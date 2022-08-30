/**
 * Язык тернарного описания
 * @namespace LTD
 */
/**
 * @memberof LTD
 * @typedef {Object} T
 * @property {String} name - type ltd.
 * @property {String} type - type bio.
 */
 /**
 * @memberof LTD
 * @typedef {Object} System
 * @property {boolean} v - views
 * @property {any} p - property
 * @property {String} c - color
 * @property {T} s - substrate
 * @property {String} r - relation
 */

/**
 * @memberof Utils
 * @function createDocs
 * @param {Object} data
 * @return String
 */
function createDocs (data) {

}
export default async () => {
  let core = await import('/static/html/components/component_modules/ride/index.mjs')
  core = await core.Core
  let type = core.message.ltd
  console.log(type)
  createDocs({
    FunctionsDoc: core.message.FunctionsDoc,
    doc: core.message.doc
  })
  let ltd = {
   /**
   * @memberof RAID
   * @function toBytes
   * @param {string} s
   * @return Bytes
   */
   toBytes: (s) => { },

   /**
   * @memberof LTD
   * @function synthesis
   * @param {T} a object
   * @param {T} b object
   * */
   synthesis: (a, b) => {
     return new Promise(function (resolve) {
       try {
         let out = ''
         switch (a.name) {
           case 't':
             switch (b.name) {
               case 't':
                 out = type[type.key[2]]
                 break
               case `t'`:
                 out = type[type.key[9]]
                 break
               case `T'`:
                 out = type[type.key[9]]
                 break
               case `a`:
                 out = type[type.key[9]]
                 break
               case `A`:
                 out = type[type.key[9]]
                 break
               case `Lt`:
                 out = type[type.key[2]]
                 break
               case `Lt'`:
                 out = type[type.key[9]]
                 break
               case `La`:
                 out = type[type.key[9]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           case `t'`:
             switch (b.name) {
               case 't':
                 out = type[type.key[9]]
                 break
               case `t'`:
                 out = type[type.key[3]]
                 break
               case `T'`:
                 out = type[type.key[6]]
                 break
               case `a`:
                 out = type[type.key[5]]
                 break
               case `A`:
                 out = type[type.key[5]]
                 break
               case `Lt`:
                 out = type[type.key[9]]
                 break
               case `Lt'`:
                 out = type[type.key[3]]
                 break
               case `La`:
                 out = type[type.key[5]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           case `T'`:
             switch (b.name) {
               case 't':
                 out = type[type.key[9]]
                 break
               case `t'`:
                 out = type[type.key[3]]
                 break
               case `T'`:
                 out = type[type.key[3]]
                 break
               case `a`:
                 out = type[type.key[5]]
                 break
               case `A`:
                 out = type[type.key[5]]
                 break
               case `Lt`:
                 out = type[type.key[9]]
                 break
               case `Lt'`:
                 out = type[type.key[3]]
                 break
               case `La`:
                 out = type[type.key[5]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           case `a`:
             switch (b.name) {
               case 't':
                 out = type[type.key[9]]
                 break
               case `t'`:
                 out = type[type.key[9]]
                 break
               case `T'`:
                 out = type[type.key[9]]
                 break
               case `a`:
                 out = type[type.key[9]]
                 break
               case `A`:
                 out = type[type.key[9]]
                 break
               case `Lt`:
                 out = type[type.key[9]]
                 break
               case `Lt'`:
                 out = type[type.key[9]]
                 break
               case `La`:
                 out = type[type.key[9]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           case `A`:
             switch (b.name) {
               case 't':
                 out = type[type.key[9]]
                 break
               case `t'`:
                 out = type[type.key[9]]
                 break
               case `T'`:
                 out = type[type.key[9]]
                 break
               case `a`:
                 out = type[type.key[9]]
                 break
               case `A`:
                 out = type[type.key[9]]
                 break
               case `Lt`:
                 out = type[type.key[9]]
                 break
               case `Lt'`:
                 out = type[type.key[9]]
                 break
               case `La`:
                 out = type[type.key[9]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           case `Lt`:
             switch (b.name) {
               case 't':
                 out = type[type.key[9]]
                 break
               case `t'`:
                 out = type[type.key[9]]
                 break
               case `T'`:
                 out = type[type.key[9]]
                 break
               case `a`:
                 out = type[type.key[9]]
                 break
               case `A`:
                 out = type[type.key[9]]
                 break
               case `Lt`:
                 out = type[type.key[9]]
                 break
               case `Lt'`:
                 out = type[type.key[9]]
                 break
               case `La`:
                 out = type[type.key[9]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           case `Lt'`:
             switch (b.name) {
               case 't':
                 out = type[type.key[9]]
                 break
               case `t'`:
                 out = type[type.key[9]]
                 break
               case `T'`:
                 out = type[type.key[9]]
                 break
               case `a`:
                 out = type[type.key[9]]
                 break
               case `A`:
                 out = type[type.key[9]]
                 break
               case `Lt`:
                 out = type[type.key[9]]
                 break
               case `Lt'`:
                 out = type[type.key[9]]
                 break
               case `La`:
                 out = type[type.key[9]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           case `La`:
             switch (b.name) {
               case 't':
                 out = type[type.key[9]]
                 break
               case `t'`:
                 out = type[type.key[5]]
                 break
               case `T'`:
                 out = type[type.key[5]]
                 break
               case `a`:
                 out = type[type.key[5]]
                 break
               case `A`:
                 out = type[type.key[5]]
                 break
               case `Lt`:
                 out = type[type.key[9]]
                 break
               case `Lt'`:
                 out = type[type.key[5]]
                 break
               case `La`:
                 out = type[type.key[5]]
                 break
               default:
                 console.assert(false, 'нет такого типа', a, b)
             }
             break
           default:
             console.assert(false, 'нет такого типа', a, b)
         }
         resolve( {
           status: '',
           success: true,
           message: out,
           _scriptDir: import.meta.url
         })
       } catch (e) {
         resolve({
           _scriptDir: import.meta.url,
           status: '',
           success: false,
           message: e
         })
       }
     })
   },
   core: await core
 }

  return ltd
}