import require$$0 from '../module-error/index.js';
import require$$0$1 from '../buffer/index.js';

var levelTranscoder = {};

var encodings$1 = {};

/** @type {{ textEncoder: TextEncoder, textDecoder: TextDecoder }|null} */
let lazy = null;

/**
 * Get semi-global instances of TextEncoder and TextDecoder.
 * @returns {{ textEncoder: TextEncoder, textDecoder: TextDecoder }}
 */
var textEndec$1 = function () {
  if (lazy === null) {
    lazy = {
      textEncoder: new TextEncoder(),
      textDecoder: new TextDecoder()
    };
  }

  return lazy
};

var formats$1 = {};

var encoding = {};

const ModuleError$1 = require$$0;
const formats = new Set(['buffer', 'view', 'utf8']);

/**
 * @template TIn, TFormat, TOut
 * @abstract
 */
class Encoding$2 {
  /**
   * @param {IEncoding<TIn,TFormat,TOut>} options
   */
  constructor (options) {
    /** @type {(data: TIn) => TFormat} */
    this.encode = options.encode || this.encode;

    /** @type {(data: TFormat) => TOut} */
    this.decode = options.decode || this.decode;

    /** @type {string} */
    this.name = options.name || this.name;

    /** @type {string} */
    this.format = options.format || this.format;

    if (typeof this.encode !== 'function') {
      throw new TypeError("The 'encode' property must be a function")
    }

    if (typeof this.decode !== 'function') {
      throw new TypeError("The 'decode' property must be a function")
    }

    this.encode = this.encode.bind(this);
    this.decode = this.decode.bind(this);

    if (typeof this.name !== 'string' || this.name === '') {
      throw new TypeError("The 'name' property must be a string")
    }

    if (typeof this.format !== 'string' || !formats.has(this.format)) {
      throw new TypeError("The 'format' property must be one of 'buffer', 'view', 'utf8'")
    }

    if (options.createViewTranscoder) {
      this.createViewTranscoder = options.createViewTranscoder;
    }

    if (options.createBufferTranscoder) {
      this.createBufferTranscoder = options.createBufferTranscoder;
    }

    if (options.createUTF8Transcoder) {
      this.createUTF8Transcoder = options.createUTF8Transcoder;
    }
  }

  get commonName () {
    return /** @type {string} */ (this.name.split('+')[0])
  }

  /** @return {BufferFormat<TIn,TOut>} */
  createBufferTranscoder () {
    throw new ModuleError$1(`Encoding '${this.name}' cannot be transcoded to 'buffer'`, {
      code: 'LEVEL_ENCODING_NOT_SUPPORTED'
    })
  }

  /** @return {ViewFormat<TIn,TOut>} */
  createViewTranscoder () {
    throw new ModuleError$1(`Encoding '${this.name}' cannot be transcoded to 'view'`, {
      code: 'LEVEL_ENCODING_NOT_SUPPORTED'
    })
  }

  /** @return {UTF8Format<TIn,TOut>} */
  createUTF8Transcoder () {
    throw new ModuleError$1(`Encoding '${this.name}' cannot be transcoded to 'utf8'`, {
      code: 'LEVEL_ENCODING_NOT_SUPPORTED'
    })
  }
}

encoding.Encoding = Encoding$2;

const { Buffer: Buffer$1 } = require$$0$1 || {};
const { Encoding: Encoding$1 } = encoding;
const textEndec = textEndec$1;

/**
 * @template TIn, TOut
 * @extends {Encoding<TIn,Buffer,TOut>}
 */
class BufferFormat$2 extends Encoding$1 {
  /**
   * @param {Omit<IEncoding<TIn, Buffer, TOut>, 'format'>} options
   */
  constructor (options) {
    super({ ...options, format: 'buffer' });
  }

  /** @override */
  createViewTranscoder () {
    return new ViewFormat$2({
      encode: this.encode, // Buffer is a view (UInt8Array)
      decode: (data) => this.decode(
        Buffer$1.from(data.buffer, data.byteOffset, data.byteLength)
      ),
      name: `${this.name}+view`
    })
  }

  /** @override */
  createBufferTranscoder () {
    return this
  }
}

/**
 * @extends {Encoding<TIn,Uint8Array,TOut>}
 * @template TIn, TOut
 */
class ViewFormat$2 extends Encoding$1 {
  /**
   * @param {Omit<IEncoding<TIn, Uint8Array, TOut>, 'format'>} options
   */
  constructor (options) {
    super({ ...options, format: 'view' });
  }

  /** @override */
  createBufferTranscoder () {
    return new BufferFormat$2({
      encode: (data) => {
        const view = this.encode(data);
        return Buffer$1.from(view.buffer, view.byteOffset, view.byteLength)
      },
      decode: this.decode, // Buffer is a view (UInt8Array)
      name: `${this.name}+buffer`
    })
  }

  /** @override */
  createViewTranscoder () {
    return this
  }
}

/**
 * @extends {Encoding<TIn,string,TOut>}
 * @template TIn, TOut
 */
class UTF8Format$2 extends Encoding$1 {
  /**
   * @param {Omit<IEncoding<TIn, string, TOut>, 'format'>} options
   */
  constructor (options) {
    super({ ...options, format: 'utf8' });
  }

  /** @override */
  createBufferTranscoder () {
    return new BufferFormat$2({
      encode: (data) => Buffer$1.from(this.encode(data), 'utf8'),
      decode: (data) => this.decode(data.toString('utf8')),
      name: `${this.name}+buffer`
    })
  }

  /** @override */
  createViewTranscoder () {
    const { textEncoder, textDecoder } = textEndec();

    return new ViewFormat$2({
      encode: (data) => textEncoder.encode(this.encode(data)),
      decode: (data) => this.decode(textDecoder.decode(data)),
      name: `${this.name}+view`
    })
  }

  /** @override */
  createUTF8Transcoder () {
    return this
  }
}

formats$1.BufferFormat = BufferFormat$2;
formats$1.ViewFormat = ViewFormat$2;
formats$1.UTF8Format = UTF8Format$2;

const { Buffer } = require$$0$1 || { Buffer: { isBuffer: () => false } };
const { textEncoder, textDecoder } = textEndec$1();
const { BufferFormat: BufferFormat$1, ViewFormat: ViewFormat$1, UTF8Format: UTF8Format$1 } = formats$1;

/** @type {<T>(v: T) => v} */
const identity = (v) => v;

/**
 * @type {typeof import('./encodings').utf8}
 */
encodings$1.utf8 = new UTF8Format$1({
  encode: function (data) {
    // On node 16.9.1 buffer.toString() is 5x faster than TextDecoder
    return Buffer.isBuffer(data)
      ? data.toString('utf8')
      : ArrayBuffer.isView(data)
        ? textDecoder.decode(data)
        : String(data)
  },
  decode: identity,
  name: 'utf8',
  createViewTranscoder () {
    return new ViewFormat$1({
      encode: function (data) {
        return ArrayBuffer.isView(data) ? data : textEncoder.encode(data)
      },
      decode: function (data) {
        return textDecoder.decode(data)
      },
      name: `${this.name}+view`
    })
  },
  createBufferTranscoder () {
    return new BufferFormat$1({
      encode: function (data) {
        return Buffer.isBuffer(data)
          ? data
          : ArrayBuffer.isView(data)
            ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
            : Buffer.from(String(data), 'utf8')
      },
      decode: function (data) {
        return data.toString('utf8')
      },
      name: `${this.name}+buffer`
    })
  }
});

/**
 * @type {typeof import('./encodings').json}
 */
encodings$1.json = new UTF8Format$1({
  encode: JSON.stringify,
  decode: JSON.parse,
  name: 'json'
});

/**
 * @type {typeof import('./encodings').buffer}
 */
encodings$1.buffer = new BufferFormat$1({
  encode: function (data) {
    return Buffer.isBuffer(data)
      ? data
      : ArrayBuffer.isView(data)
        ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
        : Buffer.from(String(data), 'utf8')
  },
  decode: identity,
  name: 'buffer',
  createViewTranscoder () {
    return new ViewFormat$1({
      encode: function (data) {
        return ArrayBuffer.isView(data) ? data : Buffer.from(String(data), 'utf8')
      },
      decode: function (data) {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength)
      },
      name: `${this.name}+view`
    })
  }
});

/**
 * @type {typeof import('./encodings').view}
 */
encodings$1.view = new ViewFormat$1({
  encode: function (data) {
    return ArrayBuffer.isView(data) ? data : textEncoder.encode(data)
  },
  decode: identity,
  name: 'view',
  createBufferTranscoder () {
    return new BufferFormat$1({
      encode: function (data) {
        return Buffer.isBuffer(data)
          ? data
          : ArrayBuffer.isView(data)
            ? Buffer.from(data.buffer, data.byteOffset, data.byteLength)
            : Buffer.from(String(data), 'utf8')
      },
      decode: identity,
      name: `${this.name}+buffer`
    })
  }
});

/**
 * @type {typeof import('./encodings').hex}
 */
encodings$1.hex = new BufferFormat$1({
  encode: function (data) {
    return Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'hex')
  },
  decode: function (buffer) {
    return buffer.toString('hex')
  },
  name: 'hex'
});

/**
 * @type {typeof import('./encodings').base64}
 */
encodings$1.base64 = new BufferFormat$1({
  encode: function (data) {
    return Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'base64')
  },
  decode: function (buffer) {
    return buffer.toString('base64')
  },
  name: 'base64'
});

const ModuleError = require$$0;
const encodings = encodings$1;
const { Encoding } = encoding;
const { BufferFormat, ViewFormat, UTF8Format } = formats$1;

const kFormats = Symbol('formats');
const kEncodings = Symbol('encodings');
const validFormats = new Set(['buffer', 'view', 'utf8']);

/** @template T */
class Transcoder {
  /**
   * @param {Array<'buffer'|'view'|'utf8'>} formats
   */
  constructor (formats) {
    if (!Array.isArray(formats)) {
      throw new TypeError("The first argument 'formats' must be an array")
    } else if (!formats.every(f => validFormats.has(f))) {
      // Note: we only only support aliases in key- and valueEncoding options (where we already did)
      throw new TypeError("Format must be one of 'buffer', 'view', 'utf8'")
    }

    /** @type {Map<string|MixedEncoding<any, any, any>, Encoding<any, any, any>>} */
    this[kEncodings] = new Map();
    this[kFormats] = new Set(formats);

    // Register encodings (done early in order to populate encodings())
    for (const k in encodings) {
      try {
        this.encoding(k);
      } catch (err) {
        /* istanbul ignore if: assertion */
        if (err.code !== 'LEVEL_ENCODING_NOT_SUPPORTED') throw err
      }
    }
  }

  /**
   * @returns {Array<Encoding<any,T,any>>}
   */
  encodings () {
    return Array.from(new Set(this[kEncodings].values()))
  }

  /**
   * @param {string|MixedEncoding<any, any, any>} encoding
   * @returns {Encoding<any, T, any>}
   */
  encoding (encoding) {
    let resolved = this[kEncodings].get(encoding);

    if (resolved === undefined) {
      if (typeof encoding === 'string' && encoding !== '') {
        resolved = lookup[encoding];

        if (!resolved) {
          throw new ModuleError(`Encoding '${encoding}' is not found`, {
            code: 'LEVEL_ENCODING_NOT_FOUND'
          })
        }
      } else if (typeof encoding !== 'object' || encoding === null) {
        throw new TypeError("First argument 'encoding' must be a string or object")
      } else {
        resolved = from(encoding);
      }

      const { name, format } = resolved;

      if (!this[kFormats].has(format)) {
        if (this[kFormats].has('view')) {
          resolved = resolved.createViewTranscoder();
        } else if (this[kFormats].has('buffer')) {
          resolved = resolved.createBufferTranscoder();
        } else if (this[kFormats].has('utf8')) {
          resolved = resolved.createUTF8Transcoder();
        } else {
          throw new ModuleError(`Encoding '${name}' cannot be transcoded`, {
            code: 'LEVEL_ENCODING_NOT_SUPPORTED'
          })
        }
      }

      for (const k of [encoding, name, resolved.name, resolved.commonName]) {
        this[kEncodings].set(k, resolved);
      }
    }

    return resolved
  }
}

var Transcoder_1 = levelTranscoder.Transcoder = Transcoder;

/**
 * @param {MixedEncoding<any, any, any>} options
 * @returns {Encoding<any, any, any>}
 */
function from (options) {
  if (options instanceof Encoding) {
    return options
  }

  // Loosely typed for ecosystem compatibility
  const maybeType = 'type' in options && typeof options.type === 'string' ? options.type : undefined;
  const name = options.name || maybeType || `anonymous-${anonymousCount++}`;

  switch (detectFormat(options)) {
    case 'view': return new ViewFormat({ ...options, name })
    case 'utf8': return new UTF8Format({ ...options, name })
    case 'buffer': return new BufferFormat({ ...options, name })
    default: {
      throw new TypeError("Format must be one of 'buffer', 'view', 'utf8'")
    }
  }
}

/**
 * If format is not provided, fallback to detecting `level-codec`
 * or `multiformats` encodings, else assume a format of buffer.
 * @param {MixedEncoding<any, any, any>} options
 * @returns {string}
 */
function detectFormat (options) {
  if ('format' in options && options.format !== undefined) {
    return options.format
  } else if ('buffer' in options && typeof options.buffer === 'boolean') {
    return options.buffer ? 'buffer' : 'utf8' // level-codec
  } else if ('code' in options && Number.isInteger(options.code)) {
    return 'view' // multiformats
  } else {
    return 'buffer'
  }
}

/**
 * @typedef {import('./lib/encoding').MixedEncoding<TIn,TFormat,TOut>} MixedEncoding
 * @template TIn, TFormat, TOut
 */

/**
 * @type {Object.<string, Encoding<any, any, any>>}
 */
const aliases = {
  binary: encodings.buffer,
  'utf-8': encodings.utf8
};

/**
 * @type {Object.<string, Encoding<any, any, any>>}
 */
const lookup = {
  ...encodings,
  ...aliases
};

let anonymousCount = 0;

export { Transcoder_1 as Transcoder, levelTranscoder as default };
