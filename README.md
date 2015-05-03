# Markdown React

Markdown to React Component converter.

**DEMO**: http://alexkuz.github.io/markdown-react-js/

## Examples

#### Basic example

```
import mdReact from 'markdown-react-js';

...

render() {
  return (
    <div>{mdReact('Some text **with emphasis**.')}</div>   
  );
}
```

Result:

```
<div>
  <span>
    <p>
      Some text with <strong>emphasis</strong>.
    </p>
  </span>
</div>

```

#### Using custom tags

```
const TAGS = {
  html: 'span', // root node, replaced by default
  strong: 'b',
  em: 'i'
}

...

render() {
  return (
    <span>{mdReact('Some **bold** and *italic* text.', { tags })}</span>   
  );
}
```

Result:

```
<div>
  <span>
    <p>
      Some <b>bold</b> and <i>italic</i> text.
    </p>
  </span>
</div>

```

#### Using custom component renderer

```
import update from 'react/lib/update';

function onIterate(tag, props, children, level) {
  if (level === 1) {
    props = update(props, {
      className: { $set: 'first-level-class' }
    });
  }
  
  if (tag === 'a') {
    props = update(props, {
      className: { $set: 'link-class' },
      href: { $apply: h => h.replace('SOME_URL', 'http://example.com') }
    });
  }
  
  return React.createElement(tag, props, children);
}

...

render() {
  return (
    <span>{mdReact('[This link](SOME_URL) has it’s own style.', { onIterate })}</span>   
  );
}
```

Result:

```
<div>
  <span>
    <p class="first-level-class">
      <a href="http://example.com" class="link-class">This link</a> has it’s own style.
    </p>
  </span>
</div>

```
