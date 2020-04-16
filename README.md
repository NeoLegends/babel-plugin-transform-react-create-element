# babel-plugin-transform-react-create-element

Shorten JSX `React.createElement` calls using a local variable.

Compiles

```jsx
import React from 'react';

const Component = () => (
  <div>Hello, World!</div>
);
```

to

```jsx
import React from 'react';

const _createElement = React.createElement;

const Component = () => (
  _createElement('div', {}, 'Hello, World!')
);
```

instead of

```jsx
import React from 'react';

const Component = () => (
  React.createElement('div', {}, 'Hello, World!')
);
```

## How?

In your `.babelrc`:

```
{
  "plugins": [
    "babel-plugin-transform-react-create-element",
  ]
}
```

It works by inserting a JSX pragma that points to the local variable. Hence, it needs to run before any JSX compilers. If you're using `@babel/preset-react` everything will work out of the box. If you're using `@babel/plugin-transform-react-jsx` directly, make sure to list this plugin before it.

This plugin _does_ respect any existing JSX pragmas in the file and does not modify them.

## Why?

Performance. In particular in conjunction with the way webpack transforms imports.

Also created to solve https://github.com/facebook/create-react-app/issues/5435.

## License

MIT
