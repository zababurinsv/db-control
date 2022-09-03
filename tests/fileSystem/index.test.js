'use strict'
import service from '/service/WCNode/src/fileSystem/index.mjs';
import buffer from '/service/ReactNode/controlCenter/database/modules/safe-buffer/dist/index.js'
const assert = window['@newkind/tests'].assert;
const Buffer = buffer.Buffer;

describe('File System', async function() {
  this.timeout(100000);
  let api = {
    idbfs: undefined,
    worker: undefined,
    info: undefined
  };

  before(async () => {
      console.log('BEFORE');
      api = await (await service()).init();
      api.idbfs.load();
      console.log('api', api.info());
  });

  after(async () => {
    // api.terminate();
  });

  describe('IDBFS api', function() {
    it('create dir', async () => {
      api.idbfs.create.dir('/shared/data/test2');
      api.idbfs.save();
    });

    it('is dir', async () => {
      await api.idbfs.is.dir('/shared/data/test2');
    });

    it('set file', async () => {
      // await api.idbfs.set.file('test', {test:'test2'}, '/shared/data/test2');
      // await api.idbfs.set.file('test', {test:'test2'});
      // api.idbfs.save();
    });

    it('is file', async () => {
      // await api.idbfs.is.file('/shared/data/test2');
    });

    it('get all', async () => {
      // await api.idbfs.get.all.files('/shared/data/test2', (data) => {
      //   console.log('GET ALL', data);
      // })
    });

    it('get dir', async () => {
      // await api.idbfs.get.dir('/shared/data/test2');
    });

    it('get file', async () => {
      // await api.idbfs.get.file('test');
    });

    it('file rename', async () => {
      // await api.idbfs.file.rename('test', 'test222');
      // await api.idbfs.save();
    });
  });

  describe('WORKERFS api', function() {
    it('Create dir', async () => {
      await api.worker.existsSync('/DATA-BROWSER');
    });

    it('Write file', async () => {
      await api.worker.writeFileSync('/DATA-BROWSER/log.log', "28.12.2021 02:36:33.134 : CheckStartedBlocks at 0\r\n")
      await api.worker.writeFileSync('/DATA-BROWSER/log.log', "28.12.2021 02:36:34.134 : CheckStartedBlocks at 0\r\n")
      await api.worker.writeFileSync('/DATA-BROWSER/log.log', "28.12.2021 02:36:35.134 : CheckStartedBlocks at 0\r\n")
      await api.worker.writeFileSync('/DATA-BROWSER/log.log', "28.12.2021 02:36:36.134 : CheckStartedBlocks at 0\r\n")
    });

    it('Read file', async () => {
      await api.worker.readFileSync('/DATA-BROWSER/log.log', 'utf8');
    });
  });
});
