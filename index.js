'use strict';

var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

module.exports = function hooks (opts) {
  if (!opts) return hooks({});
  if (typeof opts === 'string') return hooks({ dir: opts });
  if (!opts.cwd) opts.cwd = process.cwd();
  opts.dir = path.resolve(opts.dir || 'hooks');
  return function run (hook, args, cb) {
    if (typeof args === 'function') return run(hook, [], args);
    var script = path.join(opts.dir, hook);
    var override = opts.overrides && opts.overrides[hook];
    if (override) return cb(spawn('/bin/sh', ['-c', override, hook].concat(args)));
    fs.exists(script, function (exists) {
      if (exists) cb(spawn(script, args, { cwd: opts.cwd }));
    });
  };
};
