'use strict';
var global = require('../common');
var mysql = require('mysql');

var Database = function Database() {
    var self = this;
    self.poolCluster = mysql.createPoolCluster();
    self.dirties = {};
    self.connections = {};
}

Database.prototype.init = function init(opts) {
    var self = this;
    for (var key in opts) {
        self.poolCluster.add(key, opts[key]);
        self.dirties[key] = false;
    }

    self.poolCluster.on('remove', function(key) {
        console.log('Node removed: ' + key);
    });
};

Database.prototype.query = function query(key, statement, args, callback) {
    var self = this;
    self.getConnection(key, function(connection) {
        self.connections[key] = connection;
        connection.query(statement, args, function(err, result) {
            callback(err, result);
        });
    });
}

Database.prototype.getConnection = function getConnection(key, callback) {
    var self = this;
    var conn = self.connections[key];
    if (conn != null) {
        return callback(conn);
    }

    self.poolCluster.getConnection(key, function(err, connection) {
        global.throwError(err, "DATABASE", "getConnection");
        self.connections[key] = connection;
        callback(connection);
    });
};


Database.prototype.dirty = function dirty(key) {
    var self = this;
    self.dirties[key] = true;
};

Database.prototype.commitAll = function commitAll(callback) {
    //console.log('::commitAll');
    var self = this;
    var targets = Object.keys(self.dirties);
    for(var i = 0; i < targets.length; i++) {
        self.getConnection(targets[i], function(connection) {
            var key = targets[i];
            connection.commit(function(err) {
                console.log('::commit');
                gl.throwError(err, "DATABASE", "commitAll");
                self.dirties[key] = false;
                if(self.connections[key] != null){
                    self.connections[key].release();
                    self.connections[key] = null;
                }
            });
        });
    }
}

Database.prototype.rollbackAll = function roolbackAll(callback) {
    console.log('::rollbackAll');
    var self = this;
    var targets = Object.keys(self.dirties);
    for(var i = 0; i < targets.length; i++) {
        self.getConnection(targets[i], function(connection) {
            var key = targets[i];
            connection.rollback(function() {
                console.log('::rollback');
                self.dirties[key] = false;
                if(self.connections[key] != null){
                    self.connections[key].release();
                    self.connections[key] = null;
                }
            });
        });
    }
}



module.exports = new Database();
