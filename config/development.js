'use strict';
var winston = require('winston');

// configuracoes gerais deste ambiente: desenvolvimento
var config = {
  mongo: {
    debug: true
  },
  log: {
    transports: [
      new (winston.transports.Console)({
        handleExceptions: true,
        timestamp: function () {
          return (new Date()).toLocaleString(null, { hour12: false });
        },
        colorize: true
      })
    ]
  }
};

/** disponibiliza as configuracoes */
module.exports = config;
