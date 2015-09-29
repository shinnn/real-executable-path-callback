# real-executable-path-callback

[![NPM version](https://img.shields.io/npm/v/real-executable-path-callback.svg)](https://www.npmjs.com/package/real-executable-path-callback)
[![Build Status](https://travis-ci.org/shinnn/real-executable-path-callback.svg?branch=master)](https://travis-ci.org/shinnn/real-executable-path-callback)
[![Build status](https://ci.appveyor.com/api/projects/status/ap6060wrs8xlja88/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/real-executable-path-callback/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/real-executable-path-callback.svg)](https://coveralls.io/r/shinnn/real-executable-path-callback)
[![Dependency Status](https://img.shields.io/david/shinnn/real-executable-path-callback.svg?label=deps)](https://david-dm.org/shinnn/real-executable-path-callback)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/real-executable-path-callback.svg?label=devDeps)](https://david-dm.org/shinnn/real-executable-path-callback#info=devDependencies)

Callback-style version of [real-executable-path]:

> Find the first instance of an executable in the PATH, with expanding all symbolic links

```javascript
const realExecutablePathCallback = require('real-executable-path-callback');
const which = require('which');

which('npm', (err, binPath) => {
  binpath; //=> '/usr/local/bin/node'
});

realExecutablePathCallback('npm', (err, binPath) => {
  binpath; //=> '/usr/local/Cellar/node/4.2.1/bin/node'
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install real-executable-path-callback
```

## API

```javascript
const realExecutablePathCallback = require('real-executable-path-callback');
```

### realExecutablePathCallback(*binName* [, *options*], *callback*)

*binName*: `String` (an executable name in the PATH)  
*options*: `Object`  
*callback*: `Function` (called after the path is resolved)

It finds the first instance of the given executable in the [PATH](http://pubs.opengroup.org/onlinepubs/000095399/basedefs/xbd_chap08.html#tag_08_03) environment variable, expands all symbolic links and resolves the canonicalized absolute pathname.

#### options

All options except for `all` option are used as [`which`](https://github.com/npm/node-which) [options](https://github.com/npm/node-which#options), and `option.cache` is used as `cache` of [`fs.realpath`](https://nodejs.org/api/fs.html#fs_fs_realpath_path_cache_callback).

```javascript
const realExecutablePathCallback = require('real-executable-path-callback');

realExecutablePathCallback('foo', {
  path: 'binaries',
  cache: {
    'binaries/foo': '/usr/local/lib/node_modules/foo/bin/foo'
  }
}, (err, resolvedPath) => {
  resolvedPath; //=> '/usr/local/lib/node_modules/foo/bin/foo'
});
```

## Related projects

* [real-executable-path] ([Promises/A+](https://promisesaplus.com/) version)

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[real-executable-path]: https://github.com/shinnn/real-executable-path