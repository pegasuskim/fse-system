'use strict';
var express = require('express');
var router = express.Router();
var control = require('../controllers/routercontrol.js');

router.post('/test', control.router_control);
router.post('/msgpush', control.mq_messagepush);
module.exports = router;

