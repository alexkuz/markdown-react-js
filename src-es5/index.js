'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodashLangIsPlainObject = require('lodash/lang/isPlainObject');

var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashCollectionReduce = require('lodash/collection/reduce');

var _lodashCollectionReduce2 = _interopRequireDefault(_lodashCollectionReduce);

var _lodashArrayZipObject = require('lodash/array/zipObject');

var _lodashArrayZipObject2 = _interopRequireDefault(_lodashArrayZipObject);

var _lodashCollectionSortBy = require('lodash/collection/sortBy');

var _lodashCollectionSortBy2 = _interopRequireDefault(_lodashCollectionSortBy);

var _lodashArrayCompact = require('lodash/array/compact');

var _lodashArrayCompact2 = _interopRequireDefault(_lodashArrayCompact);

var _lodashStringCamelCase = require('lodash/string/camelCase');

var _lodashStringCamelCase2 = _interopRequireDefault(_lodashStringCamelCase);

var _lodashLangIsString = require('lodash/lang/isString');

var _lodashLangIsString2 = _interopRequireDefault(_lodashLangIsString);

'use strict';

var DEFAULT_TAGS = {
  'html': 'span'
};

var DEFAULT_RULES = {
  image: function image(token, attrs, children) {
    if (children.length) {
      attrs = _lodashObjectAssign2['default']({}, attrs, { alt: children[0] });
    }
    return [[token.tag, attrs]];
  },

  codeInline: function codeInline(token, attrs) {
    return [_lodashArrayCompact2['default']([token.tag, attrs, token.content])];
  },

  codeBlock: function codeBlock(token, attrs) {
    return [['pre', _lodashArrayCompact2['default']([token.tag, attrs, token.content])]];
  },

  fence: function fence(token, attrs) {
    if (token.info) {
      var langName = token.info.trim().split(/\s+/g)[0];
      attrs = _lodashObjectAssign2['default']({}, attrs, { 'data-language': langName });
    }

    return [['pre', _lodashArrayCompact2['default']([token.tag, attrs, token.content])]];
  },

  hardbreak: function hardbreak() {
    return [['br']];
  },

  softbreak: function softbreak(token, attrs, children, options) {
    return options.breaks ? [['br']] : '\n';
  },

  text: function text(token) {
    return token.content;
  },

  htmlBlock: function htmlBlock(token) {
    return token.content;
  },

  htmlInline: function htmlInline(token) {
    return token.content;
  },

  inline: function inline(token, attrs, children) {
    return children;
  },

  'default': function _default(token, attrs, children, options, getNext) {
    if (token.nesting === 1 && token.hidden) {
      return getNext();
    }
    /* plugin-related */
    if (!token.tag) {
      return token.content;
    }
    if (token.info) {
      attrs = _lodashObjectAssign2['default']({}, attrs, { 'data-info': token.info.trim() });
    }
    /* plugin-related */
    return [_lodashArrayCompact2['default']([token.tag, attrs].concat(token.nesting === 1 && getNext()))];
  }
};

function convertTree(tokens, convertRules, options) {
  function convertBranch(tkns, nested) {
    var branch = [];

    if (!nested) {
      branch.push('html');
    }

    function getNext() {
      return convertBranch(tkns, true);
    }

    var token = tkns.shift();
    while (token && token.nesting !== -1) {
      var attrs = token.attrs && _lodashArrayZipObject2['default'](_lodashCollectionSortBy2['default'](token.attrs, 0));
      var children = token.children && convertBranch(token.children.slice(), true);
      var rule = convertRules[_lodashStringCamelCase2['default'](token.type)] || convertRules['default'];

      branch = branch.concat(rule(token, attrs, children, options, getNext));
      token = tkns.shift();
    }
    return branch;
  }

  return convertBranch(tokens, false);
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
  var _options$onGenerateKey = options.onGenerateKey;
  var onGenerateKey = _options$onGenerateKey === undefined ? function (tag, index) {
    return 'mdrct-' + tag + '-' + index;
  } : _options$onGenerateKey;

  var md = _markdownIt2['default'](markdownOptions || presetName).enable(enableRules).disable(disableRules);

  var convertRules = _lodashObjectAssign2['default']({}, DEFAULT_RULES, options.convertRules);

  md = _lodashCollectionReduce2['default'](plugins, function (m, plugin) {
    return plugin.plugin ? m.use.apply(m, [plugin.plugin].concat(_toConsumableArray(plugin.args))) : m.use(plugin);
  }, md);

  function iterateTree(tree) {
    var level = arguments[1] === undefined ? 0 : arguments[1];
    var index = arguments[2] === undefined ? 0 : arguments[2];

    var tag = tree.shift();
    var key = onGenerateKey(tag, index);

    var props = tree.length && _lodashLangIsPlainObject2['default'](tree[0]) ? _lodashObjectAssign2['default'](tree.shift(), { key: key }) : { key: key };

    var children = tree.map(function (branch, idx) {
      return Array.isArray(branch) ? iterateTree(branch, level + 1, idx) : branch;
    });

    tag = tags[tag] || tag;

    if (_lodashLangIsString2['default'](props.style)) {
      props.style = _lodashArrayZipObject2['default'](props.style.split(';').map(function (prop) {
        return prop.split(':');
      }).map(function (keyVal) {
        return [_lodashStringCamelCase2['default'](keyVal[0].trim()), keyVal[1].trim()];
      }));
    }

    return typeof onIterate === 'function' ? onIterate(tag, props, children, level) : _react2['default'].createElement(tag, props, children);
  }

  return function (text) {
    var tree = convertTree(md.parse(text, {}), convertRules, md.options);
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
      text: _react.PropTypes.string.isRequired,
      onIterate: _react.PropTypes.func,
      onGenerateKey: _react.PropTypes.func,
      tags: _react.PropTypes.object,
      presetName: _react.PropTypes.string,
      markdownOptions: _react.PropTypes.object,
      enableRules: _react.PropTypes.array,
      disableRules: _react.PropTypes.array,
      convertRules: _react.PropTypes.object,
      plugins: _react.PropTypes.array
    },
    enumerable: true
  }]);

  return MDReactComponent;
})(_react.Component);

exports['default'] = MDReactComponent;
exports.mdReact = mdReactFactory;