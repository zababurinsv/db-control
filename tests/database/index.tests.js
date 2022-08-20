import feedTest from '/tests/database/feed.test.js';
import feedTestLoad from '/tests/database/feed-load.test.js';
import manual from '/tests/database/orbit-db-test-utils/test/manual.spec.js';
import memstore from '/tests/database/orbit-db-test-utils/test/memstore.spec.js';
import eventLog from '/tests/database/eventlog.test.js';
import multipleDatabases from '/tests/database/multiple-databases.test.js';
// memstore();
// manual();
feedTestLoad();
feedTest();
eventLog();
multipleDatabases()
