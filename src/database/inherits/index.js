// old school shim for old browsers
export const oldBrowsersInherits =  function inherits(ctor, superCtor) {
    if (superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
    }
}

/* istanbul ignore else - coverage doesn't work without Object.create */
// implementation from standard node.js 'util' module
export default function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            })
        }
    };
