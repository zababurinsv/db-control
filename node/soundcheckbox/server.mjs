import express from "express";
import path from "path";
const __dirname = path.join(path.dirname(process.argv[1]));
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/soundcheckbox.json" assert {type: "json"};
import proxy from "express-http-proxy";
import config from 'config';
import cors from "cors";
import corsOptions from "../../namespace/config/cors/index.mjs";
import notFound from "../../namespace/config/page_not_found/index.mjs";
const node = config.get('node');
const pathNode = config.get('path');
const app = express();

app.use(await cors({ credentials: true }));
app.use((req, res, next) => {
    console.log(`path: ${req.path}`);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(proxy(node.api, {
    limit: '5mb',
    filter: function(req) {
        console.log('======= >', req.body)
        return pathNode.api.some(path =>  path === req.path)
    }
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/modules', express.static(__dirname + '/modules'));
app.use('/tests', express.static(__dirname + '/tests'));


app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/index.html'));
})


export default app
