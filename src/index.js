'use strict';

import React, { Component } from 'react/addons';
import Playground from 'component-playground';
import componentExample from 'raw!../examples/component.example';
import MDReactComponent from 'markdown-react-js';

class Index extends Component {
  render() {
    return (
      <div className="component-documentation">
        <Playground codeText={componentExample} scope={{ React, MDReactComponent }} />
      </div>
    );
  }
}

React.render(<Index/>, document.getElementById('root'));