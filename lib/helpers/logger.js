'use strict';
var _ = require('lodash'),
    root = require('app-root-path'),
    caller = require('caller'),
    winston = require('winston');

// arquivo de configuracao
var config  = require('../../config');

// cria uma nova instancia do winston
var logger = new winston.Logger(config.log);

// cria um banner da api
logger.showBanner = function() {

  // define o que sera exibido no banner
  var show = config.name + ' - ' + config.env;

  // define o tamanho do banner
  var size = 80;

  // mostra o banner
  logger.log('info', _.repeat('*', size));
  logger.log('info', '*' + _.pad(show, size - 2) + '*');
  logger.log('info', _.repeat('*', size));
};

// wapper da funcao de log
logger._wrap = function(who, level, message, meta, callback, context) {

  // remove o root
  var file = _.replace(who, root.path + '/', '');

  // cria um novo parametro, definindo o tipo da mensagem
  var args = [ level ];

  // monta a mensagem que sera exibida
  if (!_.isEmpty(context)) {
    args.push('[' + context.hash + '] ' + message + ' (' + file + ')');
  } else {
    args.push(message + ' (' + file + ')');
  }

  // adiciona os demais parametros
  if (!_.isNil(meta)) {
    args.push(meta);
  }
  if (!_.isNil(callback)) {
    args.push(callback);
  }

  // chama a funcao original
  logger.log.apply(logger, args);
};

// substituicao das funcoes padroes
logger.info = function(message, meta, callback) {
  logger._wrap(caller(), 'info', message, meta, callback);
};

logger.error = function(message, meta, callback) {
  logger._wrap(caller(), 'error', message, meta, callback);
};

module.exports = logger;
