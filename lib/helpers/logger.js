'use strict';
var winston = require('winston');
var caller = require('caller');
var root = require('app-root-path');

/** arquivo de configuracao */
var config  = require('../../config');

/** cria uma nova instancia do winston */
var logger = new winston.Logger(config.log);

/** substituicao do log, para obter o nome do arquivo */
logger.info = function(message, meta, callback) {

  /* obtem quem chamou */
  var who = caller();

  /* remove o root */
  var file = who.replace(root.path + '/', '');

  /* cria um novo parametro, definindo o tipo da mensagem */
  var args = [ 'info' ];

  /* concatena o arquivo com a mensagem */
  arguments[0] = '(' + file + ') ' + arguments[0];

  /* adiciona os demais parametros */
  args = args.concat(Array.prototype.slice.call(arguments));

  /* chama a funcao original */
  logger.log.apply(logger, args);
};

module.exports = logger;
