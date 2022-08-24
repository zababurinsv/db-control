import { corsOptions } from '../../config/cors/index.mjs';
import cors from 'cors';
import express from 'express';
import connectDB from "./config/db/index.mjs";
import users from "./routes/api/users.mjs";
import auth from "./routes/api/auth.mjs";
import profile from "./routes/api/profile.mjs";
import posts from "./routes/api/posts.mjs";
import riders from "./routes/api/riders.mjs";
import equipment from './routes/api/equipment.mjs';
import models from './routes/api/models.mjs';
import presets from './routes/api/presets.mjs';
import presets__categories from './routes/api/presets__categories.mjs';
import presets__tags from './routes/api/presets__tags.mjs';


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use(await cors({ credentials: true }));
app.use((req, res, next) => {
    console.log(`node api: ${req.path}`);
    next();
});

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/riders', riders);
app.use('/api/equipment', equipment);
app.use('/api/models', models);
app.use('/api/presets', presets);
app.use('/api/presets/categories', presets__categories);
app.use('/api/presets/tags', presets__tags);



app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send('ok');
})

export default app;
