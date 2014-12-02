'use strict';

var proc = require('child_process');
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
    fs.exists(script, function (exists) {
      if (exists) cb(proc.spawn(script, args, { cwd: opts.cwd }));
    });
  };
};
