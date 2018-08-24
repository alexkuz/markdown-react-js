'use strict';

import markdown from 'markdown-it';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isPlainObject from 'lodash/isPlainObject';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import zipObject from 'lodash/zipObject';
import sortBy from 'lodash/sortBy';
import compact from 'lodash/compact';
import camelCase from 'lodash/camelCase';
import isString from 'lodash/isString';


const DEFAULT_TAGS = {
  'html': 'span'
};

const DEFAULT_RULES = {
  image(token, attrs, children) {
    if (children.length) {
      attrs = assign({}, attrs, { alt: children[0] });
    }
    return [[token.tag, attrs]];
  },

  codeInline(token, attrs) {
    return [compact([token.tag, attrs, token.content])];
  },

  codeBlock(token, attrs) {
    return [['pre', compact([token.tag, attrs, token.content])]];
  },

  fence(token, attrs) {
    if (token.info) {
      const langName = token.info.trim().split(/\s+/g)[0];
      attrs = assign({}, attrs, { 'data-language': langName });
    }

    return [['pre', compact([token.tag, attrs, token.content])]];
  },

  hardbreak() {
    return [['br']];
  },

  softbreak(token, attrs, children, options) {
    return options.breaks ? [['br']] : '\n';
  },

  text(token) {
    return token.content;
  },

  htmlBlock(token) {
    return token.content;
  },

  htmlInline(token) {
    return token.content;
  },

  inline(token, attrs, children) {
    return children;
  },

  default(token, attrs, children, options, getNext) {
    if (token.nesting === 1 && token.hidden) {
      return getNext();
    }
    /* plugin-related */
    if (!token.tag) {
      return token.content;
    }
    if (token.info) {
      attrs = assign({}, attrs, { 'data-info': token.info.trim() });
    }
    /* plugin-related */
    return [compact([token.tag, attrs].concat((token.nesting === 1) && getNext()))];
  }
};

function convertTree(tokens, convertRules, options) {
  function convertBranch(tkns, nested) {
    let branch = [];

    if (!nested) {
      branch.push('html');
    }

    function getNext() {
      return convertBranch(tkns, true);
    }

    let token = tkns.shift();
    while (token && token.nesting !== -1) {
      const attrs = token.attrs && zipObject(sortBy(token.attrs, 0));
      const children = token.children && convertBranch(token.children.slice(), true);
      const rule = convertRules[camelCase(token.type)] || convertRules.default;

      branch = branch.concat(
        rule(token, attrs, children, options, getNext)
      );
      token = tkns.shift();
    }
    return branch;
  }

  return convertBranch(tokens, false);
}

function mdReactFactory(options={}) {
  const { onIterate, tags=DEFAULT_TAGS,
    presetName, markdownOptions,
    enableRules=[], disableRules=[], plugins=[],
    onGenerateKey=(tag, index) => `mdrct-${tag}-${index}`,
    className } = options;

  let md = markdown(presetName || 'default', markdownOptions)
    .enable(enableRules)
    .disable(disableRules);

  const convertRules = assign({}, DEFAULT_RULES, options.convertRules);

  md = reduce(plugins, (m, plugin) =>
    plugin.plugin ?
    m.use(plugin.plugin, ...plugin.args) :
    m.use(plugin),
    md
  );

  let defaultProps;

  function iterateTree(tree, level=0, index=0) {
    let tag = tree.shift();
    const key = onGenerateKey(tag, index);
    const props = { ...defaultProps, key };

    if (tree.length && isPlainObject(tree[0])) {
      assign(props, tree.shift());
    }

    if (level === 0 && className) {
      props.className = className;
    }

    let children = tree.map(
      (branch, idx) => Array.isArray(branch) ?
        iterateTree(branch, level + 1, idx) :
        branch
    );

    // Don't pass empty children array to void elements like img,
    // otherwise react will warn you.
    if (!children.length) {
      children = undefined;
    }

    tag = tags[tag] || tag;

    if (isString(props.style)) {
      props.style = zipObject(
        props.style.split(';')
          .map(prop => prop.split(':'))
          .map(keyVal => [camelCase(keyVal[0].trim()), keyVal[1].trim()])
      );
    }

    return (typeof onIterate === 'function') ?
      onIterate(tag, props, children, level) :
      React.createElement(tag, props, children);
  }

  return function(text, props) {
    defaultProps = props;
    const tree = convertTree(md.parse(text, {}), convertRules, md.options);
    return iterateTree(tree);
  };
}

class MDReactComponent extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onIterate: PropTypes.func,
    onGenerateKey: PropTypes.func,
    tags: PropTypes.object,
    presetName: PropTypes.string,
    markdownOptions: PropTypes.object,
    enableRules: PropTypes.array,
    disableRules: PropTypes.array,
    convertRules: PropTypes.object,
    plugins: PropTypes.array,
    className: PropTypes.string
  }

  render() {
    const { text, ...props } = this.props;
    return mdReactFactory(props)(text);
  }
}

export default MDReactComponent;
export { mdReactFactory as mdReact };
