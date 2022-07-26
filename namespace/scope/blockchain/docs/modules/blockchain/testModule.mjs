
async function test() {
  console.log('DDDDDDDDDDDDDDDD')
  return 2
}


let out = await test()

let global = {}
export default (self) => {
  global = self
}