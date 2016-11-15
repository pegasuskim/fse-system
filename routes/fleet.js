'use strict';
var express = require('express');
var router = express.Router();
var fleetcontrol = require('../controllers/fleet.js');

// fleet 기능별로 URL 처리

//router.post('/test', fleetcontrol.router_control);
//router.post('/msgpush', fleetcontrol.mq_messagepush);

module.exports = router;

