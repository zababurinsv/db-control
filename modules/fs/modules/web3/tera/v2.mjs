let GenerateKeys = () => {}
let CreateAccount = () => {}
let Send = () => {}
let SendCall = () => {}
let GetBalance = () => {}
let GetTransaction = () => {}
let GetHistoryTransactions = () => {}
let CreateRawTransaction = () => {}
let SignRawTransaction = () => {}
let SendRawTransaction = () => {}
let TxID = () => {}
let block = () => {}
export default {
    GenerateKeys: GenerateKeys,
    CreateAccount: CreateAccount,
    Send: Send,
    DApp: {
        SendCall: SendCall,
        GetBalance: GetBalance,
        GetTransaction: GetTransaction,
        GetHistoryTransactions: GetHistoryTransactions,
        CreateRawTransaction: CreateRawTransaction,
        SignRawTransaction: SignRawTransaction,
        SendRawTransaction: SendRawTransaction,
    },
    viewer: {
        TxID: TxID,
        block: block
    }
}