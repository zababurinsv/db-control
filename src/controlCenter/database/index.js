import Config from '../config/index.js'
import logs from '../../../modules/debug/index.js'
let orbitdb = undefined
let programs = undefined

let debug = (maxCount, id, ...args) => {
  let path = 'palette/src/github.com/zababurinsv/newkind-db/frontend/src/components/newkind-control/src/database/index.js'
  let from = path.search('/database');
  let to = path.length;
  let url = path.substring(from,to);
  logs.assert(maxCount,url, id, args)
}

export const initIPFS = async (props) => {
  const {IPFS} = props
  debug( -4,'--------------👀[(database)initIPFS]');
  return await IPFS.create(Config.ipfs)
}

export const initOrbitDB = async (props) => {
  const {ipfs, OrbitDB} = props;
  debug( -4,'----------------------👀[(database)initOrbitDB]', {
    OrbitDB,
    ipfs
  })
  orbitdb = await OrbitDB.createInstance(ipfs)
  return orbitdb
}

export const getAllDatabases = async (props) => {
  if (!programs && orbitdb) {
    // Load programs database
    debug( -4,'👀[(database)Load programs database orbitdb.feed]')
    programs = await orbitdb.feed('network.programs', {
      accessController: { write: [orbitdb.identity.id] },
      create: true
    })
    await programs.load()
  }
  debug( -4,'👀[(database)getAllDatabases]',programs)
  const result =  programs
      ? programs.iterator({ limit: -1 }).collect()
      : []
  return result
}

export const getDB = async (address) => {
  debug( -4,'👀[(database)getDB]',address)
  let db
  if (orbitdb) {
    db = await orbitdb.open(address)
    await db.load()
  }
  return db
}

export const addDatabase = async (address) => {
  const db = await orbitdb.open(address)
  return programs.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now()
  })
}

export const createDatabase = async (name, type, permissions) => {
  let accessController

  switch (permissions) {
    case 'public':
      accessController = { write: ['*'] }
      break
    default:
      accessController = { write: [orbitdb.identity.id] }
      break
  }

  const db = await orbitdb.create(name, type, { accessController })

  return programs.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}

export const removeDatabase = (hash) => {
  debug( -4,'👀[(database)removeDatabase]',{
    hash: hash,
  })
  return programs.remove(hash)
}

export default {
  removeDatabase,
  createDatabase,
  addDatabase,
  getDB,
  getAllDatabases,
  initOrbitDB,
  initIPFS
}
