'use strict';

import { markdown } from 'markdown';
import React from 'react';
import isPlainObject from 'lodash/lang/isPlainObject';
import assign from 'lodash/object/assign';

const DEFAULT_TAGS = {
  'html': 'span'
};

function iterateTree(tree, options={}, level=0, index=0) {
  let tag = tree.shift();
  const key = `mdrct-${index}`;
  const { onIterate, tags=DEFAULT_TAGS } = options;

  const props = (tree.length && isPlainObject(tree[0])) ?
    assign(tree.shift(), { key }) :
    { key };

  const children = tree.map(
    (branch, idx) => Array.isArray(branch) ?
      iterateTree(branch, options, level + 1, idx) :
      branch
  );

  tag = tags[tag] || tag;

  return (typeof onIterate === 'function') ?
    onIterate(tag, props, children, level) :
    React.createElement(tag, props, children);
}

export default function(text, options) {
  const tree = markdown.toHTMLTree(text);

  return iterateTree(tree, options);
}