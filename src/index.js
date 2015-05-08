'use strict';

import markdown from 'markdown-it';
import React, { PropTypes, Component } from 'react';
import isPlainObject from 'lodash/lang/isPlainObject';
import assign from 'lodash/object/assign';
import reduce from 'lodash/collection/reduce';

const DEFAULT_TAGS = {
  '': 'span'
};

function mdReactFactory(options={}) {
  const { onIterate, tags=DEFAULT_TAGS,
    presetName, markdownOptions,
    enableRules=[], disableRules=[], plugins=[] } = options;

  let md = markdown(presetName, markdownOptions)
    .enable(enableRules)
    .disable(disableRules);

  md = reduce(plugins, (m, plugin) => m.use(plugin), md);

  function iterateTree(token, level=0, index=0) {
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
    const tree = md.parse(text);
    console.log(tree);
    return iterateTree(tree);
  };
}

class MDReactComponent extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onIterate: PropTypes.func,
    tags: PropTypes.object,
    dialect: PropTypes.string,
    markdownOptions: PropTypes.object
  }

  render() {
    const { onIterate, tags, text, dialect, markdownOptions } = this.props;

    return mdReactFactory({ onIterate, tags, dialect, markdownOptions })(text);
  }
}

export default MDReactComponent;
export { mdReactFactory as mdReact };
