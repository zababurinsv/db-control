'use strict'
// const rmrf = require('rimraf')
import path from "/service/ReactNode/controlCenter/database/modules/path/dist/index.js";
import OrbitDB from "/service/ReactNode/controlCenter/database/modules/orbit-db/dist/index.js";
import {config, startIpfs, stopIpfs, testAPIs} from "/tests/database/orbit-db-test-utils/index.js";

const assert = window['@newkind/tests'].assert;

const dbPath = './orbitdb/tests/feed-load'

export default () => {
  Object.keys(testAPIs).forEach(API => {
    describe(`orbit-db - Feed Load Amount (${API})`, function() {
      this.timeout(config.timeout)

      let ipfsd, ipfs, orbitdb1, db, address

      before(async () => {
        // rmrf.sync(dbPath)
        ipfsd = await startIpfs(API, config.daemon1)
        ipfs = ipfsd.api
        orbitdb1 = await OrbitDB.createInstance(ipfs, { directory: path.join(dbPath, '1') })
      })

      after(async () => {
        if(orbitdb1)
          await orbitdb1.stop()

        if (ipfsd)
          await stopIpfs(ipfsd)
      })

      describe('Feed Load Amount', function() {

        it('add 10 items and verify they are in the index', async () => {
          db = await orbitdb1.feed('feed database')

          //All tests should retrieve these 10 items.
          for (var i=0; i < 10; i++) {
            await db.add({content: (i + 10).toString()})
          }

          assert.equal(Object.keys(db.index).length, 10)
        })

        it('reopen store and load 10 items', async () => {

          address = db.address.toString()
          await db.close()
          db = await orbitdb1.open(address)

          //Load 10 items
          await db.load(10)

          assert.equal(Object.keys(db.index).length, 10)

        })

        it('reopen store and load 1 item more than exists', async () => {
          await db.close()
          db = await orbitdb1.open(address)

          //Load 11 items
          await db.load(11)

          assert.equal(Object.keys(db.index).length, 10)

        })

        it('reopen store and load 5 item more than exists', async () => {

          await db.close()
          db = await orbitdb1.open(address)

          //Load 15 items
          await db.load(15)

          assert.equal(Object.keys(db.index).length, 10)
        })


        it('reopen store and load 20 items more than exists', async () => {

          await db.close()
          db = await orbitdb1.open(address)

          //Load 30 items
          await db.load(30)

          assert.equal(Object.keys(db.index).length, 10)
        })
      })
    })
  })
}
