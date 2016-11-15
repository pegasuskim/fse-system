'use strict';
var global = require('../common');
var async = require('async');
var request = require('request');
var rabbitmq = require('../handler/rabbitmq');

function router_control(req, res) {
      // https://www.npmjs.com/package/request
      request('http://www.google.com', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                  console.log(body)
            }
      });
/*
      var test_url = global.config.towerhost + 'test/test_info';
      request.post({ url:test_url, form:{ 'memory': info } }  ,function (err, res, body) {
            if (err){
                  global.log.error("request modules ERROR ");
                  return cb(err);
            }else{
                  var resData = JSON.parse(body);
                  global.log.debug("resData: ", resData);
            }
      });
*/
};
exports.router_control = global.safe(router_control);



function mq_messagepush(req, res) {
      var mqueue = new rabbitmq({"readyqueue":global.config.mqueue.mq});
      var qName = global.config.qname;

      var data = {
            'test': "mq_message",
            'data' : info
      };
      mqueue.publish(qName, data);
};
exports.mq_messagepush = global.safe(mq_messagepush);


function sql_datacontrol(req, res) {

};
exports.sql_datacontrol = global.safe(sql_datacontrol);





