const express = require('express');
const apiRouters = express.Router();
apiRouters.use('/user', require('./user'));
apiRouters.use('/files', require('./assets'))

module.exports = {apiRouters};
