'use strict'
import service from '/service/WCNode/src/fileSystem/index.mjs';
import buffer from '/service/ReactNode/controlCenter/database/modules/safe-buffer/dist/index.js'
const assert = window['@newkind/tests'].assert;
const Buffer = buffer.Buffer;
let api = {}
describe('File System IDBFS api', async function() {
  this.timeout(100000);
  let idbfs = {}
  before(async () => {
      console.log('BEFORE');
      api = await service();
      idbfs = await api.idbfs();
      idbfs.info();
  });

  after(async () => {
    api.terminate();
  });

  describe('Positive', function() {
    it('create dir', async () => {
        idbfs.create.dir('testDir');
        idbfs.save();
    });

    it('is dir', async () => {
      await idbfs.is.dir('testDir');

    });

    it('set file', async () => {
      await idbfs.set.file('test', {test:'test2'}, '/testDir');
      await idbfs.set.file('test', {test:'test2'});
      idbfs.save();
    });

    it('is file', async () => {
      await idbfs.is.file('/testDir/test');
    });

    it('get all', async () => {
      await idbfs.get.all.files('/testDir', (data) => {
        console.log('GET ALL', data);
      })
    });

    it('get dir', async () => {
      console.log('GET DIR', await idbfs.get.dir('/testDir'))
    });

    it('get file', async () => {
      console.log('GET FILE', await idbfs.get.file('test'))
    });

    it('file rename', async () => {
      console.log('RENAME FILE', await idbfs.file.rename('test', 'test222'))
      idbfs.save();
    });
  });
});
