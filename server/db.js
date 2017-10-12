'use strict';

// DB helper class to perform database
// operations on MariaDB from NodeJS app

// Third party modules
const mariasql = require('mariasql');
const uuid = require('uuid');

// Configuration
const config = require('./config');

// Create client
let client = new mariasql({
  'host': config.db.host,
  'user': config.db.user,
  'password': config.db.pwd,
  'db': config.db.name
});

/**
 * @namespace DB
 */
function DB () {

}

/**
 * @name query
 * @desc Executes INSERT, UPDATE and DELETE statements
 * @param {object} queryObj
 * @param {string} queryObj.query
 * @param {object} queryObj.data
 * @param {callback} cb
 */
DB.prototype.query = function (queryObj, cb) {
  this.executeQuery(queryObj, function (err, response) {
    return cb(err, response);
  });
};

/**
 * @name getResults
 * @desc Executes SELECT statements
 * and returns multiple result set
 * @param {object} queryObj
 * @param {string} queryObj.query
 * @param {object} queryObj.data
 * @param {callback} cb
 */
DB.prototype.getResults = function (queryObj, cb) {
  queryObj.isSelect = true;
  this.executeQuery(queryObj, function (err, response) {
    return cb(err, response);
  });
};

/**
 * @name getResult
 * @desc Executes SELECT statements
 * and returns single result set
 * @param {object} queryObj
 * @param {string} queryObj.query
 * @param {object} queryObj.data
 * @param {callback} cb
 */
DB.prototype.getResult = function (queryObj, cb) {
  queryObj.isSelect = true;
  this.executeQuery(queryObj, function (err, response) {
    return cb(err, response[0]);
  });
};

/**
 * @name executeQuery
 * @desc Executes given SQL statements
 * and process the response from DB
 * @param {object} queryObj
 * @param {string} queryObj.query
 * @param {object} queryObj.data
 * @param {callback} cb
 */
DB.prototype.executeQuery = function (queryObj, cb) {
  let response = [];
  // Normalizing query object
  client.query(queryObj.query, queryObj.data, queryObj.useArray)
    .on('result', cbHandleResult)
    .on('error', cbHandleError)
    .on('end', cbEnd)

  function cbHandleResult(res) {
    if (queryObj.isSelect) {
      res.on('data', function (row) {
        response.push(row);
      });
    }
    res.on('end', function () {
      if (!queryObj.isSelect) {
        cb(null, res.info);
      }
    });
  }

  function cbHandleError(err) {
    queryObj.hasError = true;
    cb(err);
  }

  function cbEnd () {
    if (!queryObj.hasError) {
      if (queryObj.isSelect) {
        cb(null, response);
      }
    }
  }
};

/**
 * @name getMultipleInsertQuery
 * @desc Helper function to generate the batch
 * statement for insertion of multiple rows at a time
 * @param {object} queryObj
 */
DB.prototype.getMultipleInsertQuery = function (queryObj) {
  let initQuery = queryObj.initQuery;
  let finalData = queryObj.staticData;
  let cols = queryObj.cols;
  let staticCols = queryObj.staticCols;
  let data = queryObj.data;
  let hasPrimaryKey = queryObj.hasPrimary;
  let valuesQueryArr = [];
  let valuesQuery = '';
  for (let i = 0, len = data.length; i < len; i++) {
    let dynamicCols = [];
    if (hasPrimaryKey) {
      // Adding id column
      dynamicCols.push(`:id_${i.toString()}`);
      finalData[`id_${i.toString()}`] = uuid.v4();
    }
    let currData = data[i];
    for (let j = 0, len2 = cols.length; j < len2; ++j) {
      let currColName = `${cols[j]}_${i.toString()}`;
      dynamicCols.push(`:${currColName}`);
      finalData[currColName] = currData[cols[j]];
    }
    valuesQueryArr.push(`(${dynamicCols.join()},${staticCols.join()})`);
  }
  valuesQuery = valuesQueryArr.join();
  return {
    query: `${initQuery}${valuesQuery};`,
    data: finalData
  };
};

function normalizeQueryObj (queryObj) {
  if (!queryObj.useArray) {
    queryObj.useArray = true;
  }
  if (!queryObj.isSelect) {
    queryObj.isSelect = false;
  }
}

module.exports = DB;