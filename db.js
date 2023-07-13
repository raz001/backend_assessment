const mongoose = require("mongoose");
require('dotenv').config();
const connction = mongoose.connect(process.env.mongoURL);

module.exports = {connction}