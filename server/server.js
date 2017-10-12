'use strict';

// Third party modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const async = require('async');

// Custom modules
const config = require('./config');
const db = require('./db');
const util = require('./util');

// Initializing app
let app = express();

// Enable cors support
app.use(cors());

// parse application/json
app.use(bodyParser.json())

app.listen(config.port, config.ip, function (err) {
  if (err) {
    console.log(err);
    process.exit(10);
  }
  console.log(`Server is listening on http://${config.ip}:${config.port}`);
});

// Route to store data series in the database
app.post('/series', function (request, response) {
  let data = request.body;
  data = normalizeSeriesData(data);
  let connection = new db();
  let initialQuery = 'INSERT INTO series (id, name, series, created_on) VALUES ';
  let created = util.getDbTimeFormat()
  let queryObj = connection.getMultipleInsertQuery({
    initQuery: initialQuery,
    hasPrimary: true,
    data: data,
    cols: ['name', 'series'],
    staticCols: [':created'],
    staticData: {
      created: created
    }
  });
  async.waterfall([function (next) {
    connection.query(queryObj, next);
  }, function (data, next) {
    let queryObj = {
      query: `SELECT id, name, created_on AS created FROM series WHERE created_on = ?
        ORDER BY name;`,
      data: [created]
    };
    connection.getResults(queryObj, next);
  }], function (err, data) {
    return sendResponse(err, data, response);
  });
});

// Route to retrieve series data from the database
app.get('/series', function (request, response) {
  let connection = new db();
  let queryObj = {
    query: `SELECT series FROM series WHERE id = ?`,
    data: [request.query.id]
  };
  connection.getResult(queryObj, function (err, data) {
    return sendResponse(err, data, response);
  });
});

function normalizeSeriesData (data) {
  for (let i = 0, len = data.length; i < len; ++i) {
    data[i].series = JSON.stringify(data[i].series);
  }
  return data;
}

// Handles success and error response
function sendResponse (err, data, response) {
  if (err) {
    console.log(err);
    response.format({
      'application/json': function () {
        response.status(500).json({
          'status': 'fail',
          'data': {},
          'message': err.message
        });
      }
    });
  } else {
    response.format({
      'application/json': function () {
        response.status(200).json({
          'status': 'success',
          'data': data
        });
      }
    });
  }
}