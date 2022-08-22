import main_process from "./process/main-process.mjs"
export default (global = {}) => {
    return new Promise(async resolve => {
       resolve(await main_process(global))
    })
}