'use strict';
var express = require('express'),
    swagger = require('swagger-jsdoc'),
    path = require('path'),
    fs = require('fs'),
    pkg = require('../../../package.json');

// inicializa as rotas
module.exports = function(app, settings) {

  // unifica todos os parametros existentes
  var router = express.Router({ mergeParams: true });

  // caminho do swagger-ui
  var swagger_ui = path.join(__dirname, '../../../node_modules/swagger-ui-dist');

  // rota do arquivo criado com as apis
  router.get('/swagger.json', function(req, res) {

    // cria a especificacao da api
    var spec = swagger({
      swaggerDefinition: {
        swagger: '2.0',
        info: {
          title: pkg.name,
          version: pkg.version,
          description: pkg.description,
          license: {
            name: pkg.license,
            url: 'https://spdx.org/licenses/MIT.html'
          },
          contact: {
            email: pkg.author.email
          }
        },
        host: req.get('host'),
        schemes: [
          req.protocol
        ],
        basePath: '/',
        securityDefinitions: {
          JWT: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
          }
        }
      },
      apis: [
        './lib/routes/api/*.js'
      ]
    });

    // envia a resposta
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
  });

  // hack para o arquivo index.html para informar o arquivo
  router.get('(/index.html)?', function(req, res) {

    // url base
    var base = req.protocol + '://' +
               req.get('host') +
               req.originalUrl.replace('index.html', '') +
               (req.originalUrl.charAt(req.originalUrl.length - 1) !== '/' ? '/' : '');

    // modifica a localizacao do arquivo de definicao
    // e toda referencia ./ para url correta
    var html = fs
      .readFileSync(path.join(swagger_ui, '/index.html'), 'binary')
      .replace('http://petstore.swagger.io/v2/swagger.json', base + 'swagger.json')
      .replace(/\.\//g, base);

    // retorna o html alterado
    res.status(200).send(html);
  });

  // demais arquivos do swagger-ui
  router.use(express.static(swagger_ui));

  // retorno das rotas configuradas
  return router;
};
