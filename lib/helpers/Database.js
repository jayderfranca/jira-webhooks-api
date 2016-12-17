'use strict';
var mongoose = require('mongoose'),
    Promise = require('bluebird'),
    logger = require('./logger');

var Database = function (config) {

  // atribui a promise padrao para o mongoose
  mongoose.Promise = Promise;

  // salva as informacoes da configuracao
  var mongo = config.mongo;

  // escuta o evento de sigint
  process.on('SIGINT', function () {
    mongoose.disconnect(function () {
      process.exit(0);
    })
  });

  return {

    // conecta com o banco de dados
    connect: function () {
      return new Promise(function (resolve, reject) {
        // mongoose debug ?
        mongoose.set('debug', mongo.debug);

        // realiza a conexao com mongo
        mongoose.connect(mongo.url, mongo.options)
          .then(function () {
            // conexao realizada
            logger.info('Conectado em ' + mongo.url);

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
          }, function (error) {
            logger.error('Erro na comunicação com banco de dados', error);
            reject(error);
          })
      });
    },

    // exclui uma colecao no banco de dados
    drop: function (collection) {
      return new Promise(function (resolve, reject) {
        mongoose.connection.db.dropCollection(collection)
          .then(resolve, reject);
      });
    },

    // desconecta do banco de dados
    disconnect: function () {
      return new Promise(function (resolve, reject) {
        mongoose.connection.close()
          .then(resolve, reject);
      });
    }
  }
};

module.exports = Database;
