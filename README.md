## Introduction

A sample application that will take series data from the CSV file and generates a line chart. In this application, both client and server
are isolated.

## Prerequisites

* Node (>4.4.0)
* Bower
* Grunt

## Installation

### Building UI

* Go to `client` directory and run the following commands.

```sh
bower install
npm install
```

* Now start the server by using following command.

```sh
grunt
```

### Starting the server

* Go to server directory and run the following commands to install required npm dependencies
```sh
npm install
```
* Run the following command to start the server
```sh
npm start
```

By default,

UI will run on the following URL,

```sh
http://127.0.0.1:8000
```
Server will run on the following URL,

```sh
http://127.0.0.1:8000
```

If you want to change this configuration, please feel to change it in `Gruntfile.js` file (client) and `config.js` file (server).

```js
// Gruntfile.js
grunt.initConfig({
  'pkg': grunt.file.read('package.json'),
  'connect': {
    static:{
      port: 8000
    }
  }
});
```
```js
// App configuration settings
const config = {
  'port': process.env.EXPRESS_PORT || 3000,
  'ip': process.env.EXPRESS_IP || '127.0.0.1',
  'db': {
    'host': process.env.DATABASE_HOST || '127.0.0.1',
    'user': process.env.DATABASE_USER || 'root',
    'pwd': process.env.DATABASE_PASSWORD || '',
    'name': process.env.DATABASE_NAME || 'series'
  }
};
```
## Database

Before running the application, please import the database which you will find under sql folder.
