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

/** classe do servidor */
var Server = function Server(config) {

  console.log(config);

  /* incializacao das configuracoes */
  this.settings = {};

  /* configuracao das portas */
  this.settings.listen = config.listen;

  /* configuracao ssl */
  this.settings.ssl = config.ssl;

  /* express tratamento de rotas */
  this.app = express();

  /* demais middlewares necessarios */
  this.app.use(compression());
  this.app.use(helmet());
  this.app.use(cors());

  /* cookie parser */
  this.app.use(cookie());

  /* body parser */
  this.app.use(body.text());
  this.app.use(body.json());
  this.app.use(body.urlencoded({ extended: true }));

  return {

    /* inicializa o servidor http/https */
    listen: function() {
      return new Promise(function(resolve, reject) {
        logger.info('Servidor inicializado.');
        resolve();
      });
    },

    /* termina o servidor http/https */
    shutdown: function() {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    }
  };
};

module.exports = Server;
