/**
 * class Renderer
 *
 * Generates AST from parsed token stream.
 *
 **/

'use strict';

import assign from 'lodash/object/assign';

////////////////////////////////////////////////////////////////////////////////

const DEFAULT_RULES = {
  code_inline(tokens, idx /*, options, env */) {
    return ['code', [tokens[idx].content]];
  },
  
  code_block(tokens, idx /*, options, env */) {
    return [
      'pre',
      [
        ['code', [tokens[idx].content]]
      ]
    ];
  },

  fence(tokens, idx, options, env, self) {
    var token = tokens[idx],
        langName = '',
        highlighted;

    if (token.info) {
      langName = token.info.trim().split(/\s+/g)[0];
      token.attrPush([ 'class', options.langPrefix + langName ]);
    }

    if (options.highlight) {
      highlighted = options.highlight(token.content, langName) || token.content;
    } else {
      highlighted = token.content;
    }

    return [
      'pre',
      [
        ['code', self.renderAttrs(token), highlighted]
      ]
    ];
  },

  image(tokens, idx, options, env, self) {
    var token = tokens[idx];

    // "alt" attr MUST be set, even if empty. Because it's mandatory and
    // should be placed on proper position for tests.
    //
    // Replace content with actual value

    token.attrs[token.attrIndex('alt')][1] =
      self.renderInlineAsText(token.children, options, env);

    return self.renderToken(tokens, idx, options);
  },

  hardbreak(tokens, idx, options /*, env */) {
    return ['br'];
  },

  softbreak(tokens, idx, options /*, env */) {
    return options.breaks ? ['br'] : '\n';
  },

  text(tokens, idx /*, options, env */) {
    return tokens[idx].content;
  },

  html_block(tokens, idx /*, options, env */) {
    return tokens[idx].content;
  },

  html_inline(tokens, idx /*, options, env */) {
    return tokens[idx].content;
  }
};


/**
 * new Renderer()
 *
 * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
 **/
class Renderer {

  /**
   * Renderer#rules -> Object
   *
   * Contains render rules for tokens. Can be updated and extended.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.renderer.rules.strong_open () { return '<b>'; };
   * md.renderer.rules.strong_close() { return '</b>'; };
   *
   * var result = md.renderInline(...);
   * ```
   *
   * Each rule is called as independed static function with fixed signature:
   *
   * ```javascript
   * function my_token_render(tokens, idx, options, env, renderer) {
   *   // ...
   *   return renderedHTML;
   * }
   * ```
   *
   * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
   * for more details and examples.
   **/
  constructor() {
    this.rules = assign({}, DEFAULT_RULES);
  }


  /**
   * Renderer.renderAttrs(token) -> Object
   *
   * Render token attributes to object.
   **/
  renderAttrs(token) {
    var i, l, result = {};

    if (!token.attrs) { return null; }

    for (i = 0, l = token.attrs.length; i < l; i++) {
      result[token.attrs[i][0]] = token.attrs[i][1];
    }

    return result;
  }


  /**
   * Renderer.renderToken(tokens, idx, options) -> String
   * - tokens (Array): list of tokens
   * - idx (Numbed): token index to render
   * - options (Object): params of parser instance
   *
   * Default token renderer. Can be overriden by custom function
   * in [[Renderer#rules]].
   **/
  renderToken(tokens, idx, options) {
    var nextToken,
        results = [],
        result = [],
        needLf = false,
        token = tokens[idx];

    // Tight list paragraphs
    if (token.hidden) {
      return [];
    }

    if (token.nesting === -1) {
      return null;
    }

    // Insert a newline between hidden paragraph and subsequent opening
    // block-level tag.
    //
    // For example, here we should insert a newline before blockquote:
    //  - a
    //    >
    //
    if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
      results.push('\n');
    }

    // Add token name, e.g. `<img`
    result[0] = token.tag;

    // Encode attributes, e.g. `<img src="foo"`
    var attrs = this.renderAttrs(token);
    if (attrs) {
      result[1] = attrs;
    }

    // Check if we need to add a newline after this tag
    if (token.block) {
      needLf = true;

      if (token.nesting === 1) {
        if (idx + 1 < tokens.length) {
          nextToken = tokens[idx + 1];

          if (nextToken.type === 'inline' || nextToken.hidden) {
            // Block-level tag containing an inline tag.
            //
            needLf = false;

          } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
            // Opening tag + closing tag of the same type. E.g. `<li></li>`.
            //
            needLf = false;
          }
        }
      }
    }

    results.push(result);

    if (needLf) results.push('\n');

    return results;
  }


/**
 * Renderer.renderInline(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * The same as [[Renderer.render]], but for single token of `inline` type.
 **/
  renderInline(tokens, options, env) {
    var type,
        result = '',
        rules = this.rules;

    for (var i = 0, len = tokens.length; i < len; i++) {
      type = tokens[i].type;

      if (typeof rules[type] !== 'undefined') {
        result += rules[type](tokens, i, options, env, this);
      } else {
        result += this.renderToken(tokens, i, options);
      }
    }

    return result;
  };


/** internal
 * Renderer.renderInlineAsText(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Special kludge for image `alt` attributes to conform CommonMark spec.
 * Don't try to use it! Spec requires to show `alt` content with stripped markup,
 * instead of simple escaping.
 **/
  renderInlineAsText(tokens, options, env) {
    var result = '',
        rules = this.rules;

    for (var i = 0, len = tokens.length; i < len; i++) {
      if (tokens[i].type === 'text') {
        result += rules.text(tokens, i, options, env, this);
      } else if (tokens[i].type === 'image') {
        result += this.renderInlineAsText(tokens[i].children, options, env);
      }
    }

    return result;
  }


/**
 * Renderer.render(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Takes token stream and generates HTML. Probably, you will never need to call
 * this method directly.
 **/
  render(tokens, options, env) {
    var i, len, type,
        result = '',
        rules = this.rules;

    for (i = 0, len = tokens.length; i < len; i++) {
      type = tokens[i].type;

      if (type === 'inline') {
        result += this.renderInline(tokens[i].children, options, env);
      } else if (typeof rules[type] !== 'undefined') {
        result += rules[tokens[i].type](tokens, i, options, env, this);
      } else {
        result += this.renderToken(tokens, i, options, env);
      }
    }

    return result;
  }
}

export default Renderer;