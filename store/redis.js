var _config = require('../config');
var _fs = require('fs');
var _store = [];

var Store = function(scriptsDir) {
  this.scripts = {};
  var self = this;
  //scriptsDir = scriptsDir || '../scripts/lua/';
  //scriptsDir = __dirname + '/' + scriptsDir;
  scriptsDir = __dirname + "/scripts/lua/";
  var scripts = _fs.readdirSync(scriptsDir);
  scripts.forEach(function(s) {
    var key = s.replace('.lua', '');
    key = key.toLowerCase();
    //console.log('script file(' + scriptsDir + s + ') loaded as key:' + key);
    self.scripts[key] = _fs.readFileSync(scriptsDir + s, 'utf8');
  });

};



exports.store = function() {
  var instanceIndex = 0;
  if (_store.length == 0) {
    var size = sizeOfRedisInstance();
    // console.log('size of redis instance: ' + size);
    for (var i = 0; i < size; i++) {
      var config = _config.redis;
      var host = config.master[i].host;
      var port = config.master[i].port;
      var pass = config.master[i].pass;
      // console.log('host: ' + host + ', port: ' + port);
      var redis = require('redis').createClient(port, host, {'auth_pass':pass});
      redis.debug_mode = true;
      redis.on("error", function (err) {
        console.log("RedisError " + err);
      });
      var store = new Store(config.master[i].scripts_dir);
      _store.push(store.extend(redis));
    }
  }
  return _store[instanceIndex];
}


Store.prototype.getScript = function(name) {
  return this.scripts[name.toLowerCase()];
};

Store.prototype.extend = function(redis) {
  for (var n in this.scripts) {
    if (this.scripts.hasOwnProperty(n)) {
      //console.log('hasOwnProperty:' + n);
      var script = this.getScript(n);
      (function(s) { redis[n] = function(keys, argv, callback) {
        var args = [];
        args.push(s, keys.length || 0);
        args = args.concat(keys, argv || callback, callback || null);
        //console.log('args: ' + JSON.stringify(args));
        redis.eval.apply(redis, args);
      };})(script);
    }
  }
  return redis;
};


function sizeOfRedisInstance() {
  return _config.redis.master.length;
}
