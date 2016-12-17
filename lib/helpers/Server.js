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
    logger = require('./logger');

// classe do servidor
var Server = function Server(config) {

  // incializacao das configuracoes
  var settings = { listen: config.listen, ssl: config.ssl };

  // protocolos de escuta
  var protocols = { insecure: null, secure: null };

  // express tratamento de rotas
  var app = express();

  // demais middlewares necessarios
  app.use(compression());
  app.use(helmet());
  app.use(cors());

  // cookie parser
  app.use(cookie());

  // body parser
  app.use(body.text());
  app.use(body.json());
  app.use(body.urlencoded({ extended: true }));

  return {

    // inicializa o servidor http/https
    listen: function () {
      return new Promise(function (resolve, reject) {
        try {
          // porta http
          if (settings.listen.http) {
            protocols.insecure = http.createServer(app);
          }

          // inicializa o protocolo http
          if (protocols.insecure) {
            protocols.insecure.listen(settings.listen.http, function () {
              logger.info('HTTP inicializado na porta %s', settings.listen.http);
            })
          }

          // protocolos inicializados
          resolve();

        // em caso de erro na inicializacao, realiza o tratamento
        } catch (error) {
          logger.error('Erro ao inicializar os protocolos', error);
          reject(error);
        }
      });
    },

    // termina o servidor http/https
    shutdown: function () {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }
  };
};

module.exports = Server;
