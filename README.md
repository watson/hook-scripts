# hook-scripts

Add [git-style](http://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
hooks to your node project.

[![build status](https://secure.travis-ci.org/watson/hook-scripts.png)](http://travis-ci.org/watson/hook-scripts)

## Install

```
npm install hook-scripts
```

## Example usage

```js
var hooks = require('hook-scripts')();

hooks('hook-name', function (hook) {
  if (!hook) return console.log('No hook named hook-name found');
  hook.on('close', function (code) {
    console.log('Script exited with code', code);
  });
  hook.stdout.pipe(process.stdout);
  hook.stderr.pipe(process.stderr);
});
```

## API

By default, hook-scripts will look for a `hooks` folder in the current
working directory (`process.cwd()`). You can override this behavior by
parsing in a path to a different directory upon initialization:

```js
var hooks = require('hook-scripts')('/path/to/hooks');
```

It's expected that the hook names map to filenames inside the hooks
directory.

You can parse in arguments to the hook script using an optional 2nd
argument when registering the hook:

```js
hooks('hook-name', ['arg1', 'arg2'], function (hook) {...});
```

And you can even set custom environment variables:

```js
hooks('hook-name', [], { env: { NODE_ENV: 'production' } }, function (hook) {...});
```

### Initialize

An initializer is returned when requireing `hook-scripts`. It takes one
optional argument which can either be a string or an options hash.

```js
require('hook-scripts')([dir || options]);
```

The string is just a shorthand for parsing in `{ dir: string }`.

The full list of options are:

- `dir` - The directory in which to look for the hook scripts
- `cwd` - The working directory in which to run the hook scripts (defaults to `process.cwd()`)
- `env` - Environment key-value pairs
- `overrides` - An optional hash of hook script overrides (see the [Advanced](#advanced) section below)


## Example hooks

The hooks can be written in any language that you prefer. Just make sure
they are executable and include a
[hashbang](http://en.wikipedia.org/wiki/Shebang_(Unix)) in the top of
the script.

Here are some examples in various languages:

**Bash**

```bash
#!/usr/bin/env bash

echo 'Hello World'
```

**Node.js**

```js
#!/usr/bin/env node

console.log('Hello World');
```

**Ruby**

```ruby
#!/usr/bin/env ruby

puts 'Hello World'
```

## Advanced

### Overrides

Using the initialization option `overrides` it's possible to override
individual hooks:

```js
var hooks = require('hook-scripts')({ overrides: { foo: 'echo bar' } });

// will run `echo bar` instead of looking for a script named foo
hooks('foo', function (hook) {
  hook.stdout.pipe(process.stdout); // pipes `bar\n` to STDOUT
});
```

## License

MIT
