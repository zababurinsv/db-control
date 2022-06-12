import require$$0 from '../abstract-level/index.js';
import require$$1 from '../module-error/index.js';
import require$$2 from '../run-parallel-limit/index.js';
import require$$3 from '../catering/index.js';
var browserLevel = {};
var iterator = {};

/* global IDBKeyRange */

var keyRange = function createKeyRange (options) {
  const lower = options.gte !== undefined ? options.gte : options.gt !== undefined ? options.gt : undefined;
  const upper = options.lte !== undefined ? options.lte : options.lt !== undefined ? options.lt : undefined;
  const lowerExclusive = options.gte === undefined;
  const upperExclusive = options.lte === undefined;

  if (lower !== undefined && upper !== undefined) {
    return IDBKeyRange.bound(lower, upper, lowerExclusive, upperExclusive)
  } else if (lower !== undefined) {
    return IDBKeyRange.lowerBound(lower, lowerExclusive)
  } else if (upper !== undefined) {
    return IDBKeyRange.upperBound(upper, upperExclusive)
  } else {
    return null
  }
};

const textEncoder = new TextEncoder();

var deserialize$2 = function (data) {
  if (data instanceof Uint8Array) {
    return data
  } else if (data instanceof ArrayBuffer) {
    return new Uint8Array(data)
  } else {
    // Non-binary data stored with an old version (level-js < 5.0.0)
    return textEncoder.encode(data)
  }
};

const { AbstractIterator } = require$$0;
const createKeyRange$1 = keyRange;
const deserialize$1 = deserialize$2;

const kCache = Symbol('cache');
const kFinished = Symbol('finished');
const kOptions = Symbol('options');
const kCurrentOptions = Symbol('currentOptions');
const kPosition = Symbol('position');
const kLocation$1 = Symbol('location');
const kFirst = Symbol('first');
const emptyOptions = {};

class Iterator$1 extends AbstractIterator {
  constructor (db, location, options) {
    super(db, options);

    this[kCache] = [];
    this[kFinished] = this.limit === 0;
    this[kOptions] = options;
    this[kCurrentOptions] = { ...options };
    this[kPosition] = undefined;
    this[kLocation$1] = location;
    this[kFirst] = true;
  }

  // Note: if called by _all() then size can be Infinity. This is an internal
  // detail; by design AbstractIterator.nextv() does not support Infinity.
  _nextv (size, options, callback) {
    this[kFirst] = false;

    if (this[kFinished]) {
      return this.nextTick(callback, null, [])
    } else if (this[kCache].length > 0) {
      // TODO: mixing next and nextv is not covered by test suite
      size = Math.min(size, this[kCache].length);
      return this.nextTick(callback, null, this[kCache].splice(0, size))
    }

    // Adjust range by what we already visited
    if (this[kPosition] !== undefined) {
      if (this[kOptions].reverse) {
        this[kCurrentOptions].lt = this[kPosition];
        this[kCurrentOptions].lte = undefined;
      } else {
        this[kCurrentOptions].gt = this[kPosition];
        this[kCurrentOptions].gte = undefined;
      }
    }

    let keyRange;

    try {
      keyRange = createKeyRange$1(this[kCurrentOptions]);
    } catch (_) {
      // The lower key is greater than the upper key.
      // IndexedDB throws an error, but we'll just return 0 results.
      this[kFinished] = true;
      return this.nextTick(callback, null, [])
    }

    const transaction = this.db.db.transaction([this[kLocation$1]], 'readonly');
    const store = transaction.objectStore(this[kLocation$1]);
    const entries = [];

    if (!this[kOptions].reverse) {
      let keys;
      let values;

      const complete = () => {
        // Wait for both requests to complete
        if (keys === undefined || values === undefined) return

        const length = Math.max(keys.length, values.length);

        if (length === 0 || size === Infinity) {
          this[kFinished] = true;
        } else {
          this[kPosition] = keys[length - 1];
        }

        // Resize
        entries.length = length;

        // Merge keys and values
        for (let i = 0; i < length; i++) {
          const key = keys[i];
          const value = values[i];

          entries[i] = [
            this[kOptions].keys && key !== undefined ? deserialize$1(key) : undefined,
            this[kOptions].values && value !== undefined ? deserialize$1(value) : undefined
          ];
        }

        maybeCommit(transaction);
      };

      // If keys were not requested and size is Infinity, we don't have to keep
      // track of position and can thus skip getting keys.
      if (this[kOptions].keys || size < Infinity) {
        store.getAllKeys(keyRange, size < Infinity ? size : undefined).onsuccess = (ev) => {
          keys = ev.target.result;
          complete();
        };
      } else {
        keys = [];
        this.nextTick(complete);
      }

      if (this[kOptions].values) {
        store.getAll(keyRange, size < Infinity ? size : undefined).onsuccess = (ev) => {
          values = ev.target.result;
          complete();
        };
      } else {
        values = [];
        this.nextTick(complete);
      }
    } else {
      // Can't use getAll() in reverse, so use a slower cursor that yields one item at a time
      // TODO: test if all target browsers support openKeyCursor
      const method = !this[kOptions].values && store.openKeyCursor ? 'openKeyCursor' : 'openCursor';

      store[method](keyRange, 'prev').onsuccess = (ev) => {
        const cursor = ev.target.result;

        if (cursor) {
          const { key, value } = cursor;
          this[kPosition] = key;

          entries.push([
            this[kOptions].keys && key !== undefined ? deserialize$1(key) : undefined,
            this[kOptions].values && value !== undefined ? deserialize$1(value) : undefined
          ]);

          if (entries.length < size) {
            cursor.continue();
          } else {
            maybeCommit(transaction);
          }
        } else {
          this[kFinished] = true;
        }
      };
    }

    // If an error occurs (on the request), the transaction will abort.
    transaction.onabort = () => {
      callback(transaction.error || new Error('aborted by user'));
      callback = null;
    };

    transaction.oncomplete = () => {
      callback(null, entries);
      callback = null;
    };
  }

  _next (callback) {
    if (this[kCache].length > 0) {
      const [key, value] = this[kCache].shift();
      this.nextTick(callback, null, key, value);
    } else if (this[kFinished]) {
      this.nextTick(callback);
    } else {
      let size = Math.min(100, this.limit - this.count);

      if (this[kFirst]) {
        // It's common to only want one entry initially or after a seek()
        this[kFirst] = false;
        size = 1;
      }

      this._nextv(size, emptyOptions, (err, entries) => {
        if (err) return callback(err)
        this[kCache] = entries;
        this._next(callback);
      });
    }
  }

  _all (options, callback) {
    this[kFirst] = false;

    // TODO: mixing next and all is not covered by test suite
    const cache = this[kCache].splice(0, this[kCache].length);
    const size = this.limit - this.count - cache.length;

    if (size <= 0) {
      return this.nextTick(callback, null, cache)
    }

    this._nextv(size, emptyOptions, (err, entries) => {
      if (err) return callback(err)
      if (cache.length > 0) entries = cache.concat(entries);
      callback(null, entries);
    });
  }

  _seek (target, options) {
    this[kFirst] = true;
    this[kCache] = [];
    this[kFinished] = false;
    this[kPosition] = undefined;

    // TODO: not covered by test suite
    this[kCurrentOptions] = { ...this[kOptions] };

    let keyRange;

    try {
      keyRange = createKeyRange$1(this[kOptions]);
    } catch (_) {
      this[kFinished] = true;
      return
    }

    if (keyRange !== null && !keyRange.includes(target)) {
      this[kFinished] = true;
    } else if (this[kOptions].reverse) {
      this[kCurrentOptions].lte = target;
    } else {
      this[kCurrentOptions].gte = target;
    }
  }
}

iterator.Iterator = Iterator$1;

function maybeCommit (transaction) {
  // Commit (meaning close) now instead of waiting for auto-commit
  if (typeof transaction.commit === 'function') {
    transaction.commit();
  }
}

var clear$1 = function clear (db, location, keyRange, options, callback) {
  if (options.limit === 0) return db.nextTick(callback)

  const transaction = db.db.transaction([location], 'readwrite');
  const store = transaction.objectStore(location);
  let count = 0;

  transaction.oncomplete = function () {
    callback();
  };

  transaction.onabort = function () {
    callback(transaction.error || new Error('aborted by user'));
  };

  // A key cursor is faster (skips reading values) but not supported by IE
  // TODO: we no longer support IE. Test others
  const method = store.openKeyCursor ? 'openKeyCursor' : 'openCursor';
  const direction = options.reverse ? 'prev' : 'next';

  store[method](keyRange, direction).onsuccess = function (ev) {
    const cursor = ev.target.result;

    if (cursor) {
      // Wait for a request to complete before continuing, saving CPU.
      store.delete(cursor.key).onsuccess = function () {
        if (options.limit <= 0 || ++count < options.limit) {
          cursor.continue();
        }
      };
    }
  };
};

/* global indexedDB */

const { AbstractLevel } = require$$0;
const ModuleError = require$$1;
const parallel = require$$2;
const { fromCallback } = require$$3;
const { Iterator } = iterator;
const deserialize = deserialize$2;
const clear = clear$1;
const createKeyRange = keyRange;

// Keep as-is for compatibility with existing level-js databases
const DEFAULT_PREFIX = 'level-js-';

const kIDB = Symbol('idb');
const kNamePrefix = Symbol('namePrefix');
const kLocation = Symbol('location');
const kVersion = Symbol('version');
const kStore = Symbol('store');
const kOnComplete = Symbol('onComplete');
const kPromise = Symbol('promise');

class BrowserLevel extends AbstractLevel {
  constructor (location, options, _) {
    // To help migrating to abstract-level
    if (typeof options === 'function' || typeof _ === 'function') {
      throw new ModuleError('The levelup-style callback argument has been removed', {
        code: 'LEVEL_LEGACY'
      })
    }

    const { prefix, version, ...forward } = options || {};

    super({
      encodings: { view: true },
      snapshots: false,
      createIfMissing: false,
      errorIfExists: false,
      seek: true
    }, forward);

    if (typeof location !== 'string') {
      throw new Error('constructor requires a location string argument')
    }

    // TODO (next major): remove default prefix
    this[kLocation] = location;
    this[kNamePrefix] = prefix == null ? DEFAULT_PREFIX : prefix;
    this[kVersion] = parseInt(version || 1, 10);
    this[kIDB] = null;
  }

  get location () {
    return this[kLocation]
  }

  get namePrefix () {
    return this[kNamePrefix]
  }

  get version () {
    return this[kVersion]
  }

  // Exposed for backwards compat and unit tests
  get db () {
    return this[kIDB]
  }

  get type () {
    return 'browser-level'
  }

  _open (options, callback) {
    const req = indexedDB.open(this[kNamePrefix] + this[kLocation], this[kVersion]);

    req.onerror = function () {
      callback(req.error || new Error('unknown error'));
    };

    req.onsuccess = () => {
      this[kIDB] = req.result;
      callback();
    };

    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;

      if (!db.objectStoreNames.contains(this[kLocation])) {
        db.createObjectStore(this[kLocation]);
      }
    };
  }

  [kStore] (mode) {
    const transaction = this[kIDB].transaction([this[kLocation]], mode);
    return transaction.objectStore(this[kLocation])
  }

  [kOnComplete] (request, callback) {
    const transaction = request.transaction;

    // Take advantage of the fact that a non-canceled request error aborts
    // the transaction. I.e. no need to listen for "request.onerror".
    transaction.onabort = function () {
      callback(transaction.error || new Error('aborted by user'));
    };

    transaction.oncomplete = function () {
      callback(null, request.result);
    };
  }

  _get (key, options, callback) {
    const store = this[kStore]('readonly');
    let req;

    try {
      req = store.get(key);
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, function (err, value) {
      if (err) return callback(err)

      if (value === undefined) {
        return callback(new ModuleError('Entry not found', {
          code: 'LEVEL_NOT_FOUND'
        }))
      }

      callback(null, deserialize(value));
    });
  }

  _getMany (keys, options, callback) {
    const store = this[kStore]('readonly');
    const tasks = keys.map((key) => (next) => {
      let request;

      try {
        request = store.get(key);
      } catch (err) {
        return next(err)
      }

      request.onsuccess = () => {
        const value = request.result;
        next(null, value === undefined ? value : deserialize(value));
      };

      request.onerror = (ev) => {
        ev.stopPropagation();
        next(request.error);
      };
    });

    parallel(tasks, 16, callback);
  }

  _del (key, options, callback) {
    const store = this[kStore]('readwrite');
    let req;

    try {
      req = store.delete(key);
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, callback);
  }

  _put (key, value, options, callback) {
    const store = this[kStore]('readwrite');
    let req;

    try {
      // Will throw a DataError or DataCloneError if the environment
      // does not support serializing the key or value respectively.
      req = store.put(value, key);
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, callback);
  }

  // TODO: implement key and value iterators
  _iterator (options) {
    return new Iterator(this, this[kLocation], options)
  }

  _batch (operations, options, callback) {
    const store = this[kStore]('readwrite');
    const transaction = store.transaction;
    let index = 0;
    let error;

    transaction.onabort = function () {
      callback(error || transaction.error || new Error('aborted by user'));
    };

    transaction.oncomplete = function () {
      callback();
    };

    // Wait for a request to complete before making the next, saving CPU.
    function loop () {
      const op = operations[index++];
      const key = op.key;

      let req;

      try {
        req = op.type === 'del' ? store.delete(key) : store.put(op.value, key);
      } catch (err) {
        error = err;
        transaction.abort();
        return
      }

      if (index < operations.length) {
        req.onsuccess = loop;
      } else if (typeof transaction.commit === 'function') {
        // Commit now instead of waiting for auto-commit
        transaction.commit();
      }
    }

    loop();
  }

  _clear (options, callback) {
    let keyRange;
    let req;

    try {
      keyRange = createKeyRange(options);
    } catch (e) {
      // The lower key is greater than the upper key.
      // IndexedDB throws an error, but we'll just do nothing.
      return this.nextTick(callback)
    }

    if (options.limit >= 0) {
      // IDBObjectStore#delete(range) doesn't have such an option.
      // Fall back to cursor-based implementation.
      return clear(this, this[kLocation], keyRange, options, callback)
    }

    try {
      const store = this[kStore]('readwrite');
      req = keyRange ? store.delete(keyRange) : store.clear();
    } catch (err) {
      return this.nextTick(callback, err)
    }

    this[kOnComplete](req, callback);
  }

  _close (callback) {
    this[kIDB].close();
    this.nextTick(callback);
  }
}

BrowserLevel.destroy = function (location, prefix, callback) {
  if (typeof prefix === 'function') {
    callback = prefix;
    prefix = DEFAULT_PREFIX;
  }

  callback = fromCallback(callback, kPromise);
  const request = indexedDB.deleteDatabase(prefix + location);

  request.onsuccess = function () {
    callback();
  };

  request.onerror = function (err) {
    callback(err);
  };

  return callback[kPromise]
};

var BrowserLevel_1 = browserLevel.BrowserLevel = BrowserLevel;

export { BrowserLevel_1 as BrowserLevel, browserLevel as default };
