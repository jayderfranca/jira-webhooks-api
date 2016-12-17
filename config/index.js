var assign = require('object-assign');

/** obtem o ambiente definido */
var env = process.env.NODE_ENV || 'development';

/** carrega o arquivo especifico do ambiente */
var config = require('./' + env);

/** definicoes globais, pode ser sobrescrito no arquivo do ambiente */
var global = {
  env: env,
  version: 'v1.0',
  listen: {
    http: process.env.PORT || 8080,
    https: process.env.PORT_SSL || 8443
  },
  ssl: {
    certificate: process.env.SSL_CERT_FILE || '',
    private: process.env.SSL_KEY_FILE || ''
  },
  mongo: {
    url: 'mongodb://' + (process.env.MONGO_HOST || 'localhost') + '/jira',
    debug: process.env.MONGO_DEBUG || false,
    options: process.env.MONGO_OPTIONS || {}
  }
};

/** merge das configuracoes globais com as do ambiente */
module.exports = assign({}, global, config);
