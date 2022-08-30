/*
# configuration file
VERSION: 11
accountsStore: n {rootStore: s, serialize: ƒ, deserialize: ƒ, newChainIdReaction: ƒ, …}
compilationStore: t {rootStore: s, getFunctionsComplexityMessages: ƒ, …}
filesStore: t {rootStore: s, tests: {…}, _preventUpdateMessage: false, …}
migrationStore: t {rootStore: s, parentBus: null, iframeBus: e, …}
newsStore: t {rootStore: s, serialize: ƒ, …}
notificationsStore: t {rootStore: s, _instance: {…}}
replsStore: t {rootStore: s, Symbol(mobx did run lazy initializers): true, Symbol(mobx administration): e}
rideReplStore: t {rootStore: s, historyCommandCursor: 0, repl: {…}, getHistoryCommand: ƒ, …}
serialize: ƒ ()
settingsStore: t {rootStore: s, systemNodes: Array(2), …}
signerStore: t {rootStore: s, Symbol(mobx did run lazy initializers): true, Symbol(mobx administration): e}
tabsStore: t {rootStore: s, models: {…}, isTutorialTab: ƒ, …}
testsStore: t {rootStore: s, …}
uiStore: t {rootStore: s, resizables: Proxy, replsPanel: Proxy, editorSettings: Proxy}

## account
chainId: "T"
isScripted: false
label: "Account 1"
seed: "cube space stone online define crowd worth life educate barrel expire response base vanish saddle"
wavesBalance: 0
address: "3N1DDY3UXoCfopA85ETf9b2X8kWHESAj2BE"
privateKey: "AAqk9dK8k27V4Sui66i26aRtxpaWbCCEd8K52dhiPrEi"
publicKey: "Am2W14ZWGGGnc6MjEJvYUHyVDkdPzMXKNHqUk7HNjZNz"
Symbol(mobx administration): e {target: {…}, values: Map(8), name: "ObservableObject@100", keysAtom: e, defaultEnhancer: ƒ, …}
get chainId: ƒ ()
set chainId: ƒ (t)
get isScripted: ƒ ()
set isScripted: ƒ (t)
get label: ƒ ()
set label: ƒ (t)
get seed: ƒ ()
set seed: ƒ (t)
get wavesBalance: ƒ ()
set wavesBalance: ƒ (t)
get address: ƒ ()
set address: ƒ (t)
get privateKey: ƒ ()
set privateKey: ƒ (t)
get publicKey: ƒ ()
set publicKey: ƒ (t)
*/
export default {
  VERSION: 0,
  T: [
    'https://nodes-testnet.wavesnodes.com',
    'https://testnode1.wavesnodes.com'
  ],
  W: [
    'https://nodes.wavesnodes.com'
  ],
  matcher: {
    T:['https://matcher-testnet.waves.exchange'],
    W:['https://matcher.waves.exchange']
  },
  timestamp: () => {
    let timestamp = Date.now()
    return {
      now: timestamp,
      month: timestamp + 2592000000
    }
  },
  WAVES: 10 ** 8,
  price: 10 ** 6,
  fee: 0.003,
  explorer: 'https://wavesexplorer.com',
  accountsStore: {
    accountGroups: {
      S: {},
      T: {
        chainId: "T",
        isScripted: true,
        label: "main",
        seed: "zone tower six sound oblige horn false blue enroll flash pact all",
        wavesBalance: 0,
        address: "3N8n4Lc8BMsPPyVHJXTivQWs7ER61bB7wQn",
        privateKey: "4HuiWMwR4LJ86WVkLPtLsTEDyUdn1WpmpF4xF675xdGZ",
        publicKey: "Eqd6aMMz62N5bbMFsgtccwuC5KNgxGQ9AFfzFDVPL1GJ",
        clients: [{
          chainId: "T",
          isScripted: false,
          label: "alice",
          seed: "convince bubble claim case tube domain grief eyebrow decline witness bachelor mansion",
          wavesBalance: 0,
          address: "3MsSxnyAwzfi8jsT2ua3Vt8m4BSvYs4YSpw",
          privateKey: "G6FnRWmKKBBfmFbDzHTv18eidCGLutjEPaXBWLWoAvhM",
          publicKey: "3vhS6tWdhTMgiUjYWdqyzTW1ythueupqQ637qnpyDRyZ",
        },{
          chainId: "T",
          isScripted: false,
          label: "bob",
          seed: "kitten tooth maze behave purity dance differ stereo faint immune century peace",
          wavesBalance: 0,
          address: "3MvegjWphvbYgEgQmqJiJhYWXnqPNTpieVc",
          privateKey: "3AAy61QF4QQbDZDYmHqfbCoUUEVSqgWawmrwGcYFK34f",
          publicKey: "AycYKRsxXEWqnc2mGYoxUWjj9mBDhAXMeQ2Ghqb7tXab",
        },{
          chainId: "T",
          isScripted: false,
          label: "cooper",
          seed: "discover swim emerge demise dwarf inmate utility cycle hospital pistol sugar emotion",
          wavesBalance: 0,
          address: "3Mr6qVieFjKZfE8Z2hxLSS1HBZCFMdB4zmy",
          privateKey: "ABLc5hzaxKFW7iFGz23YBExDT7n6EFHWgncvEh3aF8LV",
          publicKey: "9kz1ogj2BmFYqjEKw7aVXJ7ckEEB27jfcN3Grzo8fxSz",
        },{
          chainId: "T",
          isScripted: false,
          label: "diana",
          seed: "tone leg hidden system tenant aware desk clap body robust debris puppy ecology scan runway thing second metal cousin ocean liberty banner garment rice feel",
          wavesBalance: 0,
          address: "3MxxT4EmVq5L54bNGVaNm8nRTAvTnDYVS4E",
          privateKey: "BJDodJ9fYxsu1Zdtw4JzfRvsHki4De5W5XGKNuptXbyf",
          publicKey: "HrMWJVXDkjpzkMA3LnzurfmXMtRTtip4uS2236NvW6AR",
        }]
      },
      W: {}
    }
  }
}
