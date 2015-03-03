'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var xtend = require('xtend');

module.exports = function hooks (opts) {
  if (!opts) return hooks({});
  if (typeof opts === 'string') return hooks({ dir: opts });
  if (!opts.cwd) opts.cwd = process.cwd();
  opts.dir = path.resolve(opts.dir || 'hooks');
  return function run (hook, args, spawnOpts, cb) {
    if (typeof args === 'function') return run(hook, [], {}, args);
    if (typeof spawnOpts === 'function') return run(hook, args, {}, spawnOpts);
    if (!spawnOpts.cwd) spawnOpts.cwd = opts.cwd;
    spawnOpts.env = xtend({}, process.env, opts.env, spawnOpts.env);
    var script = path.join(opts.dir, hook);
    var override = opts.overrides && opts.overrides[hook];
    if (override) return cb(spawn('/bin/sh', ['-c', override, hook].concat(args), spawnOpts));
    fs.exists(script, function (exists) {
      if (!exists) return cb();
      cb(spawn(script, args, spawnOpts));
    });
  };
};
