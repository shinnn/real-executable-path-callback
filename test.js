'use strict';

const {join} = require('path');

const realExecutablePathCallback = require('.');
const test = require('tape');

const isWinFlag = Number(process.platform === 'win32');

test('realExecutablePathCallback()', t => {
	t.plan(12);

	process.env.PATH = join(__dirname, 'node_modules', '.bin');

	realExecutablePathCallback('which', (err, filePath) => {
		t.equal(err, null, 'should not pass any errors when it successfully resolve a path.');
		t.equal(
			filePath,
      join(__dirname, 'node_modules', ['which/bin/which', '.bin/which.CMD'][isWinFlag]), // eslint-disable-line
			'should resolve an executable path.'
		);
	});

	realExecutablePathCallback('foo', ({message}, ...restArgs) => {
		t.equal(
			restArgs.length,
			0,
			'should only pass one argument to the callback when it fails to resolve a path.'
		);

		t.equal(
			message,
			'not found: foo',
			'should pass an error to the callback when it fails to resolve a path.'
		);
	});

	realExecutablePathCallback('which', {path: 'foo'}, ({message}) => {
		t.equal(
			message,
			'not found: which',
			'should reflect `node-which` options to the result.'
		);
	});

	t.throws(
		() => realExecutablePathCallback(true, t.fail),
		/^TypeError.*Expected an executable name.*, but got a non-string value true \(boolean\)\./,
		'should throw an error when the first argument is not a string.'
	);

	t.throws(
		() => realExecutablePathCallback('', undefined, t.fail),
		/^Error.*Expected an executable name inside the PATH, .*but got '' \(empty string\)\./,
		'should throw an error when the first argument is an empty string.'
	);

	t.throws(
		() => realExecutablePathCallback('foo', [{}], t.fail),
		/^TypeError.*passed to `node-which`.*, but got \[ \{} ] \(array\)\./,
		'should throw an error when the second argument is neither a function nor an object.'
	);

	t.throws(
		() => realExecutablePathCallback('foo', {all: true}, t.fail),
		/Error.*`all` option is not supported, but a value true \(boolean\) was provided\./,
		'should throw an error when it takes `all` option.'
	);

	t.throws(
		() => realExecutablePathCallback('foo', 1),
		/^TypeError.*Expected a callback function, but got 1 \(number\)\./,
		'should throw an error when the last argument is not a funtion.'
	);

	t.throws(
		() => realExecutablePathCallback(),
		/^RangeError.*Expected 2 or 3 arguments \(<string>\[, <Object>], <Function>\), but got no arguments\./,
		'should throw an error when it takes no arguments.'
	);

	t.throws(
		() => realExecutablePathCallback(1, 2, 3, 4),
		/^RangeError.*Expected 2 or 3 arguments \(<string>\[, <Object>], <Function>\), but got 4 arguments\./,
		'should throw an error when it takes too many arguments.'
	);
});
