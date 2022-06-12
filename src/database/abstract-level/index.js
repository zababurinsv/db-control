import require$$0$1 from '../level-supports/index.js';
import require$$1$2 from '../level-transcoder/index.js';
import require$$2 from '../events/index.js';
import require$$0 from '../catering/index.js';
import require$$1 from '../module-error/index.js';
import require$$1$1 from '../buffer/index.js';
import Tick from './lib/next-tick-browser.js'
var abstractLevel$1 = {};

var abstractLevel = {};

var abstractIterator = {};

var common = {};

common.getCallback = function (options, callback) {
  return typeof options === 'function' ? options : callback
};

common.getOptions = function (options, def) {
  if (typeof options === 'object' && options !== null) {
    return options
  }

  if (def !== undefined) {
    return def
  }

  return {}
};

const { fromCallback: fromCallback$2 } = require$$0;
const ModuleError$5 = require$$1;
const { getOptions: getOptions$2, getCallback: getCallback$2 } = common;

const kPromise$2 = Symbol('promise');
const kCallback$1 = Symbol('callback');
const kWorking = Symbol('working');
const kHandleOne$1 = Symbol('handleOne');
const kHandleMany$1 = Symbol('handleMany');
const kAutoClose = Symbol('autoClose');
const kFinishWork = Symbol('finishWork');
const kReturnMany = Symbol('returnMany');
const kClosing = Symbol('closing');
const kHandleClose = Symbol('handleClose');
const kClosed = Symbol('closed');
const kCloseCallbacks$1 = Symbol('closeCallbacks');
const kKeyEncoding$1 = Symbol('keyEncoding');
const kValueEncoding$1 = Symbol('valueEncoding');
const kAbortOnClose = Symbol('abortOnClose');
const kLegacy = Symbol('legacy');
const kKeys = Symbol('keys');
const kValues = Symbol('values');
const kLimit = Symbol('limit');
const kCount = Symbol('count');

const emptyOptions = Object.freeze({});
const noop$1 = () => {};
let warnedEnd = false;

// This class is an internal utility for common functionality between AbstractIterator,
// AbstractKeyIterator and AbstractValueIterator. It's not exported.
class CommonIterator {
  constructor (db, options, legacy) {
    if (typeof db !== 'object' || db === null) {
      const hint = db === null ? 'null' : typeof db;
      throw new TypeError(`The first argument must be an abstract-level database, received ${hint}`)
    }

    if (typeof options !== 'object' || options === null) {
      throw new TypeError('The second argument must be an options object')
    }

    this[kClosed] = false;
    this[kCloseCallbacks$1] = [];
    this[kWorking] = false;
    this[kClosing] = false;
    this[kAutoClose] = false;
    this[kCallback$1] = null;
    this[kHandleOne$1] = this[kHandleOne$1].bind(this);
    this[kHandleMany$1] = this[kHandleMany$1].bind(this);
    this[kHandleClose] = this[kHandleClose].bind(this);
    this[kKeyEncoding$1] = options[kKeyEncoding$1];
    this[kValueEncoding$1] = options[kValueEncoding$1];
    this[kLegacy] = legacy;
    this[kLimit] = Number.isInteger(options.limit) && options.limit >= 0 ? options.limit : Infinity;
    this[kCount] = 0;

    // Undocumented option to abort pending work on close(). Used by the
    // many-level module as a temporary solution to a blocked close().
    // TODO (next major): consider making this the default behavior. Native
    // implementations should have their own logic to safely close iterators.
    this[kAbortOnClose] = !!options.abortOnClose;

    this.db = db;
    this.db.attachResource(this);
    this.nextTick = db.nextTick;
  }

  get count () {
    return this[kCount]
  }

  get limit () {
    return this[kLimit]
  }

  next (callback) {
    let promise;

    if (callback === undefined) {
      promise = new Promise((resolve, reject) => {
        callback = (err, key, value) => {
          if (err) reject(err);
          else if (!this[kLegacy]) resolve(key);
          else if (key === undefined && value === undefined) resolve();
          else resolve([key, value]);
        };
      });
    } else if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function')
    }

    if (this[kClosing]) {
      this.nextTick(callback, new ModuleError$5('Iterator is not open: cannot call next() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    } else if (this[kWorking]) {
      this.nextTick(callback, new ModuleError$5('Iterator is busy: cannot call next() until previous call has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      }));
    } else {
      this[kWorking] = true;
      this[kCallback$1] = callback;

      if (this[kCount] >= this[kLimit]) this.nextTick(this[kHandleOne$1], null);
      else this._next(this[kHandleOne$1]);
    }

    return promise
  }

  _next (callback) {
    this.nextTick(callback);
  }

  nextv (size, options, callback) {
    callback = getCallback$2(options, callback);
    callback = fromCallback$2(callback, kPromise$2);
    options = getOptions$2(options, emptyOptions);

    if (!Number.isInteger(size)) {
      this.nextTick(callback, new TypeError("The first argument 'size' must be an integer"));
      return callback[kPromise$2]
    }

    if (this[kClosing]) {
      this.nextTick(callback, new ModuleError$5('Iterator is not open: cannot call nextv() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    } else if (this[kWorking]) {
      this.nextTick(callback, new ModuleError$5('Iterator is busy: cannot call nextv() until previous call has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      }));
    } else {
      if (size < 1) size = 1;
      if (this[kLimit] < Infinity) size = Math.min(size, this[kLimit] - this[kCount]);

      this[kWorking] = true;
      this[kCallback$1] = callback;

      if (size <= 0) this.nextTick(this[kHandleMany$1], null, []);
      else this._nextv(size, options, this[kHandleMany$1]);
    }

    return callback[kPromise$2]
  }

  _nextv (size, options, callback) {
    const acc = [];
    const onnext = (err, key, value) => {
      if (err) {
        return callback(err)
      } else if (this[kLegacy] ? key === undefined && value === undefined : key === undefined) {
        return callback(null, acc)
      }

      acc.push(this[kLegacy] ? [key, value] : key);

      if (acc.length === size) {
        callback(null, acc);
      } else {
        this._next(onnext);
      }
    };

    this._next(onnext);
  }

  all (options, callback) {
    callback = getCallback$2(options, callback);
    callback = fromCallback$2(callback, kPromise$2);
    options = getOptions$2(options, emptyOptions);

    if (this[kClosing]) {
      this.nextTick(callback, new ModuleError$5('Iterator is not open: cannot call all() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    } else if (this[kWorking]) {
      this.nextTick(callback, new ModuleError$5('Iterator is busy: cannot call all() until previous call has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      }));
    } else {
      this[kWorking] = true;
      this[kCallback$1] = callback;
      this[kAutoClose] = true;

      if (this[kCount] >= this[kLimit]) this.nextTick(this[kHandleMany$1], null, []);
      else this._all(options, this[kHandleMany$1]);
    }

    return callback[kPromise$2]
  }

  _all (options, callback) {
    // Must count here because we're directly calling _nextv()
    let count = this[kCount];
    const acc = [];

    const nextv = () => {
      // Not configurable, because implementations should optimize _all().
      const size = this[kLimit] < Infinity ? Math.min(1e3, this[kLimit] - count) : 1e3;

      if (size <= 0) {
        this.nextTick(callback, null, acc);
      } else {
        this._nextv(size, emptyOptions, onnextv);
      }
    };

    const onnextv = (err, items) => {
      if (err) {
        callback(err);
      } else if (items.length === 0) {
        callback(null, acc);
      } else {
        acc.push.apply(acc, items);
        count += items.length;
        nextv();
      }
    };

    nextv();
  }

  [kFinishWork] () {
    const cb = this[kCallback$1];

    // Callback will be null if work was aborted on close
    if (this[kAbortOnClose] && cb === null) return noop$1

    this[kWorking] = false;
    this[kCallback$1] = null;

    if (this[kClosing]) this._close(this[kHandleClose]);

    return cb
  }

  [kReturnMany] (cb, err, items) {
    if (this[kAutoClose]) {
      this.close(cb.bind(null, err, items));
    } else {
      cb(err, items);
    }
  }

  seek (target, options) {
    options = getOptions$2(options, emptyOptions);

    if (this[kClosing]) ; else if (this[kWorking]) {
      throw new ModuleError$5('Iterator is busy: cannot call seek() until next() has completed', {
        code: 'LEVEL_ITERATOR_BUSY'
      })
    } else {
      const keyEncoding = this.db.keyEncoding(options.keyEncoding || this[kKeyEncoding$1]);
      const keyFormat = keyEncoding.format;

      if (options.keyEncoding !== keyFormat) {
        options = { ...options, keyEncoding: keyFormat };
      }

      const mapped = this.db.prefixKey(keyEncoding.encode(target), keyFormat);
      this._seek(mapped, options);
    }
  }

  _seek (target, options) {
    throw new ModuleError$5('Iterator does not support seek()', {
      code: 'LEVEL_NOT_SUPPORTED'
    })
  }

  close (callback) {
    callback = fromCallback$2(callback, kPromise$2);

    if (this[kClosed]) {
      this.nextTick(callback);
    } else if (this[kClosing]) {
      this[kCloseCallbacks$1].push(callback);
    } else {
      this[kClosing] = true;
      this[kCloseCallbacks$1].push(callback);

      if (!this[kWorking]) {
        this._close(this[kHandleClose]);
      } else if (this[kAbortOnClose]) {
        // Don't wait for work to finish. Subsequently ignore the result.
        const cb = this[kFinishWork]();

        cb(new ModuleError$5('Aborted on iterator close()', {
          code: 'LEVEL_ITERATOR_NOT_OPEN'
        }));
      }
    }

    return callback[kPromise$2]
  }

  _close (callback) {
    this.nextTick(callback);
  }

  [kHandleClose] () {
    this[kClosed] = true;
    this.db.detachResource(this);

    const callbacks = this[kCloseCallbacks$1];
    this[kCloseCallbacks$1] = [];

    for (const cb of callbacks) {
      cb();
    }
  }

  async * [Symbol.asyncIterator] () {
    try {
      let item;

      while ((item = (await this.next())) !== undefined) {
        yield item;
      }
    } finally {
      if (!this[kClosed]) await this.close();
    }
  }
}

// For backwards compatibility this class is not (yet) called AbstractEntryIterator.
class AbstractIterator$3 extends CommonIterator {
  constructor (db, options) {
    super(db, options, true);
    this[kKeys] = options.keys !== false;
    this[kValues] = options.values !== false;
  }

  [kHandleOne$1] (err, key, value) {
    const cb = this[kFinishWork]();
    if (err) return cb(err)

    try {
      key = this[kKeys] && key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
      value = this[kValues] && value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
    } catch (err) {
      return cb(new IteratorDecodeError('entry', err))
    }

    if (!(key === undefined && value === undefined)) {
      this[kCount]++;
    }

    cb(null, key, value);
  }

  [kHandleMany$1] (err, entries) {
    const cb = this[kFinishWork]();
    if (err) return this[kReturnMany](cb, err)

    try {
      for (const entry of entries) {
        const key = entry[0];
        const value = entry[1];

        entry[0] = this[kKeys] && key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
        entry[1] = this[kValues] && value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
      }
    } catch (err) {
      return this[kReturnMany](cb, new IteratorDecodeError('entries', err))
    }

    this[kCount] += entries.length;
    this[kReturnMany](cb, null, entries);
  }

  end (callback) {
    if (!warnedEnd && typeof console !== 'undefined') {
      warnedEnd = true;
      console.warn(new ModuleError$5(
        'The iterator.end() method was renamed to close() and end() is an alias that will be removed in a future version',
        { code: 'LEVEL_LEGACY' }
      ));
    }

    return this.close(callback)
  }
}

class AbstractKeyIterator$3 extends CommonIterator {
  constructor (db, options) {
    super(db, options, false);
  }

  [kHandleOne$1] (err, key) {
    const cb = this[kFinishWork]();
    if (err) return cb(err)

    try {
      key = key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
    } catch (err) {
      return cb(new IteratorDecodeError('key', err))
    }

    if (key !== undefined) this[kCount]++;
    cb(null, key);
  }

  [kHandleMany$1] (err, keys) {
    const cb = this[kFinishWork]();
    if (err) return this[kReturnMany](cb, err)

    try {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        keys[i] = key !== undefined ? this[kKeyEncoding$1].decode(key) : undefined;
      }
    } catch (err) {
      return this[kReturnMany](cb, new IteratorDecodeError('keys', err))
    }

    this[kCount] += keys.length;
    this[kReturnMany](cb, null, keys);
  }
}

class AbstractValueIterator$3 extends CommonIterator {
  constructor (db, options) {
    super(db, options, false);
  }

  [kHandleOne$1] (err, value) {
    const cb = this[kFinishWork]();
    if (err) return cb(err)

    try {
      value = value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
    } catch (err) {
      return cb(new IteratorDecodeError('value', err))
    }

    if (value !== undefined) this[kCount]++;
    cb(null, value);
  }

  [kHandleMany$1] (err, values) {
    const cb = this[kFinishWork]();
    if (err) return this[kReturnMany](cb, err)

    try {
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        values[i] = value !== undefined ? this[kValueEncoding$1].decode(value) : undefined;
      }
    } catch (err) {
      return this[kReturnMany](cb, new IteratorDecodeError('values', err))
    }

    this[kCount] += values.length;
    this[kReturnMany](cb, null, values);
  }
}

// Internal utility, not typed or exported
class IteratorDecodeError extends ModuleError$5 {
  constructor (subject, cause) {
    super(`Iterator could not decode ${subject}`, {
      code: 'LEVEL_DECODE_ERROR',
      cause
    });
  }
}

// To help migrating to abstract-level
for (const k of ['_ended property', '_nexting property', '_end method']) {
  Object.defineProperty(AbstractIterator$3.prototype, k.split(' ')[0], {
    get () { throw new ModuleError$5(`The ${k} has been removed`, { code: 'LEVEL_LEGACY' }) },
    set () { throw new ModuleError$5(`The ${k} has been removed`, { code: 'LEVEL_LEGACY' }) }
  });
}

// Exposed so that AbstractLevel can set these options
AbstractIterator$3.keyEncoding = kKeyEncoding$1;
AbstractIterator$3.valueEncoding = kValueEncoding$1;

abstractIterator.AbstractIterator = AbstractIterator$3;
abstractIterator.AbstractKeyIterator = AbstractKeyIterator$3;
abstractIterator.AbstractValueIterator = AbstractValueIterator$3;

var defaultKvIterator = {};

const { AbstractKeyIterator: AbstractKeyIterator$2, AbstractValueIterator: AbstractValueIterator$2 } = abstractIterator;

const kIterator = Symbol('iterator');
const kCallback = Symbol('callback');
const kHandleOne = Symbol('handleOne');
const kHandleMany = Symbol('handleMany');

class DefaultKeyIterator$1 extends AbstractKeyIterator$2 {
  constructor (db, options) {
    super(db, options);

    this[kIterator] = db.iterator({ ...options, keys: true, values: false });
    this[kHandleOne] = this[kHandleOne].bind(this);
    this[kHandleMany] = this[kHandleMany].bind(this);
  }
}

class DefaultValueIterator$1 extends AbstractValueIterator$2 {
  constructor (db, options) {
    super(db, options);

    this[kIterator] = db.iterator({ ...options, keys: false, values: true });
    this[kHandleOne] = this[kHandleOne].bind(this);
    this[kHandleMany] = this[kHandleMany].bind(this);
  }
}

for (const Iterator of [DefaultKeyIterator$1, DefaultValueIterator$1]) {
  const keys = Iterator === DefaultKeyIterator$1;
  const mapEntry = keys ? (entry) => entry[0] : (entry) => entry[1];

  Iterator.prototype._next = function (callback) {
    this[kCallback] = callback;
    this[kIterator].next(this[kHandleOne]);
  };

  Iterator.prototype[kHandleOne] = function (err, key, value) {
    const callback = this[kCallback];
    if (err) callback(err);
    else callback(null, keys ? key : value);
  };

  Iterator.prototype._nextv = function (size, options, callback) {
    this[kCallback] = callback;
    this[kIterator].nextv(size, options, this[kHandleMany]);
  };

  Iterator.prototype._all = function (options, callback) {
    this[kCallback] = callback;
    this[kIterator].all(options, this[kHandleMany]);
  };

  Iterator.prototype[kHandleMany] = function (err, entries) {
    const callback = this[kCallback];
    if (err) callback(err);
    else callback(null, entries.map(mapEntry));
  };

  Iterator.prototype._seek = function (target, options) {
    this[kIterator].seek(target, options);
  };

  Iterator.prototype._close = function (callback) {
    this[kIterator].close(callback);
  };
}

// Internal utilities, should be typed as AbstractKeyIterator and AbstractValueIterator
defaultKvIterator.DefaultKeyIterator = DefaultKeyIterator$1;
defaultKvIterator.DefaultValueIterator = DefaultValueIterator$1;

var deferredIterator = {};

const { AbstractIterator: AbstractIterator$2, AbstractKeyIterator: AbstractKeyIterator$1, AbstractValueIterator: AbstractValueIterator$1 } = abstractIterator;
const ModuleError$4 = require$$1;

const kNut = Symbol('nut');
const kUndefer$1 = Symbol('undefer');
const kFactory = Symbol('factory');

class DeferredIterator$1 extends AbstractIterator$2 {
  constructor (db, options) {
    super(db, options);

    this[kNut] = null;
    this[kFactory] = () => db.iterator(options);

    this.db.defer(() => this[kUndefer$1]());
  }
}

class DeferredKeyIterator$1 extends AbstractKeyIterator$1 {
  constructor (db, options) {
    super(db, options);

    this[kNut] = null;
    this[kFactory] = () => db.keys(options);

    this.db.defer(() => this[kUndefer$1]());
  }
}

class DeferredValueIterator$1 extends AbstractValueIterator$1 {
  constructor (db, options) {
    super(db, options);

    this[kNut] = null;
    this[kFactory] = () => db.values(options);

    this.db.defer(() => this[kUndefer$1]());
  }
}

for (const Iterator of [DeferredIterator$1, DeferredKeyIterator$1, DeferredValueIterator$1]) {
  Iterator.prototype[kUndefer$1] = function () {
    if (this.db.status === 'open') {
      this[kNut] = this[kFactory]();
    }
  };

  Iterator.prototype._next = function (callback) {
    if (this[kNut] !== null) {
      this[kNut].next(callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._next(callback));
    } else {
      this.nextTick(callback, new ModuleError$4('Iterator is not open: cannot call next() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    }
  };

  Iterator.prototype._nextv = function (size, options, callback) {
    if (this[kNut] !== null) {
      this[kNut].nextv(size, options, callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._nextv(size, options, callback));
    } else {
      this.nextTick(callback, new ModuleError$4('Iterator is not open: cannot call nextv() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    }
  };

  Iterator.prototype._all = function (options, callback) {
    if (this[kNut] !== null) {
      this[kNut].all(callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._all(options, callback));
    } else {
      this.nextTick(callback, new ModuleError$4('Iterator is not open: cannot call all() after close()', {
        code: 'LEVEL_ITERATOR_NOT_OPEN'
      }));
    }
  };

  Iterator.prototype._seek = function (target, options) {
    if (this[kNut] !== null) {
      // TODO: explain why we need _seek() rather than seek() here
      this[kNut]._seek(target, options);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._seek(target, options));
    }
  };

  Iterator.prototype._close = function (callback) {
    if (this[kNut] !== null) {
      this[kNut].close(callback);
    } else if (this.db.status === 'opening') {
      this.db.defer(() => this._close(callback));
    } else {
      this.nextTick(callback);
    }
  };
}

deferredIterator.DeferredIterator = DeferredIterator$1;
deferredIterator.DeferredKeyIterator = DeferredKeyIterator$1;
deferredIterator.DeferredValueIterator = DeferredValueIterator$1;

var defaultChainedBatch = {};

var abstractChainedBatch = {};

const { fromCallback: fromCallback$1 } = require$$0;
const ModuleError$3 = require$$1;
const { getCallback: getCallback$1, getOptions: getOptions$1 } = common;

const kPromise$1 = Symbol('promise');
const kStatus$1 = Symbol('status');
const kOperations$1 = Symbol('operations');
const kFinishClose = Symbol('finishClose');
const kCloseCallbacks = Symbol('closeCallbacks');

class AbstractChainedBatch$2 {
  constructor (db) {
    if (typeof db !== 'object' || db === null) {
      const hint = db === null ? 'null' : typeof db;
      throw new TypeError(`The first argument must be an abstract-level database, received ${hint}`)
    }

    this[kOperations$1] = [];
    this[kCloseCallbacks] = [];
    this[kStatus$1] = 'open';
    this[kFinishClose] = this[kFinishClose].bind(this);

    this.db = db;
    this.db.attachResource(this);
    this.nextTick = db.nextTick;
  }

  get length () {
    return this[kOperations$1].length
  }

  put (key, value, options) {
    if (this[kStatus$1] !== 'open') {
      throw new ModuleError$3('Batch is not open: cannot call put() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      })
    }

    const err = this.db._checkKey(key) || this.db._checkValue(value);
    if (err) throw err

    const db = options && options.sublevel != null ? options.sublevel : this.db;
    const original = options;
    const keyEncoding = db.keyEncoding(options && options.keyEncoding);
    const valueEncoding = db.valueEncoding(options && options.valueEncoding);
    const keyFormat = keyEncoding.format;

    // Forward encoding options
    options = { ...options, keyEncoding: keyFormat, valueEncoding: valueEncoding.format };

    // Prevent double prefixing
    if (db !== this.db) {
      options.sublevel = null;
    }

    const mappedKey = db.prefixKey(keyEncoding.encode(key), keyFormat);
    const mappedValue = valueEncoding.encode(value);

    this._put(mappedKey, mappedValue, options);
    this[kOperations$1].push({ ...original, type: 'put', key, value });

    return this
  }

  _put (key, value, options) {}

  del (key, options) {
    if (this[kStatus$1] !== 'open') {
      throw new ModuleError$3('Batch is not open: cannot call del() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      })
    }

    const err = this.db._checkKey(key);
    if (err) throw err

    const db = options && options.sublevel != null ? options.sublevel : this.db;
    const original = options;
    const keyEncoding = db.keyEncoding(options && options.keyEncoding);
    const keyFormat = keyEncoding.format;

    // Forward encoding options
    options = { ...options, keyEncoding: keyFormat };

    // Prevent double prefixing
    if (db !== this.db) {
      options.sublevel = null;
    }

    this._del(db.prefixKey(keyEncoding.encode(key), keyFormat), options);
    this[kOperations$1].push({ ...original, type: 'del', key });

    return this
  }

  _del (key, options) {}

  clear () {
    if (this[kStatus$1] !== 'open') {
      throw new ModuleError$3('Batch is not open: cannot call clear() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      })
    }

    this._clear();
    this[kOperations$1] = [];

    return this
  }

  _clear () {}

  write (options, callback) {
    callback = getCallback$1(options, callback);
    callback = fromCallback$1(callback, kPromise$1);
    options = getOptions$1(options);

    if (this[kStatus$1] !== 'open') {
      this.nextTick(callback, new ModuleError$3('Batch is not open: cannot call write() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      }));
    } else if (this.length === 0) {
      this.close(callback);
    } else {
      this[kStatus$1] = 'writing';
      this._write(options, (err) => {
        this[kStatus$1] = 'closing';
        this[kCloseCallbacks].push(() => callback(err));

        // Emit after setting 'closing' status, because event may trigger a
        // db close which in turn triggers (idempotently) closing this batch.
        if (!err) this.db.emit('batch', this[kOperations$1]);

        this._close(this[kFinishClose]);
      });
    }

    return callback[kPromise$1]
  }

  _write (options, callback) {}

  close (callback) {
    callback = fromCallback$1(callback, kPromise$1);

    if (this[kStatus$1] === 'closing') {
      this[kCloseCallbacks].push(callback);
    } else if (this[kStatus$1] === 'closed') {
      this.nextTick(callback);
    } else {
      this[kCloseCallbacks].push(callback);

      if (this[kStatus$1] !== 'writing') {
        this[kStatus$1] = 'closing';
        this._close(this[kFinishClose]);
      }
    }

    return callback[kPromise$1]
  }

  _close (callback) {
    this.nextTick(callback);
  }

  [kFinishClose] () {
    this[kStatus$1] = 'closed';
    this.db.detachResource(this);

    const callbacks = this[kCloseCallbacks];
    this[kCloseCallbacks] = [];

    for (const cb of callbacks) {
      cb();
    }
  }
}

abstractChainedBatch.AbstractChainedBatch = AbstractChainedBatch$2;

const { AbstractChainedBatch: AbstractChainedBatch$1 } = abstractChainedBatch;
const ModuleError$2 = require$$1;
const kEncoded = Symbol('encoded');

// Functional default for chained batch, with support of deferred open
class DefaultChainedBatch$1 extends AbstractChainedBatch$1 {
  constructor (db) {
    super(db);
    this[kEncoded] = [];
  }

  _put (key, value, options) {
    this[kEncoded].push({ ...options, type: 'put', key, value });
  }

  _del (key, options) {
    this[kEncoded].push({ ...options, type: 'del', key });
  }

  _clear () {
    this[kEncoded] = [];
  }

  // Assumes this[kEncoded] cannot change after write()
  _write (options, callback) {
    if (this.db.status === 'opening') {
      this.db.defer(() => this._write(options, callback));
    } else if (this.db.status === 'open') {
      if (this[kEncoded].length === 0) this.nextTick(callback);
      else this.db._batch(this[kEncoded], options, callback);
    } else {
      this.nextTick(callback, new ModuleError$2('Batch is not open: cannot call write() after write() or close()', {
        code: 'LEVEL_BATCH_NOT_OPEN'
      }));
    }
  }
}

defaultChainedBatch.DefaultChainedBatch = DefaultChainedBatch$1;

const ModuleError$1 = require$$1;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const rangeOptions$1 = new Set(['lt', 'lte', 'gt', 'gte']);

var rangeOptions_1 = function (options, keyEncoding) {
  const result = {};

  for (const k in options) {
    if (!hasOwnProperty.call(options, k)) continue
    if (k === 'keyEncoding' || k === 'valueEncoding') continue

    if (k === 'start' || k === 'end') {
      throw new ModuleError$1(`The legacy range option '${k}' has been removed`, {
        code: 'LEVEL_LEGACY'
      })
    } else if (k === 'encoding') {
      // To help migrating to abstract-level
      throw new ModuleError$1("The levelup-style 'encoding' alias has been removed, use 'valueEncoding' instead", {
        code: 'LEVEL_LEGACY'
      })
    }

    if (rangeOptions$1.has(k)) {
      // Note that we don't reject nullish and empty options here. While
      // those types are invalid as keys, they are valid as range options.
      result[k] = keyEncoding.encode(options[k]);
    } else {
      result[k] = options[k];
    }
  }

  result.reverse = !!result.reverse;
  result.limit = Number.isInteger(result.limit) && result.limit >= 0 ? result.limit : -1;

  return result
};

var nextTick;
var hasRequiredNextTick;

function requireNextTick () {
	if (hasRequiredNextTick) return nextTick;
	hasRequiredNextTick = 1;

	nextTick = Tick;
	return nextTick;
}

var abstractSublevelIterator = {};

var hasRequiredAbstractSublevelIterator;

function requireAbstractSublevelIterator () {
	if (hasRequiredAbstractSublevelIterator) return abstractSublevelIterator;
	hasRequiredAbstractSublevelIterator = 1;

	const { AbstractIterator, AbstractKeyIterator, AbstractValueIterator } = abstractIterator;

	const kUnfix = Symbol('unfix');
	const kIterator = Symbol('iterator');
	const kHandleOne = Symbol('handleOne');
	const kHandleMany = Symbol('handleMany');
	const kCallback = Symbol('callback');

	// TODO: unfix natively if db supports it
	class AbstractSublevelIterator extends AbstractIterator {
	  constructor (db, options, iterator, unfix) {
	    super(db, options);

	    this[kIterator] = iterator;
	    this[kUnfix] = unfix;
	    this[kHandleOne] = this[kHandleOne].bind(this);
	    this[kHandleMany] = this[kHandleMany].bind(this);
	    this[kCallback] = null;
	  }

	  [kHandleOne] (err, key, value) {
	    const callback = this[kCallback];
	    if (err) return callback(err)
	    if (key !== undefined) key = this[kUnfix](key);
	    callback(err, key, value);
	  }

	  [kHandleMany] (err, entries) {
	    const callback = this[kCallback];
	    if (err) return callback(err)

	    for (const entry of entries) {
	      const key = entry[0];
	      if (key !== undefined) entry[0] = this[kUnfix](key);
	    }

	    callback(err, entries);
	  }
	}

	class AbstractSublevelKeyIterator extends AbstractKeyIterator {
	  constructor (db, options, iterator, unfix) {
	    super(db, options);

	    this[kIterator] = iterator;
	    this[kUnfix] = unfix;
	    this[kHandleOne] = this[kHandleOne].bind(this);
	    this[kHandleMany] = this[kHandleMany].bind(this);
	    this[kCallback] = null;
	  }

	  [kHandleOne] (err, key) {
	    const callback = this[kCallback];
	    if (err) return callback(err)
	    if (key !== undefined) key = this[kUnfix](key);
	    callback(err, key);
	  }

	  [kHandleMany] (err, keys) {
	    const callback = this[kCallback];
	    if (err) return callback(err)

	    for (let i = 0; i < keys.length; i++) {
	      const key = keys[i];
	      if (key !== undefined) keys[i] = this[kUnfix](key);
	    }

	    callback(err, keys);
	  }
	}

	class AbstractSublevelValueIterator extends AbstractValueIterator {
	  constructor (db, options, iterator) {
	    super(db, options);
	    this[kIterator] = iterator;
	  }
	}

	for (const Iterator of [AbstractSublevelIterator, AbstractSublevelKeyIterator]) {
	  Iterator.prototype._next = function (callback) {
	    this[kCallback] = callback;
	    this[kIterator].next(this[kHandleOne]);
	  };

	  Iterator.prototype._nextv = function (size, options, callback) {
	    this[kCallback] = callback;
	    this[kIterator].nextv(size, options, this[kHandleMany]);
	  };

	  Iterator.prototype._all = function (options, callback) {
	    this[kCallback] = callback;
	    this[kIterator].all(options, this[kHandleMany]);
	  };
	}

	for (const Iterator of [AbstractSublevelValueIterator]) {
	  Iterator.prototype._next = function (callback) {
	    this[kIterator].next(callback);
	  };

	  Iterator.prototype._nextv = function (size, options, callback) {
	    this[kIterator].nextv(size, options, callback);
	  };

	  Iterator.prototype._all = function (options, callback) {
	    this[kIterator].all(options, callback);
	  };
	}

	for (const Iterator of [AbstractSublevelIterator, AbstractSublevelKeyIterator, AbstractSublevelValueIterator]) {
	  Iterator.prototype._seek = function (target, options) {
	    this[kIterator].seek(target, options);
	  };

	  Iterator.prototype._close = function (callback) {
	    this[kIterator].close(callback);
	  };
	}

	abstractSublevelIterator.AbstractSublevelIterator = AbstractSublevelIterator;
	abstractSublevelIterator.AbstractSublevelKeyIterator = AbstractSublevelKeyIterator;
	abstractSublevelIterator.AbstractSublevelValueIterator = AbstractSublevelValueIterator;
	return abstractSublevelIterator;
}

var abstractSublevel;
var hasRequiredAbstractSublevel;

function requireAbstractSublevel () {
	if (hasRequiredAbstractSublevel) return abstractSublevel;
	hasRequiredAbstractSublevel = 1;

	const ModuleError = require$$1;
	const { Buffer } = require$$1$1 || {};
	const {
	  AbstractSublevelIterator,
	  AbstractSublevelKeyIterator,
	  AbstractSublevelValueIterator
	} = requireAbstractSublevelIterator();

	const kPrefix = Symbol('prefix');
	const kUpperBound = Symbol('upperBound');
	const kPrefixRange = Symbol('prefixRange');
	const kParent = Symbol('parent');
	const kUnfix = Symbol('unfix');

	const textEncoder = new TextEncoder();
	const defaults = { separator: '!' };

	// Wrapped to avoid circular dependency
	abstractSublevel = function ({ AbstractLevel }) {
	  class AbstractSublevel extends AbstractLevel {
	    static defaults (options) {
	      // To help migrating from subleveldown to abstract-level
	      if (typeof options === 'string') {
	        throw new ModuleError('The subleveldown string shorthand for { separator } has been removed', {
	          code: 'LEVEL_LEGACY'
	        })
	      } else if (options && options.open) {
	        throw new ModuleError('The subleveldown open option has been removed', {
	          code: 'LEVEL_LEGACY'
	        })
	      }

	      if (options == null) {
	        return defaults
	      } else if (!options.separator) {
	        return { ...options, separator: '!' }
	      } else {
	        return options
	      }
	    }

	    // TODO: add autoClose option, which if true, does parent.attachResource(this)
	    constructor (db, name, options) {
	      // Don't forward AbstractSublevel options to AbstractLevel
	      const { separator, manifest, ...forward } = AbstractSublevel.defaults(options);
	      name = trim(name, separator);

	      // Reserve one character between separator and name to give us an upper bound
	      const reserved = separator.charCodeAt(0) + 1;
	      const parent = db[kParent] || db;

	      // Keys should sort like ['!a!', '!a!!a!', '!a"', '!aa!', '!b!'].
	      // Use ASCII for consistent length between string, Buffer and Uint8Array
	      if (!textEncoder.encode(name).every(x => x > reserved && x < 127)) {
	        throw new ModuleError(`Prefix must use bytes > ${reserved} < ${127}`, {
	          code: 'LEVEL_INVALID_PREFIX'
	        })
	      }

	      super(mergeManifests(parent, manifest), forward);

	      const prefix = (db.prefix || '') + separator + name + separator;
	      const upperBound = prefix.slice(0, -1) + String.fromCharCode(reserved);

	      this[kParent] = parent;
	      this[kPrefix] = new MultiFormat(prefix);
	      this[kUpperBound] = new MultiFormat(upperBound);
	      this[kUnfix] = new Unfixer();

	      this.nextTick = parent.nextTick;
	    }

	    prefixKey (key, keyFormat) {
	      if (keyFormat === 'utf8') {
	        return this[kPrefix].utf8 + key
	      } else if (key.byteLength === 0) {
	        // Fast path for empty key (no copy)
	        return this[kPrefix][keyFormat]
	      } else if (keyFormat === 'view') {
	        const view = this[kPrefix].view;
	        const result = new Uint8Array(view.byteLength + key.byteLength);

	        result.set(view, 0);
	        result.set(key, view.byteLength);

	        return result
	      } else {
	        const buffer = this[kPrefix].buffer;
	        return Buffer.concat([buffer, key], buffer.byteLength + key.byteLength)
	      }
	    }

	    // Not exposed for now.
	    [kPrefixRange] (range, keyFormat) {
	      if (range.gte !== undefined) {
	        range.gte = this.prefixKey(range.gte, keyFormat);
	      } else if (range.gt !== undefined) {
	        range.gt = this.prefixKey(range.gt, keyFormat);
	      } else {
	        range.gte = this[kPrefix][keyFormat];
	      }

	      if (range.lte !== undefined) {
	        range.lte = this.prefixKey(range.lte, keyFormat);
	      } else if (range.lt !== undefined) {
	        range.lt = this.prefixKey(range.lt, keyFormat);
	      } else {
	        range.lte = this[kUpperBound][keyFormat];
	      }
	    }

	    get prefix () {
	      return this[kPrefix].utf8
	    }

	    get db () {
	      return this[kParent]
	    }

	    _open (options, callback) {
	      // The parent db must open itself or be (re)opened by the user because
	      // a sublevel should not initiate state changes on the rest of the db.
	      this[kParent].open({ passive: true }, callback);
	    }

	    _put (key, value, options, callback) {
	      this[kParent].put(key, value, options, callback);
	    }

	    _get (key, options, callback) {
	      this[kParent].get(key, options, callback);
	    }

	    _getMany (keys, options, callback) {
	      this[kParent].getMany(keys, options, callback);
	    }

	    _del (key, options, callback) {
	      this[kParent].del(key, options, callback);
	    }

	    _batch (operations, options, callback) {
	      this[kParent].batch(operations, options, callback);
	    }

	    _clear (options, callback) {
	      // TODO (refactor): move to AbstractLevel
	      this[kPrefixRange](options, options.keyEncoding);
	      this[kParent].clear(options, callback);
	    }

	    _iterator (options) {
	      // TODO (refactor): move to AbstractLevel
	      this[kPrefixRange](options, options.keyEncoding);
	      const iterator = this[kParent].iterator(options);
	      const unfix = this[kUnfix].get(this[kPrefix].utf8.length, options.keyEncoding);
	      return new AbstractSublevelIterator(this, options, iterator, unfix)
	    }

	    _keys (options) {
	      this[kPrefixRange](options, options.keyEncoding);
	      const iterator = this[kParent].keys(options);
	      const unfix = this[kUnfix].get(this[kPrefix].utf8.length, options.keyEncoding);
	      return new AbstractSublevelKeyIterator(this, options, iterator, unfix)
	    }

	    _values (options) {
	      this[kPrefixRange](options, options.keyEncoding);
	      const iterator = this[kParent].values(options);
	      return new AbstractSublevelValueIterator(this, options, iterator)
	    }
	  }

	  return { AbstractSublevel }
	};

	const mergeManifests = function (parent, manifest) {
	  return {
	    // Inherit manifest of parent db
	    ...parent.supports,

	    // Disable unsupported features
	    createIfMissing: false,
	    errorIfExists: false,

	    // Unset additional events because we're not forwarding them
	    events: {},

	    // Unset additional methods (like approximateSize) which we can't support here unless
	    // the AbstractSublevel class is overridden by an implementation of `abstract-level`.
	    additionalMethods: {},

	    // Inherit manifest of custom AbstractSublevel subclass. Such a class is not
	    // allowed to override encodings.
	    ...manifest,

	    encodings: {
	      utf8: supportsEncoding(parent, 'utf8'),
	      buffer: supportsEncoding(parent, 'buffer'),
	      view: supportsEncoding(parent, 'view')
	    }
	  }
	};

	const supportsEncoding = function (parent, encoding) {
	  // Prefer a non-transcoded encoding for optimal performance
	  return parent.supports.encodings[encoding]
	    ? parent.keyEncoding(encoding).name === encoding
	    : false
	};

	class MultiFormat {
	  constructor (key) {
	    this.utf8 = key;
	    this.view = textEncoder.encode(key);
	    this.buffer = Buffer ? Buffer.from(this.view.buffer, 0, this.view.byteLength) : {};
	  }
	}

	class Unfixer {
	  constructor () {
	    this.cache = new Map();
	  }

	  get (prefixLength, keyFormat) {
	    let unfix = this.cache.get(keyFormat);

	    if (unfix === undefined) {
	      if (keyFormat === 'view') {
	        unfix = function (prefixLength, key) {
	          // Avoid Uint8Array#slice() because it copies
	          return key.subarray(prefixLength)
	        }.bind(null, prefixLength);
	      } else {
	        unfix = function (prefixLength, key) {
	          // Avoid Buffer#subarray() because it's slow
	          return key.slice(prefixLength)
	        }.bind(null, prefixLength);
	      }

	      this.cache.set(keyFormat, unfix);
	    }

	    return unfix
	  }
	}

	const trim = function (str, char) {
	  let start = 0;
	  let end = str.length;

	  while (start < end && str[start] === char) start++;
	  while (end > start && str[end - 1] === char) end--;

	  return str.slice(start, end)
	};
	return abstractSublevel;
}

const { supports } = require$$0$1;
const { Transcoder } = require$$1$2;
const { EventEmitter } = require$$2;
const { fromCallback } = require$$0;
const ModuleError = require$$1;
const { AbstractIterator: AbstractIterator$1 } = abstractIterator;
const { DefaultKeyIterator, DefaultValueIterator } = defaultKvIterator;
const { DeferredIterator, DeferredKeyIterator, DeferredValueIterator } = deferredIterator;
const { DefaultChainedBatch } = defaultChainedBatch;
const { getCallback, getOptions } = common;
const rangeOptions = rangeOptions_1;

const kPromise = Symbol('promise');
const kLanded = Symbol('landed');
const kResources = Symbol('resources');
const kCloseResources = Symbol('closeResources');
const kOperations = Symbol('operations');
const kUndefer = Symbol('undefer');
const kDeferOpen = Symbol('deferOpen');
const kOptions = Symbol('options');
const kStatus = Symbol('status');
const kDefaultOptions = Symbol('defaultOptions');
const kTranscoder = Symbol('transcoder');
const kKeyEncoding = Symbol('keyEncoding');
const kValueEncoding = Symbol('valueEncoding');
const noop = () => {};

class AbstractLevel$1 extends EventEmitter {
  constructor (manifest, options) {
    super();

    if (typeof manifest !== 'object' || manifest === null) {
      throw new TypeError("The first argument 'manifest' must be an object")
    }

    options = getOptions(options);
    const { keyEncoding, valueEncoding, passive, ...forward } = options;

    this[kResources] = new Set();
    this[kOperations] = [];
    this[kDeferOpen] = true;
    this[kOptions] = forward;
    this[kStatus] = 'opening';
    console.log('+++++++ AbstractLevel$1 +++++++', require$$0$1)
    this.supports = supports(manifest, {
      status: true,
      promises: true,
      clear: true,
      getMany: true,
      deferredOpen: true,

      // TODO (next major): add seek
      snapshots: manifest.snapshots !== false,
      permanence: manifest.permanence !== false,

      // TODO: remove from level-supports because it's always supported
      keyIterator: true,
      valueIterator: true,
      iteratorNextv: true,
      iteratorAll: true,

      encodings: manifest.encodings || {},
      events: Object.assign({}, manifest.events, {
        opening: true,
        open: true,
        closing: true,
        closed: true,
        put: true,
        del: true,
        batch: true,
        clear: true
      })
    });

    this[kTranscoder] = new Transcoder(formats(this));
    this[kKeyEncoding] = this[kTranscoder].encoding(keyEncoding || 'utf8');
    this[kValueEncoding] = this[kTranscoder].encoding(valueEncoding || 'utf8');

    // Add custom and transcoder encodings to manifest
    for (const encoding of this[kTranscoder].encodings()) {
      if (!this.supports.encodings[encoding.commonName]) {
        this.supports.encodings[encoding.commonName] = true;
      }
    }

    this[kDefaultOptions] = {
      empty: Object.freeze({}),
      entry: Object.freeze({
        keyEncoding: this[kKeyEncoding].commonName,
        valueEncoding: this[kValueEncoding].commonName
      }),
      key: Object.freeze({
        keyEncoding: this[kKeyEncoding].commonName
      })
    };

    // Let subclass finish its constructor
    this.nextTick(() => {
      if (this[kDeferOpen]) {
        this.open({ passive: false }, noop);
      }
    });
  }

  get status () {
    return this[kStatus]
  }

  keyEncoding (encoding) {
    return this[kTranscoder].encoding(encoding != null ? encoding : this[kKeyEncoding])
  }

  valueEncoding (encoding) {
    return this[kTranscoder].encoding(encoding != null ? encoding : this[kValueEncoding])
  }

  open (options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback(callback, kPromise);

    options = { ...this[kOptions], ...getOptions(options) };

    options.createIfMissing = options.createIfMissing !== false;
    options.errorIfExists = !!options.errorIfExists;

    const maybeOpened = (err) => {
      if (this[kStatus] === 'closing' || this[kStatus] === 'opening') {
        // Wait until pending state changes are done
        this.once(kLanded, err ? () => maybeOpened(err) : maybeOpened);
      } else if (this[kStatus] !== 'open') {
        callback(new ModuleError('Database is not open', {
          code: 'LEVEL_DATABASE_NOT_OPEN',
          cause: err
        }));
      } else {
        callback();
      }
    };

    if (options.passive) {
      if (this[kStatus] === 'opening') {
        this.once(kLanded, maybeOpened);
      } else {
        this.nextTick(maybeOpened);
      }
    } else if (this[kStatus] === 'closed' || this[kDeferOpen]) {
      this[kDeferOpen] = false;
      this[kStatus] = 'opening';
      this.emit('opening');

      this._open(options, (err) => {
        if (err) {
          this[kStatus] = 'closed';

          // Resources must be safe to close in any db state
          this[kCloseResources](() => {
            this.emit(kLanded);
            maybeOpened(err);
          });

          this[kUndefer]();
          return
        }

        this[kStatus] = 'open';
        this[kUndefer]();
        this.emit(kLanded);

        // Only emit public event if pending state changes are done
        if (this[kStatus] === 'open') this.emit('open');

        // TODO (next major): remove this alias
        if (this[kStatus] === 'open') this.emit('ready');

        maybeOpened();
      });
    } else if (this[kStatus] === 'open') {
      this.nextTick(maybeOpened);
    } else {
      this.once(kLanded, () => this.open(options, callback));
    }

    return callback[kPromise]
  }

  _open (options, callback) {
    this.nextTick(callback);
  }

  close (callback) {
    callback = fromCallback(callback, kPromise);

    const maybeClosed = (err) => {
      if (this[kStatus] === 'opening' || this[kStatus] === 'closing') {
        // Wait until pending state changes are done
        this.once(kLanded, err ? maybeClosed(err) : maybeClosed);
      } else if (this[kStatus] !== 'closed') {
        callback(new ModuleError('Database is not closed', {
          code: 'LEVEL_DATABASE_NOT_CLOSED',
          cause: err
        }));
      } else {
        callback();
      }
    };

    if (this[kStatus] === 'open') {
      this[kStatus] = 'closing';
      this.emit('closing');

      const cancel = (err) => {
        this[kStatus] = 'open';
        this[kUndefer]();
        this.emit(kLanded);
        maybeClosed(err);
      };

      this[kCloseResources](() => {
        this._close((err) => {
          if (err) return cancel(err)

          this[kStatus] = 'closed';
          this[kUndefer]();
          this.emit(kLanded);

          // Only emit public event if pending state changes are done
          if (this[kStatus] === 'closed') this.emit('closed');

          maybeClosed();
        });
      });
    } else if (this[kStatus] === 'closed') {
      this.nextTick(maybeClosed);
    } else {
      this.once(kLanded, () => this.close(callback));
    }

    return callback[kPromise]
  }

  [kCloseResources] (callback) {
    if (this[kResources].size === 0) {
      return this.nextTick(callback)
    }

    let pending = this[kResources].size;
    let sync = true;

    const next = () => {
      if (--pending === 0) {
        // We don't have tests for generic resources, so dezalgo
        if (sync) this.nextTick(callback);
        else callback();
      }
    };

    // In parallel so that all resources know they are closed
    for (const resource of this[kResources]) {
      resource.close(next);
    }

    sync = false;
    this[kResources].clear();
  }

  _close (callback) {
    this.nextTick(callback);
  }

  get (key, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback(callback, kPromise);
    options = getOptions(options, this[kDefaultOptions].entry);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.get(key, options, callback));
      return callback[kPromise]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise]
    }

    const err = this._checkKey(key);

    if (err) {
      this.nextTick(callback, err);
      return callback[kPromise]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const valueEncoding = this.valueEncoding(options.valueEncoding);
    const keyFormat = keyEncoding.format;
    const valueFormat = valueEncoding.format;

    // Forward encoding options to the underlying store
    if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
      // Avoid spread operator because of https://bugs.chromium.org/p/chromium/issues/detail?id=1204540
      options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
    }

    this._get(this.prefixKey(keyEncoding.encode(key), keyFormat), options, (err, value) => {
      if (err) {
        // Normalize not found error for backwards compatibility with abstract-leveldown and level(up)
        if (err.code === 'LEVEL_NOT_FOUND' || err.notFound || /NotFound/i.test(err)) {
          if (!err.code) err.code = 'LEVEL_NOT_FOUND'; // Preferred way going forward
          if (!err.notFound) err.notFound = true; // Same as level-errors
          if (!err.status) err.status = 404; // Same as level-errors
        }

        return callback(err)
      }

      try {
        value = valueEncoding.decode(value);
      } catch (err) {
        return callback(new ModuleError('Could not decode value', {
          code: 'LEVEL_DECODE_ERROR',
          cause: err
        }))
      }

      callback(null, value);
    });

    return callback[kPromise]
  }

  _get (key, options, callback) {
    this.nextTick(callback, new Error('NotFound'));
  }

  getMany (keys, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback(callback, kPromise);
    options = getOptions(options, this[kDefaultOptions].entry);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.getMany(keys, options, callback));
      return callback[kPromise]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise]
    }

    if (!Array.isArray(keys)) {
      this.nextTick(callback, new TypeError("The first argument 'keys' must be an array"));
      return callback[kPromise]
    }

    if (keys.length === 0) {
      this.nextTick(callback, null, []);
      return callback[kPromise]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const valueEncoding = this.valueEncoding(options.valueEncoding);
    const keyFormat = keyEncoding.format;
    const valueFormat = valueEncoding.format;

    // Forward encoding options
    if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
      options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
    }

    const mappedKeys = new Array(keys.length);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const err = this._checkKey(key);

      if (err) {
        this.nextTick(callback, err);
        return callback[kPromise]
      }

      mappedKeys[i] = this.prefixKey(keyEncoding.encode(key), keyFormat);
    }

    this._getMany(mappedKeys, options, (err, values) => {
      if (err) return callback(err)

      try {
        for (let i = 0; i < values.length; i++) {
          if (values[i] !== undefined) {
            values[i] = valueEncoding.decode(values[i]);
          }
        }
      } catch (err) {
        return callback(new ModuleError(`Could not decode one or more of ${values.length} value(s)`, {
          code: 'LEVEL_DECODE_ERROR',
          cause: err
        }))
      }

      callback(null, values);
    });

    return callback[kPromise]
  }

  _getMany (keys, options, callback) {
    this.nextTick(callback, null, new Array(keys.length).fill(undefined));
  }

  put (key, value, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback(callback, kPromise);
    options = getOptions(options, this[kDefaultOptions].entry);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.put(key, value, options, callback));
      return callback[kPromise]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise]
    }

    const err = this._checkKey(key) || this._checkValue(value);

    if (err) {
      this.nextTick(callback, err);
      return callback[kPromise]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const valueEncoding = this.valueEncoding(options.valueEncoding);
    const keyFormat = keyEncoding.format;
    const valueFormat = valueEncoding.format;

    // Forward encoding options
    if (options.keyEncoding !== keyFormat || options.valueEncoding !== valueFormat) {
      options = Object.assign({}, options, { keyEncoding: keyFormat, valueEncoding: valueFormat });
    }

    const mappedKey = this.prefixKey(keyEncoding.encode(key), keyFormat);
    const mappedValue = valueEncoding.encode(value);

    this._put(mappedKey, mappedValue, options, (err) => {
      if (err) return callback(err)
      this.emit('put', key, value);
      callback();
    });

    return callback[kPromise]
  }

  _put (key, value, options, callback) {
    this.nextTick(callback);
  }

  del (key, options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback(callback, kPromise);
    options = getOptions(options, this[kDefaultOptions].key);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.del(key, options, callback));
      return callback[kPromise]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise]
    }

    const err = this._checkKey(key);

    if (err) {
      this.nextTick(callback, err);
      return callback[kPromise]
    }

    const keyEncoding = this.keyEncoding(options.keyEncoding);
    const keyFormat = keyEncoding.format;

    // Forward encoding options
    if (options.keyEncoding !== keyFormat) {
      options = Object.assign({}, options, { keyEncoding: keyFormat });
    }

    this._del(this.prefixKey(keyEncoding.encode(key), keyFormat), options, (err) => {
      if (err) return callback(err)
      this.emit('del', key);
      callback();
    });

    return callback[kPromise]
  }

  _del (key, options, callback) {
    this.nextTick(callback);
  }

  batch (operations, options, callback) {
    if (!arguments.length) {
      if (this[kStatus] === 'opening') return new DefaultChainedBatch(this)
      if (this[kStatus] !== 'open') {
        throw new ModuleError('Database is not open', {
          code: 'LEVEL_DATABASE_NOT_OPEN'
        })
      }
      return this._chainedBatch()
    }

    if (typeof operations === 'function') callback = operations;
    else callback = getCallback(options, callback);

    callback = fromCallback(callback, kPromise);
    options = getOptions(options, this[kDefaultOptions].empty);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.batch(operations, options, callback));
      return callback[kPromise]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise]
    }

    if (!Array.isArray(operations)) {
      this.nextTick(callback, new TypeError("The first argument 'operations' must be an array"));
      return callback[kPromise]
    }

    if (operations.length === 0) {
      this.nextTick(callback);
      return callback[kPromise]
    }

    const mapped = new Array(operations.length);
    const { keyEncoding: ke, valueEncoding: ve, ...forward } = options;

    for (let i = 0; i < operations.length; i++) {
      if (typeof operations[i] !== 'object' || operations[i] === null) {
        this.nextTick(callback, new TypeError('A batch operation must be an object'));
        return callback[kPromise]
      }

      const op = Object.assign({}, operations[i]);

      if (op.type !== 'put' && op.type !== 'del') {
        this.nextTick(callback, new TypeError("A batch operation must have a type property that is 'put' or 'del'"));
        return callback[kPromise]
      }

      const err = this._checkKey(op.key);

      if (err) {
        this.nextTick(callback, err);
        return callback[kPromise]
      }

      const db = op.sublevel != null ? op.sublevel : this;
      const keyEncoding = db.keyEncoding(op.keyEncoding || ke);
      const keyFormat = keyEncoding.format;

      op.key = db.prefixKey(keyEncoding.encode(op.key), keyFormat);
      op.keyEncoding = keyFormat;

      if (op.type === 'put') {
        const valueErr = this._checkValue(op.value);

        if (valueErr) {
          this.nextTick(callback, valueErr);
          return callback[kPromise]
        }

        const valueEncoding = db.valueEncoding(op.valueEncoding || ve);

        op.value = valueEncoding.encode(op.value);
        op.valueEncoding = valueEncoding.format;
      }

      // Prevent double prefixing
      if (db !== this) {
        op.sublevel = null;
      }

      mapped[i] = op;
    }

    this._batch(mapped, forward, (err) => {
      if (err) return callback(err)
      this.emit('batch', operations);
      callback();
    });

    return callback[kPromise]
  }

  _batch (operations, options, callback) {
    this.nextTick(callback);
  }

  sublevel (name, options) {
    return this._sublevel(name, AbstractSublevel$1.defaults(options))
  }

  _sublevel (name, options) {
    return new AbstractSublevel$1(this, name, options)
  }

  prefixKey (key, keyFormat) {
    return key
  }

  clear (options, callback) {
    callback = getCallback(options, callback);
    callback = fromCallback(callback, kPromise);
    options = getOptions(options, this[kDefaultOptions].empty);

    if (this[kStatus] === 'opening') {
      this.defer(() => this.clear(options, callback));
      return callback[kPromise]
    }

    if (maybeError(this, callback)) {
      return callback[kPromise]
    }

    const original = options;
    const keyEncoding = this.keyEncoding(options.keyEncoding);

    options = rangeOptions(options, keyEncoding);
    options.keyEncoding = keyEncoding.format;

    if (options.limit === 0) {
      this.nextTick(callback);
    } else {
      this._clear(options, (err) => {
        if (err) return callback(err)
        this.emit('clear', original);
        callback();
      });
    }

    return callback[kPromise]
  }

  _clear (options, callback) {
    this.nextTick(callback);
  }

  iterator (options) {
    const keyEncoding = this.keyEncoding(options && options.keyEncoding);
    const valueEncoding = this.valueEncoding(options && options.valueEncoding);

    options = rangeOptions(options, keyEncoding);
    options.keys = options.keys !== false;
    options.values = options.values !== false;

    // We need the original encoding options in AbstractIterator in order to decode data
    options[AbstractIterator$1.keyEncoding] = keyEncoding;
    options[AbstractIterator$1.valueEncoding] = valueEncoding;

    // Forward encoding options to private API
    options.keyEncoding = keyEncoding.format;
    options.valueEncoding = valueEncoding.format;

    if (this[kStatus] === 'opening') {
      return new DeferredIterator(this, options)
    } else if (this[kStatus] !== 'open') {
      throw new ModuleError('Database is not open', {
        code: 'LEVEL_DATABASE_NOT_OPEN'
      })
    }

    return this._iterator(options)
  }

  _iterator (options) {
    return new AbstractIterator$1(this, options)
  }

  keys (options) {
    // Also include valueEncoding (though unused) because we may fallback to _iterator()
    const keyEncoding = this.keyEncoding(options && options.keyEncoding);
    const valueEncoding = this.valueEncoding(options && options.valueEncoding);

    options = rangeOptions(options, keyEncoding);

    // We need the original encoding options in AbstractKeyIterator in order to decode data
    options[AbstractIterator$1.keyEncoding] = keyEncoding;
    options[AbstractIterator$1.valueEncoding] = valueEncoding;

    // Forward encoding options to private API
    options.keyEncoding = keyEncoding.format;
    options.valueEncoding = valueEncoding.format;

    if (this[kStatus] === 'opening') {
      return new DeferredKeyIterator(this, options)
    } else if (this[kStatus] !== 'open') {
      throw new ModuleError('Database is not open', {
        code: 'LEVEL_DATABASE_NOT_OPEN'
      })
    }

    return this._keys(options)
  }

  _keys (options) {
    return new DefaultKeyIterator(this, options)
  }

  values (options) {
    const keyEncoding = this.keyEncoding(options && options.keyEncoding);
    const valueEncoding = this.valueEncoding(options && options.valueEncoding);

    options = rangeOptions(options, keyEncoding);

    // We need the original encoding options in AbstractValueIterator in order to decode data
    options[AbstractIterator$1.keyEncoding] = keyEncoding;
    options[AbstractIterator$1.valueEncoding] = valueEncoding;

    // Forward encoding options to private API
    options.keyEncoding = keyEncoding.format;
    options.valueEncoding = valueEncoding.format;

    if (this[kStatus] === 'opening') {
      return new DeferredValueIterator(this, options)
    } else if (this[kStatus] !== 'open') {
      throw new ModuleError('Database is not open', {
        code: 'LEVEL_DATABASE_NOT_OPEN'
      })
    }

    return this._values(options)
  }

  _values (options) {
    return new DefaultValueIterator(this, options)
  }

  defer (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('The first argument must be a function')
    }

    this[kOperations].push(fn);
  }

  [kUndefer] () {
    if (this[kOperations].length === 0) {
      return
    }

    const operations = this[kOperations];
    this[kOperations] = [];

    for (const op of operations) {
      op();
    }
  }

  // TODO: docs and types
  attachResource (resource) {
    if (typeof resource !== 'object' || resource === null ||
      typeof resource.close !== 'function') {
      throw new TypeError('The first argument must be a resource object')
    }

    this[kResources].add(resource);
  }

  // TODO: docs and types
  detachResource (resource) {
    this[kResources].delete(resource);
  }

  _chainedBatch () {
    return new DefaultChainedBatch(this)
  }

  _checkKey (key) {
    if (key === null || key === undefined) {
      return new ModuleError('Key cannot be null or undefined', {
        code: 'LEVEL_INVALID_KEY'
      })
    }
  }

  _checkValue (value) {
    if (value === null || value === undefined) {
      return new ModuleError('Value cannot be null or undefined', {
        code: 'LEVEL_INVALID_VALUE'
      })
    }
  }
}

// Expose browser-compatible nextTick for dependents
// TODO: after we drop node 10, also use queueMicrotask in node
AbstractLevel$1.prototype.nextTick = requireNextTick();

const { AbstractSublevel: AbstractSublevel$1 } = requireAbstractSublevel()({ AbstractLevel: AbstractLevel$1 });

abstractLevel.AbstractLevel = AbstractLevel$1;
abstractLevel.AbstractSublevel = AbstractSublevel$1;

const maybeError = function (db, callback) {
  if (db[kStatus] !== 'open') {
    db.nextTick(callback, new ModuleError('Database is not open', {
      code: 'LEVEL_DATABASE_NOT_OPEN'
    }));
    return true
  }

  return false
};

const formats = function (db) {
  return Object.keys(db.supports.encodings)
    .filter(k => !!db.supports.encodings[k])
};

var AbstractLevel = abstractLevel$1.AbstractLevel = abstractLevel.AbstractLevel;
var AbstractSublevel = abstractLevel$1.AbstractSublevel = abstractLevel.AbstractSublevel;
var AbstractIterator = abstractLevel$1.AbstractIterator = abstractIterator.AbstractIterator;
var AbstractKeyIterator = abstractLevel$1.AbstractKeyIterator = abstractIterator.AbstractKeyIterator;
var AbstractValueIterator = abstractLevel$1.AbstractValueIterator = abstractIterator.AbstractValueIterator;
var AbstractChainedBatch = abstractLevel$1.AbstractChainedBatch = abstractChainedBatch.AbstractChainedBatch;

export { AbstractChainedBatch, AbstractIterator, AbstractKeyIterator, AbstractLevel, AbstractSublevel, AbstractValueIterator, abstractLevel$1 as default };
