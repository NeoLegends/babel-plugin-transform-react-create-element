# babel-plugin-transform-react-imports

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

This plugin respects existing `/** @jsx some-jsx-pragma */` pragmas and does not modify them.

## Why?

Performance. In particular in conjunction with the way webpack transforms imports.

Also created to solve https://github.com/facebook/create-react-app/issues/5435.

## License

MIT
