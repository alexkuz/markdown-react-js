'use strict';

import React, { Component } from 'react/addons';
import Playground from 'component-playground';
import componentExample from 'raw!../examples/component.example';
import MDReactComponent from 'markdown-react-js';
import __markdownText__ from 'raw!../examples/demo.md';

const __plugins__ = {
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

class Index extends Component {
  render() {
    return (
      <div className="component-documentation">
        <Playground codeText={componentExample}
                    es6Console
                    scope={{ React, MDReactComponent, __markdownText__, __plugins__ }} />
      </div>
    );
  }
}

React.render(<Index/>, document.getElementById('root'));