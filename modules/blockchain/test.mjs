import fff from './testModule.mjs'
async function test() {
  console.log('DDDDDDDDDDDDDDDD')
return 2
}
let global = 0
let x = await test()
let y = await fff()
console.log('########', global)

export default global