'use strict'
import service from '/service/WCNode/src/fileSystem/index.mjs';
import buffer from '/service/ReactNode/controlCenter/database/modules/safe-buffer/dist/index.js'
const assert = window['@newkind/tests'].assert;
const Buffer = buffer.Buffer;
let api = {}
describe('File System IDBFS api', async function() {
  this.timeout(100000);

  before(async () => {
    console.log('BEFORE');
      api = await service()
      const idbfs = await api.idbfs()
      idbfs.info();
  });

  after(async () => {
    api.terminate();
    console.log('AFTER');
  });

  describe('Positive', function() {
    beforeEach(async () => {
      console.log('BEFORE EACH');
    });

    afterEach(async () => {
      console.log('AFTER EACH');
    });

    it('create dir', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('is dir', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('is file', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('get all', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('get dir', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('get file', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('set file', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('set data', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('file rename', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });
  });

  describe('Negative', function() {

    it('create dir', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('is dir', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('is file', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('get all', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('get dir', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('get file', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('set file', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('set data', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });

    it('file rename', async () => {
      // idbfs.set.file('test', {test:'test2'})
      // idbfs.save()
      // console.log('ddddd', await idbfs.get.file('test'))
    });
  });

});
