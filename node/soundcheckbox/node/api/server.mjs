import { corsOptions } from '../../config/cors/index.mjs';
import cors from 'cors';
import express from 'express';
import connectDB from "./config/db/index.mjs";
import users from "./routes/api/users.mjs";
import auth from "./routes/api/auth.mjs";
import profile from "./routes/api/profile.mjs";
import posts from "./routes/api/posts.mjs";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use(await cors({ credentials: true }));
app.use((req, res, next) => {
    console.log(`path: ${req.path}`);
    next();
});

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.options(`/*`, await cors(corsOptions))
app.get(`/*`, async (req, res) => {
    res.status(404).send('ok');
})

export default app;
