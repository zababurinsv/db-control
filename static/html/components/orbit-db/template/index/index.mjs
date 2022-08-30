import task from '/static/html/components/component_modules/heap/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
const creatures = [
  '🐙', '🐷', '🐬', '🐞',
  '🐈', '🙉', '🐸', '🐓',
  '🐊', '🕷', '🐠', '🐘',
  '🐼', '🐰', '🐶', '🐥'
]
function handleError(e) {
  console.error(e.stack)
  statusElm.innerHTML = e.message
}
export default async (v,p,c,obj,r) => {
  const outputHeaderElm = obj.this.shadowRoot.getElementById("output-header")
  const outputElm = obj.this.shadowRoot.getElementById("output")
  const statusElm = obj.this.shadowRoot.getElementById("status")
  const dbnameField = obj.this.shadowRoot.getElementById("dbname")
  const dbAddressField = obj.this.shadowRoot.getElementById("dbaddress")
  const createButton = obj.this.shadowRoot.getElementById("create")
  const openButton = obj.this.shadowRoot.getElementById("open")
  const createType = obj.this.shadowRoot.getElementById("type")
  const writerText = obj.this.shadowRoot.getElementById("writerText")
  const publicCheckbox = obj.this.shadowRoot.getElementById("public")
  const readonlyCheckbox = obj.this.shadowRoot.getElementById("readonly")

  let db
  let count = 0
  let interval = Math.floor((Math.random() * 300) + (Math.random() * 2000))
  let updateInterval
  let dbType, dbAddress
  window.IPFS = Ipfs

  const initIPFSInstance = async () => {
    return IPFS.create({
      repo: './db',
      start: true,
      preload: {
        enabled: false
      },
      EXPERIMENTAL: {
        pubsub: true,
      },
      config: {
        Addresses: {
          Swarm: [
            '/dns4/web3-star.herokuapp.com/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/'
          ]
        },
      }
    });
  };
  let initOrbitDB = async (ipfs, obj) => {
    return new Promise(async (resolve, reject) => {
      OrbitDB.createInstance(ipfs,{
        directory:'./orbit-of-venus'
      }).then(( orbitdb )=>{
        statusElm.innerHTML = "Orbit DB Started"
        // obj.orbitdb = orbitdb
        resolve({
          status: true,
          data: orbitdb
        })
      }).catch(function(e) {
        statusElm.innerHTML = e.stack
        resolve({
          status: false,
          data: e
        })
      })
    })
  }
  let ipfs = await initIPFSInstance()
  let id = await ipfs.id()
  console.log( 'id',id.id)
  statusElm.innerHTML = "IPFS Started"
  let orbitdb = await initOrbitDB(ipfs)
  while (!orbitdb.status) {
    orbitdb = await initOrbitDB(ipfs)
  }
  obj.orbitdb = orbitdb.data
  const load = async (db, statusText) => {
    statusElm.innerHTML = statusText
    db.events.on('ready', () => {
      return queryAndRender(db)
    })
    db.events.on('replicated', () => {
      console.log('orbitdb replicated')
      return queryAndRender(db)
    })
    db.events.on('replicate', (address) => {
      console.log('orbitdb replicate', address)
    })
    db.events.on('replicate.progress', (address, hash, entry, progress, have) => {

      console.log('orbitdb replicate.progress', progress, have, hash)
    })
    db.events.on('load', (dbname) => {
      console.log('orbitdb load', dbname)
    })
    db.events.on('write', () => {
      console.log('orbitdb write')
      return queryAndRender(db)
    })
    db.events.on('peer', (peer) => {
      console.log('orbitdb peer', peer)
    })
    db.events.on('peer.exchanged', (peer, address, heads) => {
      console.log('orbitdb peer.exchanged', peer, address, heads)
    })
    db.events.on('replicate.progress', () => queryAndRender(db))
    let maxTotal = 0, loaded = 0
    db.events.on('load.progress', (address, hash, entry, progress, total) => {
      loaded ++
      maxTotal = Math.max.apply(null, [maxTotal, progress, 0])
      total = Math.max.apply(null, [progress, maxTotal, total, entry.clock.time, 0])
      statusElm.innerHTML = `Loading database... ${maxTotal} / ${total}`
    })
    db.events.on('ready', () => {
      console.log('orbitdb ready')
      setTimeout(() => {
        statusElm.innerHTML = 'Database is ready'
      }, 1000)
    })
    await db.load()
  }

  const startWriter = async (db, interval) => {
    writerText.innerHTML = `Writing to database every ${interval} milliseconds...`
    updateInterval = setInterval(async () => {
      try {
        await update(db)
      } catch (e) {
        console.error(e.toString())
        writerText.innerHTML = '<span style="color: red">' + e.toString() + '</span>'
        clearInterval(updateInterval)
      }
    }, interval)
  }

  const resetDatabase = async (db) => {
    writerText.innerHTML = ""
    outputElm.innerHTML = ""
    outputHeaderElm.innerHTML = ""
    clearInterval(updateInterval)
    if (db) {
      await db.close()
    }
    interval = Math.floor((Math.random() * 300) + (Math.random() * 2000))
  }

  const createDatabase = async (nameOfDatabase) => {
    await resetDatabase(db)
    try {
      const name = nameOfDatabase
      const type = 'docstore'
      const publicAccess = true
      db = await obj['orbitdb'].open(name, {
        create: true,
        overwrite: true,
        localOnly: false,
        type: type,
        accessController: {
          write: publicAccess ? ['*'] : [obj.orbitdb.identity.id],
        }
      })
      //
      await load(db, 'Creating database...')
      // startWriter(db, interval)
    } catch (e) {
      console.error(e)
    }
  }
  const openDatabase = async (dbAddressField) => {
    const address = dbAddressField
    try {
      let out = {}
      if(db) {
        await resetDatabase(db)
        statusElm.innerHTML = "Connecting to peers..."
        db = await obj.orbitdb.open(address, { sync: true })
        out = await load(db, 'Loading database...')
        writerText.innerHTML = `Listening for updates to the database...`
      } else {
        statusElm.innerHTML = "Connecting to peers..."
        db = await obj.orbitdb.open(address, { sync: true })
        out = await load(db, 'Loading database...')
        writerText.innerHTML = `Listening for updates to the database...`
      }
      task.get(true, 'await', '5', '','/orbitdb', async (object)=>{
        let md = query(db)
        object.callback({status:'ok',md:md})
      })
      task.get(true, 'await', '5', '','/orbitdb/set/:external', async (object)=>{
        await update(db, object.substrate, object.property)
        object.callback({status:'ok'})
      })
      task.get(true, 'await', '5', '','/orbitdb/get/:external', async (object)=>{
        // console.log('FFFFFFFFFFFFFFFFFFFFFFFFFffffFFFFfff', object.property)
        try{
          let md = await query(db, object.property)
          isEmpty(md)
              ?object.callback({status:'false', md:false})
              :object.callback({status:'ok', md:md})

        }catch (e) {
          object.callback({status:'false', md:e})
        }


      })
      task.get(true, 'await', '5', '','/orbitdb/delete', async (object)=>{
        try{
          console.log('/orbitdb/delete')
          const hash = await db.del(object.substrate.item)
          object.callback({status:'ok', hash:hash})
        }catch (e) {
          object.callback({status:'false', error:e})
        }
      })
    } catch (e) {
      console.error({
        _:"status error",
        data:e
      })
    }
  }

  const update = async (db, payload = '', type) => {
    count ++
    const time = new Date().toISOString()
    const idx = Math.floor(Math.random() * creatures.length)
    const creature = creatures[idx]
    if (db.type === 'eventlog') {
      const value = "GrEEtinGs from " + obj.orbitdb.id + " " + creature + ": Hello #" + count + " (" + time + ")"
      await db.add(value)
    } else if (db.type === 'feed') {
      const value = "GrEEtinGs from " + obj.orbitdb.id + " " + creature + ": Hello #" + count + " (" + time + ")"
      await db.add(value)
    } else if (db.type === 'docstore') {
      let value = {}
      if(isEmpty(payload)) {
        payload = '# empty'
      }
      switch (type){
        case 'anil':
          value = { _id: 'anil', avatar: creature, updated: time, md: payload }
          break
        case 'external':
          value = { _id: 'external', avatar: creature, updated: time, md:payload }
          break
        default:
          console.warn('неизвестный запрос', type)
          break
      }
      return db.put(value)
    } else if (db.type === 'keyvalue') {
      await db.set('mykey', creature)
    } else if (db.type === 'counter') {
      await db.inc(1)
    } else {
      throw new Error("Unknown datatbase type: ", db.type)
    }
  }
  const query = async (db, type) => {
    if (db.type === 'eventlog')
      return db.iterator({ limit: 5 }).collect()
    else if (db.type === 'feed')
      return db.iterator({ limit: 5 }).collect()
    else if (db.type === 'docstore'){
      let response = {}
      switch (type) {
        case 'anil':
          response = await db.get('anil')
          break
        case 'external':
          response = await db.get('external')
          break
        default:
          response = await db.get('')
          break
      }
      console.log(`(0( )0)`, response)
      return response
    }
    else if (db.type === 'keyvalue')
      return db.get('mykey')
    else if (db.type === 'counter')
      return db.value
    else
      throw new Error("Unknown datatbase type: ", db.type)
  }

  const queryAndRender = async (db) => {
    const networkPeers = await ipfs.swarm.peers()
    const databasePeers = await ipfs.pubsub.peers(db.address.toString())
    const result = await query(db)
    // window.zb.fs['/body'].writeFile("/body/external.md", result[0].md)
    // window.zb.fs['/body'].syncfs(false, err => console.warn(err));
    if (dbType !== db.type || dbAddress !== db.address) {
      dbType = db.type;
      dbAddress = db.address;

      outputHeaderElm.innerHTML = `
         <h2>${dbType.toUpperCase()}</h2>
         <h3 id="remoteAddress">${dbAddress}</h3>
         <p>Copy this address and use the 'Open Remote Database' in another browser to replicate this database between peers.</p>
       `
    }

    outputElm.innerHTML = `
       <div><b>Peer ID:</b> ${obj.orbitdb.id}</div>
       <div><b>Peers (database/network):</b> ${databasePeers.length} / ${networkPeers.length}</div>
       <div><b>Oplog Size:</b> ${Math.max(db._replicationStatus.progress, db._oplog.length)} / ${db._replicationStatus.max}</div>
       <h2>Results</h2>
       <div id="results">
         <div>
         ${result && Array.isArray(result) && result.length > 0 && db.type !== 'docstore' && db.type !== 'keyvalue'
        ? result.slice().reverse().map((e) => e.payload.value).join('<br>\n')
        : db.type === 'docstore'
            ? JSON.stringify(result, null, 2)
            : result ? result.toString().replace('"', '').replace('"', '') : result
    }
         </div>
       </div>
     `}
  openDatabase('/orbitdb/zdpuApCvxfEFug6uohbADwnsBvBBxSdHaq1WTD6ES8cKmxN14/web3')
  return obj
}

/*

// obj['orbitdb'] = orbitdb

      // createDatabase('orbit-of-venus')
      // openButton.addEventListener('click', openDatabase)
      // createButton.addEventListener('click', createDatabase)


 */
