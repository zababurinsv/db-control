import require$$0 from 'inherits-ex/lib/inherits';
import 'inherits-ex/lib/createFunction';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var abstractError$1 = {exports: {}};

(function (module) {
	(function() {
	  var AbstractError, Err, createError, errors, firstLower, inherits, k, kCorruption, kIOError, kInvalidArgument, kInvalidFormat, kInvalidType, kNotFound, kNotOpened, kNotSupported, kOk;

	  inherits = require$$0;

	  firstLower = function(s) {
	    if (s === 'IO') {
	      return s.toLowerCase();
	    }
	    return s[0].toLowerCase() + s.substring(1);
	  };

	  module.exports.AbstractError = AbstractError = (function() {
	    inherits(AbstractError, Error);

	    function AbstractError(msg, errno) {
	      Error.call(this, msg);
	      this.code = errno;
	      this.message = msg;
	      if (Error.captureStackTrace) {
	        Error.captureStackTrace(this, arguments.callee);
	      }
	    }

	    return AbstractError;

	  })();

	  module.exports.NotImplementedError = (function() {
	    inherits(NotImplementedError, AbstractError);

	    function NotImplementedError() {
	      AbstractError.call(this, "NotImplemented", kNotSupported);
	    }

	    return NotImplementedError;

	  })();

	  kOk = 0;

	  kNotFound = 1;

	  kCorruption = 2;

	  kNotSupported = 3;

	  kInvalidArgument = 4;

	  kIOError = 5;

	  kNotOpened = 6;

	  kInvalidType = 7;

	  kInvalidFormat = 8;

	  errors = {
	    Ok: kOk,
	    NotFound: kNotFound,
	    Corruption: kCorruption,
	    NotSupported: kNotSupported,
	    InvalidArgument: kInvalidArgument,
	    IO: kIOError,
	    NotOpened: kNotOpened,
	    InvalidType: kInvalidType,
	    InvalidFormat: kInvalidFormat
	  };

	  module.exports.createError = createError = function(aType, aErrorCode, ErrorClass) {
	    if (ErrorClass == null) {
	      ErrorClass = AbstractError;
	    }
	    ErrorClass[aType] = aErrorCode;
	    ErrorClass["is" + aType] = (function(aErrorCode, aType) {
	      return function(err) {
	        return err.code === aErrorCode || ((err.code == null) && err.message && err.message.substring(0, aType.length) === aType);
	      };
	    })(aErrorCode, aType);
	    ErrorClass.prototype[firstLower(aType)] = (function(aIsMethodName, ErrorClass) {
	      return function() {
	        return ErrorClass[aIsMethodName](this);
	      };
	    })("is" + aType, ErrorClass);

	    /* ugly way to create a named ctor.
	    result = createFunction aType+'Error', ['msg', 'aCode'],
	      "if ('number' !== typeof aCode) {aCode = aErrorCode;}\n
	       if (msg == null || msg === '') {msg = aType;}\n
	      "+ aType + 'Error.__super__.constructor.call(this, msg, aCode);',
	        aErrorCode: aErrorCode
	        aType: aType
	    inherits result, ErrorClass
	    result::name = aType + 'Error'
	    result
	     */
	    return (function() {
	      inherits(Err, ErrorClass);

	      Err.prototype.name = aType + 'Error';

	      function Err(msg, aCode) {
	        if (typeof aCode !== 'number') {
	          aCode = aErrorCode;
	        }
	        if ((msg == null) || msg === "") {
	          msg = aType;
	        }
	        Err.__super__.constructor.call(this, msg, aCode);
	      }

	      return Err;

	    })();
	  };

	  for (k in errors) {
	    Err = createError(k, errors[k]);
	    if (errors[k] > 0) {
	      module.exports[k + "Error"] = Err;
	    }

	    /* the error code
	    AbstractError[k] = errors[k]
	    
	    #generate AbstractError.isNotFound(err) class methods:
	    AbstractError["is" + k] = ((i, aType) ->
	      (err) ->
	        err.code is i or (not err.code? and err.message and err.message.substring(0, aType.length) is aType)
	    )(errors[k], k)
	    
	    #generate AbstractError.notFound() instance methods:
	    AbstractError::[firstLower(k)] = ((aType) ->
	      ->
	        AbstractError[aType] this
	    )("is" + k)
	    if errors[k] > 0
	      Err = ((i, aType) ->
	        (msg) ->
	          msg = aType  if not msg? or msg is ""
	          AbstractError.call this, msg, i
	      )(errors[k], k)
	      inherits Err, AbstractError
	      
	      #generate NotFoundError,... Classes
	      module.exports[k + "Error"] = Err
	     */
	  }

	}).call(commonjsGlobal);

	
} (abstractError$1));

var abstractError = abstractError$1.exports;

export { abstractError as default };
