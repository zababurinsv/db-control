import path from "path";
const __dirname = path.join(path.dirname(process.argv[1]), '../');
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("../package.json");
import express from 'express'
import cors from "cors";
import Enqueue from "express-enqueue";
import compression from "compression";
import notFound from './config/page_not_found/index.mjs'
import corsOptions from './config/cors/index.mjs'
import shouldCompress from './config/compression/index.mjs'
import io from './pages/index.mjs'

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
app.use( '/', io);

app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send(await notFound(pkg.targets.module.publicUrl));
})

app.use(queue.getErrorMiddleware())

export default app
