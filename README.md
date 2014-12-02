# hook-scripts

Add [git-style](http://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
hooks to your node module.

[![build status](https://secure.travis-ci.org/watson/hook-scripts.png)](http://travis-ci.org/watson/hook-scripts)

## Install

```
npm install hook-scripts
```

## Example usage

```js
var hooks = require('hook-scripts')();

hooks('hook-name', function (err, stdout, stderr) {
  console.log('Script exit code:', err ? err.code : 0);
  console.log('Script output:\n' + stdout);
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
hooks('hook-name', ['arg1', 'arg2'], function (err, stdout, stderr) {...});
```

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

## License

MIT
