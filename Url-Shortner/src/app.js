const express = require("express");
const cors = require("cors");
const urlRoutes = require('./router/url.routes');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/', urlRoutes);
module.exports = app;

