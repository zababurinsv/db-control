import { corsOptions } from '../../config/cors/index.mjs';
import cors from 'cors';
import express from 'express';
import connectDB from "./connect/index.mjs";
import presets from "./routes/api/presets.mjs";
import path from "path";
const __dirname = path.join(path.dirname(process.argv[1]));
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use(await cors({ credentials: true }));
app.use((req, res, next) => {
    console.log(`node api: ${req.path}`);
    next();
});

app.use('/modules', express.static(__dirname + '/modules'));
app.use('/dev/presets', presets);

app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send('ok');
})

export default app;
