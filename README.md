# denoteArgs

Denote specific malformed arguments for peculiar use case.

The specific form is:

 * A function call
 * A function call with such signature:

```js
var foo = function () {};

foo('str', ['jQuery', 'React', 'underscore'], function (a, b, c, d, e, f) {
  
})
```

It will convert the source into this:

```js
var foo = function () {};

/**
 * underscore: f
 * React: e
 * jQUery: d
 */
foo('str', ['jQuery', 'React', 'underscore'], function (a, b, c, d, e, f) {
  
})
```

## Usage

```bash
git clone https://github.com/towry/denoteArgs /tmp/denoteArgs
cd /tmp/denoteArgs && npm link .
```

After that, run `denoteArgs`
