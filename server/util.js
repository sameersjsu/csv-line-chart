'use strict';

module.exports = (function () {

  // Returns UTC date and time
  let getDbTimeFormat = function () {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  };

  return {
    getDbTimeFormat: getDbTimeFormat
  };
})();