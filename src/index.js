'use strict';

import markdown from 'markdown-it';
import React, { PropTypes, Component } from 'react';
import isPlainObject from 'lodash/lang/isPlainObject';
import assign from 'lodash/object/assign';
import reduce from 'lodash/collection/reduce';
import zipObject from 'lodash/array/zipObject';
import sortBy from 'lodash/collection/sortBy';

const DEFAULT_TAGS = {
  'html': 'span'
};

function convertTree(tokens, nested) {
  let branch = [];

  if (!nested) {
    branch.push('html');
  }

  function getBlock(tkn, tkns) {
    const block = [];
    block.push(tkn.tag);
    if (tkn.attrs) {
      const attrs = zipObject(sortBy(tkn.attrs, 0));

      if (attrs.alt === '') {
        attrs.alt = tkn.children[0].content;
      }

      block.push(attrs);
    }

    if (tkn.content && !tkn.children) {
      block.push(tkn.content);
      return block;
    }

    return block.concat(convertTree(tkns, true));
  }

  let token = tokens.shift();
  while (token && token.nesting !== -1) {
    if (token.nesting === 1) {
      if (token.hidden) {
        branch = branch.concat(convertTree(tokens, true));
      } else {
        branch.push(getBlock(token, tokens));
      }
    }

    if (token.nesting === 0) {
      if (token.type === 'inline') {
        branch = branch.concat(convertTree(token.children, true));
      } else if (token.type === 'text') {
        branch.push(token.content);
      } else if (token.type === 'softbreak') {
        branch.push('\n');
      } else {
        branch.push(getBlock(token, tokens));
      }
    }
    token = tokens.shift();
  }
  return branch;
}

function mdReactFactory(options={}) {
  const { onIterate, tags=DEFAULT_TAGS,
    presetName, markdownOptions,
    enableRules=[], disableRules=[], plugins=[] } = options;

  let md = markdown(presetName, markdownOptions)
    .enable(enableRules)
    .disable(disableRules);

  md = reduce(plugins, (m, plugin) => m.use(plugin), md);

  function iterateTree(tree, level=0, index=0) {
    let tag = tree.shift();
    const key = `mdrct-${index}`;

    const props = (tree.length && isPlainObject(tree[0])) ?
      assign(tree.shift(), { key }) :
      { key };

    const children = tree.map(
      (branch, idx) => Array.isArray(branch) ?
        iterateTree(branch, level + 1, idx) :
        branch
    );

    tag = tags[tag] || tag;

    return (typeof onIterate === 'function') ?
      onIterate(tag, props, children, level) :
      React.createElement(tag, props, children);
  }

  return function(text) {
    const tree = convertTree(md.parse(text));
    return iterateTree(tree);
  };
}

class MDReactComponent extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onIterate: PropTypes.func,
    tags: PropTypes.object,
    presetName: PropTypes.string,
    markdownOptions: PropTypes.object,
    enableRules: PropTypes.array,
    disableRules: PropTypes.array,
    plugins: PropTypes.array
  }

  render() {
    const { text, ...props } = this.props;
    return mdReactFactory(props)(text);
  }
}

export default MDReactComponent;
export { mdReactFactory as mdReact };
