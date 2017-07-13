'use strict';
var Promise = require('bluebird'),
    fs = require('fs'),
    express = require('express'),
    http = require('http'),
    https = require('https'),
    cookie = require('cookie-parser'),
    body = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    helmet = require('helmet'),
    logger = require('./logger'),
    routes = require('../routes');

// classe do servidor
var Server = function(settings) {
  try {

    // incializacao das configuracoes
    this._settings = {listen: settings.listen, ssl: settings.ssl};

    // protocolos de escuta
    this._protocols = {http: null, https: null};

    // express tratamento de rotas
    this._app = express();

    // demais middlewares necessarios
    this._app.use(compression());
    this._app.use(helmet());
    this._app.use(cors());

    // cookie parser
    this._app.use(cookie());

    // body parser
    this._app.use(body.text());
    this._app.use(body.json());
    this._app.use(body.urlencoded({extended: true}));

    // tratamento de todas requisicoes
    this._app.use(Server._requests);

    // rotas as serem carregads
    this._app.use('/', routes());

    // tratamento de erros
    this._app.use(Server._errors);

  } catch (error) {
    logger.error('Erro ao criar o servidor', error);
    process.exit(-1);
  }
};

// intercepta todas as requisicoes
Server._requests = function(req, res, next) {
  // continua o fluxo da requisicao
  next();
};

// tratamento de todos erros das requisicoes
Server._errors = function(err, req, res, next) {
};

// metodo que inicializa o servidor
Server.prototype.listen = function() {

  // salva a instancia da classe
  var _self = this;

  // cria uma nova promisse para execucao
  return new Promise(function(resolve, reject) {

    try {
      // porta http
      if (_self._settings.listen.http) {
        _self._protocols.http = http.createServer(_self._app);
      }

      // inicializa o protocolo http
      if (_self._protocols.http) {
        _self._protocols.http.listen(_self._settings.listen.http, function() {
          logger.info('HTTP inicializado na porta %s', _self._settings.listen.http);
        });
      }

      // protocolos inicializados
      resolve();

      // em caso de erro na inicializacao, realiza o tratamento
    } catch (error) {
      logger.error('Erro ao inicializar os protocolos', error);
      reject(error);
    }
  });
};

// metodo que para o servidor
Server.prototype.shutdown = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

module.exports = Server;
