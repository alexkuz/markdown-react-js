# Markdown React

Markdown to React Component converter.

This project uses Markdown parser from [Markdown It](https://github.com/markdown-it/markdown-it) library, but loosely supports its plugins.

**DEMO**: http://alexkuz.github.io/markdown-react-js/

## Install

```sh
npm i markdown-react-js
```


## Examples

### Basic example

```jsx
import MDReactComponent from 'markdown-react-js';

render() {
  return (
    <MDReactComponent text='Some text **with emphasis**.' />   
  );
}
```

or, using function instead of component:

```jsx
import { mdReact } from 'markdown-react-js';

render() {
  return mdReact()('Some text **with emphasis**.');
}
```

Result:

```jsx
<span>
  <p>
    Some text with <strong>emphasis</strong>.
  </p>
</span>
```

### Using custom tags

```jsx
const TAGS = {
  html: 'span', // root node, replaced by default
  strong: 'b',
  em: 'i'
}

render() {
  return (
    <MDReactComponent text='Some **bold** and *italic* text.' tags={TAGS} />   
  );
}
```

Result:

```jsx
<span>
  <p>
    Some <b>bold</b> and <i>italic</i> text.
  </p>
</span>

```

### Using custom component renderer

```jsx
function handleIterate(Tag, props, children, level) {
  if (level === 1) {
    props = {
      ...props,
      className: 'first-level-class'
    };
  }
  
  if (Tag === 'a') {
    props = {
      ...props,
      className: 'link-class',
      href: props.href.replace('SOME_URL', 'http://example.com')
    };
  }
  
  return <Tag {...props}>{children}</Tag>;
}

render() {
  return (
    <MDReactComponent text='[This link](SOME_URL) has it’s own style.' onIterate={handleIterate} />   
  );
}
```

Result:

```jsx
<span>
  <p class="first-level-class">
    <a href="http://example.com" class="link-class">This link</a> has it’s own style.
  </p>
</span>

```

## Copyright

Copyright 2015, Alexander Kuznetsov &lt;alexkuz@gmail.com&gt;

Markdown-It:

Copyright (c) 2014 Vitaly Puzrin &lt;vitaly@rcdesign.ru&gt;, Alex Kocharin &lt;alex@kocharin.ru&gt;
