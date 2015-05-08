'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _markdown = require('markdown');

var _React$PropTypes$Component = require('react');

var _React$PropTypes$Component2 = _interopRequireDefault(_React$PropTypes$Component);

var _isPlainObject = require('lodash/lang/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

'use strict';

var DEFAULT_TAGS = {
  html: 'span'
};

function mdReactFactory() {
  var options = arguments[0] === undefined ? {} : arguments[0];
  var onIterate = options.onIterate;
  var _options$tags = options.tags;
  var tags = _options$tags === undefined ? DEFAULT_TAGS : _options$tags;
  var dialect = options.dialect;
  var markdownOptions = options.markdownOptions;

  function iterateTree(tree) {
    var level = arguments[1] === undefined ? 0 : arguments[1];
    var index = arguments[2] === undefined ? 0 : arguments[2];

    var tag = tree.shift();
    var key = 'mdrct-' + index;

    var props = tree.length && _isPlainObject2['default'](tree[0]) ? _assign2['default'](tree.shift(), { key: key }) : { key: key };

    var children = tree.map(function (branch, idx) {
      return Array.isArray(branch) ? iterateTree(branch, level + 1, idx) : branch;
    });

    tag = tags[tag] || tag;

    return typeof onIterate === 'function' ? onIterate(tag, props, children, level) : _React$PropTypes$Component2['default'].createElement(tag, props, children);
  }

  return function (text) {
    var tree = _markdown.markdown.toHTMLTree(text, dialect, markdownOptions);

    return iterateTree(tree);
  };
}

var MDReactComponent = (function (_Component) {
  function MDReactComponent() {
    _classCallCheck(this, MDReactComponent);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(MDReactComponent, _Component);

  _createClass(MDReactComponent, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var onIterate = _props.onIterate;
      var tags = _props.tags;
      var text = _props.text;
      var dialect = _props.dialect;
      var markdownOptions = _props.markdownOptions;

      return mdReactFactory({ onIterate: onIterate, tags: tags, dialect: dialect, markdownOptions: markdownOptions })(text);
    }
  }], [{
    key: 'propTypes',
    value: {
      text: _React$PropTypes$Component.PropTypes.string.isRequired,
      onIterate: _React$PropTypes$Component.PropTypes.func,
      tags: _React$PropTypes$Component.PropTypes.object,
      dialect: _React$PropTypes$Component.PropTypes.string,
      markdownOptions: _React$PropTypes$Component.PropTypes.object
    },
    enumerable: true
  }]);

  return MDReactComponent;
})(_React$PropTypes$Component.Component);

exports['default'] = MDReactComponent;
exports.mdReact = mdReactFactory;