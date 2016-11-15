var config = require('../config');
var winston = require('winston');

// set logging level
var loggerConfig = {
  levels: {
    verbose: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    file: 5
  },colors: {
    verbose: 'blue',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'green',
    file: 'white'
  }
};

var loggr = new (winston.Logger)({ levels: loggerConfig.levels });
winston.addColors(loggerConfig.colors);

// add logging transports
if (config.logging) {
  try {
    winston.remove(winston.transports.Console);
    loggr.remove(winston.transports.Console);
  } catch (e) { }

  var detail, type;
  for (var i = 0; i < config.logging.length; i++) {
    detail = config.logging[i];
    type = detail.type;
    delete detail.type;
    winston.add(winston.transports[type], detail);
    loggr.add(winston.transports[type], detail);
  }
}

//loggr.info("logger initialized");
//module.exports = winston;
module.exports = loggr;
