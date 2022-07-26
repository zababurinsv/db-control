import api from './api.mjs'
let DappStaticCall = () => {}
let GetCurrentInfo = () => {}
let GetNodeList = () => {}

/**
 *
 * @param StartNum
 * @param CountNum
 * @returns {Promise<*>}
 * @constructor
 */
let GetAccountList = async (StartNum = 0, CountNum = 1) => {
   return await api.get(`/api/v1/GetAccountList?StartNum=${StartNum}&CountNum=${CountNum}`)
}
let GetBlockList = () => {}
let GetTransactionList = () => {}
let GetDappList = () => {}
let GetAccountListByKey = () => {}
let GetTransaction = () => {}
let GetHistoryTransactions = () => {}
let SendHexTx = () => {}
let GetSupply = () => {}
let GetWork = () => {}
let SubmitWork = () => {}
export default {
    DappStaticCall: DappStaticCall,
    GetCurrentInfo: GetCurrentInfo,
    GetNodeList: GetNodeList,
    GetAccountList: GetAccountList,
    GetBlockList: GetBlockList,
    GetTransactionList: GetTransactionList,
    GetDappList: GetDappList,
    GetAccountListByKey: GetAccountListByKey,
    GetTransaction: GetTransaction,
    GetHistoryTransactions: GetHistoryTransactions,
    SendHexTx: SendHexTx,
    GetSupply: GetSupply,
    Mining: {
        GetWork: GetWork,
        SubmitWork: SubmitWork
    }
}