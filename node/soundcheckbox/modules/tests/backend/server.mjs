import path from "path";
const __dirname = path.join(path.dirname(process.argv[1]), '../');
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../package.json");
import express from 'express'
import cors from "cors";
import Enqueue from "express-enqueue";
import compression from "compression";
import notFound from './config/utils/notFound.html.mjs'
import corsOptions from './config/security/corsOptions.mjs'
import shouldCompress from './config/utils/compress.mjs'
import dev from './service/index.mjs'
const app = express()
app.use(await express.json())
app.use(await compression({ filter: shouldCompress }))
app.use(await cors({ credentials: true }));

const queue = new Enqueue({
    concurrentWorkers: 4,
    maxSize: 200,
    timeout: 30000
});

app.use(queue.getMiddleware());

app.options(`/`, await cors(corsOptions))
app.use( '/', dev);

app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send(await notFound(pkg.targets.dev.publicUrl));
})

app.use(queue.getErrorMiddleware())

export default app
