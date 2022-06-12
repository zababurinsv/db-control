import path from 'path'
import fs from 'fs'
import YAML from 'yaml'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __page = path.join(dirname(fileURLToPath(import.meta.url)), '/');
const __dirname = path.join(path.dirname(process.argv[1]), '../');
import cors from 'cors'
import express from 'express'
import notFound from '../config/page_not_found/index.mjs'
import corsOptions from '../config/cors/index.mjs'
const app = express.Router();
app.use(await cors({ credentials: true }));

const file = fs.readFileSync(path.join(__dirname, `config.yml`), 'utf8')
const config = YAML.parse(file)

console.log('======== config ========', {
    'page': __page,
    'dirname': path.join(__dirname),
    'config': config
})

app.use((req, res, next) => {
    console.log(`request: ${req.path}`);
    next();
});

config.dir.forEach(folder => {
    console.log(`${folder} :`, {
        'index': path.join(__page, `${folder}/docs`),
        'assets': path.join(__page, `${folder}/docs/assets`),
        'manifest': path.join(__page, `${folder}/docs/manifest`),
        'path': `/${folder !== 'io'? folder: ''}`
    });
    app.use(`/${folder !== 'io'? folder: ''}`, express.static(path.join(__page, `${folder}/docs`)));
    app.use(`/${folder !== 'io'? folder: ''}`, express.static(path.join(__page, `${folder}/docs/assets`)));
    app.use(`/${folder !== 'io'? folder: ''}`, express.static(path.join(__page, `${folder}/docs/manifest`)));
})

app.use(express.static(__dirname + 'src/assets/'));
app.use(express.static(__dirname + 'src/database/'));
app.use('/config',express.static(__dirname + 'src/config/'));
app.use('/modules', express.static(__dirname + 'modules'));

app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send(await notFound(req.path));
})

export default app;
