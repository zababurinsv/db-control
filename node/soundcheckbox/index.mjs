import app from './server.mjs';

const port = (process.env.PORT)
    ? process.env.PORT
    : 4552

app.listen(port ,() => {
    console.log('pid: ', process.pid)
    console.log('listening on http://localhost:'+ port);
});
