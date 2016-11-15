'use strict';
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

var fleet = require('./routes/fleet');
app.use('/control', fleet);

var etcd = require('./routes/etcd');
app.use('/control', etcd);

module.exports = app;
