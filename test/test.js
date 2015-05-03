'use strict';

import { assert } from 'chai';
import { describe, it } from 'mocha';
import { mdReact } from '../src/index';
import React, { renderToStaticMarkup } from 'react';
import update from 'react/lib/update';

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
      '<span><p><img alt="GitHub Logo" src="/images/logo.png">\nFormat: <img alt="Alt Text" src="url"></p></span>'
    );
  });

  it('should work with links', () => {
    assert.equal(
      render('Here is [some link](http://some-url.com).'),
      '<span><p>Here is <a href="http://some-url.com">some link</a>.</p></span>'
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
});

// Markdown-React

describe('Markdown-React options tests', () => {
  it('should render tags with custom props', () => {
    assert.equal(
      render('Here is [some link with class](SOME_URL).', { onIterate: linkCallback }),
      '<span><p>Here is <a href="http://real-url.com" class="link-class">some link with class</a>.</p></span>'
    );

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