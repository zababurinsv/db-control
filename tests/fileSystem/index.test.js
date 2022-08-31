'use strict'
import service from '/service/WCNode/src/fileSystem/index.mjs';
import buffer from '/service/ReactNode/controlCenter/database/modules/safe-buffer/dist/index.js'

const assert = window['@newkind/tests'].assert;
const Buffer = buffer.Buffer;

describe('File System IDBFS api', async function() {
  this.timeout(100000);
  let api = {
    idbfs: undefined,
    worker: undefined,
    info: undefined
  };

  before(async () => {
      console.log('BEFORE');
      api = await (await service()).init();
      console.log('api', api.info());
  });

  after(async () => {
    // api.terminate();
  });

  describe('Positive', function() {
    it('create dir', async () => {
      api.idbfs.create.dir('testDir');
      api.idbfs.save();
    });

    it('is dir', async () => {
      await api.idbfs.is.dir('testDir');

    });

    it('set file', async () => {
      await api.idbfs.set.file('test', {test:'test2'}, '/testDir');
      await api.idbfs.set.file('test', {test:'test2'});
      api.idbfs.save();
    });

    it('is file', async () => {
      await api.idbfs.is.file('/testDir/test');
    });

    it('get all', async () => {
      await api.idbfs.get.all.files('/testDir', (data) => {
        console.log('GET ALL', data);
      })
    });

    it('get dir', async () => {
      console.log('GET DIR', await api.idbfs.get.dir('/testDir'))
    });

    it('get file', async () => {
      console.log('GET FILE', await api.idbfs.get.file('test'))
    });

    it('file rename', async () => {
      console.log('RENAME FILE', await api.idbfs.file.rename('test', 'test222'))
      api.idbfs.save();
    });
  });
});
