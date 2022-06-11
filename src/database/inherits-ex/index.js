var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var inheritsEx = {exports: {}};

var getPrototypeOf$6 = {exports: {}};

(function() {
  var getPrototypeOf;

  getPrototypeOf = Object.getPrototypeOf;

  if (!getPrototypeOf) {
    getPrototypeOf = function(obj) {
      return obj.__proto__;
    };
  }

  getPrototypeOf$6.exports = getPrototypeOf;

}).call(commonjsGlobal);

var getPrototypeOf$5     = getPrototypeOf$6.exports;

var isInheritedFromStr$1 = function(ctor, superStr, throwError) {
  if (ctor.name === superStr) {
    if (throwError)
      throw new Error('Circular inherits found!');
    else
      return true;
  }
  var ctorSuper = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$5(ctor);
  var result  =  ctorSuper != null && ctorSuper.name === superStr;
  var checkeds = [];
  checkeds.push(ctor);
  while (!result && ((ctor = ctorSuper) != null)) {
    ctorSuper = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$5(ctor);
    if (checkeds.indexOf(ctor) >= 0) {
      if (throwError)
        throw new Error('Circular inherits found!');
      else
        return true;
    }
    checkeds.push(ctor);
    result = ctorSuper != null && ctorSuper.name === superStr;
  }
  if (result) {
    result = ctor;
    ctor = checkeds[0];
    if (ctor.mixinCtor_ === result) result = ctor;
  }

  return result;
};

var isInheritedFromStr = isInheritedFromStr$1;
var getPrototypeOf$4     = getPrototypeOf$6.exports;

var objectSuperCtor$3 = getPrototypeOf$4(Object);

var isInheritedFrom$2 = function(ctor, superCtor, throwError) {
  if (typeof superCtor === 'string') return isInheritedFromStr(ctor, superCtor, throwError);
  if (ctor === superCtor) {
    if (throwError)
      throw new Error('Circular inherits found!');
    else
      return true;
  }
  var ctorSuper = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$4(ctor);
  var result  = ctorSuper === superCtor;
  var checkeds = [];
  checkeds.push(ctor);
  while (!result && ((ctor = ctorSuper) != null) && ctorSuper !== objectSuperCtor$3) {
    ctorSuper = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$4(ctor);
    if (checkeds.indexOf(ctor) >= 0) {
      if (throwError)
        throw new Error('Circular inherits found!');
      else
        return true;
    }
    checkeds.push(ctor);
    result = ctorSuper === superCtor;
  }
  if (result) {
    result = ctor;
    ctor = checkeds[0];
    if (ctor.mixinCtor_ === result) result = ctor;
  }

  return result;
};

var isEmptyCtor$1 = function(vStr) {
  var isClass = /^class\s+/.test(vStr);
  var result;
  if (isClass) {
    result = /^class\s+\S+\s*{\s*}/g.test(vStr);
    if (!result) {
      result = !/^class\s+\S+\s*{[\s\S]*(\S+\s*[\n;]\s*)?constructor\s*\((.|[\n\r\u2028\u2029])*\)\s*{[\s\S]*}[\s\S]*}/.test(vStr);
    }
  }
  return result;
};

var isEmptyCtor = isEmptyCtor$1;

var isEmptyFunction$2 = function(aFunc, istanbul) {
  var vStr = aFunc.toString();
  var result = /^function\s*\S*\s*\((.|[\n\r\u2028\u2029])*\)\s*{[\s;]*}$/g.test(vStr);
  if (!result) {result = isEmptyCtor(vStr);}

  if (!result) {
    if (!istanbul) try {istanbul = eval("require('istanbul')");} catch(e){}
    if (istanbul)
      result = /^function\s*\S*\s*\((.|[\n\r\u2028\u2029])*\)\s*{__cov_[\d\w_]+\.f\[.*\]\+\+;}$/.test(vStr);
  }
  return result;
};

var isEmptyFunction$1 = isEmptyFunction$2;
var getPrototypeOf$3    = getPrototypeOf$6.exports;

var objectSuperCtor$2 = getPrototypeOf$3(Object);

//get latest non-empty constructor function through inherits link:
var getConstructor$1 = function (ctor) {
  var result = ctor;
  var isEmpty = isEmptyFunction$1(result);
  // console.log('getConstructor', result.toString(), isEmpty)
  var v  = result.super_ || getPrototypeOf$3(result);
  while (isEmpty && v && v !== objectSuperCtor$2) {
    result  = v;
    v  = result.super_ || getPrototypeOf$3(result);
    isEmpty = isEmptyFunction$1(result);
  }
  // console.log('getConstructor', result.toString())
  //if (isEmpty) result = null;
  return result;
};

var _extend = extend$1;

var hasOwnProperty = Object.prototype.hasOwnProperty;
// var isArray = Array.isArray;

function extend$1(target) {
  for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
              target[key] = source[key];
          }
      }
  }

  return target
}

var getConstructor = getConstructor$1;
var isEmptyFunction = isEmptyFunction$2;
var extend = _extend;

var newPrototype$1 = function (aClass, aConstructor) {
  //Object.create(prototype) only for ES5
  //Object.create(prototype, initProps) only for ES6
  //For Browser not support ES5/6:
  //  var Object = function() { this.constructor = aConstructor; };
  //  Object.prototype = aClass.prototype;
  //  return new Object();
  var ctor = isEmptyFunction(aConstructor) ? getConstructor(aClass) : aConstructor;
  // console.log('TCL:: ~ file: newPrototype.js ~ line 13 ~ ctor', aClass, ctor);
  var result;
  if (Object.create) { //typeof Object.create === 'function'
    result = Object.create(aClass.prototype, {
      Class: {
        value: aConstructor,
        enumerable: false,
        writable: true,
        configurable: true
      },
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  } else {
    var Obj = function obj() {this.constructor = ctor;this.Class = aConstructor;};
    Obj.prototype = aClass.prototype;
    result = new Obj();
  }
  extend(result, aConstructor.prototype);
  // console.log('TCL:: ~ file: newPrototype.js ~ line 36 ~ result', result, aConstructor);
  return result;
};

var setPrototypeOf$2 = {exports: {}};

(function() {
  var setPrototypeOf;

  setPrototypeOf = Object.setPrototypeOf;

  if (!setPrototypeOf) {
    setPrototypeOf = function(obj, prototype) {
      return obj.__proto__ = prototype;
    };
  }

  setPrototypeOf$2.exports = setPrototypeOf;

}).call(commonjsGlobal);

var defineProperty$3 = {exports: {}};

(function() {
  var defineProperty;

  defineProperty = Object.defineProperty;

  if (!defineProperty) {
    defineProperty = function(obj, key, descriptor) {
      var value;
      if (descriptor) {
        value = descriptor.value;
      }
      obj[key] = value;
    };
  }

  defineProperty$3.exports = function(object, key, value, aOptions) {
    var descriptor, isAccessor, writable;
    writable = true;
    descriptor = {
      configurable: true,
      enumerable: false
    };
    if (aOptions) {
      descriptor.enumerable = aOptions.enumerable === true;
      descriptor.configurable = aOptions.configurable !== false;
      if (aOptions.get) {
        isAccessor = true;
        descriptor.get = aOptions.get;
      }
      if (aOptions.set) {
        isAccessor = true;
        descriptor.set = aOptions.set;
      }
      writable = aOptions.writable !== false;
      if (value === void 0) {
        value = aOptions.value;
      }
    }
    if (!isAccessor) {
      descriptor.writable = writable;
      descriptor.value = value;
    }
    return defineProperty(object, key, descriptor);
  };

}).call(commonjsGlobal);

var newPrototype = newPrototype$1;
var setPrototypeOf$1 = setPrototypeOf$2.exports;
var defineProperty$2 = defineProperty$3.exports;

//just replace the ctor.super to superCtor,
var inheritsDirectly$2 = function(ctor, superCtor, staticInherit) {
  defineProperty$2(ctor, 'super_', superCtor);
  defineProperty$2(ctor, '__super__', superCtor.prototype);//for coffeeScript super keyword.
  var vPrototype = newPrototype(superCtor, ctor);
  ctor.prototype = vPrototype; // ES6 class can not modify prototype!
  if (vPrototype !== ctor.prototype) {
    defineProperty$2(ctor.prototype, 'constructor', vPrototype.constructor);
    defineProperty$2(ctor.prototype, 'Class', vPrototype.Class);
  }
  // console.log('TCL:: ~ file: inheritsDirectly.js ~ line 11 ~ ctor.prototype', ctor.prototype, ctor.prototype.constructor, ctor.prototype.Class);
  setPrototypeOf$1(ctor.prototype, superCtor.prototype);
  if (staticInherit !== false) {
    // NOTE: ES6 use this to keep superCtor.
    setPrototypeOf$1(ctor, superCtor); // additional static inheritance
  }
};

var isArray           = Array.isArray;
var isInheritedFrom$1   = isInheritedFrom$2;
var inheritsDirectly$1  = inheritsDirectly$2;
var getPrototypeOf$2    = getPrototypeOf$6.exports;
var defineProperty$1    = defineProperty$3.exports;

var objectSuperCtor$1 = getPrototypeOf$2(Object);
/**
 * Inherit the prototype methods from one constructor into another.
 *
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 * @param {boolean} staticInherit whether static inheritance,defaults to true.
 */
function inherits$1(ctor, superCtor, staticInherit) {
  var v  = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$2(ctor);
  var mixinCtor = ctor.mixinCtor_;
  if (mixinCtor && v === mixinCtor) {
    ctor = mixinCtor;
    v = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$2(ctor);
  }
  var result = false;
  var isInherited = isInheritedFrom$1(ctor, superCtor);
  if (!isInherited && !isInheritedFrom$1(superCtor, ctor)) {
    inheritsDirectly$1(ctor, superCtor, staticInherit);
    // patch the missing prototype chain if exists ctor.super.
    while (v != null && v !== objectSuperCtor$1 && superCtor !== v) {
      ctor = superCtor;
      superCtor = v;
      inheritsDirectly$1(ctor, superCtor, staticInherit);
      v = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$2(ctor);
    }
    result = true;
  } else if (isInherited) {
    // additional properties
    if (!ctor.hasOwnProperty('super_')) {
      defineProperty$1(ctor, 'super_', superCtor);
      defineProperty$1(ctor.prototype, 'Class', ctor);
    }
    if (!ctor.hasOwnProperty('__super__')) {
      defineProperty$1(ctor, '__super__', superCtor.prototype);
    }
  }
  return result;
}

var inherits_1 = function(ctor, superCtors, staticInherit) {
  if (!isArray(superCtors)) return inherits$1(ctor, superCtors, staticInherit);
  for (var i = superCtors.length - 1; i >= 0; i--) {
    if (!inherits$1(ctor, superCtors[i], staticInherit)) return false;
  }
  return true;
};

var mixin$1 = {exports: {}};

var isMixinedFromStr$1 = function(ctor, superStr) {
  var result = false;
  var mixinCtors = ctor.mixinCtors_;
  if (mixinCtors) {
    for (var i = 0; i < mixinCtors.length; i++) {
      result = mixinCtors[i].name === superStr;
      if (result) break;
    }
  }

  return result;
};

var isMixinedFromStr = isMixinedFromStr$1;

var isMixinedFrom$1 = function(ctor, superCtor) {
  if (typeof superCtor === 'string') return isMixinedFromStr(ctor, superCtor);
  var mixinCtors = ctor.mixinCtors_;
  var result = false;
  if (mixinCtors) {
    result = mixinCtors.indexOf(superCtor);
    result = result >= 0;
  }
  return result;
};

var inheritsDirectly  = inheritsDirectly$2;
var isInheritedFrom   = isInheritedFrom$2;
var isMixinedFrom     = isMixinedFrom$1;
var defineProperty    = defineProperty$3.exports;
var getPrototypeOf$1    = getPrototypeOf$6.exports;

var getOwnPropertyNames = Object.getOwnPropertyNames;
var filterOpts = {
  'all': 0,
  'errSuper': 1,
  'skipSuper': 2
};

/**
 *  A11 -> A1 -> A -> Root
 *  B11 -> B1 -> B -> Root
 *  C11 -> C1 -> C -> Root
 *  mixin B11, C1 : inject C to B11.
 * TODO: Another Implement:
 *   B11 -> B1 -> B -> Root -> mixinCtor_ -> C1_Clone -> C -> Root?
 *
 *  mixin B11, A : inject A to B11.
 *   B11 -> B1 -> B -> Root -> mixinCtor_ -> A_Clone -> C1_Clone -> C -> Root?
 */

/**
 *  Mixin multi classes to ctor.
 *  mixin(Class, ParentClass1, ParentClass2, ...)
 *  + mixinCtors_ array to keep the mixined super ctors
 *  + mixinCtor_ inject to the super_ inheritance chain.
 *  inject into methods to implement inherit.
 *
 *  A11 -> A1 -> A -> Root
 *  B11 -> B1 -> B -> Root
 *  C11 -> C1 -> C -> Root
 *  mixin B11, C : inject C to B11.
 *  clone C.prototype to mixinCtor_.prototype
 *    * all mixined methods/properties are in `mixinCtor_`
 *  for k,method of C.prototype
 *    originalMethod = mixinCtor_.prototype[k]
 *    if isFunction(originalMethod) and originalMethod.__mixin_super__
 *      #B11.__super__ is mixinCtor_.prototype
 *      method  = ->
 *        B11.__super__ = originalMethod.__mixin_super__
 *        method.apply this, arguments
 *        B11.__super__ = mixinCtor_
 *      method.__mixin_super__ = C.prototype
 *  B11 -> mixinCtor_ -> B1 -> B -> Root
 *
mixin the exists method: the new mixin method will overwrite the old one.

```coffee
class Root
  m: ->
    console.log 'root'
    console.log '----'
class C
  inherits C, Root
  m: ->
    console.log "c"
    super
class B
  inherits B, Root
  m: ->
    console.log "b"
    super
class B11
  inherits B11, B
  m: ->
    console.log 'b11'
    super

b = new B11
b.m()
mixin B11, C
b = new B11
b.m()

# The console results:
# b11
# b
# root
# ----
# b11
# c
# root
# ----

```


 *
 */

/**
 *  check the function body whether call the super
 *
 */
function isSuperInFunction(aMethod) {
  var vStr = aMethod.toString();
  return vStr.indexOf('__super__') >= 0 || /(\s+|^|[;(\[])super[(]|super[.]\S+[(]/.test(vStr);
}

function _getFilterFunc(filter){
  if (!filter) {
    filter = function all(name, value){return value};
  } else if (filter === 1) {
    filter = function raiseErrorOnSuper(name, value) {
      if (typeof value === 'function' && isSuperInFunction(value)) {
        throw new Error(name + ' method: should not use super');
      }
      return value;
    };
  } else if (filter === 2) {
    filter = function skipOnSuper(name, value) {
      if (typeof value !== 'function' || !isSuperInFunction(value)) {
        return value;
      }
    };
  } else if (Array.isArray(filter) && filter.length) {
    var inFilter = filter;
    filter = function allowedInFilter(name, value) {
      if (inFilter.indexOf(name) >= 0) {
        return value;
      }
    };
  } else if (typeof filter !== 'function') {
    throw new Error('filter option value error:' + filter);
  }
  return filter;
}

function _clone(dest, src, ctor, filter) {
  // filter = _getFilterFunc(filter);

  var names = getOwnPropertyNames(src);

  for (var i = 0; i < names.length; i++ ) {
    var k = names[i];
    // if (k === 'Class' || k === 'constructor') continue;
    var value = filter(k, src[k]);
    if (value !== void 0) dest[k] = value;
  }
}

function cloneCtor(dest, src, ctor, filter) {
  var filterFn = function (name, value) {
    for (var n of [ 'length', 'name', 'arguments', 'caller', 'prototype' ]) {
      if (n === name) {
        value = void 0;
        break;
      }
      if (value !== void 0) value = filter(name, value);
    }
    return value;
  };
  _clone(dest, src, ctor, filterFn);
}

//clone src(superCtor) to dest(MixinCtor)
function clonePrototype(dest, src, ctor, filter) {
  // filter = _getFilterFunc(filter);
  var filterFn = function (name, value) {
    for (var n of [ 'Class', 'constructor' ]) {
      if (n === name) {
        value = void 0;
        break;
      }
      if (value !== void 0) value = filter(name, value);
    }
    return value;
  };

  var sp = src.prototype;
  var dp = dest.prototype;
  _clone(dp, sp, ctor, filterFn);
  /*
  var names = getOwnPropertyNames(sp);

  for (var i = 0; i < names.length; i++ ) {
    var k = names[i];
    if (k === 'Class' || k === 'constructor') continue;
    var value = filter(k, sp[k]);
    // console.log(k, value)
    if (value !== void 0) dp[k] = value;
    // continue;


    // var method = sp[k];
    // var mixinedMethod = dp[k]; // the method is already clone into mixinCtor_

    // just override the property simply.
    // if (mixinedMethod !== void 0 && typeof mixinedMethod !== 'function') {
    //  // Already be defined as property in the mixin ctor
    //   continue;
    // }

    // if (typeof method === 'function') {
    //   console.log(src, k, getProtoChain(dest.chain))
    //   if (mixinedMethod && mixinedMethod.__mixin_super__) continue;
    //   if (isSuperInFunction(method)) {
    //     console.log('mixined', method)
    //     method = _mixinGenMethod(dest.chain.__super__, method, src);
    //     method.__mixin_super__ = true;
    //   }
    //   dp[k] = method;
    //   continue;

      // if (mixinedMethod && mixinedMethod.__mixin_super__){
      //   if (isSuperInFunction(method)) {
      //     // pass the last mixin super to control the super's parent.
      //     // 但是这将导致代码不会在单一类中流转，不过似乎函数复制过来本来就没有继承关系了。
      //     // A1->A  B1->B C1->C假设 Mixin(B1, [A1,C1]),那么 C1上的方法，本来如果super应该是C
      //     // 但是应为上次方法复制过来的时候指定了 __mixin_super__ 为 A1，就跳到A1上了。
      //     // 不过这个__mixin_super__应该在闭包中，否则会断链。
      //     // 又想到了一招，直接构造新的prototype: 形成双根chain,仅当mixin时用这个chain,
      //     // mixinCtor.chain -> A1CloneCtor -> A1
      //     // mixinCtor.chain -> C1CloneCtor -> A1CloneCtor -> A1
      //     //method = _mixinGenMethod(mixinedMethod.__mixin_super__, method, src);
      //     method = _mixinGenMethod(dest.chain, method, src);

      //   }
      //   else if (isES6SuperInFunction(method)) {
      //     method = _mixinGenMethodES6(mixinedMethod.__mixin_super__, method, src);
      //   }
      // }

      //last mixin_super of this mixined method.
      // method.__mixin_super__ = sp;
    // }
    // dp[k] = method;
  }
  */
}

// function shadowCloneCtor(ctor) {
//   var result = createCtor('Clone__' + ctor.name, '');
//   inheritsDirectly(result, ctor);
//   return result;
// }

// function findLastClonedCtor(ctor) {
//   var result;
//   while (ctor && ctor.name.indexOf('Clone__') === 0) {
//     result = ctor;
//     ctor = ctor.super_;
//   }
//   return result;
// }

var objectSuperCtor = getPrototypeOf$1(Object);
function mixin(ctor, superCtor, options) {
  var v  = (ctor.hasOwnProperty('super_') && ctor.super_) || getPrototypeOf$1(ctor); // original superCtor
  var result = false;
  if (!isMixinedFrom(ctor, superCtor) && !isInheritedFrom(ctor, superCtor) && !isInheritedFrom(superCtor, ctor)) {
    var mixinCtor = ctor.mixinCtor_;
    var mixinCtors = ctor.mixinCtors_;
    if (!mixinCtor) {
      mixinCtor = function MixinCtor_(){};
      defineProperty(ctor, 'mixinCtor_', mixinCtor);
      if (v && v !== objectSuperCtor) inheritsDirectly(mixinCtor, v);
      // defineProperty(mixinCtor, 'chain', shadowCloneCtor(superCtor));
      // inheritsDirectly(mixinCtor.chain, shadowCloneCtor(superCtor));
    // } else {
    //   var lastChainCtor = findLastClonedCtor(mixinCtor.chain);
    //   inheritsDirectly(lastChainCtor, shadowCloneCtor(superCtor));
    }
    if (!mixinCtors) {
      mixinCtors = [];
      defineProperty(ctor, 'mixinCtors_', mixinCtors);
    }
    mixinCtors.push(superCtor);//quickly check in isMixinedFrom.
    var filterFn = _getFilterFunc(options && options.filter);
    cloneCtor(mixinCtor, superCtor, ctor, filterFn);
    clonePrototype(mixinCtor, superCtor, ctor, filterFn);
    inheritsDirectly(ctor, mixinCtor);
    result = true;
  }
  return result;
}

var mixins = mixin$1.exports = function(ctor, superCtors, options) {
  if (typeof superCtors === 'function') return mixin(ctor, superCtors, options);
  for (var i = 0; i < superCtors.length; i++) {
    var superCtor = superCtors[i];
    if (!mixin(ctor, superCtor, options)) return false;
  }
  return true;
};

mixins.filterOpts = filterOpts;

var inherits = inherits_1;
var getPrototypeOf = getPrototypeOf$6.exports;
var setPrototypeOf = setPrototypeOf$2.exports;

//make sure the aClass.prototype hook to the aObject instance.

var inheritsObject = function(aObject, aClass, staticInherit) {
  // ES6: Object.getPrototypeOf / Object.setPrototypeOf
  var vOldProto = getPrototypeOf(aObject);
  var result = false;
  if ( vOldProto !== aClass.prototype) {
    inherits(aClass, vOldProto.constructor, staticInherit);
    setPrototypeOf(aObject, aClass.prototype);
    result = true;
  }
  return result;
};

(function (module) {
	var exports = module.exports = inherits_1;
	exports.directly = inheritsDirectly$2;
	exports.is = isInheritedFrom$2;
	exports.mixin = mixin$1.exports;
	exports.isMixin = isMixinedFrom$1;
	exports.object = inheritsObject;
} (inheritsEx));

var index = /*@__PURE__*/getDefaultExportFromCjs(inheritsEx.exports);

export { index as default };
