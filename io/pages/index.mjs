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

const file = fs.readFileSync(path.join(__dirname, `config.io.yml`), 'utf8')
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

config.forEach(item => {
    console.log(`${item.page} :`, {
        'index': path.join(__page, `${item.page}${item.dir}`),
        'assets': path.join(__page, `${item.page}${item.dir}/assets`),
        'manifest': path.join(__page, `${item.page}${item.dir}/manifest`),
        'path': `/${item.page !== 'io'? item.page: ''}`
    });
    app.use(`/${item.page !== 'io'? item.page: ''}`, express.static(path.join(__page, `${item.page}${item.dir}`)));
    app.use(`/${item.page !== 'io'? item.page: ''}`, express.static(path.join(__page, `${item.page}${item.dir}/assets`)));
    app.use(`/${item.page !== 'io'? item.page: ''}`, express.static(path.join(__page, `${item.page}${item.dir}/modules`)));
    app.use(`/${item.page !== 'io'? item.page: ''}`, express.static(path.join(__page, `${item.page}${item.dir}/manifest`)));
})

app.use(express.static(__dirname + 'src/assets/'));
app.use(express.static(__dirname + 'src/database/'));
app.use('/config',express.static(__dirname + 'src/config/'));
app.use('/utils',express.static(__dirname + 'src/utils/'));
app.use('/modules', express.static(__dirname + 'modules'));

app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send(await notFound(req.path));
})

export default app;
