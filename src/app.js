const dotenv = require("dotenv");
dotenv.config({ path: `.env` });
// const { config } = require("./config/config.js");
const {connectDB} = require("./config/db");
// const { notFound, errorHandler } = require("./middlewares/error.js");


connectDB();
const express = require("express");
const expressApp = express();
const bodyParser = require("body-parser");
const { apiRouters } = require("./routes/api");
const config = require("./config/config");

expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());
expressApp.use("/api", apiRouters);
expressApp.use((req, res, next) => {
    const allowedOrigins = config.ACCESS_CONTROL_ALLOW_ORIGINS;
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, source, client-version, platform, Authorization-Mode");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'POST GET');
        return res.status(200).json({});
    }
    next();
});
// expressApp.use(notFound);

// expressApp.use(errorHandler);

module.exports = {
    app: expressApp,
};
