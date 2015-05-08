'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _markdown = require('markdown-it');

var _markdown2 = _interopRequireDefault(_markdown);

var _React$PropTypes$Component = require('react');

var _React$PropTypes$Component2 = _interopRequireDefault(_React$PropTypes$Component);

var _isPlainObject = require('lodash/lang/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _reduce = require('lodash/collection/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _zipObject = require('lodash/array/zipObject');

var _zipObject2 = _interopRequireDefault(_zipObject);

var _sortBy = require('lodash/collection/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

'use strict';

var DEFAULT_TAGS = {
  html: 'span'
};

function convertTree(tokens, nested) {
  var branch = [];

  if (!nested) {
    branch.push('html');
  }

  function getBlock(tkn, tkns) {
    var block = [];
    block.push(tkn.tag);
    if (tkn.attrs) {
      var attrs = _zipObject2['default'](_sortBy2['default'](tkn.attrs, 0));

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

  var token = tokens.shift();
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

function mdReactFactory() {
  var options = arguments[0] === undefined ? {} : arguments[0];
  var onIterate = options.onIterate;
  var _options$tags = options.tags;
  var tags = _options$tags === undefined ? DEFAULT_TAGS : _options$tags;
  var presetName = options.presetName;
  var markdownOptions = options.markdownOptions;
  var _options$enableRules = options.enableRules;
  var enableRules = _options$enableRules === undefined ? [] : _options$enableRules;
  var _options$disableRules = options.disableRules;
  var disableRules = _options$disableRules === undefined ? [] : _options$disableRules;
  var _options$plugins = options.plugins;
  var plugins = _options$plugins === undefined ? [] : _options$plugins;

  var md = _markdown2['default'](presetName, markdownOptions).enable(enableRules).disable(disableRules);

  md = _reduce2['default'](plugins, function (m, plugin) {
    return m.use(plugin);
  }, md);

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
    var tree = convertTree(md.parse(text));
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
      var text = _props.text;

      var props = _objectWithoutProperties(_props, ['text']);

      return mdReactFactory(props)(text);
    }
  }], [{
    key: 'propTypes',
    value: {
      text: _React$PropTypes$Component.PropTypes.string.isRequired,
      onIterate: _React$PropTypes$Component.PropTypes.func,
      tags: _React$PropTypes$Component.PropTypes.object,
      presetName: _React$PropTypes$Component.PropTypes.string,
      markdownOptions: _React$PropTypes$Component.PropTypes.object,
      enableRules: _React$PropTypes$Component.PropTypes.array,
      disableRules: _React$PropTypes$Component.PropTypes.array,
      plugins: _React$PropTypes$Component.PropTypes.array
    },
    enumerable: true
  }]);

  return MDReactComponent;
})(_React$PropTypes$Component.Component);

exports['default'] = MDReactComponent;
exports.mdReact = mdReactFactory;