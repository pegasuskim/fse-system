'use strict';
var os = require('os');
var hostname = os.hostname();
//console.log("hostname:"+ hostname);

var config = require('./dev.json');
if (hostname == '') {
  // This config is for  pegasus server
  config = require('./dev.json');
} else {
  // This config is for server
}

module.exports = config;


