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
    log:require(__dirname + '/utils/logger')
};

module.exports = common;
