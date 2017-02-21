'use strict';
var mongoose = require('mongoose'),
    Promise = require('bluebird'),
    logger = require('./logger');

// classe de banco de dados
var Database = function(settings) {

  // atribui a promise padrao para o mongoose
  mongoose.Promise = Promise;

  // salva as informacoes da configuracao
  this._settings = settings.mongo;

  // escuta o evento de sigint
  process.on('SIGINT', function() {
    mongoose.disconnect(function() {
      process.exit(0);
    })
  });
};

// metodo que realiza a conexao com banco de dados
Database.prototype.connect = function() {
  // salva a instancia da classe
  var _self = this;

  // cria a promise de conexao
  return new Promise(function(resolve, reject) {

    // mongoose debug ?
    mongoose.set('debug', _self._settings.debug);

    // realiza a conexao com mongo
    mongoose.connect(_self._settings.url, _self._settings.options)
      .then(function() {
        // conexao realizada
        logger.info('Conectado em ' + _self._settings.url);

        // obtem a connection do mongoose
        var connection = mongoose.connection;

        // conecta-se a alguns eventos
        connection.on('disconnected', function () {
          logger.warn('Conexão finalizada com banco de dados');
        });
        connection.on('reconnected', function () {
          logger.warn('Conexão reestabelecida com banco de dados');
        });
        connection.on('error', function (error) {
          logger.error('Erro na comunicação com banco de dados', error);
        });

        // sucesso no metodo
        resolve();

        //erro na conversa com o banco de dados
      }, function(error) {
        logger.error('Erro na comunicação com banco de dados', error);
        reject(error);
      })
  });
};

// metodo que desconecta com banco de dados
Database.prototype.disconnect = function() {
  return new Promise(function(resolve, reject) {
    mongoose.connection.close()
      .then(resolve, reject);
  });
};

// exclui uma coleção no banco de dados
Database.prototype.drop = function(collection) {
  return new Promise(function(resolve, reject) {
    mongoose.connection.db.dropCollection(collection)
      .then(resolve, reject);
  });
};

module.exports = Database;
