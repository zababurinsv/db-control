import path from 'path'
const __dirname = path.join(path.dirname(process.argv[1]), '../');
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import cors from 'cors'
import express from 'express'
let app = express.Router();
app.use(await cors({ credentials: true }));
import corsOptions from '../config/security/corsOptions.mjs'

console.log('======== config ========', {
 'static': path.join(__dirname, `/frontend/src`),
 'manifest': path.join(__dirname, `/frontend/src/manifest.json`)
})

const pkg = require("../../package.json");

app.use((req, res, next) => {
    console.log(`request: ${pkg.targets.dev.publicUrl}${req.path}`);
    next();
});

app.options('/favicon.ico', cors(corsOptions))
app.get('/favicon.ico', async (req, res) => {
    res.sendFile('./frontend/src/favicon.ico', { root: __dirname });
})

app.options('/manifest.json', cors(corsOptions))
app.get('/manifest.json', async (req, res) => {
    res.sendFile('./frontend/src/manifest.json', {root: __dirname});
})

app.use(express.static(`frontend/src`));
app.use(express.static(`frontend/src/static`));
// app.use(express.static(`dist`));

app.options('/*', cors(corsOptions))
app.get('/*', async (req, res) => {
    res.sendFile('./frontend/src/index.html', {root: __dirname});
})

export default app;