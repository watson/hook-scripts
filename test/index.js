'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var test = require('tape');
var Hooks = require('../');

var dir = path.join(process.cwd(), 'test', 'hooks');
var cmd = 'node ' + path.join(dir, 'foo');

test('run with dir string', function (t) {
  var hooks = Hooks(dir);
  hooks('foo', function (hook) {
    var stdout = [];
    var stderr = [];
    hook.on('close', function (code) {
      t.equals(code, 42);
      t.equals(stdout.join(''), cmd);
      t.equals(stderr.join(''), process.cwd());
      t.end();
    });
    hook.stdout.on('data', stdout.push.bind(stdout));
    hook.stderr.on('data', stderr.push.bind(stderr));
  });
});

test('run with opts.dir', function (t) {
  var hooks = Hooks({ dir: dir });
  hooks('foo', function (hook) {
    var stdout = [];
    var stderr = [];
    hook.on('close', function (code) {
      t.equals(code, 42);
      t.equals(stdout.join(''), cmd);
      t.equals(stderr.join(''), process.cwd());
      t.end();
    });
    hook.stdout.on('data', stdout.push.bind(stdout));
    hook.stderr.on('data', stderr.push.bind(stderr));
  });
});

test('run with opts.dir + opts.cwd', function (t) {
  var cwd = fs.realpathSync(os.tmpdir());
  var hooks = Hooks({ dir: dir, cwd: cwd });
  hooks('foo', function (hook) {
    var stdout = [];
    var stderr = [];
    hook.on('close', function (code) {
      t.equals(code, 42);
      t.equals(stdout.join(''), cmd);
      t.equals(stderr.join(''), cwd);
      t.end();
    });
    hook.stdout.on('data', stdout.push.bind(stdout));
    hook.stderr.on('data', stderr.push.bind(stderr));
  });
});
