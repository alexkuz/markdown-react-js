'use strict';

import { assert } from 'chai';
import { describe, it } from 'mocha';
import { mdReact } from '../src/index';
import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import update from 'immutability-helper';

const plugins = {
  abbr: require('markdown-it-abbr'),
  container: require('markdown-it-container'),
  deflist: require('markdown-it-deflist'),
  emoji: require('markdown-it-emoji'),
  footnote: require('markdown-it-footnote'),
  ins: require('markdown-it-ins'),
  mark: require('markdown-it-mark'),
  sub: require('markdown-it-sub'),
  sup: require('markdown-it-sup')
};

function render(text, options) {
  return renderToStaticMarkup(mdReact(options)(text));
}

function linkCallback(tag, props, children) {
  if (tag === 'a') {
    props = update(props, {
      className: { $set: 'link-class' },
      href: { $apply: h => h.replace('SOME_URL', 'http://real-url.com') }
    });
  }
  return React.createElement(tag, props, children);
}

function firstLevelCallback(tag, props, children, level) {
  if (level === 1) {
    props = update(props, {
      className: { $set: 'first-level-class' }
    });
  }

  return React.createElement(tag, props, children);
}

describe('Markdown tests', () => {
  it('should work with headers', () => {
    assert.equal(
      render('# This is an <h1> tag\n## This is an <h2> tag\n###### This is an <h6> tag'),
      '<span><h1>This is an &lt;h1&gt; tag</h1><h2>This is an &lt;h2&gt; tag</h2><h6>This is an &lt;h6&gt; tag</h6></span>'
    );
  });

  it('should work with emphasis', () => {
    assert.equal(
      render('*This text will be italic*\n_This will also be italic_\n\n**This text will be bold**\n__This will also be bold__\n\n*You **can** combine them*'),
      '<span><p><em>This text will be italic</em>\n<em>This will also be italic</em></p><p><strong>This text will be bold</strong>\n<strong>This will also be bold</strong></p><p><em>You <strong>can</strong> combine them</em></p></span>'
    );
  });

  it('should work with unordered lists', () => {
    assert.equal(
      render('* Item 1\n* Item 2\n  * Item 2a\n  * Item 2b'),
      '<span><ul><li>Item 1</li><li>Item 2<ul><li>Item 2a</li><li>Item 2b</li></ul></li></ul></span>'
    );
  });

  it('should work with ordered lists', () => {
    assert.equal(
      render('1. Item 1\n2. Item 2\n3. Item 3\n   * Item 3a\n   * Item 3b'),
      '<span><ol><li>Item 1</li><li>Item 2</li><li>Item 3<ul><li>Item 3a</li><li>Item 3b</li></ul></li></ol></span>'
    );
  });

  it('should work with images', () => {
    assert.equal(
      render('![GitHub Logo](/images/logo.png)\nFormat: ![Alt Text](url)'),
      '<span><p><img src="/images/logo.png" alt="GitHub Logo"/>\nFormat: <img src="url" alt="Alt Text"/></p></span>'
    );
  });

  it('should work with links', () => {
    assert.equal(
      render('Here is [some link](http://some-url.com).'),
      '<span><p>Here is <a href="http://some-url.com">some link</a>.</p></span>'
    );
  });

  it('should work with "tel:" links', () => {
    assert.equal(
      render('toll-free [1-800-000-0000](tel:180000000 "Contact phone number:180000000")'),
      '<span><p>toll-free <a href="tel:180000000" title="Contact phone number:180000000">1-800-000-0000</a></p></span>'
    );
  });

  it('should work with blockquotes', () => {
    assert.equal(
      render('As Kanye West said:\n\n> We\'re living the future so\n> the present is our past.'),
      '<span><p>As Kanye West said:</p><blockquote><p>We&#x27;re living the future so\nthe present is our past.</p></blockquote></span>'
    );
  });

  it('should work with inline code', () => {
    assert.equal(
      render('I think you should use an `<addr>` element here instead.'),
      '<span><p>I think you should use an <code>&lt;addr&gt;</code> element here instead.</p></span>'
    );
  });

  it('should work with tables', () => {
    assert.equal(
      render('| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n'),
      '<span><table><thead><tr><th>Option</th><th>Description</th></tr></thead><tbody><tr><td>data</td><td>path to data files to supply the data that will be passed into templates.</td></tr><tr><td>engine</td><td>engine to be used for processing templates. Handlebars is the default.</td></tr><tr><td>ext</td><td>extension to be used for dest files.</td></tr></tbody></table></span>'
    );
  });

  it('should work with indented code', () => {
    assert.equal(
      render('Indented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code'),
      '<span><p>Indented code</p><pre><code>// Some comments\nline 1 of code\nline 2 of code\nline 3 of code</code></pre></span>'
    );
  });

  it('should work with block code', () => {
    assert.equal(
      render('Block code "fences"\n\n```\nSample text here...\n```\n'),
      '<span><p>Block code &quot;fences&quot;</p><pre><code>Sample text here...\n</code></pre></span>'
    );
  });

  it('should work with highlighted code', () => {
    assert.equal(
      render('Syntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```'),
      '<span><p>Syntax highlighting</p><pre><code data-language="js">var foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n</code></pre></span>'
    );
  });

  it('should work with enabled typographer', () => {
    assert.equal(
      render('## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'',
        {markdownOptions: {typographer: true}}),
      '<span><h2>Typographic replacements</h2><p>Enable typographer option to see result.</p><p>© © ® ® ™ ™ § § ±</p><p>test… test… test… test?.. test!..</p><p>!!! ??? ,  – —</p><p>“Smartypants, double quotes” and ‘single quotes’</p></span>'
    );
  });

  it('should work with disabled typographer', () => {
    assert.equal(
      render('## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'',
        {markdownOptions: {typographer: false}}),
      '<span><h2>Typographic replacements</h2><p>Enable typographer option to see result.</p><p>(c) (C) (r) (R) (tm) (TM) (p) (P) +-</p><p>test.. test... test..... test?..... test!....</p><p>!!!!!! ???? ,,  -- ---</p><p>&quot;Smartypants, double quotes&quot; and &#x27;single quotes&#x27;</p></span>'
    );
  });
});

describe('Markdown plugins', () => {
  it('should work with emoji', () => {
    assert.equal(
      render(':) 8-)',
        {plugins: [plugins.emoji]}),
      '<span><p>😃 😎</p></span>'
    );
  });

  it('should work with container', () => {
    assert.equal(
      render('::: warning\n*here be dragons*\n:::',
        {plugins: [{plugin: plugins.container, args: ['warning']}]}),
      '<span><div data-info="warning"><p><em>here be dragons</em></p></div></span>'
    );
  });

  /* TODO: footnote and other plugins */


});

// Markdown-React

describe('Markdown-React options tests', () => {
  it('should render tags with custom props', () => {
    assert.equal(
      render('Here is [some link with class](SOME_URL).', { onIterate: linkCallback }),
      '<span><p>Here is <a href="http://real-url.com" class="link-class">some link with class</a>.</p></span>'
    );
  });

  it('should forward additional props to createElement/onIterate', () => {
    let someProp1;
    let someProp2;
    const onIterate = (tag, props) => {
      someProp1 = props.someProp1;
      someProp2 = props.someProp2;
      return createElement(tag, props);
    };
    const render = mdReact({ onIterate })
    render('Something', { someProp1: 1, someProp2: 2 });
    assert.equal(someProp1, 1);
    assert.equal(someProp2, 2);
    render('Something', { someProp1: 3, someProp2: 4 });
    assert.equal(someProp1, 3);
    assert.equal(someProp2, 4);
  });

  it('should distinct tags depending on level', () => {
    assert.equal(
      render('This node has custom class, **but not this node**.', { onIterate: firstLevelCallback }),
      '<span><p class="first-level-class">This node has custom class, <strong>but not this node</strong>.</p></span>'
    );
  });

  it('should replace tags', () => {
    assert.equal(
      render('This text uses **“i” and “b” tags** instead of *“em” and “strong” tags*.', {tags: { 'html': 'span', 'em': 'i', 'strong': 'b' }}),
      '<span><p>This text uses <b>“i” and “b” tags</b> instead of <i>“em” and “strong” tags</i>.</p></span>'
    );
  });
});
