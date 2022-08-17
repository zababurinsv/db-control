import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __page = path.join(dirname(fileURLToPath(import.meta.url)), '/');
const __dirname = path.join(path.dirname(process.argv[1]), '../');
import cors from 'cors';
import express from 'express';
import notFound from '../config/page_not_found/index.mjs';
import corsOptions from '../config/cors/index.mjs';
import YAML from 'yaml';
const file = fs.readFileSync(path.join(__dirname, `config.io.yml`), 'utf8');
const config = YAML.parse(file);

const app = express.Router();
app.use(await cors({ credentials: true }));

console.log('======== config ========', {
    'page': __page,
    'dirname': path.join(__dirname),
    'config': config
})

app.use((req, res, next) => {
    console.log(`request: ${req.path}`);
    next();
});

for(let item of config) {
    for(let page of item.scope) {
        console.log(`${item.namespace} :`, {
            'index': path.join(__page, `${item.namespace}${page}`),
            'assets': path.join(__page, `${item.namespace}${page}/assets`),
            'manifest': path.join(__page, `${item.namespace}${page}/manifest`),
            'path': `/${item.namespace !== 'io'? item.namespace: ''}`
        });
        app.use(`/${item.namespace !== 'io'? item.namespace: ''}`, express.static(path.join(__page, `${item.namespace}${page}`)));
        app.use(`/${item.namespace !== 'io'? item.namespace: ''}`, express.static(path.join(__page, `${item.namespace}${page}/assets`)));
        app.use(`/${item.namespace !== 'io'? item.namespace: ''}`, express.static(path.join(__page, `${item.namespace}${page}/modules`)));
        app.use(`/${item.namespace !== 'io'? item.namespace: ''}`, express.static(path.join(__page, `${item.namespace}${page}/manifest`)));
    }
}

// const dirs = fs.readdirSync(`${__dirname}/src`, { withFileTypes: true })
//     .filter(d => d.isDirectory())
//     .map(d => d.name);

app.use('/src', express.static(__dirname + 'src'));
app.use('/modules', express.static(__dirname + 'modules'));
app.use('/service', express.static(__dirname + 'service'));



app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send(await notFound(req.path));
})

export default app;
