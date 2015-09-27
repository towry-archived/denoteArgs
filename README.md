# denoteArgs

Denote specific malformed arguments for peculiar use case.

*Ignore me*

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
