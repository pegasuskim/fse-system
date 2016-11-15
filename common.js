'use strict';
function wrapResponse(result, err) {
    if (result == null || result == undefined) {
        result = {};
    }
    if (err) {
        result.success = false;
    } else {
        result.success = true;
    }
}

var common = {
    config:require(__dirname + '/config'),
    log:require(__dirname + '/utils/logger'),
    redis_store:function () {
        return require(__dirname + '/store/redis').store();
    },
    result: function(err) {
        var result = {};
        if (err) {
            result.success = false;
            result.code = 999;
        } else {
            result.success = true;
            result.code = 0;
        }
        return result;
    },
    safe: function(fn) {
        return function(req, res) {
            var d = require('domain').create();
            d.on('error', function(err) {
                // TODO: write a error log
                console.log('error ==>> ', err, err.stack);
                var DB = require('./database');
                DB.rollbackAll(function() {
                    res.send(common.errorResponse());
                });
            });
            d.run(function() {
                fn(req, res);
            });
        }
    },
    errorResponse: function(err) {
        return {
            success: false,
            msg: err
        }
    },
    throwError: function(err, cls, method) {
        if (err) {
            if (typeof err === 'string') {
                throw new Error(cls + '::' + method + '::' + err);
            } else {
//                throw new Error(cls + '::' + method + '::', err);
            }
        }
    }
};

module.exports = common;
