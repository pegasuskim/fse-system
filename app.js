'use strict';
var global = require('./common');
process.env.TZ = 'Asia/Seoul';
// express 4.0
var express = require('express');

var cookieParser = require('cookie-parser');
var routes = require('./routes/index');
var logger = require('morgan');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

var router = require('./routes/router');
app.use('/', router);

module.exports = app;
