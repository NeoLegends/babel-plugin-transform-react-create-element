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

It works by translating any found calls to `React.createElement` to use the newly inserted local variable instead.

As such, it automatically respects any existing JSX pragmas in the file and does not interfer with their use.

## Why?

Performance. In particular in conjunction with the way webpack transforms imports.

Also created to solve https://github.com/facebook/create-react-app/issues/5435.

## License

MIT
