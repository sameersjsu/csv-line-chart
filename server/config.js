'use strict';

// App configuration settings
const config = {
  'port': process.env.EXPRESS_PORT || 3000,
  'ip': process.env.EXPRESS_IP || '127.0.0.1',
  'db': {
    'host': process.env.DATABASE_HOST || '127.0.0.1',
    'user': process.env.DATABASE_USER || 'root',
    'pwd': process.env.DATABASE_PASSWORD || 'surendra9',
    'name': process.env.DATABASE_NAME || 'series'
  }
};

// Exports configuration module
module.exports = config;