'use strict';

import { markdown } from 'markdown';
import React, { PropTypes, Component } from 'react';
import isPlainObject from 'lodash/lang/isPlainObject';
import assign from 'lodash/object/assign';

const DEFAULT_TAGS = {
  'html': 'span'
};

function mdReactFactory(options={}) {
  const { onIterate, tags=DEFAULT_TAGS, dialect, markdownOptions } = options;

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
    const tree = markdown.toHTMLTree(text, dialect, markdownOptions);

    return iterateTree(tree);
  };
}

class MDReactComponent extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onIterate: PropTypes.func,
    tags: PropTypes.object
  }

  render() {
    const { onIterate, tags, text } = this.props;

    return mdReactFactory({ onIterate, tags })(text);
  }
}

export default MDReactComponent;
export { mdReactFactory as mdReact };
