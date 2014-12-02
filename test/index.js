'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var test = require('tape');
var Hooks = require('../');

var dir = path.join(process.cwd(), 'test', 'hooks');
var cmd = 'node ' + path.join(dir, 'foo');

test('run without opts', function (t) {
  var hook = Hooks();
  hook('foo', function (err, stdout, stderr) {
    var script = path.join(process.cwd(), 'hooks', 'foo');
    t.equals(err.message, 'Unknown file: ' + script);
    t.end();
  });
});

test('run with dir string', function (t) {
  var hook = Hooks(dir);
  hook('foo', function (err, stdout, stderr) {
    t.equals(err.code, 42);
    t.equals(stdout, cmd);
    t.equals(stderr, process.cwd());
    t.end();
  });
});

test('run with opts.dir', function (t) {
  var hook = Hooks({ dir: dir });
  hook('foo', function (err, stdout, stderr) {
    t.equals(err.code, 42);
    t.equals(stdout, cmd);
    t.equals(stderr, process.cwd());
    t.end();
  });
});

test('run with opts.dir + opts.cwd', function (t) {
  var cwd = fs.realpathSync(os.tmpdir());
  var hook = Hooks({ dir: dir, cwd: cwd });
  hook('foo', function (err, stdout, stderr) {
    t.equals(err.code, 42);
    t.equals(stdout, cmd);
    t.equals(stderr, cwd);
    t.end();
  });
});
