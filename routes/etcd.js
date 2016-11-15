'use strict';
var express = require('express');
var router = express.Router();
var etcdcontrol = require('../controllers/etcd.js');

// etcd 기능별로 URL 처리
//router.post('/test', control.router_control);
//router.post('/msgpush', control.mq_messagepush);
module.exports = router;

