'use strong';

const path = require('path');

const realExecutablePathCallback = require('.');
const test = require('tape');

const isWinFlag = Number(process.platform === 'win32');

test('realExecutablePathCallback()', t => {
  t.plan(13);

  t.strictEqual(
    realExecutablePathCallback.name,
    'realExecutablePathCallback',
    'should have a function name.'
  );

  process.env.PATH = path.join('node_modules', '.bin');

  realExecutablePathCallback(`eslint${'.CMD'.repeat(isWinFlag)}`, (err, filePath) => {
    t.strictEqual(err, null, 'should not pass any errors when it successfully resolve a path.');
    t.strictEqual(
      filePath,
      path.resolve('node_modules', ['eslint/bin/eslint.js', '.bin/eslint.CMD'][isWinFlag]),
      'should resolve an executable path.'
    );
  });

  realExecutablePathCallback('foo', null, (...args) => {
    t.strictEqual(
      args.length,
      1,
      'should only pass one argument to the callback when it fails to resolve a path.'
    );
    t.strictEqual(
      args[0].message,
      'not found: foo',
      'should pass an error to the callback when it fails to resolve a path.'
    );
  });

  realExecutablePathCallback('eslint', {path: 'foo'}, err => {
    t.strictEqual(
      err.message,
      'not found: eslint',
      'should reflect `node-which` options to the result.'
    );
  });

  t.throws(
    () => realExecutablePathCallback(true, t.fail),
    /TypeError.*true is not a string\. Expected a string of a specific executable name in the PATH\./,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    () => realExecutablePathCallback('', undefined, t.fail),
    /Error.* but received an empty string instead./,
    'should throw an error when the first argument is an empty string.'
  );

  t.throws(
    () => realExecutablePathCallback('foo', true, t.fail),
    /TypeError.*true is not an object\. Expected a falsy value or an option object/,
    'should throw a type error when the second argument is not a function or object.'
  );

  t.throws(
    () => realExecutablePathCallback('foo', [{}], t.fail),
    /TypeError.* to be passed to `node-which` .*, but received an array instead\./,
    'should throw a type error when the second argument is not a function or object.'
  );

  t.throws(
    () => realExecutablePathCallback('foo', {all: true}, t.fail),
    /Error.*`all` option is not supported\./,
    'should throw an error when it takes `all` option.'
  );

  t.throws(
    () => realExecutablePathCallback('foo', 1),
    /TypeError.*1 is not a function\. Expected a callback function\./,
    'should throw a type error when the last argument is not a funtion.'
  );

  t.throws(
    () => realExecutablePathCallback(),
    /TypeError.*undefined is not a string\. /,
    'should throw a type error when the last argument is not a funtion.'
  );
});
