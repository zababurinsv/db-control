import path from "path";
const __dirname = path.join(path.dirname(process.argv[1]), '/');
import express from 'express'
import cors from "cors";
import Enqueue from "express-enqueue";
import compression from "compression";
import corsOptions from './config/cors/index.mjs'
import shouldCompress from './config/compression/index.mjs'
import io from './pages/index.mjs'
import favicon from "serve-favicon";

const app = express()

app.use(favicon(__dirname + 'favicon.ico'))
app.use(await express.json())
app.use(await compression({ filter: shouldCompress }))
app.use(await cors({ credentials: true }));

const queue = new Enqueue({
    concurrentWorkers: 4,
    maxSize: 200,
    timeout: 30000
});

app.use(queue.getMiddleware());
app.options(await cors(corsOptions))
app.use(io);

app.use(queue.getErrorMiddleware())

export {corsOptions}
export default app
