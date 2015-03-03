'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var test = require('tape');
var Hooks = require('../');

var dir = path.join(process.cwd(), 'test', 'hooks');
var cmd = 'node ' + path.join(dir, 'foo');

test('run with non-existing hook', function (t) {
  var hooks = Hooks();
  hooks('non-existing', function (hook) {
    t.ok(!hook);
    t.end();
  });
});

test('init with dir string', function (t) {
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

test('init with opts.dir', function (t) {
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

test('init with opts.dir + opts.cwd', function (t) {
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

test('init with opts.dir + opts.env', function (t) {
  var hooks = Hooks({ dir: dir, env: { FOO: 'bar' } });
  hooks('foo', function (hook) {
    var stdout = [];
    var stderr = [];
    hook.on('close', function (code) {
      t.equals(code, 42);
      t.equals(stdout.join(''), 'bar' + cmd);
      t.equals(stderr.join(''), process.cwd());
      t.end();
    });
    hook.stdout.on('data', stdout.push.bind(stdout));
    hook.stderr.on('data', stderr.push.bind(stderr));
  });
});

test('init with dir and run with empty args and opts.env', function (t) {
  var hooks = Hooks(dir);
  hooks('foo', [], { env: { FOO: 'bar' } }, function (hook) {
    var stdout = [];
    var stderr = [];
    hook.on('close', function (code) {
      t.equals(code, 42);
      t.equals(stdout.join(''), 'bar' + cmd);
      t.equals(stderr.join(''), process.cwd());
      t.end();
    });
    hook.stdout.on('data', stdout.push.bind(stdout));
    hook.stderr.on('data', stderr.push.bind(stderr));
  });
});

test('init with override', function (t) {
  var hooks = Hooks({ dir: dir, overrides: { foo: 'echo bar' } });
  hooks('foo', function (hook) {
    var stdout = [];
    hook.on('close', function (code) {
      t.equals(code, 0);
      t.equals(stdout.join(''), 'bar\n');
      t.end();
    });
    hook.stdout.on('data', stdout.push.bind(stdout));
  });
});
