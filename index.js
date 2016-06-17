/*!
 * real-executable-path-callback | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/real-executable-path-callback
*/
'use strict';

const inspect = require('util').inspect;

const fs = require('graceful-fs');
const which = require('which');

const optionErrorMsg = 'Expected a falsy value or an option object to be passed to `node-which` ' +
                     'https://www.npmjs.com/package/which';

module.exports = function realExecutablePathCallback(cmd, options, cb) {
  if (typeof cmd !== 'string') {
    throw new TypeError(
      inspect(cmd) +
      ' is not a string. Expected a string of a specific executable name in the PATH.'
    );
  }

  if (cmd === '') {
    throw new Error(
      'Expected a string of a specific executable name in the PATH, ' +
      'but received an empty string instead.'
    );
  }

  if (cb === undefined) {
    cb = options;
    options = {};
  } else if (options) {
    if (typeof options !== 'object') {
      throw new TypeError(`${inspect(options)} is not an object. ${optionErrorMsg}.`);
    }

    if (Array.isArray(options)) {
      throw new TypeError(optionErrorMsg + ', but received an array instead.');
    }

    if (options.all) {
      throw new Error('`all` option is not supported.');
    }
  } else {
    options = {cache: null};
  }

  if (typeof cb !== 'function') {
    throw new TypeError(`${inspect(cb)} is not a function. Expected a callback function.`);
  }

  which(cmd, options, function whichCallback(err, resolvedPaths) {
    if (err) {
      cb(err);
      return;
    }

    fs.realpath(resolvedPaths, options.cache, cb);
  });
};
