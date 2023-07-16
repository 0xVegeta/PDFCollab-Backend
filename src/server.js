const http = require('http');
const port = 9000;
const dotenv = require('dotenv');
// dotenv.config({path: `.env`});


const {app} = require('./app');
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`
    =======================================================

        Started Server on
        Port Number : ${port}

    =======================================================
    `);
});
