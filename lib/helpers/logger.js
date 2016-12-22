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
logger.banner = function ()  {

  // define o que sera exibido no banner
  var show = config.name + ' - ' + config.env;

  // define o tamanho do banner
  var size = 80;

  // mostra o banner
  logger.log('info', _.repeat('*', size));
  logger.log('info', '*' + _.pad(show, size - 2) + '*');
  logger.log('info', _.repeat('*', size));
};

// substituicao do log, para obter o nome do arquivo
logger.info = function (message, meta, callback) {

  // obtem quem chamou
  var who = caller();

  // remove o root
  var file = who.replace(root.path + '/', '');

  // cria um novo parametro, definindo o tipo da mensagem
  var args = [ 'info' ];

  // concatena o arquivo com a mensagem
  arguments[0] = arguments[0] + ' (' + file + ')';

  // adiciona os demais parametros
  _.map(arguments, function (arg) { return args.push(arg) });

  // chama a funcao original
  logger.log.apply(logger, args);
};

module.exports = logger;
