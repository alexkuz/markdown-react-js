/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "add80cb0807caa4c186e"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._acceptedDependencies[dep[i]] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0; { // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(+id);
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = +id;
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _React$Component = __webpack_require__(8);

	var _React$Component2 = _interopRequireDefault(_React$Component);

	var _Playground = __webpack_require__(54);

	var _Playground2 = _interopRequireDefault(_Playground);

	var _componentExample = __webpack_require__(174);

	var _componentExample2 = _interopRequireDefault(_componentExample);

	var _MDReactComponent = __webpack_require__(169);

	var _MDReactComponent2 = _interopRequireDefault(_MDReactComponent);

	var _markdownText__ = __webpack_require__(175);

	var _markdownText__2 = _interopRequireDefault(_markdownText__);

	'use strict';

	var __plugins__ = {
	  abbr: __webpack_require__(104),
	  container: __webpack_require__(105),
	  deflist: __webpack_require__(106),
	  emoji: __webpack_require__(107),
	  footnote: __webpack_require__(112),
	  ins: __webpack_require__(113),
	  mark: __webpack_require__(114),
	  sub: __webpack_require__(115),
	  sup: __webpack_require__(116)
	};

	var Index = (function (_Component) {
	  function Index() {
	    _classCallCheck(this, Index);

	    if (_Component != null) {
	      _Component.apply(this, arguments);
	    }
	  }

	  _inherits(Index, _Component);

	  _createClass(Index, [{
	    key: 'render',
	    value: function render() {
	      return _React$Component2['default'].createElement(
	        'div',
	        { className: 'component-documentation' },
	        _React$Component2['default'].createElement(_Playground2['default'], { codeText: _componentExample2['default'],
	          es6Console: true,
	          scope: { React: _React$Component2['default'], MDReactComponent: _MDReactComponent2['default'], __markdownText__: _markdownText__2['default'], __plugins__: __plugins__ } })
	      );
	    }
	  }]);

	  return Index;
	})(_React$Component.Component);

	_React$Component2['default'].render(_React$Component2['default'].createElement(Index, null), document.getElementById('root'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Utilities
	//
	'use strict';


	function _class(obj) { return Object.prototype.toString.call(obj); }

	function isString(obj) { return _class(obj) === '[object String]'; }

	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	function has(object, key) {
	  return _hasOwnProperty.call(object, key);
	}

	// Merge objects
	//
	function assign(obj /*from1, from2, from3, ...*/) {
	  var sources = Array.prototype.slice.call(arguments, 1);

	  sources.forEach(function (source) {
	    if (!source) { return; }

	    if (typeof source !== 'object') {
	      throw new TypeError(source + 'must be object');
	    }

	    Object.keys(source).forEach(function (key) {
	      obj[key] = source[key];
	    });
	  });

	  return obj;
	}

	// Remove element from array and put another array at those position.
	// Useful for some operations with tokens
	function arrayReplaceAt(src, pos, newElements) {
	  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
	}

	////////////////////////////////////////////////////////////////////////////////

	function isValidEntityCode(c) {
	  /*eslint no-bitwise:0*/
	  // broken sequence
	  if (c >= 0xD800 && c <= 0xDFFF) { return false; }
	  // never used
	  if (c >= 0xFDD0 && c <= 0xFDEF) { return false; }
	  if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) { return false; }
	  // control codes
	  if (c >= 0x00 && c <= 0x08) { return false; }
	  if (c === 0x0B) { return false; }
	  if (c >= 0x0E && c <= 0x1F) { return false; }
	  if (c >= 0x7F && c <= 0x9F) { return false; }
	  // out of range
	  if (c > 0x10FFFF) { return false; }
	  return true;
	}

	function fromCodePoint(c) {
	  /*eslint no-bitwise:0*/
	  if (c > 0xffff) {
	    c -= 0x10000;
	    var surrogate1 = 0xd800 + (c >> 10),
	        surrogate2 = 0xdc00 + (c & 0x3ff);

	    return String.fromCharCode(surrogate1, surrogate2);
	  }
	  return String.fromCharCode(c);
	}


	var UNESCAPE_MD_RE  = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
	var ENTITY_RE       = /&([a-z#][a-z0-9]{1,31});/gi;
	var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + '|' + ENTITY_RE.source, 'gi');

	var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

	var entities = __webpack_require__(44);

	function replaceEntityPattern(match, name) {
	  var code = 0;

	  if (has(entities, name)) {
	    return entities[name];
	  }

	  if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
	    code = name[1].toLowerCase() === 'x' ?
	      parseInt(name.slice(2), 16)
	    :
	      parseInt(name.slice(1), 10);
	    if (isValidEntityCode(code)) {
	      return fromCodePoint(code);
	    }
	  }

	  return match;
	}

	/*function replaceEntities(str) {
	  if (str.indexOf('&') < 0) { return str; }

	  return str.replace(ENTITY_RE, replaceEntityPattern);
	}*/

	function unescapeMd(str) {
	  if (str.indexOf('\\') < 0) { return str; }
	  return str.replace(UNESCAPE_MD_RE, '$1');
	}

	function unescapeAll(str) {
	  if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) { return str; }

	  return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
	    if (escaped) { return escaped; }
	    return replaceEntityPattern(match, entity);
	  });
	}

	////////////////////////////////////////////////////////////////////////////////

	var HTML_ESCAPE_TEST_RE = /[&<>"]/;
	var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
	var HTML_REPLACEMENTS = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};

	function replaceUnsafeChar(ch) {
	  return HTML_REPLACEMENTS[ch];
	}

	function escapeHtml(str) {
	  if (HTML_ESCAPE_TEST_RE.test(str)) {
	    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
	  }
	  return str;
	}

	////////////////////////////////////////////////////////////////////////////////

	var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;

	function escapeRE (str) {
	  return str.replace(REGEXP_ESCAPE_RE, '\\$&');
	}

	////////////////////////////////////////////////////////////////////////////////

	// Zs (unicode class) || [\t\f\v\r\n]
	function isWhiteSpace(code) {
	  if (code >= 0x2000 && code <= 0x200A) { return true; }
	  switch (code) {
	    case 0x09: // \t
	    case 0x0A: // \n
	    case 0x0B: // \v
	    case 0x0C: // \f
	    case 0x0D: // \r
	    case 0x20:
	    case 0xA0:
	    case 0x1680:
	    case 0x202F:
	    case 0x205F:
	    case 0x3000:
	      return true;
	  }
	  return false;
	}

	////////////////////////////////////////////////////////////////////////////////

	/*eslint-disable max-len*/
	var UNICODE_PUNCT_RE = __webpack_require__(25);

	// Currently without astral characters support.
	function isPunctChar(char) {
	  return UNICODE_PUNCT_RE.test(char);
	}


	// Markdown ASCII punctuation characters.
	//
	// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
	// http://spec.commonmark.org/0.15/#ascii-punctuation-character
	//
	// Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
	//
	function isMdAsciiPunct(ch) {
	  switch (ch) {
	    case 0x21/* ! */:
	    case 0x22/* " */:
	    case 0x23/* # */:
	    case 0x24/* $ */:
	    case 0x25/* % */:
	    case 0x26/* & */:
	    case 0x27/* ' */:
	    case 0x28/* ( */:
	    case 0x29/* ) */:
	    case 0x2A/* * */:
	    case 0x2B/* + */:
	    case 0x2C/* , */:
	    case 0x2D/* - */:
	    case 0x2E/* . */:
	    case 0x2F/* / */:
	    case 0x3A/* : */:
	    case 0x3B/* ; */:
	    case 0x3C/* < */:
	    case 0x3D/* = */:
	    case 0x3E/* > */:
	    case 0x3F/* ? */:
	    case 0x40/* @ */:
	    case 0x5B/* [ */:
	    case 0x5C/* \ */:
	    case 0x5D/* ] */:
	    case 0x5E/* ^ */:
	    case 0x5F/* _ */:
	    case 0x60/* ` */:
	    case 0x7B/* { */:
	    case 0x7C/* | */:
	    case 0x7D/* } */:
	    case 0x7E/* ~ */:
	      return true;
	    default:
	      return false;
	  }
	}

	// Hepler to unify [reference labels].
	//
	function normalizeReference(str) {
	  // use .toUpperCase() instead of .toLowerCase()
	  // here to avoid a conflict with Object.prototype
	  // members (most notably, `__proto__`)
	  return str.trim().replace(/\s+/g, ' ').toUpperCase();
	}

	////////////////////////////////////////////////////////////////////////////////

	// Re-export libraries commonly used in both markdown-it and its plugins,
	// so plugins won't have to depend on them explicitly, which reduces their
	// bundled size (e.g. a browser build).
	//
	exports.lib                 = {};
	exports.lib.mdurl           = __webpack_require__(45);
	exports.lib.ucmicro         = __webpack_require__(168);

	exports.assign              = assign;
	exports.isString            = isString;
	exports.has                 = has;
	exports.unescapeMd          = unescapeMd;
	exports.unescapeAll         = unescapeAll;
	exports.isValidEntityCode   = isValidEntityCode;
	exports.fromCodePoint       = fromCodePoint;
	// exports.replaceEntities     = replaceEntities;
	exports.escapeHtml          = escapeHtml;
	exports.arrayReplaceAt      = arrayReplaceAt;
	exports.isWhiteSpace        = isWhiteSpace;
	exports.isMdAsciiPunct      = isMdAsciiPunct;
	exports.isPunctChar         = isPunctChar;
	exports.escapeRE            = escapeRE;
	exports.normalizeReference  = normalizeReference;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/*jslint node: true*/
	var Syntax = __webpack_require__(3).Syntax;
	var leadingIndentRegexp = /(^|\n)( {2}|\t)/g;
	var nonWhiteRegexp = /(\S)/g;

	/**
	 * A `state` object represents the state of the parser. It has "local" and
	 * "global" parts. Global contains parser position, source, etc. Local contains
	 * scope based properties like current class name. State should contain all the
	 * info required for transformation. It's the only mandatory object that is
	 * being passed to every function in transform chain.
	 *
	 * @param  {string} source
	 * @param  {object} transformOptions
	 * @return {object}
	 */
	function createState(source, rootNode, transformOptions) {
	  return {
	    /**
	     * A tree representing the current local scope (and its lexical scope chain)
	     * Useful for tracking identifiers from parent scopes, etc.
	     * @type {Object}
	     */
	    localScope: {
	      parentNode: rootNode,
	      parentScope: null,
	      identifiers: {},
	      tempVarIndex: 0,
	      tempVars: []
	    },
	    /**
	     * The name (and, if applicable, expression) of the super class
	     * @type {Object}
	     */
	    superClass: null,
	    /**
	     * The namespace to use when munging identifiers
	     * @type {String}
	     */
	    mungeNamespace: '',
	    /**
	     * Ref to the node for the current MethodDefinition
	     * @type {Object}
	     */
	    methodNode: null,
	    /**
	     * Ref to the node for the FunctionExpression of the enclosing
	     * MethodDefinition
	     * @type {Object}
	     */
	    methodFuncNode: null,
	    /**
	     * Name of the enclosing class
	     * @type {String}
	     */
	    className: null,
	    /**
	     * Whether we're currently within a `strict` scope
	     * @type {Bool}
	     */
	    scopeIsStrict: null,
	    /**
	     * Indentation offset
	     * @type {Number}
	     */
	    indentBy: 0,
	    /**
	     * Global state (not affected by updateState)
	     * @type {Object}
	     */
	    g: {
	      /**
	       * A set of general options that transformations can consider while doing
	       * a transformation:
	       *
	       * - minify
	       *   Specifies that transformation steps should do their best to minify
	       *   the output source when possible. This is useful for places where
	       *   minification optimizations are possible with higher-level context
	       *   info than what jsxmin can provide.
	       *
	       *   For example, the ES6 class transform will minify munged private
	       *   variables if this flag is set.
	       */
	      opts: transformOptions,
	      /**
	       * Current position in the source code
	       * @type {Number}
	       */
	      position: 0,
	      /**
	       * Auxiliary data to be returned by transforms
	       * @type {Object}
	       */
	      extra: {},
	      /**
	       * Buffer containing the result
	       * @type {String}
	       */
	      buffer: '',
	      /**
	       * Source that is being transformed
	       * @type {String}
	       */
	      source: source,

	      /**
	       * Cached parsed docblock (see getDocblock)
	       * @type {object}
	       */
	      docblock: null,

	      /**
	       * Whether the thing was used
	       * @type {Boolean}
	       */
	      tagNamespaceUsed: false,

	      /**
	       * If using bolt xjs transformation
	       * @type {Boolean}
	       */
	      isBolt: undefined,

	      /**
	       * Whether to record source map (expensive) or not
	       * @type {SourceMapGenerator|null}
	       */
	      sourceMap: null,

	      /**
	       * Filename of the file being processed. Will be returned as a source
	       * attribute in the source map
	       */
	      sourceMapFilename: 'source.js',

	      /**
	       * Only when source map is used: last line in the source for which
	       * source map was generated
	       * @type {Number}
	       */
	      sourceLine: 1,

	      /**
	       * Only when source map is used: last line in the buffer for which
	       * source map was generated
	       * @type {Number}
	       */
	      bufferLine: 1,

	      /**
	       * The top-level Program AST for the original file.
	       */
	      originalProgramAST: null,

	      sourceColumn: 0,
	      bufferColumn: 0
	    }
	  };
	}

	/**
	 * Updates a copy of a given state with "update" and returns an updated state.
	 *
	 * @param  {object} state
	 * @param  {object} update
	 * @return {object}
	 */
	function updateState(state, update) {
	  var ret = Object.create(state);
	  Object.keys(update).forEach(function(updatedKey) {
	    ret[updatedKey] = update[updatedKey];
	  });
	  return ret;
	}

	/**
	 * Given a state fill the resulting buffer from the original source up to
	 * the end
	 *
	 * @param {number} end
	 * @param {object} state
	 * @param {?function} contentTransformer Optional callback to transform newly
	 *                                       added content.
	 */
	function catchup(end, state, contentTransformer) {
	  if (end < state.g.position) {
	    // cannot move backwards
	    return;
	  }
	  var source = state.g.source.substring(state.g.position, end);
	  var transformed = updateIndent(source, state);
	  if (state.g.sourceMap && transformed) {
	    // record where we are
	    state.g.sourceMap.addMapping({
	      generated: { line: state.g.bufferLine, column: state.g.bufferColumn },
	      original: { line: state.g.sourceLine, column: state.g.sourceColumn },
	      source: state.g.sourceMapFilename
	    });

	    // record line breaks in transformed source
	    var sourceLines = source.split('\n');
	    var transformedLines = transformed.split('\n');
	    // Add line break mappings between last known mapping and the end of the
	    // added piece. So for the code piece
	    //  (foo, bar);
	    // > var x = 2;
	    // > var b = 3;
	    //   var c =
	    // only add lines marked with ">": 2, 3.
	    for (var i = 1; i < sourceLines.length - 1; i++) {
	      state.g.sourceMap.addMapping({
	        generated: { line: state.g.bufferLine, column: 0 },
	        original: { line: state.g.sourceLine, column: 0 },
	        source: state.g.sourceMapFilename
	      });
	      state.g.sourceLine++;
	      state.g.bufferLine++;
	    }
	    // offset for the last piece
	    if (sourceLines.length > 1) {
	      state.g.sourceLine++;
	      state.g.bufferLine++;
	      state.g.sourceColumn = 0;
	      state.g.bufferColumn = 0;
	    }
	    state.g.sourceColumn += sourceLines[sourceLines.length - 1].length;
	    state.g.bufferColumn +=
	      transformedLines[transformedLines.length - 1].length;
	  }
	  state.g.buffer +=
	    contentTransformer ? contentTransformer(transformed) : transformed;
	  state.g.position = end;
	}

	/**
	 * Returns original source for an AST node.
	 * @param {object} node
	 * @param {object} state
	 * @return {string}
	 */
	function getNodeSourceText(node, state) {
	  return state.g.source.substring(node.range[0], node.range[1]);
	}

	function _replaceNonWhite(value) {
	  return value.replace(nonWhiteRegexp, ' ');
	}

	/**
	 * Removes all non-whitespace characters
	 */
	function _stripNonWhite(value) {
	  return value.replace(nonWhiteRegexp, '');
	}

	/**
	 * Finds the position of the next instance of the specified syntactic char in
	 * the pending source.
	 *
	 * NOTE: This will skip instances of the specified char if they sit inside a
	 *       comment body.
	 *
	 * NOTE: This function also assumes that the buffer's current position is not
	 *       already within a comment or a string. This is rarely the case since all
	 *       of the buffer-advancement utility methods tend to be used on syntactic
	 *       nodes' range values -- but it's a small gotcha that's worth mentioning.
	 */
	function getNextSyntacticCharOffset(char, state) {
	  var pendingSource = state.g.source.substring(state.g.position);
	  var pendingSourceLines = pendingSource.split('\n');

	  var charOffset = 0;
	  var line;
	  var withinBlockComment = false;
	  var withinString = false;
	  lineLoop: while ((line = pendingSourceLines.shift()) !== undefined) {
	    var lineEndPos = charOffset + line.length;
	    charLoop: for (; charOffset < lineEndPos; charOffset++) {
	      var currChar = pendingSource[charOffset];
	      if (currChar === '"' || currChar === '\'') {
	        withinString = !withinString;
	        continue charLoop;
	      } else if (withinString) {
	        continue charLoop;
	      } else if (charOffset + 1 < lineEndPos) {
	        var nextTwoChars = currChar + line[charOffset + 1];
	        if (nextTwoChars === '//') {
	          charOffset = lineEndPos + 1;
	          continue lineLoop;
	        } else if (nextTwoChars === '/*') {
	          withinBlockComment = true;
	          charOffset += 1;
	          continue charLoop;
	        } else if (nextTwoChars === '*/') {
	          withinBlockComment = false;
	          charOffset += 1;
	          continue charLoop;
	        }
	      }

	      if (!withinBlockComment && currChar === char) {
	        return charOffset + state.g.position;
	      }
	    }

	    // Account for '\n'
	    charOffset++;
	    withinString = false;
	  }

	  throw new Error('`' + char + '` not found!');
	}

	/**
	 * Catches up as `catchup` but replaces non-whitespace chars with spaces.
	 */
	function catchupWhiteOut(end, state) {
	  catchup(end, state, _replaceNonWhite);
	}

	/**
	 * Catches up as `catchup` but removes all non-whitespace characters.
	 */
	function catchupWhiteSpace(end, state) {
	  catchup(end, state, _stripNonWhite);
	}

	/**
	 * Removes all non-newline characters
	 */
	var reNonNewline = /[^\n]/g;
	function stripNonNewline(value) {
	  return value.replace(reNonNewline, function() {
	    return '';
	  });
	}

	/**
	 * Catches up as `catchup` but removes all non-newline characters.
	 *
	 * Equivalent to appending as many newlines as there are in the original source
	 * between the current position and `end`.
	 */
	function catchupNewlines(end, state) {
	  catchup(end, state, stripNonNewline);
	}


	/**
	 * Same as catchup but does not touch the buffer
	 *
	 * @param  {number} end
	 * @param  {object} state
	 */
	function move(end, state) {
	  // move the internal cursors
	  if (state.g.sourceMap) {
	    if (end < state.g.position) {
	      state.g.position = 0;
	      state.g.sourceLine = 1;
	      state.g.sourceColumn = 0;
	    }

	    var source = state.g.source.substring(state.g.position, end);
	    var sourceLines = source.split('\n');
	    if (sourceLines.length > 1) {
	      state.g.sourceLine += sourceLines.length - 1;
	      state.g.sourceColumn = 0;
	    }
	    state.g.sourceColumn += sourceLines[sourceLines.length - 1].length;
	  }
	  state.g.position = end;
	}

	/**
	 * Appends a string of text to the buffer
	 *
	 * @param {string} str
	 * @param {object} state
	 */
	function append(str, state) {
	  if (state.g.sourceMap && str) {
	    state.g.sourceMap.addMapping({
	      generated: { line: state.g.bufferLine, column: state.g.bufferColumn },
	      original: { line: state.g.sourceLine, column: state.g.sourceColumn },
	      source: state.g.sourceMapFilename
	    });
	    var transformedLines = str.split('\n');
	    if (transformedLines.length > 1) {
	      state.g.bufferLine += transformedLines.length - 1;
	      state.g.bufferColumn = 0;
	    }
	    state.g.bufferColumn +=
	      transformedLines[transformedLines.length - 1].length;
	  }
	  state.g.buffer += str;
	}

	/**
	 * Update indent using state.indentBy property. Indent is measured in
	 * double spaces. Updates a single line only.
	 *
	 * @param {string} str
	 * @param {object} state
	 * @return {string}
	 */
	function updateIndent(str, state) {
	  /*jshint -W004*/
	  var indentBy = state.indentBy;
	  if (indentBy < 0) {
	    for (var i = 0; i < -indentBy; i++) {
	      str = str.replace(leadingIndentRegexp, '$1');
	    }
	  } else {
	    for (var i = 0; i < indentBy; i++) {
	      str = str.replace(leadingIndentRegexp, '$1$2$2');
	    }
	  }
	  return str;
	}

	/**
	 * Calculates indent from the beginning of the line until "start" or the first
	 * character before start.
	 * @example
	 *   "  foo.bar()"
	 *         ^
	 *       start
	 *   indent will be "  "
	 *
	 * @param  {number} start
	 * @param  {object} state
	 * @return {string}
	 */
	function indentBefore(start, state) {
	  var end = start;
	  start = start - 1;

	  while (start > 0 && state.g.source[start] != '\n') {
	    if (!state.g.source[start].match(/[ \t]/)) {
	      end = start;
	    }
	    start--;
	  }
	  return state.g.source.substring(start + 1, end);
	}

	function getDocblock(state) {
	  if (!state.g.docblock) {
	    var docblock = __webpack_require__(183);
	    state.g.docblock =
	      docblock.parseAsObject(docblock.extract(state.g.source));
	  }
	  return state.g.docblock;
	}

	function identWithinLexicalScope(identName, state, stopBeforeNode) {
	  var currScope = state.localScope;
	  while (currScope) {
	    if (currScope.identifiers[identName] !== undefined) {
	      return true;
	    }

	    if (stopBeforeNode && currScope.parentNode === stopBeforeNode) {
	      break;
	    }

	    currScope = currScope.parentScope;
	  }
	  return false;
	}

	function identInLocalScope(identName, state) {
	  return state.localScope.identifiers[identName] !== undefined;
	}

	/**
	 * @param {object} boundaryNode
	 * @param {?array} path
	 * @return {?object} node
	 */
	function initScopeMetadata(boundaryNode, path, node) {
	  return {
	    boundaryNode: boundaryNode,
	    bindingPath: path,
	    bindingNode: node
	  };
	}

	function declareIdentInLocalScope(identName, metaData, state) {
	  state.localScope.identifiers[identName] = {
	    boundaryNode: metaData.boundaryNode,
	    path: metaData.bindingPath,
	    node: metaData.bindingNode,
	    state: Object.create(state)
	  };
	}

	function getLexicalBindingMetadata(identName, state) {
	  var currScope = state.localScope;
	  while (currScope) {
	    if (currScope.identifiers[identName] !== undefined) {
	      return currScope.identifiers[identName];
	    }

	    currScope = currScope.parentScope;
	  }
	}

	function getLocalBindingMetadata(identName, state) {
	  return state.localScope.identifiers[identName];
	}

	/**
	 * Apply the given analyzer function to the current node. If the analyzer
	 * doesn't return false, traverse each child of the current node using the given
	 * traverser function.
	 *
	 * @param {function} analyzer
	 * @param {function} traverser
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function analyzeAndTraverse(analyzer, traverser, node, path, state) {
	  if (node.type) {
	    if (analyzer(node, path, state) === false) {
	      return;
	    }
	    path.unshift(node);
	  }

	  getOrderedChildren(node).forEach(function(child) {
	    traverser(child, path, state);
	  });

	  node.type && path.shift();
	}

	/**
	 * It is crucial that we traverse in order, or else catchup() on a later
	 * node that is processed out of order can move the buffer past a node
	 * that we haven't handled yet, preventing us from modifying that node.
	 *
	 * This can happen when a node has multiple properties containing children.
	 * For example, XJSElement nodes have `openingElement`, `closingElement` and
	 * `children`. If we traverse `openingElement`, then `closingElement`, then
	 * when we get to `children`, the buffer has already caught up to the end of
	 * the closing element, after the children.
	 *
	 * This is basically a Schwartzian transform. Collects an array of children,
	 * each one represented as [child, startIndex]; sorts the array by start
	 * index; then traverses the children in that order.
	 */
	function getOrderedChildren(node) {
	  var queue = [];
	  for (var key in node) {
	    if (node.hasOwnProperty(key)) {
	      enqueueNodeWithStartIndex(queue, node[key]);
	    }
	  }
	  queue.sort(function(a, b) { return a[1] - b[1]; });
	  return queue.map(function(pair) { return pair[0]; });
	}

	/**
	 * Helper function for analyzeAndTraverse which queues up all of the children
	 * of the given node.
	 *
	 * Children can also be found in arrays, so we basically want to merge all of
	 * those arrays together so we can sort them and then traverse the children
	 * in order.
	 *
	 * One example is the Program node. It contains `body` and `comments`, both
	 * arrays. Lexographically, comments are interspersed throughout the body
	 * nodes, but esprima's AST groups them together.
	 */
	function enqueueNodeWithStartIndex(queue, node) {
	  if (typeof node !== 'object' || node === null) {
	    return;
	  }
	  if (node.range) {
	    queue.push([node, node.range[0]]);
	  } else if (Array.isArray(node)) {
	    for (var ii = 0; ii < node.length; ii++) {
	      enqueueNodeWithStartIndex(queue, node[ii]);
	    }
	  }
	}

	/**
	 * Checks whether a node or any of its sub-nodes contains
	 * a syntactic construct of the passed type.
	 * @param {object} node - AST node to test.
	 * @param {string} type - node type to lookup.
	 */
	function containsChildOfType(node, type) {
	  return containsChildMatching(node, function(node) {
	    return node.type === type;
	  });
	}

	function containsChildMatching(node, matcher) {
	  var foundMatchingChild = false;
	  function nodeTypeAnalyzer(node) {
	    if (matcher(node) === true) {
	      foundMatchingChild = true;
	      return false;
	    }
	  }
	  function nodeTypeTraverser(child, path, state) {
	    if (!foundMatchingChild) {
	      foundMatchingChild = containsChildMatching(child, matcher);
	    }
	  }
	  analyzeAndTraverse(
	    nodeTypeAnalyzer,
	    nodeTypeTraverser,
	    node,
	    []
	  );
	  return foundMatchingChild;
	}

	var scopeTypes = {};
	scopeTypes[Syntax.ArrowFunctionExpression] = true;
	scopeTypes[Syntax.FunctionExpression] = true;
	scopeTypes[Syntax.FunctionDeclaration] = true;
	scopeTypes[Syntax.Program] = true;

	function getBoundaryNode(path) {
	  for (var ii = 0; ii < path.length; ++ii) {
	    if (scopeTypes[path[ii].type]) {
	      return path[ii];
	    }
	  }
	  throw new Error(
	    'Expected to find a node with one of the following types in path:\n' +
	    JSON.stringify(Object.keys(scopeTypes))
	  );
	}

	function getTempVar(tempVarIndex) {
	  return '$__' + tempVarIndex;
	}

	function injectTempVar(state) {
	  var tempVar = '$__' + (state.localScope.tempVarIndex++);
	  state.localScope.tempVars.push(tempVar);
	  return tempVar;
	}

	function injectTempVarDeclarations(state, index) {
	  if (state.localScope.tempVars.length) {
	    state.g.buffer =
	      state.g.buffer.slice(0, index) +
	      'var ' + state.localScope.tempVars.join(', ') + ';' +
	      state.g.buffer.slice(index);
	    state.localScope.tempVars = [];
	  }
	}

	exports.analyzeAndTraverse = analyzeAndTraverse;
	exports.append = append;
	exports.catchup = catchup;
	exports.catchupNewlines = catchupNewlines;
	exports.catchupWhiteOut = catchupWhiteOut;
	exports.catchupWhiteSpace = catchupWhiteSpace;
	exports.containsChildMatching = containsChildMatching;
	exports.containsChildOfType = containsChildOfType;
	exports.createState = createState;
	exports.declareIdentInLocalScope = declareIdentInLocalScope;
	exports.getBoundaryNode = getBoundaryNode;
	exports.getDocblock = getDocblock;
	exports.getLexicalBindingMetadata = getLexicalBindingMetadata;
	exports.getLocalBindingMetadata = getLocalBindingMetadata;
	exports.getNextSyntacticCharOffset = getNextSyntacticCharOffset;
	exports.getNodeSourceText = getNodeSourceText;
	exports.getOrderedChildren = getOrderedChildren;
	exports.getTempVar = getTempVar;
	exports.identInLocalScope = identInLocalScope;
	exports.identWithinLexicalScope = identWithinLexicalScope;
	exports.indentBefore = indentBefore;
	exports.initScopeMetadata = initScopeMetadata;
	exports.injectTempVar = injectTempVar;
	exports.injectTempVarDeclarations = injectTempVarDeclarations;
	exports.move = move;
	exports.scopeTypes = scopeTypes;
	exports.updateIndent = updateIndent;
	exports.updateState = updateState;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
	  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // Rhino, and plain browser loading.

	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.esprima = {}));
	    }
	}(this, function (exports) {
	    'use strict';

	    var Token,
	        TokenName,
	        FnExprTokens,
	        Syntax,
	        PropertyKind,
	        Messages,
	        Regex,
	        SyntaxTreeDelegate,
	        XHTMLEntities,
	        ClassPropertyType,
	        source,
	        strict,
	        index,
	        lineNumber,
	        lineStart,
	        length,
	        delegate,
	        lookahead,
	        state,
	        extra;

	    Token = {
	        BooleanLiteral: 1,
	        EOF: 2,
	        Identifier: 3,
	        Keyword: 4,
	        NullLiteral: 5,
	        NumericLiteral: 6,
	        Punctuator: 7,
	        StringLiteral: 8,
	        RegularExpression: 9,
	        Template: 10,
	        JSXIdentifier: 11,
	        JSXText: 12
	    };

	    TokenName = {};
	    TokenName[Token.BooleanLiteral] = 'Boolean';
	    TokenName[Token.EOF] = '<end>';
	    TokenName[Token.Identifier] = 'Identifier';
	    TokenName[Token.Keyword] = 'Keyword';
	    TokenName[Token.NullLiteral] = 'Null';
	    TokenName[Token.NumericLiteral] = 'Numeric';
	    TokenName[Token.Punctuator] = 'Punctuator';
	    TokenName[Token.StringLiteral] = 'String';
	    TokenName[Token.JSXIdentifier] = 'JSXIdentifier';
	    TokenName[Token.JSXText] = 'JSXText';
	    TokenName[Token.RegularExpression] = 'RegularExpression';

	    // A function following one of those tokens is an expression.
	    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	                    'return', 'case', 'delete', 'throw', 'void',
	                    // assignment operators
	                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
	                    '&=', '|=', '^=', ',',
	                    // binary/unary operators
	                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	                    '<=', '<', '>', '!=', '!=='];

	    Syntax = {
	        AnyTypeAnnotation: 'AnyTypeAnnotation',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrayTypeAnnotation: 'ArrayTypeAnnotation',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        AssignmentExpression: 'AssignmentExpression',
	        BinaryExpression: 'BinaryExpression',
	        BlockStatement: 'BlockStatement',
	        BooleanTypeAnnotation: 'BooleanTypeAnnotation',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ClassImplements: 'ClassImplements',
	        ClassProperty: 'ClassProperty',
	        ComprehensionBlock: 'ComprehensionBlock',
	        ComprehensionExpression: 'ComprehensionExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DeclareClass: 'DeclareClass',
	        DeclareFunction: 'DeclareFunction',
	        DeclareModule: 'DeclareModule',
	        DeclareVariable: 'DeclareVariable',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportDeclaration: 'ExportDeclaration',
	        ExportBatchSpecifier: 'ExportBatchSpecifier',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        ForStatement: 'ForStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        FunctionTypeAnnotation: 'FunctionTypeAnnotation',
	        FunctionTypeParam: 'FunctionTypeParam',
	        GenericTypeAnnotation: 'GenericTypeAnnotation',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        InterfaceDeclaration: 'InterfaceDeclaration',
	        InterfaceExtends: 'InterfaceExtends',
	        IntersectionTypeAnnotation: 'IntersectionTypeAnnotation',
	        LabeledStatement: 'LabeledStatement',
	        Literal: 'Literal',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        ModuleSpecifier: 'ModuleSpecifier',
	        NewExpression: 'NewExpression',
	        NullableTypeAnnotation: 'NullableTypeAnnotation',
	        NumberTypeAnnotation: 'NumberTypeAnnotation',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        ObjectTypeAnnotation: 'ObjectTypeAnnotation',
	        ObjectTypeCallProperty: 'ObjectTypeCallProperty',
	        ObjectTypeIndexer: 'ObjectTypeIndexer',
	        ObjectTypeProperty: 'ObjectTypeProperty',
	        Program: 'Program',
	        Property: 'Property',
	        QualifiedTypeIdentifier: 'QualifiedTypeIdentifier',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        SpreadProperty: 'SpreadProperty',
	        StringLiteralTypeAnnotation: 'StringLiteralTypeAnnotation',
	        StringTypeAnnotation: 'StringTypeAnnotation',
	        SwitchCase: 'SwitchCase',
	        SwitchStatement: 'SwitchStatement',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TupleTypeAnnotation: 'TupleTypeAnnotation',
	        TryStatement: 'TryStatement',
	        TypeAlias: 'TypeAlias',
	        TypeAnnotation: 'TypeAnnotation',
	        TypeCastExpression: 'TypeCastExpression',
	        TypeofTypeAnnotation: 'TypeofTypeAnnotation',
	        TypeParameterDeclaration: 'TypeParameterDeclaration',
	        TypeParameterInstantiation: 'TypeParameterInstantiation',
	        UnaryExpression: 'UnaryExpression',
	        UnionTypeAnnotation: 'UnionTypeAnnotation',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        VoidTypeAnnotation: 'VoidTypeAnnotation',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        JSXIdentifier: 'JSXIdentifier',
	        JSXNamespacedName: 'JSXNamespacedName',
	        JSXMemberExpression: 'JSXMemberExpression',
	        JSXEmptyExpression: 'JSXEmptyExpression',
	        JSXExpressionContainer: 'JSXExpressionContainer',
	        JSXElement: 'JSXElement',
	        JSXClosingElement: 'JSXClosingElement',
	        JSXOpeningElement: 'JSXOpeningElement',
	        JSXAttribute: 'JSXAttribute',
	        JSXSpreadAttribute: 'JSXSpreadAttribute',
	        JSXText: 'JSXText',
	        YieldExpression: 'YieldExpression',
	        AwaitExpression: 'AwaitExpression'
	    };

	    PropertyKind = {
	        Data: 1,
	        Get: 2,
	        Set: 4
	    };

	    ClassPropertyType = {
	        'static': 'static',
	        prototype: 'prototype'
	    };

	    // Error messages should be identical to V8.
	    Messages = {
	        UnexpectedToken: 'Unexpected token %0',
	        UnexpectedNumber: 'Unexpected number',
	        UnexpectedString: 'Unexpected string',
	        UnexpectedIdentifier: 'Unexpected identifier',
	        UnexpectedReserved: 'Unexpected reserved word',
	        UnexpectedTemplate: 'Unexpected quasi %0',
	        UnexpectedEOS: 'Unexpected end of input',
	        NewlineAfterThrow: 'Illegal newline after throw',
	        InvalidRegExp: 'Invalid regular expression',
	        UnterminatedRegExp: 'Invalid regular expression: missing /',
	        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
	        InvalidLHSInFormalsList: 'Invalid left-hand side in formals list',
	        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
	        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	        NoCatchOrFinally: 'Missing catch or finally after try',
	        UnknownLabel: 'Undefined label \'%0\'',
	        Redeclaration: '%0 \'%1\' has already been declared',
	        IllegalContinue: 'Illegal continue statement',
	        IllegalBreak: 'Illegal break statement',
	        IllegalDuplicateClassProperty: 'Illegal duplicate property in class definition',
	        IllegalClassConstructorProperty: 'Illegal constructor property in class definition',
	        IllegalReturn: 'Illegal return statement',
	        IllegalSpread: 'Illegal spread element',
	        StrictModeWith: 'Strict mode code may not include a with statement',
	        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
	        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
	        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
	        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	        ParameterAfterRestParameter: 'Rest parameter must be final parameter of an argument list',
	        DefaultRestParameter: 'Rest parameter can not have a default value',
	        ElementAfterSpreadElement: 'Spread must be the final element of an element list',
	        PropertyAfterSpreadProperty: 'A rest property must be the final property of an object literal',
	        ObjectPatternAsRestParameter: 'Invalid rest parameter',
	        ObjectPatternAsSpread: 'Invalid spread argument',
	        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
	        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
	        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
	        StrictDuplicateProperty: 'Duplicate data property in object literal not allowed in strict mode',
	        AccessorDataProperty: 'Object literal may not have data and accessor property with the same name',
	        AccessorGetSet: 'Object literal may not have multiple get/set accessors with the same name',
	        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
	        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictReservedWord: 'Use of future reserved word in strict mode',
	        MissingFromClause: 'Missing from clause',
	        NoAsAfterImportNamespace: 'Missing as after import *',
	        InvalidModuleSpecifier: 'Invalid module specifier',
	        IllegalImportDeclaration: 'Illegal import declaration',
	        IllegalExportDeclaration: 'Illegal export declaration',
	        NoUninitializedConst: 'Const must be initialized',
	        ComprehensionRequiresBlock: 'Comprehension must have at least one block',
	        ComprehensionError: 'Comprehension Error',
	        EachNotAllowed: 'Each is not supported',
	        InvalidJSXAttributeValue: 'JSX value should be either an expression or a quoted JSX text',
	        ExpectedJSXClosingTag: 'Expected corresponding JSX closing tag for %0',
	        AdjacentJSXElements: 'Adjacent JSX elements must be wrapped in an enclosing tag',
	        ConfusedAboutFunctionType: 'Unexpected token =>. It looks like ' +
	            'you are trying to write a function type, but you ended up ' +
	            'writing a grouped type followed by an =>, which is a syntax ' +
	            'error. Remember, function type parameters are named so function ' +
	            'types look like (name1: type1, name2: type2) => returnType. You ' +
	            'probably wrote (type1) => returnType'
	    };

	    // See also tools/generate-unicode-regex.py.
	    Regex = {
	        NonAsciiIdentifierStart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]'),
	        NonAsciiIdentifierPart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0\u08a2-\u08ac\u08e4-\u08fe\u0900-\u0963\u0966-\u096f\u0971-\u0977\u0979-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1d00-\u1de6\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c\u200d\u203f\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua697\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a\uaa7b\uaa80-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabea\uabec\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]'),
	        LeadingZeros: new RegExp('^0+(?!$)')
	    };

	    // Ensure the condition is true, otherwise throw an error.
	    // This is only to have a better contract semantic, i.e. another safety net
	    // to catch a logic error. The condition shall be fulfilled in normal case.
	    // Do NOT use this to enforce a certain condition on any user input.

	    function assert(condition, message) {
	        /* istanbul ignore if */
	        if (!condition) {
	            throw new Error('ASSERT: ' + message);
	        }
	    }

	    function StringMap() {
	        this.$data = {};
	    }

	    StringMap.prototype.get = function (key) {
	        key = '$' + key;
	        return this.$data[key];
	    };

	    StringMap.prototype.set = function (key, value) {
	        key = '$' + key;
	        this.$data[key] = value;
	        return this;
	    };

	    StringMap.prototype.has = function (key) {
	        key = '$' + key;
	        return Object.prototype.hasOwnProperty.call(this.$data, key);
	    };

	    StringMap.prototype.delete = function (key) {
	        key = '$' + key;
	        return delete this.$data[key];
	    };

	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }

	    function isHexDigit(ch) {
	        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
	    }

	    function isOctalDigit(ch) {
	        return '01234567'.indexOf(ch) >= 0;
	    }


	    // 7.2 White Space

	    function isWhiteSpace(ch) {
	        return (ch === 32) ||  // space
	            (ch === 9) ||      // tab
	            (ch === 0xB) ||
	            (ch === 0xC) ||
	            (ch === 0xA0) ||
	            (ch >= 0x1680 && '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(String.fromCharCode(ch)) > 0);
	    }

	    // 7.3 Line Terminators

	    function isLineTerminator(ch) {
	        return (ch === 10) || (ch === 13) || (ch === 0x2028) || (ch === 0x2029);
	    }

	    // 7.6 Identifier Names and Identifiers

	    function isIdentifierStart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	    }

	    function isIdentifierPart(ch) {
	        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
	            (ch >= 65 && ch <= 90) ||         // A..Z
	            (ch >= 97 && ch <= 122) ||        // a..z
	            (ch >= 48 && ch <= 57) ||         // 0..9
	            (ch === 92) ||                    // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	    }

	    // 7.6.1.2 Future Reserved Words

	    function isFutureReservedWord(id) {
	        switch (id) {
	        case 'class':
	        case 'enum':
	        case 'export':
	        case 'extends':
	        case 'import':
	        case 'super':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isStrictModeReservedWord(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'yield':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    // 7.6.1.1 Keywords

	    function isKeyword(id) {
	        if (strict && isStrictModeReservedWord(id)) {
	            return true;
	        }

	        // 'const' is specialized as Keyword in V8.
	        // 'yield' is only treated as a keyword in strict mode.
	        // 'let' is for compatiblity with SpiderMonkey and ES.next.
	        // Some others are from future reserved words.

	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') ||
	                (id === 'try') || (id === 'let');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }

	    // 7.4 Comments

	    function addComment(type, value, start, end, loc) {
	        var comment;
	        assert(typeof start === 'number', 'Comment must have valid position');

	        // Because the way the actual token is scanned, often the comments
	        // (if any) are skipped twice during the lexical analysis.
	        // Thus, we need to skip adding a comment if the comment array already
	        // handled it.
	        if (state.lastCommentStart >= start) {
	            return;
	        }
	        state.lastCommentStart = start;

	        comment = {
	            type: type,
	            value: value
	        };
	        if (extra.range) {
	            comment.range = [start, end];
	        }
	        if (extra.loc) {
	            comment.loc = loc;
	        }
	        extra.comments.push(comment);
	        if (extra.attachComment) {
	            extra.leadingComments.push(comment);
	            extra.trailingComments.push(comment);
	        }
	    }

	    function skipSingleLineComment() {
	        var start, loc, ch, comment;

	        start = index - 2;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart - 2
	            }
	        };

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            ++index;
	            if (isLineTerminator(ch)) {
	                if (extra.comments) {
	                    comment = source.slice(start + 2, index - 1);
	                    loc.end = {
	                        line: lineNumber,
	                        column: index - lineStart - 1
	                    };
	                    addComment('Line', comment, start, index - 1, loc);
	                }
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                return;
	            }
	        }

	        if (extra.comments) {
	            comment = source.slice(start + 2, index);
	            loc.end = {
	                line: lineNumber,
	                column: index - lineStart
	            };
	            addComment('Line', comment, start, index, loc);
	        }
	    }

	    function skipMultiLineComment() {
	        var start, loc, ch, comment;

	        if (extra.comments) {
	            start = index - 2;
	            loc = {
	                start: {
	                    line: lineNumber,
	                    column: index - lineStart - 2
	                }
	            };
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (isLineTerminator(ch)) {
	                if (ch === 13 && source.charCodeAt(index + 1) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                ++index;
	                lineStart = index;
	                if (index >= length) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            } else if (ch === 42) {
	                // Block comment ends with '*/' (char #42, char #47).
	                if (source.charCodeAt(index + 1) === 47) {
	                    ++index;
	                    ++index;
	                    if (extra.comments) {
	                        comment = source.slice(start + 2, index - 2);
	                        loc.end = {
	                            line: lineNumber,
	                            column: index - lineStart
	                        };
	                        addComment('Block', comment, start, index, loc);
	                    }
	                    return;
	                }
	                ++index;
	            } else {
	                ++index;
	            }
	        }

	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }

	    function skipComment() {
	        var ch;

	        while (index < length) {
	            ch = source.charCodeAt(index);

	            if (isWhiteSpace(ch)) {
	                ++index;
	            } else if (isLineTerminator(ch)) {
	                ++index;
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	            } else if (ch === 47) { // 47 is '/'
	                ch = source.charCodeAt(index + 1);
	                if (ch === 47) {
	                    ++index;
	                    ++index;
	                    skipSingleLineComment();
	                } else if (ch === 42) {  // 42 is '*'
	                    ++index;
	                    ++index;
	                    skipMultiLineComment();
	                } else {
	                    break;
	                }
	            } else {
	                break;
	            }
	        }
	    }

	    function scanHexEscape(prefix) {
	        var i, len, ch, code = 0;

	        len = (prefix === 'u') ? 4 : 2;
	        for (i = 0; i < len; ++i) {
	            if (index < length && isHexDigit(source[index])) {
	                ch = source[index++];
	                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	            } else {
	                return '';
	            }
	        }
	        return String.fromCharCode(code);
	    }

	    function scanUnicodeCodePointEscape() {
	        var ch, code, cu1, cu2;

	        ch = source[index];
	        code = 0;

	        // At least, one hex digit is required.
	        if (ch === '}') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        while (index < length) {
	            ch = source[index++];
	            if (!isHexDigit(ch)) {
	                break;
	            }
	            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	        }

	        if (code > 0x10FFFF || ch !== '}') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        // UTF-16 Encoding
	        if (code <= 0xFFFF) {
	            return String.fromCharCode(code);
	        }
	        cu1 = ((code - 0x10000) >> 10) + 0xD800;
	        cu2 = ((code - 0x10000) & 1023) + 0xDC00;
	        return String.fromCharCode(cu1, cu2);
	    }

	    function getEscapedIdentifier() {
	        var ch, id;

	        ch = source.charCodeAt(index++);
	        id = String.fromCharCode(ch);

	        // '\u' (char #92, char #117) denotes an escaped character.
	        if (ch === 92) {
	            if (source.charCodeAt(index) !== 117) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            ++index;
	            ch = scanHexEscape('u');
	            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            id = ch;
	        }

	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isIdentifierPart(ch)) {
	                break;
	            }
	            ++index;
	            id += String.fromCharCode(ch);

	            // '\u' (char #92, char #117) denotes an escaped character.
	            if (ch === 92) {
	                id = id.substr(0, id.length - 1);
	                if (source.charCodeAt(index) !== 117) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                ++index;
	                ch = scanHexEscape('u');
	                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                id += ch;
	            }
	        }

	        return id;
	    }

	    function getIdentifier() {
	        var start, ch;

	        start = index++;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (ch === 92) {
	                // Blackslash (char #92) marks Unicode escape sequence.
	                index = start;
	                return getEscapedIdentifier();
	            }
	            if (isIdentifierPart(ch)) {
	                ++index;
	            } else {
	                break;
	            }
	        }

	        return source.slice(start, index);
	    }

	    function scanIdentifier() {
	        var start, id, type;

	        start = index;

	        // Backslash (char #92) starts an escaped character.
	        id = (source.charCodeAt(index) === 92) ? getEscapedIdentifier() : getIdentifier();

	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = Token.Identifier;
	        } else if (isKeyword(id)) {
	            type = Token.Keyword;
	        } else if (id === 'null') {
	            type = Token.NullLiteral;
	        } else if (id === 'true' || id === 'false') {
	            type = Token.BooleanLiteral;
	        } else {
	            type = Token.Identifier;
	        }

	        return {
	            type: type,
	            value: id,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }


	    // 7.7 Punctuators

	    function scanPunctuator() {
	        var start = index,
	            code = source.charCodeAt(index),
	            code2,
	            ch1 = source[index],
	            ch2,
	            ch3,
	            ch4;

	        if (state.inJSXTag || state.inJSXChild) {
	            // Don't need to check for '{' and '}' as it's already handled
	            // correctly by default.
	            switch (code) {
	            case 60:  // <
	            case 62:  // >
	                ++index;
	                return {
	                    type: Token.Punctuator,
	                    value: String.fromCharCode(code),
	                    lineNumber: lineNumber,
	                    lineStart: lineStart,
	                    range: [start, index]
	                };
	            }
	        }

	        switch (code) {
	        // Check for most common single-character punctuators.
	        case 40:   // ( open bracket
	        case 41:   // ) close bracket
	        case 59:   // ; semicolon
	        case 44:   // , comma
	        case 123:  // { open curly brace
	        case 125:  // } close curly brace
	        case 91:   // [
	        case 93:   // ]
	        case 58:   // :
	        case 63:   // ?
	        case 126:  // ~
	            ++index;
	            if (extra.tokenize) {
	                if (code === 40) {
	                    extra.openParenToken = extra.tokens.length;
	                } else if (code === 123) {
	                    extra.openCurlyToken = extra.tokens.length;
	                }
	            }
	            return {
	                type: Token.Punctuator,
	                value: String.fromCharCode(code),
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };

	        default:
	            code2 = source.charCodeAt(index + 1);

	            // '=' (char #61) marks an assignment or comparison operator.
	            if (code2 === 61) {
	                switch (code) {
	                case 37:  // %
	                case 38:  // &
	                case 42:  // *:
	                case 43:  // +
	                case 45:  // -
	                case 47:  // /
	                case 60:  // <
	                case 62:  // >
	                case 94:  // ^
	                case 124: // |
	                    index += 2;
	                    return {
	                        type: Token.Punctuator,
	                        value: String.fromCharCode(code) + String.fromCharCode(code2),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };

	                case 33: // !
	                case 61: // =
	                    index += 2;

	                    // !== and ===
	                    if (source.charCodeAt(index) === 61) {
	                        ++index;
	                    }
	                    return {
	                        type: Token.Punctuator,
	                        value: source.slice(start, index),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        range: [start, index]
	                    };
	                default:
	                    break;
	                }
	            }
	            break;
	        }

	        // Peek more characters.

	        ch2 = source[index + 1];
	        ch3 = source[index + 2];
	        ch4 = source[index + 3];

	        // 4-character punctuator: >>>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
	            if (ch4 === '=') {
	                index += 4;
	                return {
	                    type: Token.Punctuator,
	                    value: '>>>=',
	                    lineNumber: lineNumber,
	                    lineStart: lineStart,
	                    range: [start, index]
	                };
	            }
	        }

	        // 3-character punctuators: === !== >>> <<= >>=

	        if (ch1 === '>' && ch2 === '>' && ch3 === '>' && !state.inType) {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>>',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '<' && ch2 === '<' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '<<=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '>' && ch2 === '>' && ch3 === '=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '>>=',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '.' && ch2 === '.' && ch3 === '.') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: '...',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        // Other 2-character punctuators: ++ -- << >> && ||

	        // Don't match these tokens if we're in a type, since they never can
	        // occur and can mess up types like Map<string, Array<string>>
	        if (ch1 === ch2 && ('+-<>&|'.indexOf(ch1) >= 0) && !state.inType) {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: ch1 + ch2,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '=' && ch2 === '>') {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: '=>',
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        if (ch1 === '.') {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }

	    // 7.8.3 Numeric Literals

	    function scanHexLiteral(start) {
	        var number = '';

	        while (index < length) {
	            if (!isHexDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt('0x' + number, 16),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanBinaryLiteral(start) {
	        var ch, number;

	        number = '';

	        while (index < length) {
	            ch = source[index];
	            if (ch !== '0' && ch !== '1') {
	                break;
	            }
	            number += source[index++];
	        }

	        if (number.length === 0) {
	            // only 0b or 0B
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (index < length) {
	            ch = source.charCodeAt(index);
	            /* istanbul ignore else */
	            if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 2),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanOctalLiteral(prefix, start) {
	        var number, octal;

	        if (isOctalDigit(prefix)) {
	            octal = true;
	            number = '0' + source[index++];
	        } else {
	            octal = false;
	            ++index;
	            number = '';
	        }

	        while (index < length) {
	            if (!isOctalDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }

	        if (!octal && number.length === 0) {
	            // only 0o or 0O
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 8),
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanNumericLiteral() {
	        var number, start, ch;

	        ch = source[index];
	        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
	            'Numeric literal must start with a decimal digit or a decimal point');

	        start = index;
	        number = '';
	        if (ch !== '.') {
	            number = source[index++];
	            ch = source[index];

	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            // Octal number in ES6 starts with '0o'.
	            // Binary number in ES6 starts with '0b'.
	            if (number === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++index;
	                    return scanHexLiteral(start);
	                }
	                if (ch === 'b' || ch === 'B') {
	                    ++index;
	                    return scanBinaryLiteral(start);
	                }
	                if (ch === 'o' || ch === 'O' || isOctalDigit(ch)) {
	                    return scanOctalLiteral(ch, start);
	                }
	                // decimal number starts with '0' such as '09' is illegal.
	                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            }

	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === '.') {
	            number += source[index++];
	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }

	        if (ch === 'e' || ch === 'E') {
	            number += source[index++];

	            ch = source[index];
	            if (ch === '+' || ch === '-') {
	                number += source[index++];
	            }
	            if (isDecimalDigit(source.charCodeAt(index))) {
	                while (isDecimalDigit(source.charCodeAt(index))) {
	                    number += source[index++];
	                }
	            } else {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	        }

	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.NumericLiteral,
	            value: parseFloat(number),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    // 7.8.4 String Literals

	    function scanStringLiteral() {
	        var str = '', quote, start, ch, code, unescaped, restore, octal = false;

	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');

	        start = index;
	        ++index;

	        while (index < length) {
	            ch = source[index++];

	            if (ch === quote) {
	                quote = '';
	                break;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'n':
	                        str += '\n';
	                        break;
	                    case 'r':
	                        str += '\r';
	                        break;
	                    case 't':
	                        str += '\t';
	                        break;
	                    case 'u':
	                    case 'x':
	                        if (source[index] === '{') {
	                            ++index;
	                            str += scanUnicodeCodePointEscape();
	                        } else {
	                            restore = index;
	                            unescaped = scanHexEscape(ch);
	                            if (unescaped) {
	                                str += unescaped;
	                            } else {
	                                index = restore;
	                                str += ch;
	                            }
	                        }
	                        break;
	                    case 'b':
	                        str += '\b';
	                        break;
	                    case 'f':
	                        str += '\f';
	                        break;
	                    case 'v':
	                        str += '\x0B';
	                        break;

	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);

	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }

	                            /* istanbul ignore else */
	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);

	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            str += String.fromCharCode(code);
	                        } else {
	                            str += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch === '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            } else {
	                str += ch;
	            }
	        }

	        if (quote !== '') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.StringLiteral,
	            value: str,
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanTemplate() {
	        var cooked = '', ch, start, terminated, tail, restore, unescaped, code, octal;

	        terminated = false;
	        tail = false;
	        start = index;

	        ++index;

	        while (index < length) {
	            ch = source[index++];
	            if (ch === '`') {
	                tail = true;
	                terminated = true;
	                break;
	            } else if (ch === '$') {
	                if (source[index] === '{') {
	                    ++index;
	                    terminated = true;
	                    break;
	                }
	                cooked += ch;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'n':
	                        cooked += '\n';
	                        break;
	                    case 'r':
	                        cooked += '\r';
	                        break;
	                    case 't':
	                        cooked += '\t';
	                        break;
	                    case 'u':
	                    case 'x':
	                        if (source[index] === '{') {
	                            ++index;
	                            cooked += scanUnicodeCodePointEscape();
	                        } else {
	                            restore = index;
	                            unescaped = scanHexEscape(ch);
	                            if (unescaped) {
	                                cooked += unescaped;
	                            } else {
	                                index = restore;
	                                cooked += ch;
	                            }
	                        }
	                        break;
	                    case 'b':
	                        cooked += '\b';
	                        break;
	                    case 'f':
	                        cooked += '\f';
	                        break;
	                    case 'v':
	                        cooked += '\v';
	                        break;

	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);

	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }

	                            /* istanbul ignore else */
	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);

	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            cooked += String.fromCharCode(code);
	                        } else {
	                            cooked += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch === '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                ++lineNumber;
	                if (ch === '\r' && source[index] === '\n') {
	                    ++index;
	                }
	                lineStart = index;
	                cooked += '\n';
	            } else {
	                cooked += ch;
	            }
	        }

	        if (!terminated) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        return {
	            type: Token.Template,
	            value: {
	                cooked: cooked,
	                raw: source.slice(start + 1, index - ((tail) ? 1 : 2))
	            },
	            tail: tail,
	            octal: octal,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanTemplateElement(option) {
	        var startsWith, template;

	        lookahead = null;
	        skipComment();

	        startsWith = (option.head) ? '`' : '}';

	        if (source[index] !== startsWith) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        template = scanTemplate();

	        peek();

	        return template;
	    }

	    function testRegExp(pattern, flags) {
	        var tmp = pattern,
	            value;

	        if (flags.indexOf('u') >= 0) {
	            // Replace each astral symbol and every Unicode code point
	            // escape sequence with a single ASCII symbol to avoid throwing on
	            // regular expressions that are only valid in combination with the
	            // `/u` flag.
	            // Note: replacing with the ASCII symbol `x` might cause false
	            // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
	            // perfectly valid pattern that is equivalent to `[a-b]`, but it
	            // would be replaced by `[x-b]` which throws an error.
	            tmp = tmp
	                .replace(/\\u\{([0-9a-fA-F]+)\}/g, function ($0, $1) {
	                    if (parseInt($1, 16) <= 0x10FFFF) {
	                        return 'x';
	                    }
	                    throwError({}, Messages.InvalidRegExp);
	                })
	                .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, 'x');
	        }

	        // First, detect invalid regular expressions.
	        try {
	            value = new RegExp(tmp);
	        } catch (e) {
	            throwError({}, Messages.InvalidRegExp);
	        }

	        // Return a regular expression object for this pattern-flag pair, or
	        // `null` in case the current environment doesn't support the flags it
	        // uses.
	        try {
	            return new RegExp(pattern, flags);
	        } catch (exception) {
	            return null;
	        }
	    }

	    function scanRegExpBody() {
	        var ch, str, classMarker, terminated, body;

	        ch = source[index];
	        assert(ch === '/', 'Regular expression literal must start with a slash');
	        str = source[index++];

	        classMarker = false;
	        terminated = false;
	        while (index < length) {
	            ch = source[index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = source[index++];
	                // ECMA-262 7.8.5
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnterminatedRegExp);
	                }
	                str += ch;
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnterminatedRegExp);
	            } else if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            } else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                } else if (ch === '[') {
	                    classMarker = true;
	                }
	            }
	        }

	        if (!terminated) {
	            throwError({}, Messages.UnterminatedRegExp);
	        }

	        // Exclude leading and trailing slash.
	        body = str.substr(1, str.length - 2);
	        return {
	            value: body,
	            literal: str
	        };
	    }

	    function scanRegExpFlags() {
	        var ch, str, flags, restore;

	        str = '';
	        flags = '';
	        while (index < length) {
	            ch = source[index];
	            if (!isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }

	            ++index;
	            if (ch === '\\' && index < length) {
	                ch = source[index];
	                if (ch === 'u') {
	                    ++index;
	                    restore = index;
	                    ch = scanHexEscape('u');
	                    if (ch) {
	                        flags += ch;
	                        for (str += '\\u'; restore < index; ++restore) {
	                            str += source[restore];
	                        }
	                    } else {
	                        index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	                } else {
	                    str += '\\';
	                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            } else {
	                flags += ch;
	                str += ch;
	            }
	        }

	        return {
	            value: flags,
	            literal: str
	        };
	    }

	    function scanRegExp() {
	        var start, body, flags, value;

	        lookahead = null;
	        skipComment();
	        start = index;

	        body = scanRegExpBody();
	        flags = scanRegExpFlags();
	        value = testRegExp(body.value, flags.value);

	        if (extra.tokenize) {
	            return {
	                type: Token.RegularExpression,
	                value: value,
	                regex: {
	                    pattern: body.value,
	                    flags: flags.value
	                },
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [start, index]
	            };
	        }

	        return {
	            literal: body.literal + flags.literal,
	            value: value,
	            regex: {
	                pattern: body.value,
	                flags: flags.value
	            },
	            range: [start, index]
	        };
	    }

	    function isIdentifierName(token) {
	        return token.type === Token.Identifier ||
	            token.type === Token.Keyword ||
	            token.type === Token.BooleanLiteral ||
	            token.type === Token.NullLiteral;
	    }

	    function advanceSlash() {
	        var prevToken,
	            checkToken;
	        // Using the following algorithm:
	        // https://github.com/mozilla/sweet.js/wiki/design
	        prevToken = extra.tokens[extra.tokens.length - 1];
	        if (!prevToken) {
	            // Nothing before that: it cannot be a division.
	            return scanRegExp();
	        }
	        if (prevToken.type === 'Punctuator') {
	            if (prevToken.value === ')') {
	                checkToken = extra.tokens[extra.openParenToken - 1];
	                if (checkToken &&
	                        checkToken.type === 'Keyword' &&
	                        (checkToken.value === 'if' ||
	                         checkToken.value === 'while' ||
	                         checkToken.value === 'for' ||
	                         checkToken.value === 'with')) {
	                    return scanRegExp();
	                }
	                return scanPunctuator();
	            }
	            if (prevToken.value === '}') {
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                if (extra.tokens[extra.openCurlyToken - 3] &&
	                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
	                    // Anonymous function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 4];
	                    if (!checkToken) {
	                        return scanPunctuator();
	                    }
	                } else if (extra.tokens[extra.openCurlyToken - 4] &&
	                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
	                    // Named function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 5];
	                    if (!checkToken) {
	                        return scanRegExp();
	                    }
	                } else {
	                    return scanPunctuator();
	                }
	                // checkToken determines whether the function is
	                // a declaration or an expression.
	                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
	                    // It is an expression.
	                    return scanPunctuator();
	                }
	                // It is a declaration.
	                return scanRegExp();
	            }
	            return scanRegExp();
	        }
	        if (prevToken.type === 'Keyword' && prevToken.value !== 'this') {
	            return scanRegExp();
	        }
	        return scanPunctuator();
	    }

	    function advance() {
	        var ch;

	        if (!state.inJSXChild) {
	            skipComment();
	        }

	        if (index >= length) {
	            return {
	                type: Token.EOF,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                range: [index, index]
	            };
	        }

	        if (state.inJSXChild) {
	            return advanceJSXChild();
	        }

	        ch = source.charCodeAt(index);

	        // Very common: ( and ) and ;
	        if (ch === 40 || ch === 41 || ch === 58) {
	            return scanPunctuator();
	        }

	        // String literal starts with single quote (#39) or double quote (#34).
	        if (ch === 39 || ch === 34) {
	            if (state.inJSXTag) {
	                return scanJSXStringLiteral();
	            }
	            return scanStringLiteral();
	        }

	        if (state.inJSXTag && isJSXIdentifierStart(ch)) {
	            return scanJSXIdentifier();
	        }

	        if (ch === 96) {
	            return scanTemplate();
	        }
	        if (isIdentifierStart(ch)) {
	            return scanIdentifier();
	        }

	        // Dot (.) char #46 can also start a floating-point number, hence the need
	        // to check the next character.
	        if (ch === 46) {
	            if (isDecimalDigit(source.charCodeAt(index + 1))) {
	                return scanNumericLiteral();
	            }
	            return scanPunctuator();
	        }

	        if (isDecimalDigit(ch)) {
	            return scanNumericLiteral();
	        }

	        // Slash (/) char #47 can also start a regex.
	        if (extra.tokenize && ch === 47) {
	            return advanceSlash();
	        }

	        return scanPunctuator();
	    }

	    function lex() {
	        var token;

	        token = lookahead;
	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        lookahead = advance();

	        index = token.range[1];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;

	        return token;
	    }

	    function peek() {
	        var pos, line, start;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        lookahead = advance();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;
	    }

	    function lookahead2() {
	        var adv, pos, line, start, result;

	        // If we are collecting the tokens, don't grab the next one yet.
	        /* istanbul ignore next */
	        adv = (typeof extra.advance === 'function') ? extra.advance : advance;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;

	        // Scan for the next immediate token.
	        /* istanbul ignore if */
	        if (lookahead === null) {
	            lookahead = adv();
	        }
	        index = lookahead.range[1];
	        lineNumber = lookahead.lineNumber;
	        lineStart = lookahead.lineStart;

	        // Grab the token right after.
	        result = adv();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;

	        return result;
	    }

	    function rewind(token) {
	        index = token.range[0];
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;
	        lookahead = token;
	    }

	    function markerCreate() {
	        if (!extra.loc && !extra.range) {
	            return undefined;
	        }
	        skipComment();
	        return {offset: index, line: lineNumber, col: index - lineStart};
	    }

	    function markerCreatePreserveWhitespace() {
	        if (!extra.loc && !extra.range) {
	            return undefined;
	        }
	        return {offset: index, line: lineNumber, col: index - lineStart};
	    }

	    function processComment(node) {
	        var lastChild,
	            trailingComments,
	            bottomRight = extra.bottomRightStack,
	            last = bottomRight[bottomRight.length - 1];

	        if (node.type === Syntax.Program) {
	            /* istanbul ignore else */
	            if (node.body.length > 0) {
	                return;
	            }
	        }

	        if (extra.trailingComments.length > 0) {
	            if (extra.trailingComments[0].range[0] >= node.range[1]) {
	                trailingComments = extra.trailingComments;
	                extra.trailingComments = [];
	            } else {
	                extra.trailingComments.length = 0;
	            }
	        } else {
	            if (last && last.trailingComments && last.trailingComments[0].range[0] >= node.range[1]) {
	                trailingComments = last.trailingComments;
	                delete last.trailingComments;
	            }
	        }

	        // Eating the stack.
	        if (last) {
	            while (last && last.range[0] >= node.range[0]) {
	                lastChild = last;
	                last = bottomRight.pop();
	            }
	        }

	        if (lastChild) {
	            if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
	                node.leadingComments = lastChild.leadingComments;
	                delete lastChild.leadingComments;
	            }
	        } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
	            node.leadingComments = extra.leadingComments;
	            extra.leadingComments = [];
	        }

	        if (trailingComments) {
	            node.trailingComments = trailingComments;
	        }

	        bottomRight.push(node);
	    }

	    function markerApply(marker, node) {
	        if (extra.range) {
	            node.range = [marker.offset, index];
	        }
	        if (extra.loc) {
	            node.loc = {
	                start: {
	                    line: marker.line,
	                    column: marker.col
	                },
	                end: {
	                    line: lineNumber,
	                    column: index - lineStart
	                }
	            };
	            node = delegate.postProcess(node);
	        }
	        if (extra.attachComment) {
	            processComment(node);
	        }
	        return node;
	    }

	    SyntaxTreeDelegate = {

	        name: 'SyntaxTree',

	        postProcess: function (node) {
	            return node;
	        },

	        createArrayExpression: function (elements) {
	            return {
	                type: Syntax.ArrayExpression,
	                elements: elements
	            };
	        },

	        createAssignmentExpression: function (operator, left, right) {
	            return {
	                type: Syntax.AssignmentExpression,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBinaryExpression: function (operator, left, right) {
	            var type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression :
	                        Syntax.BinaryExpression;
	            return {
	                type: type,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },

	        createBlockStatement: function (body) {
	            return {
	                type: Syntax.BlockStatement,
	                body: body
	            };
	        },

	        createBreakStatement: function (label) {
	            return {
	                type: Syntax.BreakStatement,
	                label: label
	            };
	        },

	        createCallExpression: function (callee, args) {
	            return {
	                type: Syntax.CallExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createCatchClause: function (param, body) {
	            return {
	                type: Syntax.CatchClause,
	                param: param,
	                body: body
	            };
	        },

	        createConditionalExpression: function (test, consequent, alternate) {
	            return {
	                type: Syntax.ConditionalExpression,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createContinueStatement: function (label) {
	            return {
	                type: Syntax.ContinueStatement,
	                label: label
	            };
	        },

	        createDebuggerStatement: function () {
	            return {
	                type: Syntax.DebuggerStatement
	            };
	        },

	        createDoWhileStatement: function (body, test) {
	            return {
	                type: Syntax.DoWhileStatement,
	                body: body,
	                test: test
	            };
	        },

	        createEmptyStatement: function () {
	            return {
	                type: Syntax.EmptyStatement
	            };
	        },

	        createExpressionStatement: function (expression) {
	            return {
	                type: Syntax.ExpressionStatement,
	                expression: expression
	            };
	        },

	        createForStatement: function (init, test, update, body) {
	            return {
	                type: Syntax.ForStatement,
	                init: init,
	                test: test,
	                update: update,
	                body: body
	            };
	        },

	        createForInStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForInStatement,
	                left: left,
	                right: right,
	                body: body,
	                each: false
	            };
	        },

	        createForOfStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForOfStatement,
	                left: left,
	                right: right,
	                body: body
	            };
	        },

	        createFunctionDeclaration: function (id, params, defaults, body, rest, generator, expression,
	                                             isAsync, returnType, typeParameters) {
	            var funDecl = {
	                type: Syntax.FunctionDeclaration,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: generator,
	                expression: expression,
	                returnType: returnType,
	                typeParameters: typeParameters
	            };

	            if (isAsync) {
	                funDecl.async = true;
	            }

	            return funDecl;
	        },

	        createFunctionExpression: function (id, params, defaults, body, rest, generator, expression,
	                                            isAsync, returnType, typeParameters) {
	            var funExpr = {
	                type: Syntax.FunctionExpression,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: generator,
	                expression: expression,
	                returnType: returnType,
	                typeParameters: typeParameters
	            };

	            if (isAsync) {
	                funExpr.async = true;
	            }

	            return funExpr;
	        },

	        createIdentifier: function (name) {
	            return {
	                type: Syntax.Identifier,
	                name: name,
	                // Only here to initialize the shape of the object to ensure
	                // that the 'typeAnnotation' key is ordered before others that
	                // are added later (like 'loc' and 'range'). This just helps
	                // keep the shape of Identifier nodes consistent with everything
	                // else.
	                typeAnnotation: undefined,
	                optional: undefined
	            };
	        },

	        createTypeAnnotation: function (typeAnnotation) {
	            return {
	                type: Syntax.TypeAnnotation,
	                typeAnnotation: typeAnnotation
	            };
	        },

	        createTypeCast: function (expression, typeAnnotation) {
	            return {
	                type: Syntax.TypeCastExpression,
	                expression: expression,
	                typeAnnotation: typeAnnotation
	            };
	        },

	        createFunctionTypeAnnotation: function (params, returnType, rest, typeParameters) {
	            return {
	                type: Syntax.FunctionTypeAnnotation,
	                params: params,
	                returnType: returnType,
	                rest: rest,
	                typeParameters: typeParameters
	            };
	        },

	        createFunctionTypeParam: function (name, typeAnnotation, optional) {
	            return {
	                type: Syntax.FunctionTypeParam,
	                name: name,
	                typeAnnotation: typeAnnotation,
	                optional: optional
	            };
	        },

	        createNullableTypeAnnotation: function (typeAnnotation) {
	            return {
	                type: Syntax.NullableTypeAnnotation,
	                typeAnnotation: typeAnnotation
	            };
	        },

	        createArrayTypeAnnotation: function (elementType) {
	            return {
	                type: Syntax.ArrayTypeAnnotation,
	                elementType: elementType
	            };
	        },

	        createGenericTypeAnnotation: function (id, typeParameters) {
	            return {
	                type: Syntax.GenericTypeAnnotation,
	                id: id,
	                typeParameters: typeParameters
	            };
	        },

	        createQualifiedTypeIdentifier: function (qualification, id) {
	            return {
	                type: Syntax.QualifiedTypeIdentifier,
	                qualification: qualification,
	                id: id
	            };
	        },

	        createTypeParameterDeclaration: function (params) {
	            return {
	                type: Syntax.TypeParameterDeclaration,
	                params: params
	            };
	        },

	        createTypeParameterInstantiation: function (params) {
	            return {
	                type: Syntax.TypeParameterInstantiation,
	                params: params
	            };
	        },

	        createAnyTypeAnnotation: function () {
	            return {
	                type: Syntax.AnyTypeAnnotation
	            };
	        },

	        createBooleanTypeAnnotation: function () {
	            return {
	                type: Syntax.BooleanTypeAnnotation
	            };
	        },

	        createNumberTypeAnnotation: function () {
	            return {
	                type: Syntax.NumberTypeAnnotation
	            };
	        },

	        createStringTypeAnnotation: function () {
	            return {
	                type: Syntax.StringTypeAnnotation
	            };
	        },

	        createStringLiteralTypeAnnotation: function (token) {
	            return {
	                type: Syntax.StringLiteralTypeAnnotation,
	                value: token.value,
	                raw: source.slice(token.range[0], token.range[1])
	            };
	        },

	        createVoidTypeAnnotation: function () {
	            return {
	                type: Syntax.VoidTypeAnnotation
	            };
	        },

	        createTypeofTypeAnnotation: function (argument) {
	            return {
	                type: Syntax.TypeofTypeAnnotation,
	                argument: argument
	            };
	        },

	        createTupleTypeAnnotation: function (types) {
	            return {
	                type: Syntax.TupleTypeAnnotation,
	                types: types
	            };
	        },

	        createObjectTypeAnnotation: function (properties, indexers, callProperties) {
	            return {
	                type: Syntax.ObjectTypeAnnotation,
	                properties: properties,
	                indexers: indexers,
	                callProperties: callProperties
	            };
	        },

	        createObjectTypeIndexer: function (id, key, value, isStatic) {
	            return {
	                type: Syntax.ObjectTypeIndexer,
	                id: id,
	                key: key,
	                value: value,
	                static: isStatic
	            };
	        },

	        createObjectTypeCallProperty: function (value, isStatic) {
	            return {
	                type: Syntax.ObjectTypeCallProperty,
	                value: value,
	                static: isStatic
	            };
	        },

	        createObjectTypeProperty: function (key, value, optional, isStatic) {
	            return {
	                type: Syntax.ObjectTypeProperty,
	                key: key,
	                value: value,
	                optional: optional,
	                static: isStatic
	            };
	        },

	        createUnionTypeAnnotation: function (types) {
	            return {
	                type: Syntax.UnionTypeAnnotation,
	                types: types
	            };
	        },

	        createIntersectionTypeAnnotation: function (types) {
	            return {
	                type: Syntax.IntersectionTypeAnnotation,
	                types: types
	            };
	        },

	        createTypeAlias: function (id, typeParameters, right) {
	            return {
	                type: Syntax.TypeAlias,
	                id: id,
	                typeParameters: typeParameters,
	                right: right
	            };
	        },

	        createInterface: function (id, typeParameters, body, extended) {
	            return {
	                type: Syntax.InterfaceDeclaration,
	                id: id,
	                typeParameters: typeParameters,
	                body: body,
	                extends: extended
	            };
	        },

	        createInterfaceExtends: function (id, typeParameters) {
	            return {
	                type: Syntax.InterfaceExtends,
	                id: id,
	                typeParameters: typeParameters
	            };
	        },

	        createDeclareFunction: function (id) {
	            return {
	                type: Syntax.DeclareFunction,
	                id: id
	            };
	        },

	        createDeclareVariable: function (id) {
	            return {
	                type: Syntax.DeclareVariable,
	                id: id
	            };
	        },

	        createDeclareModule: function (id, body) {
	            return {
	                type: Syntax.DeclareModule,
	                id: id,
	                body: body
	            };
	        },

	        createJSXAttribute: function (name, value) {
	            return {
	                type: Syntax.JSXAttribute,
	                name: name,
	                value: value || null
	            };
	        },

	        createJSXSpreadAttribute: function (argument) {
	            return {
	                type: Syntax.JSXSpreadAttribute,
	                argument: argument
	            };
	        },

	        createJSXIdentifier: function (name) {
	            return {
	                type: Syntax.JSXIdentifier,
	                name: name
	            };
	        },

	        createJSXNamespacedName: function (namespace, name) {
	            return {
	                type: Syntax.JSXNamespacedName,
	                namespace: namespace,
	                name: name
	            };
	        },

	        createJSXMemberExpression: function (object, property) {
	            return {
	                type: Syntax.JSXMemberExpression,
	                object: object,
	                property: property
	            };
	        },

	        createJSXElement: function (openingElement, closingElement, children) {
	            return {
	                type: Syntax.JSXElement,
	                openingElement: openingElement,
	                closingElement: closingElement,
	                children: children
	            };
	        },

	        createJSXEmptyExpression: function () {
	            return {
	                type: Syntax.JSXEmptyExpression
	            };
	        },

	        createJSXExpressionContainer: function (expression) {
	            return {
	                type: Syntax.JSXExpressionContainer,
	                expression: expression
	            };
	        },

	        createJSXOpeningElement: function (name, attributes, selfClosing) {
	            return {
	                type: Syntax.JSXOpeningElement,
	                name: name,
	                selfClosing: selfClosing,
	                attributes: attributes
	            };
	        },

	        createJSXClosingElement: function (name) {
	            return {
	                type: Syntax.JSXClosingElement,
	                name: name
	            };
	        },

	        createIfStatement: function (test, consequent, alternate) {
	            return {
	                type: Syntax.IfStatement,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },

	        createLabeledStatement: function (label, body) {
	            return {
	                type: Syntax.LabeledStatement,
	                label: label,
	                body: body
	            };
	        },

	        createLiteral: function (token) {
	            var object = {
	                type: Syntax.Literal,
	                value: token.value,
	                raw: source.slice(token.range[0], token.range[1])
	            };
	            if (token.regex) {
	                object.regex = token.regex;
	            }
	            return object;
	        },

	        createMemberExpression: function (accessor, object, property) {
	            return {
	                type: Syntax.MemberExpression,
	                computed: accessor === '[',
	                object: object,
	                property: property
	            };
	        },

	        createNewExpression: function (callee, args) {
	            return {
	                type: Syntax.NewExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },

	        createObjectExpression: function (properties) {
	            return {
	                type: Syntax.ObjectExpression,
	                properties: properties
	            };
	        },

	        createPostfixExpression: function (operator, argument) {
	            return {
	                type: Syntax.UpdateExpression,
	                operator: operator,
	                argument: argument,
	                prefix: false
	            };
	        },

	        createProgram: function (body) {
	            return {
	                type: Syntax.Program,
	                body: body
	            };
	        },

	        createProperty: function (kind, key, value, method, shorthand, computed) {
	            return {
	                type: Syntax.Property,
	                key: key,
	                value: value,
	                kind: kind,
	                method: method,
	                shorthand: shorthand,
	                computed: computed
	            };
	        },

	        createReturnStatement: function (argument) {
	            return {
	                type: Syntax.ReturnStatement,
	                argument: argument
	            };
	        },

	        createSequenceExpression: function (expressions) {
	            return {
	                type: Syntax.SequenceExpression,
	                expressions: expressions
	            };
	        },

	        createSwitchCase: function (test, consequent) {
	            return {
	                type: Syntax.SwitchCase,
	                test: test,
	                consequent: consequent
	            };
	        },

	        createSwitchStatement: function (discriminant, cases) {
	            return {
	                type: Syntax.SwitchStatement,
	                discriminant: discriminant,
	                cases: cases
	            };
	        },

	        createThisExpression: function () {
	            return {
	                type: Syntax.ThisExpression
	            };
	        },

	        createThrowStatement: function (argument) {
	            return {
	                type: Syntax.ThrowStatement,
	                argument: argument
	            };
	        },

	        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
	            return {
	                type: Syntax.TryStatement,
	                block: block,
	                guardedHandlers: guardedHandlers,
	                handlers: handlers,
	                finalizer: finalizer
	            };
	        },

	        createUnaryExpression: function (operator, argument) {
	            if (operator === '++' || operator === '--') {
	                return {
	                    type: Syntax.UpdateExpression,
	                    operator: operator,
	                    argument: argument,
	                    prefix: true
	                };
	            }
	            return {
	                type: Syntax.UnaryExpression,
	                operator: operator,
	                argument: argument,
	                prefix: true
	            };
	        },

	        createVariableDeclaration: function (declarations, kind) {
	            return {
	                type: Syntax.VariableDeclaration,
	                declarations: declarations,
	                kind: kind
	            };
	        },

	        createVariableDeclarator: function (id, init) {
	            return {
	                type: Syntax.VariableDeclarator,
	                id: id,
	                init: init
	            };
	        },

	        createWhileStatement: function (test, body) {
	            return {
	                type: Syntax.WhileStatement,
	                test: test,
	                body: body
	            };
	        },

	        createWithStatement: function (object, body) {
	            return {
	                type: Syntax.WithStatement,
	                object: object,
	                body: body
	            };
	        },

	        createTemplateElement: function (value, tail) {
	            return {
	                type: Syntax.TemplateElement,
	                value: value,
	                tail: tail
	            };
	        },

	        createTemplateLiteral: function (quasis, expressions) {
	            return {
	                type: Syntax.TemplateLiteral,
	                quasis: quasis,
	                expressions: expressions
	            };
	        },

	        createSpreadElement: function (argument) {
	            return {
	                type: Syntax.SpreadElement,
	                argument: argument
	            };
	        },

	        createSpreadProperty: function (argument) {
	            return {
	                type: Syntax.SpreadProperty,
	                argument: argument
	            };
	        },

	        createTaggedTemplateExpression: function (tag, quasi) {
	            return {
	                type: Syntax.TaggedTemplateExpression,
	                tag: tag,
	                quasi: quasi
	            };
	        },

	        createArrowFunctionExpression: function (params, defaults, body, rest, expression, isAsync) {
	            var arrowExpr = {
	                type: Syntax.ArrowFunctionExpression,
	                id: null,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: rest,
	                generator: false,
	                expression: expression
	            };

	            if (isAsync) {
	                arrowExpr.async = true;
	            }

	            return arrowExpr;
	        },

	        createMethodDefinition: function (propertyType, kind, key, value, computed) {
	            return {
	                type: Syntax.MethodDefinition,
	                key: key,
	                value: value,
	                kind: kind,
	                'static': propertyType === ClassPropertyType.static,
	                computed: computed
	            };
	        },

	        createClassProperty: function (key, typeAnnotation, computed, isStatic) {
	            return {
	                type: Syntax.ClassProperty,
	                key: key,
	                typeAnnotation: typeAnnotation,
	                computed: computed,
	                static: isStatic
	            };
	        },

	        createClassBody: function (body) {
	            return {
	                type: Syntax.ClassBody,
	                body: body
	            };
	        },

	        createClassImplements: function (id, typeParameters) {
	            return {
	                type: Syntax.ClassImplements,
	                id: id,
	                typeParameters: typeParameters
	            };
	        },

	        createClassExpression: function (id, superClass, body, typeParameters, superTypeParameters, implemented) {
	            return {
	                type: Syntax.ClassExpression,
	                id: id,
	                superClass: superClass,
	                body: body,
	                typeParameters: typeParameters,
	                superTypeParameters: superTypeParameters,
	                implements: implemented
	            };
	        },

	        createClassDeclaration: function (id, superClass, body, typeParameters, superTypeParameters, implemented) {
	            return {
	                type: Syntax.ClassDeclaration,
	                id: id,
	                superClass: superClass,
	                body: body,
	                typeParameters: typeParameters,
	                superTypeParameters: superTypeParameters,
	                implements: implemented
	            };
	        },

	        createModuleSpecifier: function (token) {
	            return {
	                type: Syntax.ModuleSpecifier,
	                value: token.value,
	                raw: source.slice(token.range[0], token.range[1])
	            };
	        },

	        createExportSpecifier: function (id, name) {
	            return {
	                type: Syntax.ExportSpecifier,
	                id: id,
	                name: name
	            };
	        },

	        createExportBatchSpecifier: function () {
	            return {
	                type: Syntax.ExportBatchSpecifier
	            };
	        },

	        createImportDefaultSpecifier: function (id) {
	            return {
	                type: Syntax.ImportDefaultSpecifier,
	                id: id
	            };
	        },

	        createImportNamespaceSpecifier: function (id) {
	            return {
	                type: Syntax.ImportNamespaceSpecifier,
	                id: id
	            };
	        },

	        createExportDeclaration: function (isDefault, declaration, specifiers, src) {
	            return {
	                type: Syntax.ExportDeclaration,
	                'default': !!isDefault,
	                declaration: declaration,
	                specifiers: specifiers,
	                source: src
	            };
	        },

	        createImportSpecifier: function (id, name) {
	            return {
	                type: Syntax.ImportSpecifier,
	                id: id,
	                name: name
	            };
	        },

	        createImportDeclaration: function (specifiers, src, isType) {
	            return {
	                type: Syntax.ImportDeclaration,
	                specifiers: specifiers,
	                source: src,
	                isType: isType
	            };
	        },

	        createYieldExpression: function (argument, dlg) {
	            return {
	                type: Syntax.YieldExpression,
	                argument: argument,
	                delegate: dlg
	            };
	        },

	        createAwaitExpression: function (argument) {
	            return {
	                type: Syntax.AwaitExpression,
	                argument: argument
	            };
	        },

	        createComprehensionExpression: function (filter, blocks, body) {
	            return {
	                type: Syntax.ComprehensionExpression,
	                filter: filter,
	                blocks: blocks,
	                body: body
	            };
	        }

	    };

	    // Return true if there is a line terminator before the next token.

	    function peekLineTerminator() {
	        var pos, line, start, found;

	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        skipComment();
	        found = lineNumber !== line;
	        index = pos;
	        lineNumber = line;
	        lineStart = start;

	        return found;
	    }

	    // Throw an exception

	    function throwError(token, messageFormat) {
	        var error,
	            args = Array.prototype.slice.call(arguments, 2),
	            msg = messageFormat.replace(
	                /%(\d)/g,
	                function (whole, idx) {
	                    assert(idx < args.length, 'Message reference must be in range');
	                    return args[idx];
	                }
	            );

	        if (typeof token.lineNumber === 'number') {
	            error = new Error('Line ' + token.lineNumber + ': ' + msg);
	            error.index = token.range[0];
	            error.lineNumber = token.lineNumber;
	            error.column = token.range[0] - lineStart + 1;
	        } else {
	            error = new Error('Line ' + lineNumber + ': ' + msg);
	            error.index = index;
	            error.lineNumber = lineNumber;
	            error.column = index - lineStart + 1;
	        }

	        error.description = msg;
	        throw error;
	    }

	    function throwErrorTolerant() {
	        try {
	            throwError.apply(null, arguments);
	        } catch (e) {
	            if (extra.errors) {
	                extra.errors.push(e);
	            } else {
	                throw e;
	            }
	        }
	    }


	    // Throw an exception because of the token.

	    function throwUnexpected(token) {
	        if (token.type === Token.EOF) {
	            throwError(token, Messages.UnexpectedEOS);
	        }

	        if (token.type === Token.NumericLiteral) {
	            throwError(token, Messages.UnexpectedNumber);
	        }

	        if (token.type === Token.StringLiteral || token.type === Token.JSXText) {
	            throwError(token, Messages.UnexpectedString);
	        }

	        if (token.type === Token.Identifier) {
	            throwError(token, Messages.UnexpectedIdentifier);
	        }

	        if (token.type === Token.Keyword) {
	            if (isFutureReservedWord(token.value)) {
	                throwError(token, Messages.UnexpectedReserved);
	            } else if (strict && isStrictModeReservedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictReservedWord);
	                return;
	            }
	            throwError(token, Messages.UnexpectedToken, token.value);
	        }

	        if (token.type === Token.Template) {
	            throwError(token, Messages.UnexpectedTemplate, token.value.raw);
	        }

	        // BooleanLiteral, NullLiteral, or Punctuator.
	        throwError(token, Messages.UnexpectedToken, token.value);
	    }

	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.

	    function expect(value) {
	        var token = lex();
	        if (token.type !== Token.Punctuator || token.value !== value) {
	            throwUnexpected(token);
	        }
	    }

	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.

	    function expectKeyword(keyword, contextual) {
	        var token = lex();
	        if (token.type !== (contextual ? Token.Identifier : Token.Keyword) ||
	                token.value !== keyword) {
	            throwUnexpected(token);
	        }
	    }

	    // Expect the next token to match the specified contextual keyword.
	    // If not, an exception will be thrown.

	    function expectContextualKeyword(keyword) {
	        return expectKeyword(keyword, true);
	    }

	    // Return true if the next token matches the specified punctuator.

	    function match(value) {
	        return lookahead.type === Token.Punctuator && lookahead.value === value;
	    }

	    // Return true if the next token matches the specified keyword

	    function matchKeyword(keyword, contextual) {
	        var expectedType = contextual ? Token.Identifier : Token.Keyword;
	        return lookahead.type === expectedType && lookahead.value === keyword;
	    }

	    // Return true if the next token matches the specified contextual keyword

	    function matchContextualKeyword(keyword) {
	        return matchKeyword(keyword, true);
	    }

	    // Return true if the next token is an assignment operator

	    function matchAssign() {
	        var op;

	        if (lookahead.type !== Token.Punctuator) {
	            return false;
	        }
	        op = lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    }

	    // Note that 'yield' is treated as a keyword in strict mode, but a
	    // contextual keyword (identifier) in non-strict mode, so we need to
	    // use matchKeyword('yield', false) and matchKeyword('yield', true)
	    // (i.e. matchContextualKeyword) appropriately.
	    function matchYield() {
	        return state.yieldAllowed && matchKeyword('yield', !strict);
	    }

	    function matchAsync() {
	        var backtrackToken = lookahead, matches = false;

	        if (matchContextualKeyword('async')) {
	            lex(); // Make sure peekLineTerminator() starts after 'async'.
	            matches = !peekLineTerminator();
	            rewind(backtrackToken); // Revert the lex().
	        }

	        return matches;
	    }

	    function matchAwait() {
	        return state.awaitAllowed && matchContextualKeyword('await');
	    }

	    function consumeSemicolon() {
	        var line, oldIndex = index, oldLineNumber = lineNumber,
	            oldLineStart = lineStart, oldLookahead = lookahead;

	        // Catch the very common case first: immediately a semicolon (char #59).
	        if (source.charCodeAt(index) === 59) {
	            lex();
	            return;
	        }

	        line = lineNumber;
	        skipComment();
	        if (lineNumber !== line) {
	            index = oldIndex;
	            lineNumber = oldLineNumber;
	            lineStart = oldLineStart;
	            lookahead = oldLookahead;
	            return;
	        }

	        if (match(';')) {
	            lex();
	            return;
	        }

	        if (lookahead.type !== Token.EOF && !match('}')) {
	            throwUnexpected(lookahead);
	        }
	    }

	    // Return true if provided expression is LeftHandSideExpression

	    function isLeftHandSide(expr) {
	        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
	    }

	    function isAssignableLeftHandSide(expr) {
	        return isLeftHandSide(expr) || expr.type === Syntax.ObjectPattern || expr.type === Syntax.ArrayPattern;
	    }

	    // 11.1.4 Array Initialiser

	    function parseArrayInitialiser() {
	        var elements = [], blocks = [], filter = null, tmp, possiblecomprehension = true,
	            marker = markerCreate();

	        expect('[');
	        while (!match(']')) {
	            if (lookahead.value === 'for' &&
	                    lookahead.type === Token.Keyword) {
	                if (!possiblecomprehension) {
	                    throwError({}, Messages.ComprehensionError);
	                }
	                matchKeyword('for');
	                tmp = parseForStatement({ignoreBody: true});
	                tmp.of = tmp.type === Syntax.ForOfStatement;
	                tmp.type = Syntax.ComprehensionBlock;
	                if (tmp.left.kind) { // can't be let or const
	                    throwError({}, Messages.ComprehensionError);
	                }
	                blocks.push(tmp);
	            } else if (lookahead.value === 'if' &&
	                           lookahead.type === Token.Keyword) {
	                if (!possiblecomprehension) {
	                    throwError({}, Messages.ComprehensionError);
	                }
	                expectKeyword('if');
	                expect('(');
	                filter = parseExpression();
	                expect(')');
	            } else if (lookahead.value === ',' &&
	                           lookahead.type === Token.Punctuator) {
	                possiblecomprehension = false; // no longer allowed.
	                lex();
	                elements.push(null);
	            } else {
	                tmp = parseSpreadOrAssignmentExpression();
	                elements.push(tmp);
	                if (tmp && tmp.type === Syntax.SpreadElement) {
	                    if (!match(']')) {
	                        throwError({}, Messages.ElementAfterSpreadElement);
	                    }
	                } else if (!(match(']') || matchKeyword('for') || matchKeyword('if'))) {
	                    expect(','); // this lexes.
	                    possiblecomprehension = false;
	                }
	            }
	        }

	        expect(']');

	        if (filter && !blocks.length) {
	            throwError({}, Messages.ComprehensionRequiresBlock);
	        }

	        if (blocks.length) {
	            if (elements.length !== 1) {
	                throwError({}, Messages.ComprehensionError);
	            }
	            return markerApply(marker, delegate.createComprehensionExpression(filter, blocks, elements[0]));
	        }
	        return markerApply(marker, delegate.createArrayExpression(elements));
	    }

	    // 11.1.5 Object Initialiser

	    function parsePropertyFunction(options) {
	        var previousStrict, previousYieldAllowed, previousAwaitAllowed,
	            params, defaults, body, marker = markerCreate();

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = options.generator;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = options.async;
	        params = options.params || [];
	        defaults = options.defaults || [];

	        body = parseConciseBody();
	        if (options.name && strict && isRestrictedWord(params[0].name)) {
	            throwErrorTolerant(options.name, Messages.StrictParamName);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(marker, delegate.createFunctionExpression(
	            null,
	            params,
	            defaults,
	            body,
	            options.rest || null,
	            options.generator,
	            body.type !== Syntax.BlockStatement,
	            options.async,
	            options.returnType,
	            options.typeParameters
	        ));
	    }


	    function parsePropertyMethodFunction(options) {
	        var previousStrict, tmp, method;

	        previousStrict = strict;
	        strict = true;

	        tmp = parseParams();

	        if (tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, tmp.message);
	        }

	        method = parsePropertyFunction({
	            params: tmp.params,
	            defaults: tmp.defaults,
	            rest: tmp.rest,
	            generator: options.generator,
	            async: options.async,
	            returnType: tmp.returnType,
	            typeParameters: options.typeParameters
	        });

	        strict = previousStrict;

	        return method;
	    }


	    function parseObjectPropertyKey() {
	        var marker = markerCreate(),
	            token = lex(),
	            propertyKey,
	            result;

	        // Note: This function is called only from parseObjectProperty(), where
	        // EOF and Punctuator tokens are already filtered out.

	        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
	            if (strict && token.octal) {
	                throwErrorTolerant(token, Messages.StrictOctalLiteral);
	            }
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (token.type === Token.Punctuator && token.value === '[') {
	            // For computed properties we should skip the [ and ], and
	            // capture in marker only the assignment expression itself.
	            marker = markerCreate();
	            propertyKey = parseAssignmentExpression();
	            result = markerApply(marker, propertyKey);
	            expect(']');
	            return result;
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseObjectProperty() {
	        var token, key, id, param, computed,
	            marker = markerCreate(), returnType, typeParameters;

	        token = lookahead;
	        computed = (token.value === '[' && token.type === Token.Punctuator);

	        if (token.type === Token.Identifier || computed || matchAsync()) {
	            id = parseObjectPropertyKey();

	            if (match(':')) {
	                lex();

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'init',
	                        id,
	                        parseAssignmentExpression(),
	                        false,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (match('(') || match('<')) {
	                if (match('<')) {
	                    typeParameters = parseTypeParameterDeclaration();
	                }
	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'init',
	                        id,
	                        parsePropertyMethodFunction({
	                            generator: false,
	                            async: false,
	                            typeParameters: typeParameters
	                        }),
	                        true,
	                        false,
	                        computed
	                    )
	                );
	            }

	            // Property Assignment: Getter and Setter.

	            if (token.value === 'get') {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();

	                expect('(');
	                expect(')');
	                if (match(':')) {
	                    returnType = parseTypeAnnotation();
	                }

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'get',
	                        key,
	                        parsePropertyFunction({
	                            generator: false,
	                            async: false,
	                            returnType: returnType
	                        }),
	                        false,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (token.value === 'set') {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();

	                expect('(');
	                token = lookahead;
	                param = [ parseTypeAnnotatableIdentifier() ];
	                expect(')');
	                if (match(':')) {
	                    returnType = parseTypeAnnotation();
	                }

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'set',
	                        key,
	                        parsePropertyFunction({
	                            params: param,
	                            generator: false,
	                            async: false,
	                            name: token,
	                            returnType: returnType
	                        }),
	                        false,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (token.value === 'async') {
	                computed = (lookahead.value === '[');
	                key = parseObjectPropertyKey();

	                if (match('<')) {
	                    typeParameters = parseTypeParameterDeclaration();
	                }

	                return markerApply(
	                    marker,
	                    delegate.createProperty(
	                        'init',
	                        key,
	                        parsePropertyMethodFunction({
	                            generator: false,
	                            async: true,
	                            typeParameters: typeParameters
	                        }),
	                        true,
	                        false,
	                        computed
	                    )
	                );
	            }

	            if (computed) {
	                // Computed properties can only be used with full notation.
	                throwUnexpected(lookahead);
	            }

	            return markerApply(
	                marker,
	                delegate.createProperty('init', id, id, false, true, false)
	            );
	        }

	        if (token.type === Token.EOF || token.type === Token.Punctuator) {
	            if (!match('*')) {
	                throwUnexpected(token);
	            }
	            lex();

	            computed = (lookahead.type === Token.Punctuator && lookahead.value === '[');

	            id = parseObjectPropertyKey();

	            if (match('<')) {
	                typeParameters = parseTypeParameterDeclaration();
	            }

	            if (!match('(')) {
	                throwUnexpected(lex());
	            }

	            return markerApply(marker, delegate.createProperty(
	                'init',
	                id,
	                parsePropertyMethodFunction({
	                    generator: true,
	                    typeParameters: typeParameters
	                }),
	                true,
	                false,
	                computed
	            ));
	        }
	        key = parseObjectPropertyKey();
	        if (match(':')) {
	            lex();
	            return markerApply(marker, delegate.createProperty('init', key, parseAssignmentExpression(), false, false, false));
	        }
	        if (match('(') || match('<')) {
	            if (match('<')) {
	                typeParameters = parseTypeParameterDeclaration();
	            }
	            return markerApply(marker, delegate.createProperty(
	                'init',
	                key,
	                parsePropertyMethodFunction({
	                    generator: false,
	                    typeParameters: typeParameters
	                }),
	                true,
	                false,
	                false
	            ));
	        }
	        throwUnexpected(lex());
	    }

	    function parseObjectSpreadProperty() {
	        var marker = markerCreate();
	        expect('...');
	        return markerApply(marker, delegate.createSpreadProperty(parseAssignmentExpression()));
	    }

	    function getFieldName(key) {
	        var toString = String;
	        if (key.type === Syntax.Identifier) {
	            return key.name;
	        }
	        return toString(key.value);
	    }

	    function parseObjectInitialiser() {
	        var properties = [], property, name, kind, storedKind, map = new StringMap(),
	            marker = markerCreate(), toString = String;

	        expect('{');

	        while (!match('}')) {
	            if (match('...')) {
	                property = parseObjectSpreadProperty();
	            } else {
	                property = parseObjectProperty();

	                if (property.key.type === Syntax.Identifier) {
	                    name = property.key.name;
	                } else {
	                    name = toString(property.key.value);
	                }
	                kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;

	                if (map.has(name)) {
	                    storedKind = map.get(name);
	                    if (storedKind === PropertyKind.Data) {
	                        if (strict && kind === PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.StrictDuplicateProperty);
	                        } else if (kind !== PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.AccessorDataProperty);
	                        }
	                    } else {
	                        if (kind === PropertyKind.Data) {
	                            throwErrorTolerant({}, Messages.AccessorDataProperty);
	                        } else if (storedKind & kind) {
	                            throwErrorTolerant({}, Messages.AccessorGetSet);
	                        }
	                    }
	                    map.set(name, storedKind | kind);
	                } else {
	                    map.set(name, kind);
	                }
	            }

	            properties.push(property);

	            if (!match('}')) {
	                expect(',');
	            }
	        }

	        expect('}');

	        return markerApply(marker, delegate.createObjectExpression(properties));
	    }

	    function parseTemplateElement(option) {
	        var marker = markerCreate(),
	            token = scanTemplateElement(option);
	        if (strict && token.octal) {
	            throwError(token, Messages.StrictOctalLiteral);
	        }
	        return markerApply(marker, delegate.createTemplateElement({ raw: token.value.raw, cooked: token.value.cooked }, token.tail));
	    }

	    function parseTemplateLiteral() {
	        var quasi, quasis, expressions, marker = markerCreate();

	        quasi = parseTemplateElement({ head: true });
	        quasis = [ quasi ];
	        expressions = [];

	        while (!quasi.tail) {
	            expressions.push(parseExpression());
	            quasi = parseTemplateElement({ head: false });
	            quasis.push(quasi);
	        }

	        return markerApply(marker, delegate.createTemplateLiteral(quasis, expressions));
	    }

	    // 11.1.6 The Grouping Operator

	    function parseGroupExpression() {
	        var expr, marker, typeAnnotation;

	        expect('(');

	        ++state.parenthesizedCount;

	        marker = markerCreate();

	        expr = parseExpression();

	        if (match(':')) {
	            typeAnnotation = parseTypeAnnotation();
	            expr = markerApply(marker, delegate.createTypeCast(
	                expr,
	                typeAnnotation
	            ));
	        }

	        expect(')');

	        return expr;
	    }

	    function matchAsyncFuncExprOrDecl() {
	        var token;

	        if (matchAsync()) {
	            token = lookahead2();
	            if (token.type === Token.Keyword && token.value === 'function') {
	                return true;
	            }
	        }

	        return false;
	    }

	    // 11.1 Primary Expressions

	    function parsePrimaryExpression() {
	        var marker, type, token, expr;

	        type = lookahead.type;

	        if (type === Token.Identifier) {
	            marker = markerCreate();
	            return markerApply(marker, delegate.createIdentifier(lex().value));
	        }

	        if (type === Token.StringLiteral || type === Token.NumericLiteral) {
	            if (strict && lookahead.octal) {
	                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	            }
	            marker = markerCreate();
	            return markerApply(marker, delegate.createLiteral(lex()));
	        }

	        if (type === Token.Keyword) {
	            if (matchKeyword('this')) {
	                marker = markerCreate();
	                lex();
	                return markerApply(marker, delegate.createThisExpression());
	            }

	            if (matchKeyword('function')) {
	                return parseFunctionExpression();
	            }

	            if (matchKeyword('class')) {
	                return parseClassExpression();
	            }

	            if (matchKeyword('super')) {
	                marker = markerCreate();
	                lex();
	                return markerApply(marker, delegate.createIdentifier('super'));
	            }
	        }

	        if (type === Token.BooleanLiteral) {
	            marker = markerCreate();
	            token = lex();
	            token.value = (token.value === 'true');
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (type === Token.NullLiteral) {
	            marker = markerCreate();
	            token = lex();
	            token.value = null;
	            return markerApply(marker, delegate.createLiteral(token));
	        }

	        if (match('[')) {
	            return parseArrayInitialiser();
	        }

	        if (match('{')) {
	            return parseObjectInitialiser();
	        }

	        if (match('(')) {
	            return parseGroupExpression();
	        }

	        if (match('/') || match('/=')) {
	            marker = markerCreate();
	            expr = delegate.createLiteral(scanRegExp());
	            peek();
	            return markerApply(marker, expr);
	        }

	        if (type === Token.Template) {
	            return parseTemplateLiteral();
	        }

	        if (match('<')) {
	            return parseJSXElement();
	        }

	        throwUnexpected(lex());
	    }

	    // 11.2 Left-Hand-Side Expressions

	    function parseArguments() {
	        var args = [], arg;

	        expect('(');

	        if (!match(')')) {
	            while (index < length) {
	                arg = parseSpreadOrAssignmentExpression();
	                args.push(arg);

	                if (match(')')) {
	                    break;
	                } else if (arg.type === Syntax.SpreadElement) {
	                    throwError({}, Messages.ElementAfterSpreadElement);
	                }

	                expect(',');
	            }
	        }

	        expect(')');

	        return args;
	    }

	    function parseSpreadOrAssignmentExpression() {
	        if (match('...')) {
	            var marker = markerCreate();
	            lex();
	            return markerApply(marker, delegate.createSpreadElement(parseAssignmentExpression()));
	        }
	        return parseAssignmentExpression();
	    }

	    function parseNonComputedProperty() {
	        var marker = markerCreate(),
	            token = lex();

	        if (!isIdentifierName(token)) {
	            throwUnexpected(token);
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseNonComputedMember() {
	        expect('.');

	        return parseNonComputedProperty();
	    }

	    function parseComputedMember() {
	        var expr;

	        expect('[');

	        expr = parseExpression();

	        expect(']');

	        return expr;
	    }

	    function parseNewExpression() {
	        var callee, args, marker = markerCreate();

	        expectKeyword('new');
	        callee = parseLeftHandSideExpression();
	        args = match('(') ? parseArguments() : [];

	        return markerApply(marker, delegate.createNewExpression(callee, args));
	    }

	    function parseLeftHandSideExpressionAllowCall() {
	        var expr, args, marker = markerCreate();

	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

	        while (match('.') || match('[') || match('(') || lookahead.type === Token.Template) {
	            if (match('(')) {
	                args = parseArguments();
	                expr = markerApply(marker, delegate.createCallExpression(expr, args));
	            } else if (match('[')) {
	                expr = markerApply(marker, delegate.createMemberExpression('[', expr, parseComputedMember()));
	            } else if (match('.')) {
	                expr = markerApply(marker, delegate.createMemberExpression('.', expr, parseNonComputedMember()));
	            } else {
	                expr = markerApply(marker, delegate.createTaggedTemplateExpression(expr, parseTemplateLiteral()));
	            }
	        }

	        return expr;
	    }

	    function parseLeftHandSideExpression() {
	        var expr, marker = markerCreate();

	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

	        while (match('.') || match('[') || lookahead.type === Token.Template) {
	            if (match('[')) {
	                expr = markerApply(marker, delegate.createMemberExpression('[', expr, parseComputedMember()));
	            } else if (match('.')) {
	                expr = markerApply(marker, delegate.createMemberExpression('.', expr, parseNonComputedMember()));
	            } else {
	                expr = markerApply(marker, delegate.createTaggedTemplateExpression(expr, parseTemplateLiteral()));
	            }
	        }

	        return expr;
	    }

	    // 11.3 Postfix Expressions

	    function parsePostfixExpression() {
	        var marker = markerCreate(),
	            expr = parseLeftHandSideExpressionAllowCall(),
	            token;

	        if (lookahead.type !== Token.Punctuator) {
	            return expr;
	        }

	        if ((match('++') || match('--')) && !peekLineTerminator()) {
	            // 11.3.1, 11.3.2
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPostfix);
	            }

	            if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            token = lex();
	            expr = markerApply(marker, delegate.createPostfixExpression(token.value, expr));
	        }

	        return expr;
	    }

	    // 11.4 Unary Operators

	    function parseUnaryExpression() {
	        var marker, token, expr;

	        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
	            return parsePostfixExpression();
	        }

	        if (match('++') || match('--')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            // 11.4.4, 11.4.5
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPrefix);
	            }

	            if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            return markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	        }

	        if (match('+') || match('-') || match('~') || match('!')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            return markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	        }

	        if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
	            marker = markerCreate();
	            token = lex();
	            expr = parseUnaryExpression();
	            expr = markerApply(marker, delegate.createUnaryExpression(token.value, expr));
	            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
	                throwErrorTolerant({}, Messages.StrictDelete);
	            }
	            return expr;
	        }

	        return parsePostfixExpression();
	    }

	    function binaryPrecedence(token, allowIn) {
	        var prec = 0;

	        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
	            return 0;
	        }

	        switch (token.value) {
	        case '||':
	            prec = 1;
	            break;

	        case '&&':
	            prec = 2;
	            break;

	        case '|':
	            prec = 3;
	            break;

	        case '^':
	            prec = 4;
	            break;

	        case '&':
	            prec = 5;
	            break;

	        case '==':
	        case '!=':
	        case '===':
	        case '!==':
	            prec = 6;
	            break;

	        case '<':
	        case '>':
	        case '<=':
	        case '>=':
	        case 'instanceof':
	            prec = 7;
	            break;

	        case 'in':
	            prec = allowIn ? 7 : 0;
	            break;

	        case '<<':
	        case '>>':
	        case '>>>':
	            prec = 8;
	            break;

	        case '+':
	        case '-':
	            prec = 9;
	            break;

	        case '*':
	        case '/':
	        case '%':
	            prec = 11;
	            break;

	        default:
	            break;
	        }

	        return prec;
	    }

	    // 11.5 Multiplicative Operators
	    // 11.6 Additive Operators
	    // 11.7 Bitwise Shift Operators
	    // 11.8 Relational Operators
	    // 11.9 Equality Operators
	    // 11.10 Binary Bitwise Operators
	    // 11.11 Binary Logical Operators

	    function parseBinaryExpression() {
	        var expr, token, prec, previousAllowIn, stack, right, operator, left, i,
	            marker, markers;

	        previousAllowIn = state.allowIn;
	        state.allowIn = true;

	        marker = markerCreate();
	        left = parseUnaryExpression();

	        token = lookahead;
	        prec = binaryPrecedence(token, previousAllowIn);
	        if (prec === 0) {
	            return left;
	        }
	        token.prec = prec;
	        lex();

	        markers = [marker, markerCreate()];
	        right = parseUnaryExpression();

	        stack = [left, token, right];

	        while ((prec = binaryPrecedence(lookahead, previousAllowIn)) > 0) {

	            // Reduce: make a binary expression from the three topmost entries.
	            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
	                right = stack.pop();
	                operator = stack.pop().value;
	                left = stack.pop();
	                expr = delegate.createBinaryExpression(operator, left, right);
	                markers.pop();
	                marker = markers.pop();
	                markerApply(marker, expr);
	                stack.push(expr);
	                markers.push(marker);
	            }

	            // Shift.
	            token = lex();
	            token.prec = prec;
	            stack.push(token);
	            markers.push(markerCreate());
	            expr = parseUnaryExpression();
	            stack.push(expr);
	        }

	        state.allowIn = previousAllowIn;

	        // Final reduce to clean-up the stack.
	        i = stack.length - 1;
	        expr = stack[i];
	        markers.pop();
	        while (i > 1) {
	            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
	            i -= 2;
	            marker = markers.pop();
	            markerApply(marker, expr);
	        }

	        return expr;
	    }


	    // 11.12 Conditional Operator

	    function parseConditionalExpression() {
	        var expr, previousAllowIn, consequent, alternate, marker = markerCreate();
	        expr = parseBinaryExpression();

	        if (match('?')) {
	            lex();
	            previousAllowIn = state.allowIn;
	            state.allowIn = true;
	            consequent = parseAssignmentExpression();
	            state.allowIn = previousAllowIn;
	            expect(':');
	            alternate = parseAssignmentExpression();

	            expr = markerApply(marker, delegate.createConditionalExpression(expr, consequent, alternate));
	        }

	        return expr;
	    }

	    // 11.13 Assignment Operators

	    // 12.14.5 AssignmentPattern

	    function reinterpretAsAssignmentBindingPattern(expr) {
	        var i, len, property, element;

	        if (expr.type === Syntax.ObjectExpression) {
	            expr.type = Syntax.ObjectPattern;
	            for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                property = expr.properties[i];
	                if (property.type === Syntax.SpreadProperty) {
	                    if (i < len - 1) {
	                        throwError({}, Messages.PropertyAfterSpreadProperty);
	                    }
	                    reinterpretAsAssignmentBindingPattern(property.argument);
	                } else {
	                    if (property.kind !== 'init') {
	                        throwError({}, Messages.InvalidLHSInAssignment);
	                    }
	                    reinterpretAsAssignmentBindingPattern(property.value);
	                }
	            }
	        } else if (expr.type === Syntax.ArrayExpression) {
	            expr.type = Syntax.ArrayPattern;
	            for (i = 0, len = expr.elements.length; i < len; i += 1) {
	                element = expr.elements[i];
	                /* istanbul ignore else */
	                if (element) {
	                    reinterpretAsAssignmentBindingPattern(element);
	                }
	            }
	        } else if (expr.type === Syntax.Identifier) {
	            if (isRestrictedWord(expr.name)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }
	        } else if (expr.type === Syntax.SpreadElement) {
	            reinterpretAsAssignmentBindingPattern(expr.argument);
	            if (expr.argument.type === Syntax.ObjectPattern) {
	                throwError({}, Messages.ObjectPatternAsSpread);
	            }
	        } else {
	            /* istanbul ignore else */
	            if (expr.type !== Syntax.MemberExpression && expr.type !== Syntax.CallExpression && expr.type !== Syntax.NewExpression) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }
	        }
	    }

	    // 13.2.3 BindingPattern

	    function reinterpretAsDestructuredParameter(options, expr) {
	        var i, len, property, element;

	        if (expr.type === Syntax.ObjectExpression) {
	            expr.type = Syntax.ObjectPattern;
	            for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                property = expr.properties[i];
	                if (property.type === Syntax.SpreadProperty) {
	                    if (i < len - 1) {
	                        throwError({}, Messages.PropertyAfterSpreadProperty);
	                    }
	                    reinterpretAsDestructuredParameter(options, property.argument);
	                } else {
	                    if (property.kind !== 'init') {
	                        throwError({}, Messages.InvalidLHSInFormalsList);
	                    }
	                    reinterpretAsDestructuredParameter(options, property.value);
	                }
	            }
	        } else if (expr.type === Syntax.ArrayExpression) {
	            expr.type = Syntax.ArrayPattern;
	            for (i = 0, len = expr.elements.length; i < len; i += 1) {
	                element = expr.elements[i];
	                if (element) {
	                    reinterpretAsDestructuredParameter(options, element);
	                }
	            }
	        } else if (expr.type === Syntax.Identifier) {
	            validateParam(options, expr, expr.name);
	        } else if (expr.type === Syntax.SpreadElement) {
	            // BindingRestElement only allows BindingIdentifier
	            if (expr.argument.type !== Syntax.Identifier) {
	                throwError({}, Messages.InvalidLHSInFormalsList);
	            }
	            validateParam(options, expr.argument, expr.argument.name);
	        } else {
	            throwError({}, Messages.InvalidLHSInFormalsList);
	        }
	    }

	    function reinterpretAsCoverFormalsList(expressions) {
	        var i, len, param, params, defaults, defaultCount, options, rest;

	        params = [];
	        defaults = [];
	        defaultCount = 0;
	        rest = null;
	        options = {
	            paramSet: new StringMap()
	        };

	        for (i = 0, len = expressions.length; i < len; i += 1) {
	            param = expressions[i];
	            if (param.type === Syntax.Identifier) {
	                params.push(param);
	                defaults.push(null);
	                validateParam(options, param, param.name);
	            } else if (param.type === Syntax.ObjectExpression || param.type === Syntax.ArrayExpression) {
	                reinterpretAsDestructuredParameter(options, param);
	                params.push(param);
	                defaults.push(null);
	            } else if (param.type === Syntax.SpreadElement) {
	                assert(i === len - 1, 'It is guaranteed that SpreadElement is last element by parseExpression');
	                if (param.argument.type !== Syntax.Identifier) {
	                    throwError({}, Messages.InvalidLHSInFormalsList);
	                }
	                reinterpretAsDestructuredParameter(options, param.argument);
	                rest = param.argument;
	            } else if (param.type === Syntax.AssignmentExpression) {
	                params.push(param.left);
	                defaults.push(param.right);
	                ++defaultCount;
	                validateParam(options, param.left, param.left.name);
	            } else {
	                return null;
	            }
	        }

	        if (options.message === Messages.StrictParamDupe) {
	            throwError(
	                strict ? options.stricted : options.firstRestricted,
	                options.message
	            );
	        }

	        if (defaultCount === 0) {
	            defaults = [];
	        }

	        return {
	            params: params,
	            defaults: defaults,
	            rest: rest,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    }

	    function parseArrowFunctionExpression(options, marker) {
	        var previousStrict, previousYieldAllowed, previousAwaitAllowed, body;

	        expect('=>');

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = false;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = !!options.async;
	        body = parseConciseBody();

	        if (strict && options.firstRestricted) {
	            throwError(options.firstRestricted, options.message);
	        }
	        if (strict && options.stricted) {
	            throwErrorTolerant(options.stricted, options.message);
	        }

	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(marker, delegate.createArrowFunctionExpression(
	            options.params,
	            options.defaults,
	            body,
	            options.rest,
	            body.type !== Syntax.BlockStatement,
	            !!options.async
	        ));
	    }

	    function parseAssignmentExpression() {
	        var marker, expr, token, params, oldParenthesizedCount,
	            startsWithParen = false, backtrackToken = lookahead,
	            possiblyAsync = false;

	        if (matchYield()) {
	            return parseYieldExpression();
	        }

	        if (matchAwait()) {
	            return parseAwaitExpression();
	        }

	        oldParenthesizedCount = state.parenthesizedCount;

	        marker = markerCreate();

	        if (matchAsyncFuncExprOrDecl()) {
	            return parseFunctionExpression();
	        }

	        if (matchAsync()) {
	            // We can't be completely sure that this 'async' token is
	            // actually a contextual keyword modifying a function
	            // expression, so we might have to un-lex() it later by
	            // calling rewind(backtrackToken).
	            possiblyAsync = true;
	            lex();
	        }

	        if (match('(')) {
	            token = lookahead2();
	            if ((token.type === Token.Punctuator && token.value === ')') || token.value === '...') {
	                params = parseParams();
	                if (!match('=>')) {
	                    throwUnexpected(lex());
	                }
	                params.async = possiblyAsync;
	                return parseArrowFunctionExpression(params, marker);
	            }
	            startsWithParen = true;
	        }

	        token = lookahead;

	        // If the 'async' keyword is not followed by a '(' character or an
	        // identifier, then it can't be an arrow function modifier, and we
	        // should interpret it as a normal identifer.
	        if (possiblyAsync && !match('(') && token.type !== Token.Identifier) {
	            possiblyAsync = false;
	            rewind(backtrackToken);
	        }

	        expr = parseConditionalExpression();

	        if (match('=>') &&
	                (state.parenthesizedCount === oldParenthesizedCount ||
	                state.parenthesizedCount === (oldParenthesizedCount + 1))) {
	            if (expr.type === Syntax.Identifier) {
	                params = reinterpretAsCoverFormalsList([ expr ]);
	            } else if (expr.type === Syntax.AssignmentExpression ||
	                    expr.type === Syntax.ArrayExpression ||
	                    expr.type === Syntax.ObjectExpression) {
	                if (!startsWithParen) {
	                    throwUnexpected(lex());
	                }
	                params = reinterpretAsCoverFormalsList([ expr ]);
	            } else if (expr.type === Syntax.SequenceExpression) {
	                params = reinterpretAsCoverFormalsList(expr.expressions);
	            }
	            if (params) {
	                params.async = possiblyAsync;
	                return parseArrowFunctionExpression(params, marker);
	            }
	        }

	        // If we haven't returned by now, then the 'async' keyword was not
	        // a function modifier, and we should rewind and interpret it as a
	        // normal identifier.
	        if (possiblyAsync) {
	            possiblyAsync = false;
	            rewind(backtrackToken);
	            expr = parseConditionalExpression();
	        }

	        if (matchAssign()) {
	            // 11.13.1
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant(token, Messages.StrictLHSAssignment);
	            }

	            // ES.next draf 11.13 Runtime Semantics step 1
	            if (match('=') && (expr.type === Syntax.ObjectExpression || expr.type === Syntax.ArrayExpression)) {
	                reinterpretAsAssignmentBindingPattern(expr);
	            } else if (!isLeftHandSide(expr)) {
	                throwError({}, Messages.InvalidLHSInAssignment);
	            }

	            expr = markerApply(marker, delegate.createAssignmentExpression(lex().value, expr, parseAssignmentExpression()));
	        }

	        return expr;
	    }

	    // 11.14 Comma Operator

	    function parseExpression() {
	        var marker, expr, expressions, sequence, spreadFound;

	        marker = markerCreate();
	        expr = parseAssignmentExpression();
	        expressions = [ expr ];

	        if (match(',')) {
	            while (index < length) {
	                if (!match(',')) {
	                    break;
	                }

	                lex();
	                expr = parseSpreadOrAssignmentExpression();
	                expressions.push(expr);

	                if (expr.type === Syntax.SpreadElement) {
	                    spreadFound = true;
	                    if (!match(')')) {
	                        throwError({}, Messages.ElementAfterSpreadElement);
	                    }
	                    break;
	                }
	            }

	            sequence = markerApply(marker, delegate.createSequenceExpression(expressions));
	        }

	        if (spreadFound && lookahead2().value !== '=>') {
	            throwError({}, Messages.IllegalSpread);
	        }

	        return sequence || expr;
	    }

	    // 12.1 Block

	    function parseStatementList() {
	        var list = [],
	            statement;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            statement = parseSourceElement();
	            if (typeof statement === 'undefined') {
	                break;
	            }
	            list.push(statement);
	        }

	        return list;
	    }

	    function parseBlock() {
	        var block, marker = markerCreate();

	        expect('{');

	        block = parseStatementList();

	        expect('}');

	        return markerApply(marker, delegate.createBlockStatement(block));
	    }

	    // 12.2 Variable Statement

	    function parseTypeParameterDeclaration() {
	        var marker = markerCreate(), paramTypes = [];

	        expect('<');
	        while (!match('>')) {
	            paramTypes.push(parseTypeAnnotatableIdentifier());
	            if (!match('>')) {
	                expect(',');
	            }
	        }
	        expect('>');

	        return markerApply(marker, delegate.createTypeParameterDeclaration(
	            paramTypes
	        ));
	    }

	    function parseTypeParameterInstantiation() {
	        var marker = markerCreate(), oldInType = state.inType, paramTypes = [];

	        state.inType = true;

	        expect('<');
	        while (!match('>')) {
	            paramTypes.push(parseType());
	            if (!match('>')) {
	                expect(',');
	            }
	        }
	        expect('>');

	        state.inType = oldInType;

	        return markerApply(marker, delegate.createTypeParameterInstantiation(
	            paramTypes
	        ));
	    }

	    function parseObjectTypeIndexer(marker, isStatic) {
	        var id, key, value;

	        expect('[');
	        id = parseObjectPropertyKey();
	        expect(':');
	        key = parseType();
	        expect(']');
	        expect(':');
	        value = parseType();

	        return markerApply(marker, delegate.createObjectTypeIndexer(
	            id,
	            key,
	            value,
	            isStatic
	        ));
	    }

	    function parseObjectTypeMethodish(marker) {
	        var params = [], rest = null, returnType, typeParameters = null;
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        expect('(');
	        while (lookahead.type === Token.Identifier) {
	            params.push(parseFunctionTypeParam());
	            if (!match(')')) {
	                expect(',');
	            }
	        }

	        if (match('...')) {
	            lex();
	            rest = parseFunctionTypeParam();
	        }
	        expect(')');
	        expect(':');
	        returnType = parseType();

	        return markerApply(marker, delegate.createFunctionTypeAnnotation(
	            params,
	            returnType,
	            rest,
	            typeParameters
	        ));
	    }

	    function parseObjectTypeMethod(marker, isStatic, key) {
	        var optional = false, value;
	        value = parseObjectTypeMethodish(marker);

	        return markerApply(marker, delegate.createObjectTypeProperty(
	            key,
	            value,
	            optional,
	            isStatic
	        ));
	    }

	    function parseObjectTypeCallProperty(marker, isStatic) {
	        var valueMarker = markerCreate();
	        return markerApply(marker, delegate.createObjectTypeCallProperty(
	            parseObjectTypeMethodish(valueMarker),
	            isStatic
	        ));
	    }

	    function parseObjectType(allowStatic) {
	        var callProperties = [], indexers = [], marker, optional = false,
	            properties = [], propertyKey, propertyTypeAnnotation,
	            token, isStatic, matchStatic;

	        expect('{');

	        while (!match('}')) {
	            marker = markerCreate();
	            matchStatic =
	                   strict
	                   ? matchKeyword('static')
	                   : matchContextualKeyword('static');

	            if (allowStatic && matchStatic) {
	                token = lex();
	                isStatic = true;
	            }

	            if (match('[')) {
	                indexers.push(parseObjectTypeIndexer(marker, isStatic));
	            } else if (match('(') || match('<')) {
	                callProperties.push(parseObjectTypeCallProperty(marker, allowStatic));
	            } else {
	                if (isStatic && match(':')) {
	                    propertyKey = markerApply(marker, delegate.createIdentifier(token));
	                    throwErrorTolerant(token, Messages.StrictReservedWord);
	                } else {
	                    propertyKey = parseObjectPropertyKey();
	                }
	                if (match('<') || match('(')) {
	                    // This is a method property
	                    properties.push(parseObjectTypeMethod(marker, isStatic, propertyKey));
	                } else {
	                    if (match('?')) {
	                        lex();
	                        optional = true;
	                    }
	                    expect(':');
	                    propertyTypeAnnotation = parseType();
	                    properties.push(markerApply(marker, delegate.createObjectTypeProperty(
	                        propertyKey,
	                        propertyTypeAnnotation,
	                        optional,
	                        isStatic
	                    )));
	                }
	            }

	            if (match(';')) {
	                lex();
	            } else if (!match('}')) {
	                throwUnexpected(lookahead);
	            }
	        }

	        expect('}');

	        return delegate.createObjectTypeAnnotation(
	            properties,
	            indexers,
	            callProperties
	        );
	    }

	    function parseGenericType() {
	        var marker = markerCreate(),
	            typeParameters = null, typeIdentifier;

	        typeIdentifier = parseVariableIdentifier();

	        while (match('.')) {
	            expect('.');
	            typeIdentifier = markerApply(marker, delegate.createQualifiedTypeIdentifier(
	                typeIdentifier,
	                parseVariableIdentifier()
	            ));
	        }

	        if (match('<')) {
	            typeParameters = parseTypeParameterInstantiation();
	        }

	        return markerApply(marker, delegate.createGenericTypeAnnotation(
	            typeIdentifier,
	            typeParameters
	        ));
	    }

	    function parseVoidType() {
	        var marker = markerCreate();
	        expectKeyword('void');
	        return markerApply(marker, delegate.createVoidTypeAnnotation());
	    }

	    function parseTypeofType() {
	        var argument, marker = markerCreate();
	        expectKeyword('typeof');
	        argument = parsePrimaryType();
	        return markerApply(marker, delegate.createTypeofTypeAnnotation(
	            argument
	        ));
	    }

	    function parseTupleType() {
	        var marker = markerCreate(), types = [];
	        expect('[');
	        // We allow trailing commas
	        while (index < length && !match(']')) {
	            types.push(parseType());
	            if (match(']')) {
	                break;
	            }
	            expect(',');
	        }
	        expect(']');
	        return markerApply(marker, delegate.createTupleTypeAnnotation(
	            types
	        ));
	    }

	    function parseFunctionTypeParam() {
	        var marker = markerCreate(), name, optional = false, typeAnnotation;
	        name = parseVariableIdentifier();
	        if (match('?')) {
	            lex();
	            optional = true;
	        }
	        expect(':');
	        typeAnnotation = parseType();
	        return markerApply(marker, delegate.createFunctionTypeParam(
	            name,
	            typeAnnotation,
	            optional
	        ));
	    }

	    function parseFunctionTypeParams() {
	        var ret = { params: [], rest: null };
	        while (lookahead.type === Token.Identifier) {
	            ret.params.push(parseFunctionTypeParam());
	            if (!match(')')) {
	                expect(',');
	            }
	        }

	        if (match('...')) {
	            lex();
	            ret.rest = parseFunctionTypeParam();
	        }
	        return ret;
	    }

	    // The parsing of types roughly parallels the parsing of expressions, and
	    // primary types are kind of like primary expressions...they're the
	    // primitives with which other types are constructed.
	    function parsePrimaryType() {
	        var params = null, returnType = null,
	            marker = markerCreate(), rest = null, tmp,
	            typeParameters, token, type, isGroupedType = false;

	        switch (lookahead.type) {
	        case Token.Identifier:
	            switch (lookahead.value) {
	            case 'any':
	                lex();
	                return markerApply(marker, delegate.createAnyTypeAnnotation());
	            case 'bool':  // fallthrough
	            case 'boolean':
	                lex();
	                return markerApply(marker, delegate.createBooleanTypeAnnotation());
	            case 'number':
	                lex();
	                return markerApply(marker, delegate.createNumberTypeAnnotation());
	            case 'string':
	                lex();
	                return markerApply(marker, delegate.createStringTypeAnnotation());
	            }
	            return markerApply(marker, parseGenericType());
	        case Token.Punctuator:
	            switch (lookahead.value) {
	            case '{':
	                return markerApply(marker, parseObjectType());
	            case '[':
	                return parseTupleType();
	            case '<':
	                typeParameters = parseTypeParameterDeclaration();
	                expect('(');
	                tmp = parseFunctionTypeParams();
	                params = tmp.params;
	                rest = tmp.rest;
	                expect(')');

	                expect('=>');

	                returnType = parseType();

	                return markerApply(marker, delegate.createFunctionTypeAnnotation(
	                    params,
	                    returnType,
	                    rest,
	                    typeParameters
	                ));
	            case '(':
	                lex();
	                // Check to see if this is actually a grouped type
	                if (!match(')') && !match('...')) {
	                    if (lookahead.type === Token.Identifier) {
	                        token = lookahead2();
	                        isGroupedType = token.value !== '?' && token.value !== ':';
	                    } else {
	                        isGroupedType = true;
	                    }
	                }

	                if (isGroupedType) {
	                    type = parseType();
	                    expect(')');

	                    // If we see a => next then someone was probably confused about
	                    // function types, so we can provide a better error message
	                    if (match('=>')) {
	                        throwError({}, Messages.ConfusedAboutFunctionType);
	                    }

	                    return type;
	                }

	                tmp = parseFunctionTypeParams();
	                params = tmp.params;
	                rest = tmp.rest;

	                expect(')');

	                expect('=>');

	                returnType = parseType();

	                return markerApply(marker, delegate.createFunctionTypeAnnotation(
	                    params,
	                    returnType,
	                    rest,
	                    null /* typeParameters */
	                ));
	            }
	            break;
	        case Token.Keyword:
	            switch (lookahead.value) {
	            case 'void':
	                return markerApply(marker, parseVoidType());
	            case 'typeof':
	                return markerApply(marker, parseTypeofType());
	            }
	            break;
	        case Token.StringLiteral:
	            token = lex();
	            if (token.octal) {
	                throwError(token, Messages.StrictOctalLiteral);
	            }
	            return markerApply(marker, delegate.createStringLiteralTypeAnnotation(
	                token
	            ));
	        }

	        throwUnexpected(lookahead);
	    }

	    function parsePostfixType() {
	        var marker = markerCreate(), t = parsePrimaryType();
	        if (match('[')) {
	            expect('[');
	            expect(']');
	            return markerApply(marker, delegate.createArrayTypeAnnotation(t));
	        }
	        return t;
	    }

	    function parsePrefixType() {
	        var marker = markerCreate();
	        if (match('?')) {
	            lex();
	            return markerApply(marker, delegate.createNullableTypeAnnotation(
	                parsePrefixType()
	            ));
	        }
	        return parsePostfixType();
	    }


	    function parseIntersectionType() {
	        var marker = markerCreate(), type, types;
	        type = parsePrefixType();
	        types = [type];
	        while (match('&')) {
	            lex();
	            types.push(parsePrefixType());
	        }

	        return types.length === 1 ?
	                type :
	                markerApply(marker, delegate.createIntersectionTypeAnnotation(
	                    types
	                ));
	    }

	    function parseUnionType() {
	        var marker = markerCreate(), type, types;
	        type = parseIntersectionType();
	        types = [type];
	        while (match('|')) {
	            lex();
	            types.push(parseIntersectionType());
	        }
	        return types.length === 1 ?
	                type :
	                markerApply(marker, delegate.createUnionTypeAnnotation(
	                    types
	                ));
	    }

	    function parseType() {
	        var oldInType = state.inType, type;
	        state.inType = true;

	        type = parseUnionType();

	        state.inType = oldInType;
	        return type;
	    }

	    function parseTypeAnnotation() {
	        var marker = markerCreate(), type;

	        expect(':');
	        type = parseType();

	        return markerApply(marker, delegate.createTypeAnnotation(type));
	    }

	    function parseVariableIdentifier() {
	        var marker = markerCreate(),
	            token = lex();

	        if (token.type !== Token.Identifier) {
	            throwUnexpected(token);
	        }

	        return markerApply(marker, delegate.createIdentifier(token.value));
	    }

	    function parseTypeAnnotatableIdentifier(requireTypeAnnotation, canBeOptionalParam) {
	        var marker = markerCreate(),
	            ident = parseVariableIdentifier(),
	            isOptionalParam = false;

	        if (canBeOptionalParam && match('?')) {
	            expect('?');
	            isOptionalParam = true;
	        }

	        if (requireTypeAnnotation || match(':')) {
	            ident.typeAnnotation = parseTypeAnnotation();
	            ident = markerApply(marker, ident);
	        }

	        if (isOptionalParam) {
	            ident.optional = true;
	            ident = markerApply(marker, ident);
	        }

	        return ident;
	    }

	    function parseVariableDeclaration(kind) {
	        var id,
	            marker = markerCreate(),
	            init = null,
	            typeAnnotationMarker = markerCreate();
	        if (match('{')) {
	            id = parseObjectInitialiser();
	            reinterpretAsAssignmentBindingPattern(id);
	            if (match(':')) {
	                id.typeAnnotation = parseTypeAnnotation();
	                markerApply(typeAnnotationMarker, id);
	            }
	        } else if (match('[')) {
	            id = parseArrayInitialiser();
	            reinterpretAsAssignmentBindingPattern(id);
	            if (match(':')) {
	                id.typeAnnotation = parseTypeAnnotation();
	                markerApply(typeAnnotationMarker, id);
	            }
	        } else {
	            /* istanbul ignore next */
	            id = state.allowKeyword ? parseNonComputedProperty() : parseTypeAnnotatableIdentifier();
	            // 12.2.1
	            if (strict && isRestrictedWord(id.name)) {
	                throwErrorTolerant({}, Messages.StrictVarName);
	            }
	        }

	        if (kind === 'const') {
	            if (!match('=')) {
	                throwError({}, Messages.NoUninitializedConst);
	            }
	            expect('=');
	            init = parseAssignmentExpression();
	        } else if (match('=')) {
	            lex();
	            init = parseAssignmentExpression();
	        }

	        return markerApply(marker, delegate.createVariableDeclarator(id, init));
	    }

	    function parseVariableDeclarationList(kind) {
	        var list = [];

	        do {
	            list.push(parseVariableDeclaration(kind));
	            if (!match(',')) {
	                break;
	            }
	            lex();
	        } while (index < length);

	        return list;
	    }

	    function parseVariableStatement() {
	        var declarations, marker = markerCreate();

	        expectKeyword('var');

	        declarations = parseVariableDeclarationList();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, 'var'));
	    }

	    // kind may be `const` or `let`
	    // Both are experimental and not in the specification yet.
	    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
	    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
	    function parseConstLetDeclaration(kind) {
	        var declarations, marker = markerCreate();

	        expectKeyword(kind);

	        declarations = parseVariableDeclarationList(kind);

	        consumeSemicolon();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, kind));
	    }

	    // people.mozilla.org/~jorendorff/es6-draft.html

	    function parseModuleSpecifier() {
	        var marker = markerCreate(),
	            specifier;

	        if (lookahead.type !== Token.StringLiteral) {
	            throwError({}, Messages.InvalidModuleSpecifier);
	        }
	        specifier = delegate.createModuleSpecifier(lookahead);
	        lex();
	        return markerApply(marker, specifier);
	    }

	    function parseExportBatchSpecifier() {
	        var marker = markerCreate();
	        expect('*');
	        return markerApply(marker, delegate.createExportBatchSpecifier());
	    }

	    function parseExportSpecifier() {
	        var id, name = null, marker = markerCreate(), from;
	        if (matchKeyword('default')) {
	            lex();
	            id = markerApply(marker, delegate.createIdentifier('default'));
	            // export {default} from "something";
	        } else {
	            id = parseVariableIdentifier();
	        }
	        if (matchContextualKeyword('as')) {
	            lex();
	            name = parseNonComputedProperty();
	        }

	        return markerApply(marker, delegate.createExportSpecifier(id, name));
	    }

	    function parseExportDeclaration() {
	        var declaration = null,
	            possibleIdentifierToken, sourceElement,
	            isExportFromIdentifier,
	            src = null, specifiers = [],
	            marker = markerCreate();

	        expectKeyword('export');

	        if (matchKeyword('default')) {
	            // covers:
	            // export default ...
	            lex();
	            if (matchKeyword('function') || matchKeyword('class')) {
	                possibleIdentifierToken = lookahead2();
	                if (isIdentifierName(possibleIdentifierToken)) {
	                    // covers:
	                    // export default function foo () {}
	                    // export default class foo {}
	                    sourceElement = parseSourceElement();
	                    return markerApply(marker, delegate.createExportDeclaration(true, sourceElement, [sourceElement.id], null));
	                }
	                // covers:
	                // export default function () {}
	                // export default class {}
	                switch (lookahead.value) {
	                case 'class':
	                    return markerApply(marker, delegate.createExportDeclaration(true, parseClassExpression(), [], null));
	                case 'function':
	                    return markerApply(marker, delegate.createExportDeclaration(true, parseFunctionExpression(), [], null));
	                }
	            }

	            if (matchContextualKeyword('from')) {
	                throwError({}, Messages.UnexpectedToken, lookahead.value);
	            }

	            // covers:
	            // export default {};
	            // export default [];
	            if (match('{')) {
	                declaration = parseObjectInitialiser();
	            } else if (match('[')) {
	                declaration = parseArrayInitialiser();
	            } else {
	                declaration = parseAssignmentExpression();
	            }
	            consumeSemicolon();
	            return markerApply(marker, delegate.createExportDeclaration(true, declaration, [], null));
	        }

	        // non-default export
	        if (lookahead.type === Token.Keyword || matchContextualKeyword('type')) {
	            // covers:
	            // export var f = 1;
	            switch (lookahead.value) {
	            case 'type':
	            case 'let':
	            case 'const':
	            case 'var':
	            case 'class':
	            case 'function':
	                return markerApply(marker, delegate.createExportDeclaration(false, parseSourceElement(), specifiers, null));
	            }
	        }

	        if (match('*')) {
	            // covers:
	            // export * from "foo";
	            specifiers.push(parseExportBatchSpecifier());

	            if (!matchContextualKeyword('from')) {
	                throwError({}, lookahead.value ?
	                        Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	            }
	            lex();
	            src = parseModuleSpecifier();
	            consumeSemicolon();

	            return markerApply(marker, delegate.createExportDeclaration(false, null, specifiers, src));
	        }

	        expect('{');
	        if (!match('}')) {
	            do {
	                isExportFromIdentifier = isExportFromIdentifier || matchKeyword('default');
	                specifiers.push(parseExportSpecifier());
	            } while (match(',') && lex());
	        }
	        expect('}');

	        if (matchContextualKeyword('from')) {
	            // covering:
	            // export {default} from "foo";
	            // export {foo} from "foo";
	            lex();
	            src = parseModuleSpecifier();
	            consumeSemicolon();
	        } else if (isExportFromIdentifier) {
	            // covering:
	            // export {default}; // missing fromClause
	            throwError({}, lookahead.value ?
	                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	        } else {
	            // cover
	            // export {foo};
	            consumeSemicolon();
	        }
	        return markerApply(marker, delegate.createExportDeclaration(false, declaration, specifiers, src));
	    }


	    function parseImportSpecifier() {
	        // import {<foo as bar>} ...;
	        var id, name = null, marker = markerCreate();

	        id = parseNonComputedProperty();
	        if (matchContextualKeyword('as')) {
	            lex();
	            name = parseVariableIdentifier();
	        }

	        return markerApply(marker, delegate.createImportSpecifier(id, name));
	    }

	    function parseNamedImports() {
	        var specifiers = [];
	        // {foo, bar as bas}
	        expect('{');
	        if (!match('}')) {
	            do {
	                specifiers.push(parseImportSpecifier());
	            } while (match(',') && lex());
	        }
	        expect('}');
	        return specifiers;
	    }

	    function parseImportDefaultSpecifier() {
	        // import <foo> ...;
	        var id, marker = markerCreate();

	        id = parseNonComputedProperty();

	        return markerApply(marker, delegate.createImportDefaultSpecifier(id));
	    }

	    function parseImportNamespaceSpecifier() {
	        // import <* as foo> ...;
	        var id, marker = markerCreate();

	        expect('*');
	        if (!matchContextualKeyword('as')) {
	            throwError({}, Messages.NoAsAfterImportNamespace);
	        }
	        lex();
	        id = parseNonComputedProperty();

	        return markerApply(marker, delegate.createImportNamespaceSpecifier(id));
	    }

	    function parseImportDeclaration() {
	        var specifiers, src, marker = markerCreate(), isType = false, token2;

	        expectKeyword('import');

	        if (matchContextualKeyword('type')) {
	            token2 = lookahead2();
	            if ((token2.type === Token.Identifier && token2.value !== 'from') ||
	                    (token2.type === Token.Punctuator &&
	                        (token2.value === '{' || token2.value === '*'))) {
	                isType = true;
	                lex();
	            }
	        }

	        specifiers = [];

	        if (lookahead.type === Token.StringLiteral) {
	            // covers:
	            // import "foo";
	            src = parseModuleSpecifier();
	            consumeSemicolon();
	            return markerApply(marker, delegate.createImportDeclaration(specifiers, src, isType));
	        }

	        if (!matchKeyword('default') && isIdentifierName(lookahead)) {
	            // covers:
	            // import foo
	            // import foo, ...
	            specifiers.push(parseImportDefaultSpecifier());
	            if (match(',')) {
	                lex();
	            }
	        }
	        if (match('*')) {
	            // covers:
	            // import foo, * as foo
	            // import * as foo
	            specifiers.push(parseImportNamespaceSpecifier());
	        } else if (match('{')) {
	            // covers:
	            // import foo, {bar}
	            // import {bar}
	            specifiers = specifiers.concat(parseNamedImports());
	        }

	        if (!matchContextualKeyword('from')) {
	            throwError({}, lookahead.value ?
	                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
	        }
	        lex();
	        src = parseModuleSpecifier();
	        consumeSemicolon();

	        return markerApply(marker, delegate.createImportDeclaration(specifiers, src, isType));
	    }

	    // 12.3 Empty Statement

	    function parseEmptyStatement() {
	        var marker = markerCreate();
	        expect(';');
	        return markerApply(marker, delegate.createEmptyStatement());
	    }

	    // 12.4 Expression Statement

	    function parseExpressionStatement() {
	        var marker = markerCreate(), expr = parseExpression();
	        consumeSemicolon();
	        return markerApply(marker, delegate.createExpressionStatement(expr));
	    }

	    // 12.5 If statement

	    function parseIfStatement() {
	        var test, consequent, alternate, marker = markerCreate();

	        expectKeyword('if');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        consequent = parseStatement();

	        if (matchKeyword('else')) {
	            lex();
	            alternate = parseStatement();
	        } else {
	            alternate = null;
	        }

	        return markerApply(marker, delegate.createIfStatement(test, consequent, alternate));
	    }

	    // 12.6 Iteration Statements

	    function parseDoWhileStatement() {
	        var body, test, oldInIteration, marker = markerCreate();

	        expectKeyword('do');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        if (match(';')) {
	            lex();
	        }

	        return markerApply(marker, delegate.createDoWhileStatement(body, test));
	    }

	    function parseWhileStatement() {
	        var test, body, oldInIteration, marker = markerCreate();

	        expectKeyword('while');

	        expect('(');

	        test = parseExpression();

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        body = parseStatement();

	        state.inIteration = oldInIteration;

	        return markerApply(marker, delegate.createWhileStatement(test, body));
	    }

	    function parseForVariableDeclaration() {
	        var marker = markerCreate(),
	            token = lex(),
	            declarations = parseVariableDeclarationList();

	        return markerApply(marker, delegate.createVariableDeclaration(declarations, token.value));
	    }

	    function parseForStatement(opts) {
	        var init, test, update, left, right, body, operator, oldInIteration,
	            marker = markerCreate();
	        init = test = update = null;
	        expectKeyword('for');

	        // http://wiki.ecmascript.org/doku.php?id=proposals:iterators_and_generators&s=each
	        if (matchContextualKeyword('each')) {
	            throwError({}, Messages.EachNotAllowed);
	        }

	        expect('(');

	        if (match(';')) {
	            lex();
	        } else {
	            if (matchKeyword('var') || matchKeyword('let') || matchKeyword('const')) {
	                state.allowIn = false;
	                init = parseForVariableDeclaration();
	                state.allowIn = true;

	                if (init.declarations.length === 1) {
	                    if (matchKeyword('in') || matchContextualKeyword('of')) {
	                        operator = lookahead;
	                        if (!((operator.value === 'in' || init.kind !== 'var') && init.declarations[0].init)) {
	                            lex();
	                            left = init;
	                            right = parseExpression();
	                            init = null;
	                        }
	                    }
	                }
	            } else {
	                state.allowIn = false;
	                init = parseExpression();
	                state.allowIn = true;

	                if (matchContextualKeyword('of')) {
	                    operator = lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                } else if (matchKeyword('in')) {
	                    // LeftHandSideExpression
	                    if (!isAssignableLeftHandSide(init)) {
	                        throwError({}, Messages.InvalidLHSInForIn);
	                    }
	                    operator = lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                }
	            }

	            if (typeof left === 'undefined') {
	                expect(';');
	            }
	        }

	        if (typeof left === 'undefined') {

	            if (!match(';')) {
	                test = parseExpression();
	            }
	            expect(';');

	            if (!match(')')) {
	                update = parseExpression();
	            }
	        }

	        expect(')');

	        oldInIteration = state.inIteration;
	        state.inIteration = true;

	        if (!(opts !== undefined && opts.ignoreBody)) {
	            body = parseStatement();
	        }

	        state.inIteration = oldInIteration;

	        if (typeof left === 'undefined') {
	            return markerApply(marker, delegate.createForStatement(init, test, update, body));
	        }

	        if (operator.value === 'in') {
	            return markerApply(marker, delegate.createForInStatement(left, right, body));
	        }
	        return markerApply(marker, delegate.createForOfStatement(left, right, body));
	    }

	    // 12.7 The continue statement

	    function parseContinueStatement() {
	        var label = null, marker = markerCreate();

	        expectKeyword('continue');

	        // Optimize the most common form: 'continue;'.
	        if (source.charCodeAt(index) === 59) {
	            lex();

	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return markerApply(marker, delegate.createContinueStatement(null));
	        }

	        if (peekLineTerminator()) {
	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }

	            return markerApply(marker, delegate.createContinueStatement(null));
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            if (!state.labelSet.has(label.name)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !state.inIteration) {
	            throwError({}, Messages.IllegalContinue);
	        }

	        return markerApply(marker, delegate.createContinueStatement(label));
	    }

	    // 12.8 The break statement

	    function parseBreakStatement() {
	        var label = null, marker = markerCreate();

	        expectKeyword('break');

	        // Catch the very common case first: immediately a semicolon (char #59).
	        if (source.charCodeAt(index) === 59) {
	            lex();

	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return markerApply(marker, delegate.createBreakStatement(null));
	        }

	        if (peekLineTerminator()) {
	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }

	            return markerApply(marker, delegate.createBreakStatement(null));
	        }

	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();

	            if (!state.labelSet.has(label.name)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }

	        consumeSemicolon();

	        if (label === null && !(state.inIteration || state.inSwitch)) {
	            throwError({}, Messages.IllegalBreak);
	        }

	        return markerApply(marker, delegate.createBreakStatement(label));
	    }

	    // 12.9 The return statement

	    function parseReturnStatement() {
	        var argument = null, marker = markerCreate();

	        expectKeyword('return');

	        if (!state.inFunctionBody) {
	            throwErrorTolerant({}, Messages.IllegalReturn);
	        }

	        // 'return' followed by a space and an identifier is very common.
	        if (source.charCodeAt(index) === 32) {
	            if (isIdentifierStart(source.charCodeAt(index + 1))) {
	                argument = parseExpression();
	                consumeSemicolon();
	                return markerApply(marker, delegate.createReturnStatement(argument));
	            }
	        }

	        if (peekLineTerminator()) {
	            return markerApply(marker, delegate.createReturnStatement(null));
	        }

	        if (!match(';')) {
	            if (!match('}') && lookahead.type !== Token.EOF) {
	                argument = parseExpression();
	            }
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createReturnStatement(argument));
	    }

	    // 12.10 The with statement

	    function parseWithStatement() {
	        var object, body, marker = markerCreate();

	        if (strict) {
	            throwErrorTolerant({}, Messages.StrictModeWith);
	        }

	        expectKeyword('with');

	        expect('(');

	        object = parseExpression();

	        expect(')');

	        body = parseStatement();

	        return markerApply(marker, delegate.createWithStatement(object, body));
	    }

	    // 12.10 The swith statement

	    function parseSwitchCase() {
	        var test,
	            consequent = [],
	            sourceElement,
	            marker = markerCreate();

	        if (matchKeyword('default')) {
	            lex();
	            test = null;
	        } else {
	            expectKeyword('case');
	            test = parseExpression();
	        }
	        expect(':');

	        while (index < length) {
	            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            consequent.push(sourceElement);
	        }

	        return markerApply(marker, delegate.createSwitchCase(test, consequent));
	    }

	    function parseSwitchStatement() {
	        var discriminant, cases, clause, oldInSwitch, defaultFound, marker = markerCreate();

	        expectKeyword('switch');

	        expect('(');

	        discriminant = parseExpression();

	        expect(')');

	        expect('{');

	        cases = [];

	        if (match('}')) {
	            lex();
	            return markerApply(marker, delegate.createSwitchStatement(discriminant, cases));
	        }

	        oldInSwitch = state.inSwitch;
	        state.inSwitch = true;
	        defaultFound = false;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            clause = parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    throwError({}, Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }

	        state.inSwitch = oldInSwitch;

	        expect('}');

	        return markerApply(marker, delegate.createSwitchStatement(discriminant, cases));
	    }

	    // 12.13 The throw statement

	    function parseThrowStatement() {
	        var argument, marker = markerCreate();

	        expectKeyword('throw');

	        if (peekLineTerminator()) {
	            throwError({}, Messages.NewlineAfterThrow);
	        }

	        argument = parseExpression();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createThrowStatement(argument));
	    }

	    // 12.14 The try statement

	    function parseCatchClause() {
	        var param, body, marker = markerCreate();

	        expectKeyword('catch');

	        expect('(');
	        if (match(')')) {
	            throwUnexpected(lookahead);
	        }

	        param = parseExpression();
	        // 12.14.1
	        if (strict && param.type === Syntax.Identifier && isRestrictedWord(param.name)) {
	            throwErrorTolerant({}, Messages.StrictCatchVariable);
	        }

	        expect(')');
	        body = parseBlock();
	        return markerApply(marker, delegate.createCatchClause(param, body));
	    }

	    function parseTryStatement() {
	        var block, handlers = [], finalizer = null, marker = markerCreate();

	        expectKeyword('try');

	        block = parseBlock();

	        if (matchKeyword('catch')) {
	            handlers.push(parseCatchClause());
	        }

	        if (matchKeyword('finally')) {
	            lex();
	            finalizer = parseBlock();
	        }

	        if (handlers.length === 0 && !finalizer) {
	            throwError({}, Messages.NoCatchOrFinally);
	        }

	        return markerApply(marker, delegate.createTryStatement(block, [], handlers, finalizer));
	    }

	    // 12.15 The debugger statement

	    function parseDebuggerStatement() {
	        var marker = markerCreate();
	        expectKeyword('debugger');

	        consumeSemicolon();

	        return markerApply(marker, delegate.createDebuggerStatement());
	    }

	    // 12 Statements

	    function parseStatement() {
	        var type = lookahead.type,
	            marker,
	            expr,
	            labeledBody;

	        if (type === Token.EOF) {
	            throwUnexpected(lookahead);
	        }

	        if (type === Token.Punctuator) {
	            switch (lookahead.value) {
	            case ';':
	                return parseEmptyStatement();
	            case '{':
	                return parseBlock();
	            case '(':
	                return parseExpressionStatement();
	            default:
	                break;
	            }
	        }

	        if (type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'break':
	                return parseBreakStatement();
	            case 'continue':
	                return parseContinueStatement();
	            case 'debugger':
	                return parseDebuggerStatement();
	            case 'do':
	                return parseDoWhileStatement();
	            case 'for':
	                return parseForStatement();
	            case 'function':
	                return parseFunctionDeclaration();
	            case 'class':
	                return parseClassDeclaration();
	            case 'if':
	                return parseIfStatement();
	            case 'return':
	                return parseReturnStatement();
	            case 'switch':
	                return parseSwitchStatement();
	            case 'throw':
	                return parseThrowStatement();
	            case 'try':
	                return parseTryStatement();
	            case 'var':
	                return parseVariableStatement();
	            case 'while':
	                return parseWhileStatement();
	            case 'with':
	                return parseWithStatement();
	            default:
	                break;
	            }
	        }

	        if (matchAsyncFuncExprOrDecl()) {
	            return parseFunctionDeclaration();
	        }

	        marker = markerCreate();
	        expr = parseExpression();

	        // 12.12 Labelled Statements
	        if ((expr.type === Syntax.Identifier) && match(':')) {
	            lex();

	            if (state.labelSet.has(expr.name)) {
	                throwError({}, Messages.Redeclaration, 'Label', expr.name);
	            }

	            state.labelSet.set(expr.name, true);
	            labeledBody = parseStatement();
	            state.labelSet.delete(expr.name);
	            return markerApply(marker, delegate.createLabeledStatement(expr, labeledBody));
	        }

	        consumeSemicolon();

	        return markerApply(marker, delegate.createExpressionStatement(expr));
	    }

	    // 13 Function Definition

	    function parseConciseBody() {
	        if (match('{')) {
	            return parseFunctionSourceElements();
	        }
	        return parseAssignmentExpression();
	    }

	    function parseFunctionSourceElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted,
	            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, oldParenthesizedCount,
	            marker = markerCreate();

	        expect('{');

	        while (index < length) {
	            if (lookahead.type !== Token.StringLiteral) {
	                break;
	            }
	            token = lookahead;

	            sourceElement = parseSourceElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        oldLabelSet = state.labelSet;
	        oldInIteration = state.inIteration;
	        oldInSwitch = state.inSwitch;
	        oldInFunctionBody = state.inFunctionBody;
	        oldParenthesizedCount = state.parenthesizedCount;

	        state.labelSet = new StringMap();
	        state.inIteration = false;
	        state.inSwitch = false;
	        state.inFunctionBody = true;
	        state.parenthesizedCount = 0;

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }

	        expect('}');

	        state.labelSet = oldLabelSet;
	        state.inIteration = oldInIteration;
	        state.inSwitch = oldInSwitch;
	        state.inFunctionBody = oldInFunctionBody;
	        state.parenthesizedCount = oldParenthesizedCount;

	        return markerApply(marker, delegate.createBlockStatement(sourceElements));
	    }

	    function validateParam(options, param, name) {
	        if (strict) {
	            if (isRestrictedWord(name)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamName;
	            }
	            if (options.paramSet.has(name)) {
	                options.stricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        } else if (!options.firstRestricted) {
	            if (isRestrictedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictParamName;
	            } else if (isStrictModeReservedWord(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictReservedWord;
	            } else if (options.paramSet.has(name)) {
	                options.firstRestricted = param;
	                options.message = Messages.StrictParamDupe;
	            }
	        }
	        options.paramSet.set(name, true);
	    }

	    function parseParam(options) {
	        var marker, token, rest, param, def;

	        token = lookahead;
	        if (token.value === '...') {
	            token = lex();
	            rest = true;
	        }

	        if (match('[')) {
	            marker = markerCreate();
	            param = parseArrayInitialiser();
	            reinterpretAsDestructuredParameter(options, param);
	            if (match(':')) {
	                param.typeAnnotation = parseTypeAnnotation();
	                markerApply(marker, param);
	            }
	        } else if (match('{')) {
	            marker = markerCreate();
	            if (rest) {
	                throwError({}, Messages.ObjectPatternAsRestParameter);
	            }
	            param = parseObjectInitialiser();
	            reinterpretAsDestructuredParameter(options, param);
	            if (match(':')) {
	                param.typeAnnotation = parseTypeAnnotation();
	                markerApply(marker, param);
	            }
	        } else {
	            param =
	                rest
	                ? parseTypeAnnotatableIdentifier(
	                    false, /* requireTypeAnnotation */
	                    false /* canBeOptionalParam */
	                )
	                : parseTypeAnnotatableIdentifier(
	                    false, /* requireTypeAnnotation */
	                    true /* canBeOptionalParam */
	                );

	            validateParam(options, token, token.value);
	        }

	        if (match('=')) {
	            if (rest) {
	                throwErrorTolerant(lookahead, Messages.DefaultRestParameter);
	            }
	            lex();
	            def = parseAssignmentExpression();
	            ++options.defaultCount;
	        }

	        if (rest) {
	            if (!match(')')) {
	                throwError({}, Messages.ParameterAfterRestParameter);
	            }
	            options.rest = param;
	            return false;
	        }

	        options.params.push(param);
	        options.defaults.push(def);
	        return !match(')');
	    }

	    function parseParams(firstRestricted) {
	        var options, marker = markerCreate();

	        options = {
	            params: [],
	            defaultCount: 0,
	            defaults: [],
	            rest: null,
	            firstRestricted: firstRestricted
	        };

	        expect('(');

	        if (!match(')')) {
	            options.paramSet = new StringMap();
	            while (index < length) {
	                if (!parseParam(options)) {
	                    break;
	                }
	                expect(',');
	            }
	        }

	        expect(')');

	        if (options.defaultCount === 0) {
	            options.defaults = [];
	        }

	        if (match(':')) {
	            options.returnType = parseTypeAnnotation();
	        }

	        return markerApply(marker, options);
	    }

	    function parseFunctionDeclaration() {
	        var id, body, token, tmp, firstRestricted, message, generator, isAsync,
	            previousStrict, previousYieldAllowed, previousAwaitAllowed,
	            marker = markerCreate(), typeParameters;

	        isAsync = false;
	        if (matchAsync()) {
	            lex();
	            isAsync = true;
	        }

	        expectKeyword('function');

	        generator = false;
	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        token = lookahead;

	        id = parseVariableIdentifier();

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (strict) {
	            if (isRestrictedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictFunctionName);
	            }
	        } else {
	            if (isRestrictedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictFunctionName;
	            } else if (isStrictModeReservedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictReservedWord;
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = generator;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = isAsync;

	        body = parseFunctionSourceElements();

	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, message);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(
	            marker,
	            delegate.createFunctionDeclaration(
	                id,
	                tmp.params,
	                tmp.defaults,
	                body,
	                tmp.rest,
	                generator,
	                false,
	                isAsync,
	                tmp.returnType,
	                typeParameters
	            )
	        );
	    }

	    function parseFunctionExpression() {
	        var token, id = null, firstRestricted, message, tmp, body, generator, isAsync,
	            previousStrict, previousYieldAllowed, previousAwaitAllowed,
	            marker = markerCreate(), typeParameters;

	        isAsync = false;
	        if (matchAsync()) {
	            lex();
	            isAsync = true;
	        }

	        expectKeyword('function');

	        generator = false;

	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        if (!match('(')) {
	            if (!match('<')) {
	                token = lookahead;
	                id = parseVariableIdentifier();

	                if (strict) {
	                    if (isRestrictedWord(token.value)) {
	                        throwErrorTolerant(token, Messages.StrictFunctionName);
	                    }
	                } else {
	                    if (isRestrictedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictFunctionName;
	                    } else if (isStrictModeReservedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictReservedWord;
	                    }
	                }
	            }

	            if (match('<')) {
	                typeParameters = parseTypeParameterDeclaration();
	            }
	        }

	        tmp = parseParams(firstRestricted);
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }

	        previousStrict = strict;
	        previousYieldAllowed = state.yieldAllowed;
	        state.yieldAllowed = generator;
	        previousAwaitAllowed = state.awaitAllowed;
	        state.awaitAllowed = isAsync;

	        body = parseFunctionSourceElements();

	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && tmp.stricted) {
	            throwErrorTolerant(tmp.stricted, message);
	        }
	        strict = previousStrict;
	        state.yieldAllowed = previousYieldAllowed;
	        state.awaitAllowed = previousAwaitAllowed;

	        return markerApply(
	            marker,
	            delegate.createFunctionExpression(
	                id,
	                tmp.params,
	                tmp.defaults,
	                body,
	                tmp.rest,
	                generator,
	                false,
	                isAsync,
	                tmp.returnType,
	                typeParameters
	            )
	        );
	    }

	    function parseYieldExpression() {
	        var delegateFlag, expr, marker = markerCreate();

	        expectKeyword('yield', !strict);

	        delegateFlag = false;
	        if (match('*')) {
	            lex();
	            delegateFlag = true;
	        }

	        expr = parseAssignmentExpression();

	        return markerApply(marker, delegate.createYieldExpression(expr, delegateFlag));
	    }

	    function parseAwaitExpression() {
	        var expr, marker = markerCreate();
	        expectContextualKeyword('await');
	        expr = parseAssignmentExpression();
	        return markerApply(marker, delegate.createAwaitExpression(expr));
	    }

	    // 14 Functions and classes

	    // 14.1 Functions is defined above (13 in ES5)
	    // 14.2 Arrow Functions Definitions is defined in (7.3 assignments)

	    // 14.3 Method Definitions
	    // 14.3.7
	    function specialMethod(methodDefinition) {
	        return methodDefinition.kind === 'get' ||
	               methodDefinition.kind === 'set' ||
	               methodDefinition.value.generator;
	    }

	    function parseMethodDefinition(key, isStatic, generator, computed) {
	        var token, param, propType,
	            isAsync, typeParameters, tokenValue, returnType;

	        propType = isStatic ? ClassPropertyType.static : ClassPropertyType.prototype;

	        if (generator) {
	            return delegate.createMethodDefinition(
	                propType,
	                '',
	                key,
	                parsePropertyMethodFunction({ generator: true }),
	                computed
	            );
	        }

	        tokenValue = key.type === 'Identifier' && key.name;

	        if (tokenValue === 'get' && !match('(')) {
	            key = parseObjectPropertyKey();

	            expect('(');
	            expect(')');
	            if (match(':')) {
	                returnType = parseTypeAnnotation();
	            }
	            return delegate.createMethodDefinition(
	                propType,
	                'get',
	                key,
	                parsePropertyFunction({ generator: false, returnType: returnType }),
	                computed
	            );
	        }
	        if (tokenValue === 'set' && !match('(')) {
	            key = parseObjectPropertyKey();

	            expect('(');
	            token = lookahead;
	            param = [ parseTypeAnnotatableIdentifier() ];
	            expect(')');
	            if (match(':')) {
	                returnType = parseTypeAnnotation();
	            }
	            return delegate.createMethodDefinition(
	                propType,
	                'set',
	                key,
	                parsePropertyFunction({
	                    params: param,
	                    generator: false,
	                    name: token,
	                    returnType: returnType
	                }),
	                computed
	            );
	        }

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        isAsync = tokenValue === 'async' && !match('(');
	        if (isAsync) {
	            key = parseObjectPropertyKey();
	        }

	        return delegate.createMethodDefinition(
	            propType,
	            '',
	            key,
	            parsePropertyMethodFunction({
	                generator: false,
	                async: isAsync,
	                typeParameters: typeParameters
	            }),
	            computed
	        );
	    }

	    function parseClassProperty(key, computed, isStatic) {
	        var typeAnnotation;

	        typeAnnotation = parseTypeAnnotation();
	        expect(';');

	        return delegate.createClassProperty(
	            key,
	            typeAnnotation,
	            computed,
	            isStatic
	        );
	    }

	    function parseClassElement() {
	        var computed = false, generator = false, key, marker = markerCreate(),
	            isStatic = false, possiblyOpenBracketToken;
	        if (match(';')) {
	            lex();
	            return undefined;
	        }

	        if (lookahead.value === 'static') {
	            lex();
	            isStatic = true;
	        }

	        if (match('*')) {
	            lex();
	            generator = true;
	        }

	        possiblyOpenBracketToken = lookahead;
	        if (matchContextualKeyword('get') || matchContextualKeyword('set')) {
	            possiblyOpenBracketToken = lookahead2();
	        }

	        if (possiblyOpenBracketToken.type === Token.Punctuator
	                && possiblyOpenBracketToken.value === '[') {
	            computed = true;
	        }

	        key = parseObjectPropertyKey();

	        if (!generator && lookahead.value === ':') {
	            return markerApply(marker, parseClassProperty(key, computed, isStatic));
	        }

	        return markerApply(marker, parseMethodDefinition(
	            key,
	            isStatic,
	            generator,
	            computed
	        ));
	    }

	    function parseClassBody() {
	        var classElement, classElements = [], existingProps = {},
	            marker = markerCreate(), propName, propType;

	        existingProps[ClassPropertyType.static] = new StringMap();
	        existingProps[ClassPropertyType.prototype] = new StringMap();

	        expect('{');

	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            classElement = parseClassElement(existingProps);

	            if (typeof classElement !== 'undefined') {
	                classElements.push(classElement);

	                propName = !classElement.computed && getFieldName(classElement.key);
	                if (propName !== false) {
	                    propType = classElement.static ?
	                                ClassPropertyType.static :
	                                ClassPropertyType.prototype;

	                    if (classElement.type === Syntax.MethodDefinition) {
	                        if (propName === 'constructor' && !classElement.static) {
	                            if (specialMethod(classElement)) {
	                                throwError(classElement, Messages.IllegalClassConstructorProperty);
	                            }
	                            if (existingProps[ClassPropertyType.prototype].has('constructor')) {
	                                throwError(classElement.key, Messages.IllegalDuplicateClassProperty);
	                            }
	                        }
	                        existingProps[propType].set(propName, true);
	                    }
	                }
	            }
	        }

	        expect('}');

	        return markerApply(marker, delegate.createClassBody(classElements));
	    }

	    function parseClassImplements() {
	        var id, implemented = [], marker, typeParameters;
	        if (strict) {
	            expectKeyword('implements');
	        } else {
	            expectContextualKeyword('implements');
	        }
	        while (index < length) {
	            marker = markerCreate();
	            id = parseVariableIdentifier();
	            if (match('<')) {
	                typeParameters = parseTypeParameterInstantiation();
	            } else {
	                typeParameters = null;
	            }
	            implemented.push(markerApply(marker, delegate.createClassImplements(
	                id,
	                typeParameters
	            )));
	            if (!match(',')) {
	                break;
	            }
	            expect(',');
	        }
	        return implemented;
	    }

	    function parseClassExpression() {
	        var id, implemented, previousYieldAllowed, superClass = null,
	            superTypeParameters, marker = markerCreate(), typeParameters,
	            matchImplements;

	        expectKeyword('class');

	        matchImplements =
	                strict
	                ? matchKeyword('implements')
	                : matchContextualKeyword('implements');

	        if (!matchKeyword('extends') && !matchImplements && !match('{')) {
	            id = parseVariableIdentifier();
	        }

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');
	            previousYieldAllowed = state.yieldAllowed;
	            state.yieldAllowed = false;
	            superClass = parseLeftHandSideExpressionAllowCall();
	            if (match('<')) {
	                superTypeParameters = parseTypeParameterInstantiation();
	            }
	            state.yieldAllowed = previousYieldAllowed;
	        }

	        if (strict ? matchKeyword('implements') : matchContextualKeyword('implements')) {
	            implemented = parseClassImplements();
	        }

	        return markerApply(marker, delegate.createClassExpression(
	            id,
	            superClass,
	            parseClassBody(),
	            typeParameters,
	            superTypeParameters,
	            implemented
	        ));
	    }

	    function parseClassDeclaration() {
	        var id, implemented, previousYieldAllowed, superClass = null,
	            superTypeParameters, marker = markerCreate(), typeParameters;

	        expectKeyword('class');

	        id = parseVariableIdentifier();

	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');
	            previousYieldAllowed = state.yieldAllowed;
	            state.yieldAllowed = false;
	            superClass = parseLeftHandSideExpressionAllowCall();
	            if (match('<')) {
	                superTypeParameters = parseTypeParameterInstantiation();
	            }
	            state.yieldAllowed = previousYieldAllowed;
	        }

	        if (strict ? matchKeyword('implements') : matchContextualKeyword('implements')) {
	            implemented = parseClassImplements();
	        }

	        return markerApply(marker, delegate.createClassDeclaration(
	            id,
	            superClass,
	            parseClassBody(),
	            typeParameters,
	            superTypeParameters,
	            implemented
	        ));
	    }

	    // 15 Program

	    function parseSourceElement() {
	        var token;
	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'const':
	            case 'let':
	                return parseConstLetDeclaration(lookahead.value);
	            case 'function':
	                return parseFunctionDeclaration();
	            case 'export':
	                throwErrorTolerant({}, Messages.IllegalExportDeclaration);
	                return parseExportDeclaration();
	            case 'import':
	                throwErrorTolerant({}, Messages.IllegalImportDeclaration);
	                return parseImportDeclaration();
	            case 'interface':
	                if (lookahead2().type === Token.Identifier) {
	                    return parseInterface();
	                }
	                return parseStatement();
	            default:
	                return parseStatement();
	            }
	        }

	        if (matchContextualKeyword('type')
	                && lookahead2().type === Token.Identifier) {
	            return parseTypeAlias();
	        }

	        if (matchContextualKeyword('interface')
	                && lookahead2().type === Token.Identifier) {
	            return parseInterface();
	        }

	        if (matchContextualKeyword('declare')) {
	            token = lookahead2();
	            if (token.type === Token.Keyword) {
	                switch (token.value) {
	                case 'class':
	                    return parseDeclareClass();
	                case 'function':
	                    return parseDeclareFunction();
	                case 'var':
	                    return parseDeclareVariable();
	                }
	            } else if (token.type === Token.Identifier
	                    && token.value === 'module') {
	                return parseDeclareModule();
	            }
	        }

	        if (lookahead.type !== Token.EOF) {
	            return parseStatement();
	        }
	    }

	    function parseProgramElement() {
	        var isModule = extra.sourceType === 'module' || extra.sourceType === 'nonStrictModule';

	        if (isModule && lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'export':
	                return parseExportDeclaration();
	            case 'import':
	                return parseImportDeclaration();
	            }
	        }

	        return parseSourceElement();
	    }

	    function parseProgramElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted;

	        while (index < length) {
	            token = lookahead;
	            if (token.type !== Token.StringLiteral) {
	                break;
	            }

	            sourceElement = parseProgramElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.range[0] + 1, token.range[1] - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }

	        while (index < length) {
	            sourceElement = parseProgramElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }
	        return sourceElements;
	    }

	    function parseProgram() {
	        var body, marker = markerCreate();
	        strict = extra.sourceType === 'module';
	        peek();
	        body = parseProgramElements();
	        return markerApply(marker, delegate.createProgram(body));
	    }

	    // 16 JSX

	    XHTMLEntities = {
	        quot: '\u0022',
	        amp: '&',
	        apos: '\u0027',
	        lt: '<',
	        gt: '>',
	        nbsp: '\u00A0',
	        iexcl: '\u00A1',
	        cent: '\u00A2',
	        pound: '\u00A3',
	        curren: '\u00A4',
	        yen: '\u00A5',
	        brvbar: '\u00A6',
	        sect: '\u00A7',
	        uml: '\u00A8',
	        copy: '\u00A9',
	        ordf: '\u00AA',
	        laquo: '\u00AB',
	        not: '\u00AC',
	        shy: '\u00AD',
	        reg: '\u00AE',
	        macr: '\u00AF',
	        deg: '\u00B0',
	        plusmn: '\u00B1',
	        sup2: '\u00B2',
	        sup3: '\u00B3',
	        acute: '\u00B4',
	        micro: '\u00B5',
	        para: '\u00B6',
	        middot: '\u00B7',
	        cedil: '\u00B8',
	        sup1: '\u00B9',
	        ordm: '\u00BA',
	        raquo: '\u00BB',
	        frac14: '\u00BC',
	        frac12: '\u00BD',
	        frac34: '\u00BE',
	        iquest: '\u00BF',
	        Agrave: '\u00C0',
	        Aacute: '\u00C1',
	        Acirc: '\u00C2',
	        Atilde: '\u00C3',
	        Auml: '\u00C4',
	        Aring: '\u00C5',
	        AElig: '\u00C6',
	        Ccedil: '\u00C7',
	        Egrave: '\u00C8',
	        Eacute: '\u00C9',
	        Ecirc: '\u00CA',
	        Euml: '\u00CB',
	        Igrave: '\u00CC',
	        Iacute: '\u00CD',
	        Icirc: '\u00CE',
	        Iuml: '\u00CF',
	        ETH: '\u00D0',
	        Ntilde: '\u00D1',
	        Ograve: '\u00D2',
	        Oacute: '\u00D3',
	        Ocirc: '\u00D4',
	        Otilde: '\u00D5',
	        Ouml: '\u00D6',
	        times: '\u00D7',
	        Oslash: '\u00D8',
	        Ugrave: '\u00D9',
	        Uacute: '\u00DA',
	        Ucirc: '\u00DB',
	        Uuml: '\u00DC',
	        Yacute: '\u00DD',
	        THORN: '\u00DE',
	        szlig: '\u00DF',
	        agrave: '\u00E0',
	        aacute: '\u00E1',
	        acirc: '\u00E2',
	        atilde: '\u00E3',
	        auml: '\u00E4',
	        aring: '\u00E5',
	        aelig: '\u00E6',
	        ccedil: '\u00E7',
	        egrave: '\u00E8',
	        eacute: '\u00E9',
	        ecirc: '\u00EA',
	        euml: '\u00EB',
	        igrave: '\u00EC',
	        iacute: '\u00ED',
	        icirc: '\u00EE',
	        iuml: '\u00EF',
	        eth: '\u00F0',
	        ntilde: '\u00F1',
	        ograve: '\u00F2',
	        oacute: '\u00F3',
	        ocirc: '\u00F4',
	        otilde: '\u00F5',
	        ouml: '\u00F6',
	        divide: '\u00F7',
	        oslash: '\u00F8',
	        ugrave: '\u00F9',
	        uacute: '\u00FA',
	        ucirc: '\u00FB',
	        uuml: '\u00FC',
	        yacute: '\u00FD',
	        thorn: '\u00FE',
	        yuml: '\u00FF',
	        OElig: '\u0152',
	        oelig: '\u0153',
	        Scaron: '\u0160',
	        scaron: '\u0161',
	        Yuml: '\u0178',
	        fnof: '\u0192',
	        circ: '\u02C6',
	        tilde: '\u02DC',
	        Alpha: '\u0391',
	        Beta: '\u0392',
	        Gamma: '\u0393',
	        Delta: '\u0394',
	        Epsilon: '\u0395',
	        Zeta: '\u0396',
	        Eta: '\u0397',
	        Theta: '\u0398',
	        Iota: '\u0399',
	        Kappa: '\u039A',
	        Lambda: '\u039B',
	        Mu: '\u039C',
	        Nu: '\u039D',
	        Xi: '\u039E',
	        Omicron: '\u039F',
	        Pi: '\u03A0',
	        Rho: '\u03A1',
	        Sigma: '\u03A3',
	        Tau: '\u03A4',
	        Upsilon: '\u03A5',
	        Phi: '\u03A6',
	        Chi: '\u03A7',
	        Psi: '\u03A8',
	        Omega: '\u03A9',
	        alpha: '\u03B1',
	        beta: '\u03B2',
	        gamma: '\u03B3',
	        delta: '\u03B4',
	        epsilon: '\u03B5',
	        zeta: '\u03B6',
	        eta: '\u03B7',
	        theta: '\u03B8',
	        iota: '\u03B9',
	        kappa: '\u03BA',
	        lambda: '\u03BB',
	        mu: '\u03BC',
	        nu: '\u03BD',
	        xi: '\u03BE',
	        omicron: '\u03BF',
	        pi: '\u03C0',
	        rho: '\u03C1',
	        sigmaf: '\u03C2',
	        sigma: '\u03C3',
	        tau: '\u03C4',
	        upsilon: '\u03C5',
	        phi: '\u03C6',
	        chi: '\u03C7',
	        psi: '\u03C8',
	        omega: '\u03C9',
	        thetasym: '\u03D1',
	        upsih: '\u03D2',
	        piv: '\u03D6',
	        ensp: '\u2002',
	        emsp: '\u2003',
	        thinsp: '\u2009',
	        zwnj: '\u200C',
	        zwj: '\u200D',
	        lrm: '\u200E',
	        rlm: '\u200F',
	        ndash: '\u2013',
	        mdash: '\u2014',
	        lsquo: '\u2018',
	        rsquo: '\u2019',
	        sbquo: '\u201A',
	        ldquo: '\u201C',
	        rdquo: '\u201D',
	        bdquo: '\u201E',
	        dagger: '\u2020',
	        Dagger: '\u2021',
	        bull: '\u2022',
	        hellip: '\u2026',
	        permil: '\u2030',
	        prime: '\u2032',
	        Prime: '\u2033',
	        lsaquo: '\u2039',
	        rsaquo: '\u203A',
	        oline: '\u203E',
	        frasl: '\u2044',
	        euro: '\u20AC',
	        image: '\u2111',
	        weierp: '\u2118',
	        real: '\u211C',
	        trade: '\u2122',
	        alefsym: '\u2135',
	        larr: '\u2190',
	        uarr: '\u2191',
	        rarr: '\u2192',
	        darr: '\u2193',
	        harr: '\u2194',
	        crarr: '\u21B5',
	        lArr: '\u21D0',
	        uArr: '\u21D1',
	        rArr: '\u21D2',
	        dArr: '\u21D3',
	        hArr: '\u21D4',
	        forall: '\u2200',
	        part: '\u2202',
	        exist: '\u2203',
	        empty: '\u2205',
	        nabla: '\u2207',
	        isin: '\u2208',
	        notin: '\u2209',
	        ni: '\u220B',
	        prod: '\u220F',
	        sum: '\u2211',
	        minus: '\u2212',
	        lowast: '\u2217',
	        radic: '\u221A',
	        prop: '\u221D',
	        infin: '\u221E',
	        ang: '\u2220',
	        and: '\u2227',
	        or: '\u2228',
	        cap: '\u2229',
	        cup: '\u222A',
	        'int': '\u222B',
	        there4: '\u2234',
	        sim: '\u223C',
	        cong: '\u2245',
	        asymp: '\u2248',
	        ne: '\u2260',
	        equiv: '\u2261',
	        le: '\u2264',
	        ge: '\u2265',
	        sub: '\u2282',
	        sup: '\u2283',
	        nsub: '\u2284',
	        sube: '\u2286',
	        supe: '\u2287',
	        oplus: '\u2295',
	        otimes: '\u2297',
	        perp: '\u22A5',
	        sdot: '\u22C5',
	        lceil: '\u2308',
	        rceil: '\u2309',
	        lfloor: '\u230A',
	        rfloor: '\u230B',
	        lang: '\u2329',
	        rang: '\u232A',
	        loz: '\u25CA',
	        spades: '\u2660',
	        clubs: '\u2663',
	        hearts: '\u2665',
	        diams: '\u2666'
	    };

	    function getQualifiedJSXName(object) {
	        if (object.type === Syntax.JSXIdentifier) {
	            return object.name;
	        }
	        if (object.type === Syntax.JSXNamespacedName) {
	            return object.namespace.name + ':' + object.name.name;
	        }
	        /* istanbul ignore else */
	        if (object.type === Syntax.JSXMemberExpression) {
	            return (
	                getQualifiedJSXName(object.object) + '.' +
	                getQualifiedJSXName(object.property)
	            );
	        }
	        /* istanbul ignore next */
	        throwUnexpected(object);
	    }

	    function isJSXIdentifierStart(ch) {
	        // exclude backslash (\)
	        return (ch !== 92) && isIdentifierStart(ch);
	    }

	    function isJSXIdentifierPart(ch) {
	        // exclude backslash (\) and add hyphen (-)
	        return (ch !== 92) && (ch === 45 || isIdentifierPart(ch));
	    }

	    function scanJSXIdentifier() {
	        var ch, start, value = '';

	        start = index;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isJSXIdentifierPart(ch)) {
	                break;
	            }
	            value += source[index++];
	        }

	        return {
	            type: Token.JSXIdentifier,
	            value: value,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanJSXEntity() {
	        var ch, str = '', start = index, count = 0, code;
	        ch = source[index];
	        assert(ch === '&', 'Entity must start with an ampersand');
	        index++;
	        while (index < length && count++ < 10) {
	            ch = source[index++];
	            if (ch === ';') {
	                break;
	            }
	            str += ch;
	        }

	        // Well-formed entity (ending was found).
	        if (ch === ';') {
	            // Numeric entity.
	            if (str[0] === '#') {
	                if (str[1] === 'x') {
	                    code = +('0' + str.substr(1));
	                } else {
	                    // Removing leading zeros in order to avoid treating as octal in old browsers.
	                    code = +str.substr(1).replace(Regex.LeadingZeros, '');
	                }

	                if (!isNaN(code)) {
	                    return String.fromCharCode(code);
	                }
	            /* istanbul ignore else */
	            } else if (XHTMLEntities[str]) {
	                return XHTMLEntities[str];
	            }
	        }

	        // Treat non-entity sequences as regular text.
	        index = start + 1;
	        return '&';
	    }

	    function scanJSXText(stopChars) {
	        var ch, str = '', start;
	        start = index;
	        while (index < length) {
	            ch = source[index];
	            if (stopChars.indexOf(ch) !== -1) {
	                break;
	            }
	            if (ch === '&') {
	                str += scanJSXEntity();
	            } else {
	                index++;
	                if (ch === '\r' && source[index] === '\n') {
	                    str += ch;
	                    ch = source[index];
	                    index++;
	                }
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    ++lineNumber;
	                    lineStart = index;
	                }
	                str += ch;
	            }
	        }
	        return {
	            type: Token.JSXText,
	            value: str,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            range: [start, index]
	        };
	    }

	    function scanJSXStringLiteral() {
	        var innerToken, quote, start;

	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');

	        start = index;
	        ++index;

	        innerToken = scanJSXText([quote]);

	        if (quote !== source[index]) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }

	        ++index;

	        innerToken.range = [start, index];

	        return innerToken;
	    }

	    /**
	     * Between JSX opening and closing tags (e.g. <foo>HERE</foo>), anything that
	     * is not another JSX tag and is not an expression wrapped by {} is text.
	     */
	    function advanceJSXChild() {
	        var ch = source.charCodeAt(index);

	        // '<' 60, '>' 62, '{' 123, '}' 125
	        if (ch !== 60 && ch !== 62 && ch !== 123 && ch !== 125) {
	            return scanJSXText(['<', '>', '{', '}']);
	        }

	        return scanPunctuator();
	    }

	    function parseJSXIdentifier() {
	        var token, marker = markerCreate();

	        if (lookahead.type !== Token.JSXIdentifier) {
	            throwUnexpected(lookahead);
	        }

	        token = lex();
	        return markerApply(marker, delegate.createJSXIdentifier(token.value));
	    }

	    function parseJSXNamespacedName() {
	        var namespace, name, marker = markerCreate();

	        namespace = parseJSXIdentifier();
	        expect(':');
	        name = parseJSXIdentifier();

	        return markerApply(marker, delegate.createJSXNamespacedName(namespace, name));
	    }

	    function parseJSXMemberExpression() {
	        var marker = markerCreate(),
	            expr = parseJSXIdentifier();

	        while (match('.')) {
	            lex();
	            expr = markerApply(marker, delegate.createJSXMemberExpression(expr, parseJSXIdentifier()));
	        }

	        return expr;
	    }

	    function parseJSXElementName() {
	        if (lookahead2().value === ':') {
	            return parseJSXNamespacedName();
	        }
	        if (lookahead2().value === '.') {
	            return parseJSXMemberExpression();
	        }

	        return parseJSXIdentifier();
	    }

	    function parseJSXAttributeName() {
	        if (lookahead2().value === ':') {
	            return parseJSXNamespacedName();
	        }

	        return parseJSXIdentifier();
	    }

	    function parseJSXAttributeValue() {
	        var value, marker;
	        if (match('{')) {
	            value = parseJSXExpressionContainer();
	            if (value.expression.type === Syntax.JSXEmptyExpression) {
	                throwError(
	                    value,
	                    'JSX attributes must only be assigned a non-empty ' +
	                        'expression'
	                );
	            }
	        } else if (match('<')) {
	            value = parseJSXElement();
	        } else if (lookahead.type === Token.JSXText) {
	            marker = markerCreate();
	            value = markerApply(marker, delegate.createLiteral(lex()));
	        } else {
	            throwError({}, Messages.InvalidJSXAttributeValue);
	        }
	        return value;
	    }

	    function parseJSXEmptyExpression() {
	        var marker = markerCreatePreserveWhitespace();
	        while (source.charAt(index) !== '}') {
	            index++;
	        }
	        return markerApply(marker, delegate.createJSXEmptyExpression());
	    }

	    function parseJSXExpressionContainer() {
	        var expression, origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = false;

	        expect('{');

	        if (match('}')) {
	            expression = parseJSXEmptyExpression();
	        } else {
	            expression = parseExpression();
	        }

	        state.inJSXChild = origInJSXChild;
	        state.inJSXTag = origInJSXTag;

	        expect('}');

	        return markerApply(marker, delegate.createJSXExpressionContainer(expression));
	    }

	    function parseJSXSpreadAttribute() {
	        var expression, origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = false;

	        expect('{');
	        expect('...');

	        expression = parseAssignmentExpression();

	        state.inJSXChild = origInJSXChild;
	        state.inJSXTag = origInJSXTag;

	        expect('}');

	        return markerApply(marker, delegate.createJSXSpreadAttribute(expression));
	    }

	    function parseJSXAttribute() {
	        var name, marker;

	        if (match('{')) {
	            return parseJSXSpreadAttribute();
	        }

	        marker = markerCreate();

	        name = parseJSXAttributeName();

	        // HTML empty attribute
	        if (match('=')) {
	            lex();
	            return markerApply(marker, delegate.createJSXAttribute(name, parseJSXAttributeValue()));
	        }

	        return markerApply(marker, delegate.createJSXAttribute(name));
	    }

	    function parseJSXChild() {
	        var token, marker;
	        if (match('{')) {
	            token = parseJSXExpressionContainer();
	        } else if (lookahead.type === Token.JSXText) {
	            marker = markerCreatePreserveWhitespace();
	            token = markerApply(marker, delegate.createLiteral(lex()));
	        } else if (match('<')) {
	            token = parseJSXElement();
	        } else {
	            throwUnexpected(lookahead);
	        }
	        return token;
	    }

	    function parseJSXClosingElement() {
	        var name, origInJSXChild, origInJSXTag, marker = markerCreate();
	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = true;
	        expect('<');
	        expect('/');
	        name = parseJSXElementName();
	        // Because advance() (called by lex() called by expect()) expects there
	        // to be a valid token after >, it needs to know whether to look for a
	        // standard JS token or an JSX text node
	        state.inJSXChild = origInJSXChild;
	        state.inJSXTag = origInJSXTag;
	        expect('>');
	        return markerApply(marker, delegate.createJSXClosingElement(name));
	    }

	    function parseJSXOpeningElement() {
	        var name, attributes = [], selfClosing = false, origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        state.inJSXChild = false;
	        state.inJSXTag = true;

	        expect('<');

	        name = parseJSXElementName();

	        while (index < length &&
	                lookahead.value !== '/' &&
	                lookahead.value !== '>') {
	            attributes.push(parseJSXAttribute());
	        }

	        state.inJSXTag = origInJSXTag;

	        if (lookahead.value === '/') {
	            expect('/');
	            // Because advance() (called by lex() called by expect()) expects
	            // there to be a valid token after >, it needs to know whether to
	            // look for a standard JS token or an JSX text node
	            state.inJSXChild = origInJSXChild;
	            expect('>');
	            selfClosing = true;
	        } else {
	            state.inJSXChild = true;
	            expect('>');
	        }
	        return markerApply(marker, delegate.createJSXOpeningElement(name, attributes, selfClosing));
	    }

	    function parseJSXElement() {
	        var openingElement, closingElement = null, children = [], origInJSXChild, origInJSXTag, marker = markerCreate();

	        origInJSXChild = state.inJSXChild;
	        origInJSXTag = state.inJSXTag;
	        openingElement = parseJSXOpeningElement();

	        if (!openingElement.selfClosing) {
	            while (index < length) {
	                state.inJSXChild = false; // Call lookahead2() with inJSXChild = false because </ should not be considered in the child
	                if (lookahead.value === '<' && lookahead2().value === '/') {
	                    break;
	                }
	                state.inJSXChild = true;
	                children.push(parseJSXChild());
	            }
	            state.inJSXChild = origInJSXChild;
	            state.inJSXTag = origInJSXTag;
	            closingElement = parseJSXClosingElement();
	            if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
	                throwError({}, Messages.ExpectedJSXClosingTag, getQualifiedJSXName(openingElement.name));
	            }
	        }

	        // When (erroneously) writing two adjacent tags like
	        //
	        //     var x = <div>one</div><div>two</div>;
	        //
	        // the default error message is a bit incomprehensible. Since it's
	        // rarely (never?) useful to write a less-than sign after an JSX
	        // element, we disallow it here in the parser in order to provide a
	        // better error message. (In the rare case that the less-than operator
	        // was intended, the left tag can be wrapped in parentheses.)
	        if (!origInJSXChild && match('<')) {
	            throwError(lookahead, Messages.AdjacentJSXElements);
	        }

	        return markerApply(marker, delegate.createJSXElement(openingElement, closingElement, children));
	    }

	    function parseTypeAlias() {
	        var id, marker = markerCreate(), typeParameters = null, right;
	        expectContextualKeyword('type');
	        id = parseVariableIdentifier();
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }
	        expect('=');
	        right = parseType();
	        consumeSemicolon();
	        return markerApply(marker, delegate.createTypeAlias(id, typeParameters, right));
	    }

	    function parseInterfaceExtends() {
	        var marker = markerCreate(), id, typeParameters = null;

	        id = parseVariableIdentifier();
	        if (match('<')) {
	            typeParameters = parseTypeParameterInstantiation();
	        }

	        return markerApply(marker, delegate.createInterfaceExtends(
	            id,
	            typeParameters
	        ));
	    }

	    function parseInterfaceish(marker, allowStatic) {
	        var body, bodyMarker, extended = [], id,
	            typeParameters = null;

	        id = parseVariableIdentifier();
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }

	        if (matchKeyword('extends')) {
	            expectKeyword('extends');

	            while (index < length) {
	                extended.push(parseInterfaceExtends());
	                if (!match(',')) {
	                    break;
	                }
	                expect(',');
	            }
	        }

	        bodyMarker = markerCreate();
	        body = markerApply(bodyMarker, parseObjectType(allowStatic));

	        return markerApply(marker, delegate.createInterface(
	            id,
	            typeParameters,
	            body,
	            extended
	        ));
	    }

	    function parseInterface() {
	        var marker = markerCreate();

	        if (strict) {
	            expectKeyword('interface');
	        } else {
	            expectContextualKeyword('interface');
	        }

	        return parseInterfaceish(marker, /* allowStatic */false);
	    }

	    function parseDeclareClass() {
	        var marker = markerCreate(), ret;
	        expectContextualKeyword('declare');
	        expectKeyword('class');

	        ret = parseInterfaceish(marker, /* allowStatic */true);
	        ret.type = Syntax.DeclareClass;
	        return ret;
	    }

	    function parseDeclareFunction() {
	        var id, idMarker,
	            marker = markerCreate(), params, returnType, rest, tmp,
	            typeParameters = null, value, valueMarker;

	        expectContextualKeyword('declare');
	        expectKeyword('function');
	        idMarker = markerCreate();
	        id = parseVariableIdentifier();

	        valueMarker = markerCreate();
	        if (match('<')) {
	            typeParameters = parseTypeParameterDeclaration();
	        }
	        expect('(');
	        tmp = parseFunctionTypeParams();
	        params = tmp.params;
	        rest = tmp.rest;
	        expect(')');

	        expect(':');
	        returnType = parseType();

	        value = markerApply(valueMarker, delegate.createFunctionTypeAnnotation(
	            params,
	            returnType,
	            rest,
	            typeParameters
	        ));

	        id.typeAnnotation = markerApply(valueMarker, delegate.createTypeAnnotation(
	            value
	        ));
	        markerApply(idMarker, id);

	        consumeSemicolon();

	        return markerApply(marker, delegate.createDeclareFunction(
	            id
	        ));
	    }

	    function parseDeclareVariable() {
	        var id, marker = markerCreate();
	        expectContextualKeyword('declare');
	        expectKeyword('var');
	        id = parseTypeAnnotatableIdentifier();

	        consumeSemicolon();

	        return markerApply(marker, delegate.createDeclareVariable(
	            id
	        ));
	    }

	    function parseDeclareModule() {
	        var body = [], bodyMarker, id, idMarker, marker = markerCreate(), token;
	        expectContextualKeyword('declare');
	        expectContextualKeyword('module');

	        if (lookahead.type === Token.StringLiteral) {
	            if (strict && lookahead.octal) {
	                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	            }
	            idMarker = markerCreate();
	            id = markerApply(idMarker, delegate.createLiteral(lex()));
	        } else {
	            id = parseVariableIdentifier();
	        }

	        bodyMarker = markerCreate();
	        expect('{');
	        while (index < length && !match('}')) {
	            token = lookahead2();
	            switch (token.value) {
	            case 'class':
	                body.push(parseDeclareClass());
	                break;
	            case 'function':
	                body.push(parseDeclareFunction());
	                break;
	            case 'var':
	                body.push(parseDeclareVariable());
	                break;
	            default:
	                throwUnexpected(lookahead);
	            }
	        }
	        expect('}');

	        return markerApply(marker, delegate.createDeclareModule(
	            id,
	            markerApply(bodyMarker, delegate.createBlockStatement(body))
	        ));
	    }

	    function collectToken() {
	        var loc, token, range, value, entry;

	        /* istanbul ignore else */
	        if (!state.inJSXChild) {
	            skipComment();
	        }

	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        token = extra.advance();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (token.type !== Token.EOF) {
	            range = [token.range[0], token.range[1]];
	            value = source.slice(token.range[0], token.range[1]);
	            entry = {
	                type: TokenName[token.type],
	                value: value,
	                range: range,
	                loc: loc
	            };
	            if (token.regex) {
	                entry.regex = {
	                    pattern: token.regex.pattern,
	                    flags: token.regex.flags
	                };
	            }
	            extra.tokens.push(entry);
	        }

	        return token;
	    }

	    function collectRegex() {
	        var pos, loc, regex, token;

	        skipComment();

	        pos = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };

	        regex = extra.scanRegExp();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };

	        if (!extra.tokenize) {
	            /* istanbul ignore next */
	            // Pop the previous token, which is likely '/' or '/='
	            if (extra.tokens.length > 0) {
	                token = extra.tokens[extra.tokens.length - 1];
	                if (token.range[0] === pos && token.type === 'Punctuator') {
	                    if (token.value === '/' || token.value === '/=') {
	                        extra.tokens.pop();
	                    }
	                }
	            }

	            extra.tokens.push({
	                type: 'RegularExpression',
	                value: regex.literal,
	                regex: regex.regex,
	                range: [pos, index],
	                loc: loc
	            });
	        }

	        return regex;
	    }

	    function filterTokenLocation() {
	        var i, entry, token, tokens = [];

	        for (i = 0; i < extra.tokens.length; ++i) {
	            entry = extra.tokens[i];
	            token = {
	                type: entry.type,
	                value: entry.value
	            };
	            if (entry.regex) {
	                token.regex = {
	                    pattern: entry.regex.pattern,
	                    flags: entry.regex.flags
	                };
	            }
	            if (extra.range) {
	                token.range = entry.range;
	            }
	            if (extra.loc) {
	                token.loc = entry.loc;
	            }
	            tokens.push(token);
	        }

	        extra.tokens = tokens;
	    }

	    function patch() {
	        if (typeof extra.tokens !== 'undefined') {
	            extra.advance = advance;
	            extra.scanRegExp = scanRegExp;

	            advance = collectToken;
	            scanRegExp = collectRegex;
	        }
	    }

	    function unpatch() {
	        if (typeof extra.scanRegExp === 'function') {
	            advance = extra.advance;
	            scanRegExp = extra.scanRegExp;
	        }
	    }

	    // This is used to modify the delegate.

	    function extend(object, properties) {
	        var entry, result = {};

	        for (entry in object) {
	            /* istanbul ignore else */
	            if (object.hasOwnProperty(entry)) {
	                result[entry] = object[entry];
	            }
	        }

	        for (entry in properties) {
	            /* istanbul ignore else */
	            if (properties.hasOwnProperty(entry)) {
	                result[entry] = properties[entry];
	            }
	        }

	        return result;
	    }

	    function tokenize(code, options) {
	        var toString,
	            token,
	            tokens;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowKeyword: true,
	            allowIn: true,
	            labelSet: new StringMap(),
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1
	        };

	        extra = {};

	        // Options matching.
	        options = options || {};

	        // Of course we collect tokens here.
	        options.tokens = true;
	        extra.tokens = [];
	        extra.tokenize = true;
	        // The following two fields are necessary to compute the Regex tokens.
	        extra.openParenToken = -1;
	        extra.openCurlyToken = -1;

	        extra.range = (typeof options.range === 'boolean') && options.range;
	        extra.loc = (typeof options.loc === 'boolean') && options.loc;

	        if (typeof options.comment === 'boolean' && options.comment) {
	            extra.comments = [];
	        }
	        if (typeof options.tolerant === 'boolean' && options.tolerant) {
	            extra.errors = [];
	        }

	        patch();

	        try {
	            peek();
	            if (lookahead.type === Token.EOF) {
	                return extra.tokens;
	            }

	            token = lex();
	            while (lookahead.type !== Token.EOF) {
	                try {
	                    token = lex();
	                } catch (lexError) {
	                    token = lookahead;
	                    if (extra.errors) {
	                        extra.errors.push(lexError);
	                        // We have to break on the first error
	                        // to avoid infinite loops.
	                        break;
	                    } else {
	                        throw lexError;
	                    }
	                }
	            }

	            filterTokenLocation();
	            tokens = extra.tokens;
	            if (typeof extra.comments !== 'undefined') {
	                tokens.comments = extra.comments;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                tokens.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            unpatch();
	            extra = {};
	        }
	        return tokens;
	    }

	    function parse(code, options) {
	        var program, toString;

	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }

	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowKeyword: false,
	            allowIn: true,
	            labelSet: new StringMap(),
	            parenthesizedCount: 0,
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            inJSXChild: false,
	            inJSXTag: false,
	            inType: false,
	            lastCommentStart: -1,
	            yieldAllowed: false,
	            awaitAllowed: false
	        };

	        extra = {};
	        if (typeof options !== 'undefined') {
	            extra.range = (typeof options.range === 'boolean') && options.range;
	            extra.loc = (typeof options.loc === 'boolean') && options.loc;
	            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

	            if (extra.loc && options.source !== null && options.source !== undefined) {
	                delegate = extend(delegate, {
	                    'postProcess': function (node) {
	                        node.loc.source = toString(options.source);
	                        return node;
	                    }
	                });
	            }

	            extra.sourceType = options.sourceType;
	            if (typeof options.tokens === 'boolean' && options.tokens) {
	                extra.tokens = [];
	            }
	            if (typeof options.comment === 'boolean' && options.comment) {
	                extra.comments = [];
	            }
	            if (typeof options.tolerant === 'boolean' && options.tolerant) {
	                extra.errors = [];
	            }
	            if (extra.attachComment) {
	                extra.range = true;
	                extra.comments = [];
	                extra.bottomRightStack = [];
	                extra.trailingComments = [];
	                extra.leadingComments = [];
	            }
	        }

	        patch();
	        try {
	            program = parseProgram();
	            if (typeof extra.comments !== 'undefined') {
	                program.comments = extra.comments;
	            }
	            if (typeof extra.tokens !== 'undefined') {
	                filterTokenLocation();
	                program.tokens = extra.tokens;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                program.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            unpatch();
	            extra = {};
	        }

	        return program;
	    }

	    // Sync with *.json manifests.
	    exports.version = '13001.1001.0-dev-harmony-fb';

	    exports.tokenize = tokenize;

	    exports.parse = parse;

	    // Deep copy.
	   /* istanbul ignore next */
	    exports.Syntax = (function () {
	        var name, types = {};

	        if (typeof Object.create === 'function') {
	            types = Object.create(null);
	        }

	        for (name in Syntax) {
	            if (Syntax.hasOwnProperty(name)) {
	                types[name] = Syntax[name];
	            }
	        }

	        if (typeof Object.freeze === 'function') {
	            Object.freeze(types);
	        }

	        return types;
	    }());

	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(6),
	    isNative = __webpack_require__(9),
	    isObjectLike = __webpack_require__(7);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	module.exports = isArray;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10);

	/**
	 * Converts `value` to an object if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var escapeRegExp = __webpack_require__(101),
	    isObjectLike = __webpack_require__(7);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  escapeRegExp(objToString)
	  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (objToString.call(value) == funcTag) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isNative;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return type == 'function' || (!!value && type == 'object');
	}

	module.exports = isObject;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(13),
	    isNative = __webpack_require__(9),
	    isObject = __webpack_require__(10),
	    shimKeys = __webpack_require__(94);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object != null && object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	module.exports = keys;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Converts `value` to a string if it is not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  if (typeof value == 'string') {
	    return value;
	  }
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(34),
	    isLength = __webpack_require__(6);

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	module.exports = isArrayLike;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// Parse link destination
	//
	'use strict';


	var unescapeAll   = __webpack_require__(1).unescapeAll;


	module.exports = function parseLinkDestination(str, pos, max) {
	  var code, level,
	      lines = 0,
	      start = pos,
	      result = {
	        ok: false,
	        pos: 0,
	        lines: 0,
	        str: ''
	      };

	  if (str.charCodeAt(pos) === 0x3C /* < */) {
	    pos++;
	    while (pos < max) {
	      code = str.charCodeAt(pos);
	      if (code === 0x0A /* \n */) { return result; }
	      if (code === 0x3E /* > */) {
	        result.pos = pos + 1;
	        result.str = unescapeAll(str.slice(start + 1, pos));
	        result.ok = true;
	        return result;
	      }
	      if (code === 0x5C /* \ */ && pos + 1 < max) {
	        pos += 2;
	        continue;
	      }

	      pos++;
	    }

	    // no closing '>'
	    return result;
	  }

	  // this should be ... } else { ... branch

	  level = 0;
	  while (pos < max) {
	    code = str.charCodeAt(pos);

	    if (code === 0x20) { break; }

	    // ascii control characters
	    if (code < 0x20 || code === 0x7F) { break; }

	    if (code === 0x5C /* \ */ && pos + 1 < max) {
	      pos += 2;
	      continue;
	    }

	    if (code === 0x28 /* ( */) {
	      level++;
	      if (level > 1) { break; }
	    }

	    if (code === 0x29 /* ) */) {
	      level--;
	      if (level < 0) { break; }
	    }

	    pos++;
	  }

	  if (start === pos) { return result; }

	  result.str = unescapeAll(str.slice(start, pos));
	  result.lines = lines;
	  result.pos = pos;
	  result.ok = true;
	  return result;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// Parse link title
	//
	'use strict';


	var unescapeAll = __webpack_require__(1).unescapeAll;


	module.exports = function parseLinkTitle(str, pos, max) {
	  var code,
	      marker,
	      lines = 0,
	      start = pos,
	      result = {
	        ok: false,
	        pos: 0,
	        lines: 0,
	        str: ''
	      };

	  if (pos >= max) { return result; }

	  marker = str.charCodeAt(pos);

	  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return result; }

	  pos++;

	  // if opening marker is "(", switch it to closing marker ")"
	  if (marker === 0x28) { marker = 0x29; }

	  while (pos < max) {
	    code = str.charCodeAt(pos);
	    if (code === marker) {
	      result.pos = pos + 1;
	      result.lines = lines;
	      result.str = unescapeAll(str.slice(start + 1, pos));
	      result.ok = true;
	      return result;
	    } else if (code === 0x0A) {
	      lines++;
	    } else if (code === 0x5C /* \ */ && pos + 1 < max) {
	      pos++;
	      if (str.charCodeAt(pos) === 0x0A) {
	        lines++;
	      }
	    }

	    pos++;
	  }

	  return result;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * This is a helper function for getting values from parameter/options
	   * objects.
	   *
	   * @param args The object we are extracting values from
	   * @param name The name of the property we are getting.
	   * @param defaultValue An optional value to return if the property is missing
	   * from the object. If this is not specified and the property is missing, an
	   * error will be thrown.
	   */
	  function getArg(aArgs, aName, aDefaultValue) {
	    if (aName in aArgs) {
	      return aArgs[aName];
	    } else if (arguments.length === 3) {
	      return aDefaultValue;
	    } else {
	      throw new Error('"' + aName + '" is a required argument.');
	    }
	  }
	  exports.getArg = getArg;

	  var urlRegexp = /([\w+\-.]+):\/\/((\w+:\w+)@)?([\w.]+)?(:(\d+))?(\S+)?/;
	  var dataUrlRegexp = /^data:.+\,.+/;

	  function urlParse(aUrl) {
	    var match = aUrl.match(urlRegexp);
	    if (!match) {
	      return null;
	    }
	    return {
	      scheme: match[1],
	      auth: match[3],
	      host: match[4],
	      port: match[6],
	      path: match[7]
	    };
	  }
	  exports.urlParse = urlParse;

	  function urlGenerate(aParsedUrl) {
	    var url = aParsedUrl.scheme + "://";
	    if (aParsedUrl.auth) {
	      url += aParsedUrl.auth + "@"
	    }
	    if (aParsedUrl.host) {
	      url += aParsedUrl.host;
	    }
	    if (aParsedUrl.port) {
	      url += ":" + aParsedUrl.port
	    }
	    if (aParsedUrl.path) {
	      url += aParsedUrl.path;
	    }
	    return url;
	  }
	  exports.urlGenerate = urlGenerate;

	  function join(aRoot, aPath) {
	    var url;

	    if (aPath.match(urlRegexp) || aPath.match(dataUrlRegexp)) {
	      return aPath;
	    }

	    if (aPath.charAt(0) === '/' && (url = urlParse(aRoot))) {
	      url.path = aPath;
	      return urlGenerate(url);
	    }

	    return aRoot.replace(/\/$/, '') + '/' + aPath;
	  }
	  exports.join = join;

	  /**
	   * Because behavior goes wacky when you set `__proto__` on objects, we
	   * have to prefix all the strings in our set with an arbitrary character.
	   *
	   * See https://github.com/mozilla/source-map/pull/31 and
	   * https://github.com/mozilla/source-map/issues/30
	   *
	   * @param String aStr
	   */
	  function toSetString(aStr) {
	    return '$' + aStr;
	  }
	  exports.toSetString = toSetString;

	  function fromSetString(aStr) {
	    return aStr.substr(1);
	  }
	  exports.fromSetString = fromSetString;

	  function relative(aRoot, aPath) {
	    aRoot = aRoot.replace(/\/$/, '');

	    var url = urlParse(aRoot);
	    if (aPath.charAt(0) == "/" && url && url.path == "/") {
	      return aPath.slice(1);
	    }

	    return aPath.indexOf(aRoot + '/') === 0
	      ? aPath.substr(aRoot.length + 1)
	      : aPath;
	  }
	  exports.relative = relative;

	  function strcmp(aStr1, aStr2) {
	    var s1 = aStr1 || "";
	    var s2 = aStr2 || "";
	    return (s1 > s2) - (s1 < s2);
	  }

	  /**
	   * Comparator between two mappings where the original positions are compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same original source/line/column, but different generated
	   * line and column the same. Useful when searching for a mapping with a
	   * stubbed out mapping.
	   */
	  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	    var cmp;

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp || onlyCompareOriginal) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.name, mappingB.name);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    return mappingA.generatedColumn - mappingB.generatedColumn;
	  };
	  exports.compareByOriginalPositions = compareByOriginalPositions;

	  /**
	   * Comparator between two mappings where the generated positions are
	   * compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same generated line and column, but different
	   * source/name/original line and column the same. Useful when searching for a
	   * mapping with a stubbed out mapping.
	   */
	  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
	    var cmp;

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	    if (cmp || onlyCompareGenerated) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp) {
	      return cmp;
	    }

	    return strcmp(mappingA.name, mappingB.name);
	  };
	  exports.compareByGeneratedPositions = compareByGeneratedPositions;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/*jslint node: true*/
	"use strict";

	var esprima = __webpack_require__(3);
	var utils = __webpack_require__(2);

	var getBoundaryNode = utils.getBoundaryNode;
	var declareIdentInScope = utils.declareIdentInLocalScope;
	var initScopeMetadata = utils.initScopeMetadata;
	var Syntax = esprima.Syntax;

	/**
	 * @param {object} node
	 * @param {object} parentNode
	 * @return {boolean}
	 */
	function _nodeIsClosureScopeBoundary(node, parentNode) {
	  if (node.type === Syntax.Program) {
	    return true;
	  }

	  var parentIsFunction =
	    parentNode.type === Syntax.FunctionDeclaration
	    || parentNode.type === Syntax.FunctionExpression
	    || parentNode.type === Syntax.ArrowFunctionExpression;

	  var parentIsCurlylessArrowFunc =
	    parentNode.type === Syntax.ArrowFunctionExpression
	    && node === parentNode.body;

	  return parentIsFunction
	         && (node.type === Syntax.BlockStatement || parentIsCurlylessArrowFunc);
	}

	function _nodeIsBlockScopeBoundary(node, parentNode) {
	  if (node.type === Syntax.Program) {
	    return false;
	  }

	  return node.type === Syntax.BlockStatement
	         && parentNode.type === Syntax.CatchClause;
	}

	/**
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function traverse(node, path, state) {
	  /*jshint -W004*/
	  // Create a scope stack entry if this is the first node we've encountered in
	  // its local scope
	  var startIndex = null;
	  var parentNode = path[0];
	  if (!Array.isArray(node) && state.localScope.parentNode !== parentNode) {
	    if (_nodeIsClosureScopeBoundary(node, parentNode)) {
	      var scopeIsStrict = state.scopeIsStrict;
	      if (!scopeIsStrict
	          && (node.type === Syntax.BlockStatement
	              || node.type === Syntax.Program)) {
	          scopeIsStrict =
	            node.body.length > 0
	            && node.body[0].type === Syntax.ExpressionStatement
	            && node.body[0].expression.type === Syntax.Literal
	            && node.body[0].expression.value === 'use strict';
	      }

	      if (node.type === Syntax.Program) {
	        startIndex = state.g.buffer.length;
	        state = utils.updateState(state, {
	          scopeIsStrict: scopeIsStrict
	        });
	      } else {
	        startIndex = state.g.buffer.length + 1;
	        state = utils.updateState(state, {
	          localScope: {
	            parentNode: parentNode,
	            parentScope: state.localScope,
	            identifiers: {},
	            tempVarIndex: 0,
	            tempVars: []
	          },
	          scopeIsStrict: scopeIsStrict
	        });

	        // All functions have an implicit 'arguments' object in scope
	        declareIdentInScope('arguments', initScopeMetadata(node), state);

	        // Include function arg identifiers in the scope boundaries of the
	        // function
	        if (parentNode.params.length > 0) {
	          var param;
	          var metadata = initScopeMetadata(parentNode, path.slice(1), path[0]);
	          for (var i = 0; i < parentNode.params.length; i++) {
	            param = parentNode.params[i];
	            if (param.type === Syntax.Identifier) {
	              declareIdentInScope(param.name, metadata, state);
	            }
	          }
	        }

	        // Include rest arg identifiers in the scope boundaries of their
	        // functions
	        if (parentNode.rest) {
	          var metadata = initScopeMetadata(
	            parentNode,
	            path.slice(1),
	            path[0]
	          );
	          declareIdentInScope(parentNode.rest.name, metadata, state);
	        }

	        // Named FunctionExpressions scope their name within the body block of
	        // themselves only
	        if (parentNode.type === Syntax.FunctionExpression && parentNode.id) {
	          var metaData =
	            initScopeMetadata(parentNode, path.parentNodeslice, parentNode);
	          declareIdentInScope(parentNode.id.name, metaData, state);
	        }
	      }

	      // Traverse and find all local identifiers in this closure first to
	      // account for function/variable declaration hoisting
	      collectClosureIdentsAndTraverse(node, path, state);
	    }

	    if (_nodeIsBlockScopeBoundary(node, parentNode)) {
	      startIndex = state.g.buffer.length;
	      state = utils.updateState(state, {
	        localScope: {
	          parentNode: parentNode,
	          parentScope: state.localScope,
	          identifiers: {},
	          tempVarIndex: 0,
	          tempVars: []
	        }
	      });

	      if (parentNode.type === Syntax.CatchClause) {
	        var metadata = initScopeMetadata(
	          parentNode,
	          path.slice(1),
	          parentNode
	        );
	        declareIdentInScope(parentNode.param.name, metadata, state);
	      }
	      collectBlockIdentsAndTraverse(node, path, state);
	    }
	  }

	  // Only catchup() before and after traversing a child node
	  function traverser(node, path, state) {
	    node.range && utils.catchup(node.range[0], state);
	    traverse(node, path, state);
	    node.range && utils.catchup(node.range[1], state);
	  }

	  utils.analyzeAndTraverse(walker, traverser, node, path, state);

	  // Inject temp variables into the scope.
	  if (startIndex !== null) {
	    utils.injectTempVarDeclarations(state, startIndex);
	  }
	}

	function collectClosureIdentsAndTraverse(node, path, state) {
	  utils.analyzeAndTraverse(
	    visitLocalClosureIdentifiers,
	    collectClosureIdentsAndTraverse,
	    node,
	    path,
	    state
	  );
	}

	function collectBlockIdentsAndTraverse(node, path, state) {
	  utils.analyzeAndTraverse(
	    visitLocalBlockIdentifiers,
	    collectBlockIdentsAndTraverse,
	    node,
	    path,
	    state
	  );
	}

	function visitLocalClosureIdentifiers(node, path, state) {
	  var metaData;
	  switch (node.type) {
	    case Syntax.ArrowFunctionExpression:
	    case Syntax.FunctionExpression:
	      // Function expressions don't get their names (if there is one) added to
	      // the closure scope they're defined in
	      return false;
	    case Syntax.ClassDeclaration:
	    case Syntax.ClassExpression:
	    case Syntax.FunctionDeclaration:
	      if (node.id) {
	        metaData = initScopeMetadata(getBoundaryNode(path), path.slice(), node);
	        declareIdentInScope(node.id.name, metaData, state);
	      }
	      return false;
	    case Syntax.VariableDeclarator:
	      // Variables have function-local scope
	      if (path[0].kind === 'var') {
	        metaData = initScopeMetadata(getBoundaryNode(path), path.slice(), node);
	        declareIdentInScope(node.id.name, metaData, state);
	      }
	      break;
	  }
	}

	function visitLocalBlockIdentifiers(node, path, state) {
	  // TODO: Support 'let' here...maybe...one day...or something...
	  if (node.type === Syntax.CatchClause) {
	    return false;
	  }
	}

	function walker(node, path, state) {
	  var visitors = state.g.visitors;
	  for (var i = 0; i < visitors.length; i++) {
	    if (visitors[i].test(node, path, state)) {
	      return visitors[i](traverse, node, path, state);
	    }
	  }
	}

	var _astCache = {};

	function getAstForSource(source, options) {
	  if (_astCache[source] && !options.disableAstCache) {
	    return _astCache[source];
	  }
	  var ast = esprima.parse(source, {
	    comment: true,
	    loc: true,
	    range: true,
	    sourceType: options.sourceType
	  });
	  if (!options.disableAstCache) {
	    _astCache[source] = ast;
	  }
	  return ast;
	}

	/**
	 * Applies all available transformations to the source
	 * @param {array} visitors
	 * @param {string} source
	 * @param {?object} options
	 * @return {object}
	 */
	function transform(visitors, source, options) {
	  options = options || {};
	  var ast;
	  try {
	    ast = getAstForSource(source, options);
	    } catch (e) {
	    e.message = 'Parse Error: ' + e.message;
	    throw e;
	  }
	  var state = utils.createState(source, ast, options);
	  state.g.visitors = visitors;

	  if (options.sourceMap) {
	    var SourceMapGenerator = __webpack_require__(178).SourceMapGenerator;
	    state.g.sourceMap = new SourceMapGenerator({file: options.filename || 'transformed.js'});
	  }

	  traverse(ast, [], state);
	  utils.catchup(source.length, state);

	  var ret = {code: state.g.buffer, extra: state.g.extra};
	  if (options.sourceMap) {
	    ret.sourceMap = state.g.sourceMap;
	    ret.sourceMapFilename =  options.filename || 'source.js';
	  }
	  return ret;
	}

	exports.transform = transform;
	exports.Syntax = Syntax;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	var KEYWORDS = [
	  'break', 'do', 'in', 'typeof', 'case', 'else', 'instanceof', 'var', 'catch',
	  'export', 'new', 'void', 'class', 'extends', 'return', 'while', 'const',
	  'finally', 'super', 'with', 'continue', 'for', 'switch', 'yield', 'debugger',
	  'function', 'this', 'default', 'if', 'throw', 'delete', 'import', 'try'
	];

	var FUTURE_RESERVED_WORDS = [
	  'enum', 'await', 'implements', 'package', 'protected', 'static', 'interface',
	  'private', 'public'
	];

	var LITERALS = [
	  'null',
	  'true',
	  'false'
	];

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-reserved-words
	var RESERVED_WORDS = [].concat(
	  KEYWORDS,
	  FUTURE_RESERVED_WORDS,
	  LITERALS
	);

	var reservedWordsMap = Object.create(null);
	RESERVED_WORDS.forEach(function(k) {
	    reservedWordsMap[k] = true;
	});

	/**
	 * This list should not grow as new reserved words are introdued. This list is
	 * of words that need to be quoted because ES3-ish browsers do not allow their
	 * use as identifier names.
	 */
	var ES3_FUTURE_RESERVED_WORDS = [
	  'enum', 'implements', 'package', 'protected', 'static', 'interface',
	  'private', 'public'
	];

	var ES3_RESERVED_WORDS = [].concat(
	  KEYWORDS,
	  ES3_FUTURE_RESERVED_WORDS,
	  LITERALS
	);

	var es3ReservedWordsMap = Object.create(null);
	ES3_RESERVED_WORDS.forEach(function(k) {
	    es3ReservedWordsMap[k] = true;
	});

	exports.isReservedWord = function(word) {
	  return !!reservedWordsMap[word];
	};

	exports.isES3ReservedWord = function(word) {
	  return !!es3ReservedWordsMap[word];
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	/*global exports:true*/
	'use strict';
	var Syntax = __webpack_require__(17).Syntax;
	var utils = __webpack_require__(2);

	function renderJSXLiteral(object, isLast, state, start, end) {
	  var lines = object.value.split(/\r\n|\n|\r/);

	  if (start) {
	    utils.append(start, state);
	  }

	  var lastNonEmptyLine = 0;

	  lines.forEach(function(line, index) {
	    if (line.match(/[^ \t]/)) {
	      lastNonEmptyLine = index;
	    }
	  });

	  lines.forEach(function(line, index) {
	    var isFirstLine = index === 0;
	    var isLastLine = index === lines.length - 1;
	    var isLastNonEmptyLine = index === lastNonEmptyLine;

	    // replace rendered whitespace tabs with spaces
	    var trimmedLine = line.replace(/\t/g, ' ');

	    // trim whitespace touching a newline
	    if (!isFirstLine) {
	      trimmedLine = trimmedLine.replace(/^[ ]+/, '');
	    }
	    if (!isLastLine) {
	      trimmedLine = trimmedLine.replace(/[ ]+$/, '');
	    }

	    if (!isFirstLine) {
	      utils.append(line.match(/^[ \t]*/)[0], state);
	    }

	    if (trimmedLine || isLastNonEmptyLine) {
	      utils.append(
	        JSON.stringify(trimmedLine) +
	        (!isLastNonEmptyLine ? ' + \' \' +' : ''),
	        state);

	      if (isLastNonEmptyLine) {
	        if (end) {
	          utils.append(end, state);
	        }
	        if (!isLast) {
	          utils.append(', ', state);
	        }
	      }

	      // only restore tail whitespace if line had literals
	      if (trimmedLine && !isLastLine) {
	        utils.append(line.match(/[ \t]*$/)[0], state);
	      }
	    }

	    if (!isLastLine) {
	      utils.append('\n', state);
	    }
	  });

	  utils.move(object.range[1], state);
	}

	function renderJSXExpressionContainer(traverse, object, isLast, path, state) {
	  // Plus 1 to skip `{`.
	  utils.move(object.range[0] + 1, state);
	  utils.catchup(object.expression.range[0], state);
	  traverse(object.expression, path, state);

	  if (!isLast && object.expression.type !== Syntax.JSXEmptyExpression) {
	    // If we need to append a comma, make sure to do so after the expression.
	    utils.catchup(object.expression.range[1], state, trimLeft);
	    utils.append(', ', state);
	  }

	  // Minus 1 to skip `}`.
	  utils.catchup(object.range[1] - 1, state, trimLeft);
	  utils.move(object.range[1], state);
	  return false;
	}

	function quoteAttrName(attr) {
	  // Quote invalid JS identifiers.
	  if (!/^[a-z_$][a-z\d_$]*$/i.test(attr)) {
	    return '"' + attr + '"';
	  }
	  return attr;
	}

	function trimLeft(value) {
	  return value.replace(/^[ ]+/, '');
	}

	exports.renderJSXExpressionContainer = renderJSXExpressionContainer;
	exports.renderJSXLiteral = renderJSXLiteral;
	exports.quoteAttrName = quoteAttrName;
	exports.trimLeft = trimLeft;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = +value;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	module.exports = isIndex;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(13),
	    isIndex = __webpack_require__(20),
	    isObject = __webpack_require__(10);

	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	      ? (isArrayLike(object) && isIndex(index, object.length))
	      : (type == 'string' && index in object)) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}

	module.exports = isIterateeCall;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// Parse link label
	//
	// this function assumes that first character ("[") already matches;
	// returns the end of the label
	//
	'use strict';

	module.exports = function parseLinkLabel(state, start, disableNested) {
	  var level, found, marker, prevPos,
	      labelEnd = -1,
	      max = state.posMax,
	      oldPos = state.pos;

	  state.pos = start + 1;
	  level = 1;

	  while (state.pos < max) {
	    marker = state.src.charCodeAt(state.pos);
	    if (marker === 0x5D /* ] */) {
	      level--;
	      if (level === 0) {
	        found = true;
	        break;
	      }
	    }

	    prevPos = state.pos;
	    state.md.inline.skipToken(state);
	    if (marker === 0x5B /* [ */) {
	      if (prevPos === state.pos - 1) {
	        // increase level if we find text `[`, which is not a part of any token
	        level++;
	      } else if (disableNested) {
	        state.pos = oldPos;
	        return -1;
	      }
	    }
	  }

	  if (found) {
	    labelEnd = state.pos;
	  }

	  // restore old state
	  state.pos = oldPos;

	  return labelEnd;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * class Ruler
	 *
	 * Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
	 * [[MarkdownIt#inline]] to manage sequences of functions (rules):
	 *
	 * - keep rules in defined order
	 * - assign the name to each rule
	 * - enable/disable rules
	 * - add/replace rules
	 * - allow assign rules to additional named chains (in the same)
	 * - cacheing lists of active rules
	 *
	 * You will not need use this class directly until write plugins. For simple
	 * rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
	 * [[MarkdownIt.use]].
	 **/
	'use strict';


	/**
	 * new Ruler()
	 **/
	function Ruler() {
	  // List of added rules. Each element is:
	  //
	  // {
	  //   name: XXX,
	  //   enabled: Boolean,
	  //   fn: Function(),
	  //   alt: [ name2, name3 ]
	  // }
	  //
	  this.__rules__ = [];

	  // Cached rule chains.
	  //
	  // First level - chain name, '' for default.
	  // Second level - diginal anchor for fast filtering by charcodes.
	  //
	  this.__cache__ = null;
	}

	////////////////////////////////////////////////////////////////////////////////
	// Helper methods, should not be used directly


	// Find rule index by name
	//
	Ruler.prototype.__find__ = function (name) {
	  for (var i = 0; i < this.__rules__.length; i++) {
	    if (this.__rules__[i].name === name) {
	      return i;
	    }
	  }
	  return -1;
	};


	// Build rules lookup cache
	//
	Ruler.prototype.__compile__ = function () {
	  var self = this;
	  var chains = [ '' ];

	  // collect unique names
	  self.__rules__.forEach(function (rule) {
	    if (!rule.enabled) { return; }

	    rule.alt.forEach(function (altName) {
	      if (chains.indexOf(altName) < 0) {
	        chains.push(altName);
	      }
	    });
	  });

	  self.__cache__ = {};

	  chains.forEach(function (chain) {
	    self.__cache__[chain] = [];
	    self.__rules__.forEach(function (rule) {
	      if (!rule.enabled) { return; }

	      if (chain && rule.alt.indexOf(chain) < 0) { return; }

	      self.__cache__[chain].push(rule.fn);
	    });
	  });
	};


	/**
	 * Ruler.at(name, fn [, options])
	 * - name (String): rule name to replace.
	 * - fn (Function): new rule function.
	 * - options (Object): new rule options (not mandatory).
	 *
	 * Replace rule by name with new function & options. Throws error if name not
	 * found.
	 *
	 * ##### Options:
	 *
	 * - __alt__ - array with names of "alternate" chains.
	 *
	 * ##### Example
	 *
	 * Replace existing typorgapher replacement rule with new one:
	 *
	 * ```javascript
	 * var md = require('markdown-it')();
	 *
	 * md.core.ruler.at('replacements', function replace(state) {
	 *   //...
	 * });
	 * ```
	 **/
	Ruler.prototype.at = function (name, fn, options) {
	  var index = this.__find__(name);
	  var opt = options || {};

	  if (index === -1) { throw new Error('Parser rule not found: ' + name); }

	  this.__rules__[index].fn = fn;
	  this.__rules__[index].alt = opt.alt || [];
	  this.__cache__ = null;
	};


	/**
	 * Ruler.before(beforeName, ruleName, fn [, options])
	 * - beforeName (String): new rule will be added before this one.
	 * - ruleName (String): name of added rule.
	 * - fn (Function): rule function.
	 * - options (Object): rule options (not mandatory).
	 *
	 * Add new rule to chain before one with given name. See also
	 * [[Ruler.after]], [[Ruler.push]].
	 *
	 * ##### Options:
	 *
	 * - __alt__ - array with names of "alternate" chains.
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * var md = require('markdown-it')();
	 *
	 * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
	 *   //...
	 * });
	 * ```
	 **/
	Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
	  var index = this.__find__(beforeName);
	  var opt = options || {};

	  if (index === -1) { throw new Error('Parser rule not found: ' + beforeName); }

	  this.__rules__.splice(index, 0, {
	    name: ruleName,
	    enabled: true,
	    fn: fn,
	    alt: opt.alt || []
	  });

	  this.__cache__ = null;
	};


	/**
	 * Ruler.after(afterName, ruleName, fn [, options])
	 * - afterName (String): new rule will be added after this one.
	 * - ruleName (String): name of added rule.
	 * - fn (Function): rule function.
	 * - options (Object): rule options (not mandatory).
	 *
	 * Add new rule to chain after one with given name. See also
	 * [[Ruler.before]], [[Ruler.push]].
	 *
	 * ##### Options:
	 *
	 * - __alt__ - array with names of "alternate" chains.
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * var md = require('markdown-it')();
	 *
	 * md.inline.ruler.after('text', 'my_rule', function replace(state) {
	 *   //...
	 * });
	 * ```
	 **/
	Ruler.prototype.after = function (afterName, ruleName, fn, options) {
	  var index = this.__find__(afterName);
	  var opt = options || {};

	  if (index === -1) { throw new Error('Parser rule not found: ' + afterName); }

	  this.__rules__.splice(index + 1, 0, {
	    name: ruleName,
	    enabled: true,
	    fn: fn,
	    alt: opt.alt || []
	  });

	  this.__cache__ = null;
	};

	/**
	 * Ruler.push(ruleName, fn [, options])
	 * - ruleName (String): name of added rule.
	 * - fn (Function): rule function.
	 * - options (Object): rule options (not mandatory).
	 *
	 * Push new rule to the end of chain. See also
	 * [[Ruler.before]], [[Ruler.after]].
	 *
	 * ##### Options:
	 *
	 * - __alt__ - array with names of "alternate" chains.
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * var md = require('markdown-it')();
	 *
	 * md.core.ruler.push('my_rule', function replace(state) {
	 *   //...
	 * });
	 * ```
	 **/
	Ruler.prototype.push = function (ruleName, fn, options) {
	  var opt = options || {};

	  this.__rules__.push({
	    name: ruleName,
	    enabled: true,
	    fn: fn,
	    alt: opt.alt || []
	  });

	  this.__cache__ = null;
	};


	/**
	 * Ruler.enable(list [, ignoreInvalid]) -> Array
	 * - list (String|Array): list of rule names to enable.
	 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
	 *
	 * Enable rules with given names. If any rule name not found - throw Error.
	 * Errors can be disabled by second param.
	 *
	 * Returns list of found rule names (if no exception happened).
	 *
	 * See also [[Ruler.disable]], [[Ruler.enableOnly]].
	 **/
	Ruler.prototype.enable = function (list, ignoreInvalid) {
	  if (!Array.isArray(list)) { list = [ list ]; }

	  var result = [];

	  // Search by name and enable
	  list.forEach(function (name) {
	    var idx = this.__find__(name);

	    if (idx < 0) {
	      if (ignoreInvalid) { return; }
	      throw new Error('Rules manager: invalid rule name ' + name);
	    }
	    this.__rules__[idx].enabled = true;
	    result.push(name);
	  }, this);

	  this.__cache__ = null;
	  return result;
	};


	/**
	 * Ruler.enableOnly(list [, ignoreInvalid])
	 * - list (String|Array): list of rule names to enable (whitelist).
	 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
	 *
	 * Enable rules with given names, and disable everything else. If any rule name
	 * not found - throw Error. Errors can be disabled by second param.
	 *
	 * See also [[Ruler.disable]], [[Ruler.enable]].
	 **/
	Ruler.prototype.enableOnly = function (list, ignoreInvalid) {
	  if (!Array.isArray(list)) { list = [ list ]; }

	  this.__rules__.forEach(function (rule) { rule.enabled = false; });

	  this.enable(list, ignoreInvalid);
	};


	/**
	 * Ruler.disable(list [, ignoreInvalid]) -> Array
	 * - list (String|Array): list of rule names to disable.
	 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
	 *
	 * Disable rules with given names. If any rule name not found - throw Error.
	 * Errors can be disabled by second param.
	 *
	 * Returns list of found rule names (if no exception happened).
	 *
	 * See also [[Ruler.enable]], [[Ruler.enableOnly]].
	 **/
	Ruler.prototype.disable = function (list, ignoreInvalid) {
	  if (!Array.isArray(list)) { list = [ list ]; }

	  var result = [];

	  // Search by name and disable
	  list.forEach(function (name) {
	    var idx = this.__find__(name);

	    if (idx < 0) {
	      if (ignoreInvalid) { return; }
	      throw new Error('Rules manager: invalid rule name ' + name);
	    }
	    this.__rules__[idx].enabled = false;
	    result.push(name);
	  }, this);

	  this.__cache__ = null;
	  return result;
	};


	/**
	 * Ruler.getRules(chainName) -> Array
	 *
	 * Return array of active functions (rules) for given chain name. It analyzes
	 * rules configuration, compiles caches if not exists and returns result.
	 *
	 * Default chain name is `''` (empty string). It can't be skipped. That's
	 * done intentionally, to keep signature monomorphic for high speed.
	 **/
	Ruler.prototype.getRules = function (chainName) {
	  if (this.__cache__ === null) {
	    this.__compile__();
	  }

	  // Chain can be empty, if rules disabled. But we still have to return Array.
	  return this.__cache__[chainName] || [];
	};

	module.exports = Ruler;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// Token class

	'use strict';


	/**
	 * class Token
	 **/

	/**
	 * new Token(type, tag, nesting)
	 *
	 * Create new token and fill passed properties.
	 **/
	function Token(type, tag, nesting) {
	  /**
	   * Token#type -> String
	   *
	   * Type of the token (string, e.g. "paragraph_open")
	   **/
	  this.type     = type;

	  /**
	   * Token#tag -> String
	   *
	   * html tag name, e.g. "p"
	   **/
	  this.tag      = tag;

	  /**
	   * Token#attrs -> Array
	   *
	   * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
	   **/
	  this.attrs    = null;

	  /**
	   * Token#map -> Array
	   *
	   * Source map info. Format: `[ line_begin, line_end ]`
	   **/
	  this.map      = null;

	  /**
	   * Token#nesting -> Number
	   *
	   * Level change (number in {-1, 0, 1} set), where:
	   *
	   * -  `1` means the tag is opening
	   * -  `0` means the tag is self-closing
	   * - `-1` means the tag is closing
	   **/
	  this.nesting  = nesting;

	  /**
	   * Token#level -> Number
	   *
	   * nesting level, the same as `state.level`
	   **/
	  this.level    = 0;

	  /**
	   * Token#children -> Array
	   *
	   * An array of child nodes (inline and img tokens)
	   **/
	  this.children = null;

	  /**
	   * Token#content -> String
	   *
	   * In a case of self-closing tag (code, html, fence, etc.),
	   * it has contents of this tag.
	   **/
	  this.content  = '';

	  /**
	   * Token#markup -> String
	   *
	   * '*' or '_' for emphasis, fence string for fence, etc.
	   **/
	  this.markup   = '';

	  /**
	   * Token#info -> String
	   *
	   * fence infostring
	   **/
	  this.info     = '';

	  /**
	   * Token#meta -> Object
	   *
	   * A place for plugins to store an arbitrary data
	   **/
	  this.meta     = null;

	  /**
	   * Token#block -> Boolean
	   *
	   * True for block-level tokens, false for inline tokens.
	   * Used in renderer to calculate line breaks
	   **/
	  this.block    = false;

	  /**
	   * Token#hidden -> Boolean
	   *
	   * If it's true, ignore this element when rendering. Used for tight lists
	   * to hide paragraphs.
	   **/
	  this.hidden   = false;
	}


	/**
	 * Token.attrIndex(name) -> Number
	 *
	 * Search attribute index by name.
	 **/
	Token.prototype.attrIndex = function attrIndex(name) {
	  var attrs, i, len;

	  if (!this.attrs) { return -1; }

	  attrs = this.attrs;

	  for (i = 0, len = attrs.length; i < len; i++) {
	    if (attrs[i][0] === name) { return i; }
	  }
	  return -1;
	};


	/**
	 * Token.attrPush(attrData)
	 *
	 * Add `[ name, value ]` attribute to list. Init attrs if necessary
	 **/
	Token.prototype.attrPush = function attrPush(attrData) {
	  if (this.attrs) {
	    this.attrs.push(attrData);
	  } else {
	    this.attrs = [ attrData ];
	  }
	};


	module.exports = Token;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports=/[!-#%-\*,-/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDE38-\uDE3D]|\uD805[\uDCC6\uDDC1-\uDDC9\uDE41-\uDE43]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F/

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * Desugars ES6 rest parameters into an ES3 arguments array.
	 *
	 * function printf(template, ...args) {
	 *   args.forEach(...);
	 * }
	 *
	 * We could use `Array.prototype.slice.call`, but that usage of arguments causes
	 * functions to be deoptimized in V8, so instead we use a for-loop.
	 *
	 * function printf(template) {
	 *   for (var args = [], $__0 = 1, $__1 = arguments.length; $__0 < $__1; $__0++)
	 *     args.push(arguments[$__0]);
	 *   args.forEach(...);
	 * }
	 *
	 */
	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);



	function _nodeIsFunctionWithRestParam(node) {
	  return (node.type === Syntax.FunctionDeclaration
	          || node.type === Syntax.FunctionExpression
	          || node.type === Syntax.ArrowFunctionExpression)
	         && node.rest;
	}

	function visitFunctionParamsWithRestParam(traverse, node, path, state) {
	  if (node.parametricType) {
	    utils.catchup(node.parametricType.range[0], state);
	    path.unshift(node);
	    traverse(node.parametricType, path, state);
	    path.shift();
	  }

	  // Render params.
	  if (node.params.length) {
	    path.unshift(node);
	    traverse(node.params, path, state);
	    path.shift();
	  } else {
	    // -3 is for ... of the rest.
	    utils.catchup(node.rest.range[0] - 3, state);
	  }
	  utils.catchupWhiteSpace(node.rest.range[1], state);

	  path.unshift(node);
	  traverse(node.body, path, state);
	  path.shift();

	  return false;
	}

	visitFunctionParamsWithRestParam.test = function(node, path, state) {
	  return _nodeIsFunctionWithRestParam(node);
	};

	function renderRestParamSetup(functionNode, state) {
	  var idx = state.localScope.tempVarIndex++;
	  var len = state.localScope.tempVarIndex++;

	  return 'for (var ' + functionNode.rest.name + '=[],' +
	    utils.getTempVar(idx) + '=' + functionNode.params.length + ',' +
	    utils.getTempVar(len) + '=arguments.length;' +
	    utils.getTempVar(idx) + '<' +  utils.getTempVar(len) + ';' +
	    utils.getTempVar(idx) + '++) ' +
	    functionNode.rest.name + '.push(arguments[' + utils.getTempVar(idx) + ']);';
	}

	function visitFunctionBodyWithRestParam(traverse, node, path, state) {
	  utils.catchup(node.range[0] + 1, state);
	  var parentNode = path[0];
	  utils.append(renderRestParamSetup(parentNode, state), state);
	  return true;
	}

	visitFunctionBodyWithRestParam.test = function(node, path, state) {
	  return node.type === Syntax.BlockStatement
	         && _nodeIsFunctionWithRestParam(path[0]);
	};

	exports.renderRestParamSetup = renderRestParamSetup;
	exports.visitorList = [
	  visitFunctionParamsWithRestParam,
	  visitFunctionBodyWithRestParam
	];


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(77),
	    baseMatchesProperty = __webpack_require__(78),
	    bindCallback = __webpack_require__(33),
	    identity = __webpack_require__(43),
	    property = __webpack_require__(103);

	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}

	module.exports = baseCallback;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(73),
	    createBaseEach = __webpack_require__(85);

	/**
	 * The base implementation of `_.forEach` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object|string} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	module.exports = baseEach;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(86);

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(5);

	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = -1,
	      length = path.length;

	  while (object != null && ++index < length) {
	    object = object[path[index]];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(74);

	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  // Exit early for identical values.
	  if (value === other) {
	    return true;
	  }
	  var valType = typeof value,
	      othType = typeof other;

	  // Exit early for unlike primitive values.
	  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
	      value == null || other == null) {
	    // Return `false` unless both values are `NaN`.
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}

	module.exports = baseIsEqual;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(43);

	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}

	module.exports = bindCallback;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(32);

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	module.exports = getLength;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var constant = __webpack_require__(42),
	    isNative = __webpack_require__(9),
	    toObject = __webpack_require__(5);

	/** Native method references. */
	var getOwnPropertySymbols = isNative(getOwnPropertySymbols = Object.getOwnPropertySymbols) && getOwnPropertySymbols;

	/**
	 * Creates an array of the own symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !getOwnPropertySymbols ? constant([]) : function(object) {
	  return getOwnPropertySymbols(toObject(object));
	};

	module.exports = getSymbols;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(4),
	    toObject = __webpack_require__(5);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}

	module.exports = isKey;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(10);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	module.exports = isStrictComparable;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(12),
	    isArray = __webpack_require__(4);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `value` to property path array if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}

	module.exports = toPath;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(13),
	    isObjectLike = __webpack_require__(7);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
	}

	module.exports = isArguments;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(39),
	    isArray = __webpack_require__(4),
	    isIndex = __webpack_require__(20),
	    isLength = __webpack_require__(6),
	    isObject = __webpack_require__(10),
	    support = __webpack_require__(41);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keysIn;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to detect DOM support. */
	var document = (document = global.window) && document.document;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * An object environment feature flags.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};

	(function(x) {
	  var Ctor = function() { this.x = x; },
	      args = arguments,
	      object = { '0': x, 'length': x },
	      props = [];

	  Ctor.prototype = { 'valueOf': x, 'y': x };
	  for (var key in new Ctor) { props.push(key); }

	  /**
	   * Detect if functions can be decompiled by `Function#toString`
	   * (all but Firefox OS certified apps, older Opera mobile browsers, and
	   * the PlayStation 3; forced `false` for Windows 8 apps).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcDecomp = /\bthis\b/.test(function() { return this; });

	  /**
	   * Detect if `Function#name` is supported (all but IE).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcNames = typeof Function.name == 'string';

	  /**
	   * Detect if the DOM is supported.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.dom = document.createDocumentFragment().nodeType === 11;
	  } catch(e) {
	    support.dom = false;
	  }

	  /**
	   * Detect if `arguments` object indexes are non-enumerable.
	   *
	   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	   * checks for indexes that exceed the number of function parameters and
	   * whose associated argument values are `0`.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.nonEnumArgs = !propertyIsEnumerable.call(args, 1);
	  } catch(e) {
	    support.nonEnumArgs = true;
	  }
	}(1, 0));

	module.exports = support;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var getter = _.constant(object);
	 *
	 * getter() === object;
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	module.exports = constant;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// HTML5 entities map: { name -> utf16string }
	//
	'use strict';

	/*eslint quotes:0*/
	module.exports = __webpack_require__(60);


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	module.exports.encode = __webpack_require__(164);
	module.exports.decode = __webpack_require__(163);
	module.exports.format = __webpack_require__(165);
	module.exports.parse  = __webpack_require__(166);


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports=/[\0-\x1F\x7F-\x9F]/

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports=/[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports=/[\0-\uD7FF\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF]/

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	var base64 = __webpack_require__(170)
	var ieee754 = __webpack_require__(171)
	var isArray = __webpack_require__(172)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var kMaxLength = 0x3fffffff
	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Note:
	 *
	 * - Implementation must support adding new properties to `Uint8Array` instances.
	 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
	 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *    incorrect length in some situations.
	 *
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
	 * get the Object implementation, which is slower but will work correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  try {
	    var buf = new ArrayBuffer(0)
	    var arr = new Uint8Array(buf)
	    arr.foo = function () { return 42 }
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  this.length = 0
	  this.parent = undefined

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && object.buffer instanceof ArrayBuffer) {
	    return fromTypedArray(that, object)
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength.toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  } else if (list.length === 1) {
	    return list[0]
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = String(string)

	  if (string.length === 0) return 0

	  switch (encoding || 'utf8') {
	    case 'ascii':
	    case 'binary':
	    case 'raw':
	      return string.length
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return string.length * 2
	    case 'hex':
	      return string.length >>> 1
	    case 'utf8':
	    case 'utf-8':
	      return utf8ToBytes(string).length
	    case 'base64':
	      return base64ToBytes(string).length
	    default:
	      return string.length
	  }
	}
	Buffer.byteLength = byteLength

	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined

	// toString(encoding, start=0, end=buffer.length)
	Buffer.prototype.toString = function toString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` will be removed in Node 0.13+
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` will be removed in Node 0.13+
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  var res = ''
	  var tmp = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    if (buf[i] <= 0x7F) {
	      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
	      tmp = ''
	    } else {
	      tmp += '%' + buf[i].toString(16)
	    }
	  }

	  return res + decodeUtf8Char(tmp)
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start

	  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated, will be removed in node 0.13+
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	  var i = 0

	  for (; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (leadSurrogate) {
	        // 2 leads in a row
	        if (codePoint < 0xDC00) {
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          leadSurrogate = codePoint
	          continue
	        } else {
	          // valid surrogate pair
	          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
	          leadSurrogate = null
	        }
	      } else {
	        // no lead yet

	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else {
	          // valid lead
	          leadSurrogate = codePoint
	          continue
	        }
	      }
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	      leadSurrogate = null
	    }

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x200000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function decodeUtf8Char (str) {
	  try {
	    return decodeURIComponent(str)
	  } catch (err) {
	    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49).Buffer))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(16);

	  /**
	   * A data structure which is a combination of an array and a set. Adding a new
	   * member is O(1), testing for membership is O(1), and finding the index of an
	   * element is O(1). Removing elements from the set is not supported. Only
	   * strings are supported for membership.
	   */
	  function ArraySet() {
	    this._array = [];
	    this._set = {};
	  }

	  /**
	   * Static method for creating ArraySet instances from an existing array.
	   */
	  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	    var set = new ArraySet();
	    for (var i = 0, len = aArray.length; i < len; i++) {
	      set.add(aArray[i], aAllowDuplicates);
	    }
	    return set;
	  };

	  /**
	   * Add the given string to this set.
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	    var isDuplicate = this.has(aStr);
	    var idx = this._array.length;
	    if (!isDuplicate || aAllowDuplicates) {
	      this._array.push(aStr);
	    }
	    if (!isDuplicate) {
	      this._set[util.toSetString(aStr)] = idx;
	    }
	  };

	  /**
	   * Is the given string a member of this set?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.has = function ArraySet_has(aStr) {
	    return Object.prototype.hasOwnProperty.call(this._set,
	                                                util.toSetString(aStr));
	  };

	  /**
	   * What is the index of the given string in the array?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	    if (this.has(aStr)) {
	      return this._set[util.toSetString(aStr)];
	    }
	    throw new Error('"' + aStr + '" is not in the set.');
	  };

	  /**
	   * What is the element at the given index?
	   *
	   * @param Number aIdx
	   */
	  ArraySet.prototype.at = function ArraySet_at(aIdx) {
	    if (aIdx >= 0 && aIdx < this._array.length) {
	      return this._array[aIdx];
	    }
	    throw new Error('No element indexed by ' + aIdx);
	  };

	  /**
	   * Returns the array representation of this set (which has the proper indices
	   * indicated by indexOf). Note that this is a copy of the internal array used
	   * for storing the members so that no one can mess with internal state.
	   */
	  ArraySet.prototype.toArray = function ArraySet_toArray() {
	    return this._array.slice();
	  };

	  exports.ArraySet = ArraySet;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64 = __webpack_require__(179);

	  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
	  // length quantities we use in the source map spec, the first bit is the sign,
	  // the next four bits are the actual value, and the 6th bit is the
	  // continuation bit. The continuation bit tells us whether there are more
	  // digits in this value following this digit.
	  //
	  //   Continuation
	  //   |    Sign
	  //   |    |
	  //   V    V
	  //   101011

	  var VLQ_BASE_SHIFT = 5;

	  // binary: 100000
	  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	  // binary: 011111
	  var VLQ_BASE_MASK = VLQ_BASE - 1;

	  // binary: 100000
	  var VLQ_CONTINUATION_BIT = VLQ_BASE;

	  /**
	   * Converts from a two-complement value to a value where the sign bit is
	   * is placed in the least significant bit.  For example, as decimals:
	   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	   */
	  function toVLQSigned(aValue) {
	    return aValue < 0
	      ? ((-aValue) << 1) + 1
	      : (aValue << 1) + 0;
	  }

	  /**
	   * Converts to a two-complement value from a value where the sign bit is
	   * is placed in the least significant bit.  For example, as decimals:
	   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	   */
	  function fromVLQSigned(aValue) {
	    var isNegative = (aValue & 1) === 1;
	    var shifted = aValue >> 1;
	    return isNegative
	      ? -shifted
	      : shifted;
	  }

	  /**
	   * Returns the base 64 VLQ encoded value.
	   */
	  exports.encode = function base64VLQ_encode(aValue) {
	    var encoded = "";
	    var digit;

	    var vlq = toVLQSigned(aValue);

	    do {
	      digit = vlq & VLQ_BASE_MASK;
	      vlq >>>= VLQ_BASE_SHIFT;
	      if (vlq > 0) {
	        // There are still more digits in this value, so we must make sure the
	        // continuation bit is marked.
	        digit |= VLQ_CONTINUATION_BIT;
	      }
	      encoded += base64.encode(digit);
	    } while (vlq > 0);

	    return encoded;
	  };

	  /**
	   * Decodes the next base 64 VLQ value from the given string and returns the
	   * value and the rest of the string.
	   */
	  exports.decode = function base64VLQ_decode(aStr) {
	    var i = 0;
	    var strLen = aStr.length;
	    var result = 0;
	    var shift = 0;
	    var continuation, digit;

	    do {
	      if (i >= strLen) {
	        throw new Error("Expected more digits in base 64 VLQ value.");
	      }
	      digit = base64.decode(aStr.charAt(i++));
	      continuation = !!(digit & VLQ_CONTINUATION_BIT);
	      digit &= VLQ_BASE_MASK;
	      result = result + (digit << shift);
	      shift += VLQ_BASE_SHIFT;
	    } while (continuation);

	    return {
	      value: fromVLQSigned(result),
	      rest: aStr.slice(i)
	    };
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64VLQ = __webpack_require__(51);
	  var util = __webpack_require__(16);
	  var ArraySet = __webpack_require__(50).ArraySet;

	  /**
	   * An instance of the SourceMapGenerator represents a source map which is
	   * being built incrementally. To create a new one, you must pass an object
	   * with the following properties:
	   *
	   *   - file: The filename of the generated source.
	   *   - sourceRoot: An optional root for all URLs in this source map.
	   */
	  function SourceMapGenerator(aArgs) {
	    this._file = util.getArg(aArgs, 'file');
	    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	    this._sources = new ArraySet();
	    this._names = new ArraySet();
	    this._mappings = [];
	    this._sourcesContents = null;
	  }

	  SourceMapGenerator.prototype._version = 3;

	  /**
	   * Creates a new SourceMapGenerator based on a SourceMapConsumer
	   *
	   * @param aSourceMapConsumer The SourceMap.
	   */
	  SourceMapGenerator.fromSourceMap =
	    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	      var sourceRoot = aSourceMapConsumer.sourceRoot;
	      var generator = new SourceMapGenerator({
	        file: aSourceMapConsumer.file,
	        sourceRoot: sourceRoot
	      });
	      aSourceMapConsumer.eachMapping(function (mapping) {
	        var newMapping = {
	          generated: {
	            line: mapping.generatedLine,
	            column: mapping.generatedColumn
	          }
	        };

	        if (mapping.source) {
	          newMapping.source = mapping.source;
	          if (sourceRoot) {
	            newMapping.source = util.relative(sourceRoot, newMapping.source);
	          }

	          newMapping.original = {
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          };

	          if (mapping.name) {
	            newMapping.name = mapping.name;
	          }
	        }

	        generator.addMapping(newMapping);
	      });
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          generator.setSourceContent(sourceFile, content);
	        }
	      });
	      return generator;
	    };

	  /**
	   * Add a single mapping from original source line and column to the generated
	   * source's line and column for this source map being created. The mapping
	   * object should have the following properties:
	   *
	   *   - generated: An object with the generated line and column positions.
	   *   - original: An object with the original line and column positions.
	   *   - source: The original source file (relative to the sourceRoot).
	   *   - name: An optional original token name for this mapping.
	   */
	  SourceMapGenerator.prototype.addMapping =
	    function SourceMapGenerator_addMapping(aArgs) {
	      var generated = util.getArg(aArgs, 'generated');
	      var original = util.getArg(aArgs, 'original', null);
	      var source = util.getArg(aArgs, 'source', null);
	      var name = util.getArg(aArgs, 'name', null);

	      this._validateMapping(generated, original, source, name);

	      if (source && !this._sources.has(source)) {
	        this._sources.add(source);
	      }

	      if (name && !this._names.has(name)) {
	        this._names.add(name);
	      }

	      this._mappings.push({
	        generatedLine: generated.line,
	        generatedColumn: generated.column,
	        originalLine: original != null && original.line,
	        originalColumn: original != null && original.column,
	        source: source,
	        name: name
	      });
	    };

	  /**
	   * Set the source content for a source file.
	   */
	  SourceMapGenerator.prototype.setSourceContent =
	    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	      var source = aSourceFile;
	      if (this._sourceRoot) {
	        source = util.relative(this._sourceRoot, source);
	      }

	      if (aSourceContent !== null) {
	        // Add the source content to the _sourcesContents map.
	        // Create a new _sourcesContents map if the property is null.
	        if (!this._sourcesContents) {
	          this._sourcesContents = {};
	        }
	        this._sourcesContents[util.toSetString(source)] = aSourceContent;
	      } else {
	        // Remove the source file from the _sourcesContents map.
	        // If the _sourcesContents map is empty, set the property to null.
	        delete this._sourcesContents[util.toSetString(source)];
	        if (Object.keys(this._sourcesContents).length === 0) {
	          this._sourcesContents = null;
	        }
	      }
	    };

	  /**
	   * Applies the mappings of a sub-source-map for a specific source file to the
	   * source map being generated. Each mapping to the supplied source file is
	   * rewritten using the supplied source map. Note: The resolution for the
	   * resulting mappings is the minimium of this map and the supplied map.
	   *
	   * @param aSourceMapConsumer The source map to be applied.
	   * @param aSourceFile Optional. The filename of the source file.
	   *        If omitted, SourceMapConsumer's file property will be used.
	   */
	  SourceMapGenerator.prototype.applySourceMap =
	    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile) {
	      // If aSourceFile is omitted, we will use the file property of the SourceMap
	      if (!aSourceFile) {
	        aSourceFile = aSourceMapConsumer.file;
	      }
	      var sourceRoot = this._sourceRoot;
	      // Make "aSourceFile" relative if an absolute Url is passed.
	      if (sourceRoot) {
	        aSourceFile = util.relative(sourceRoot, aSourceFile);
	      }
	      // Applying the SourceMap can add and remove items from the sources and
	      // the names array.
	      var newSources = new ArraySet();
	      var newNames = new ArraySet();

	      // Find mappings for the "aSourceFile"
	      this._mappings.forEach(function (mapping) {
	        if (mapping.source === aSourceFile && mapping.originalLine) {
	          // Check if it can be mapped by the source map, then update the mapping.
	          var original = aSourceMapConsumer.originalPositionFor({
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          });
	          if (original.source !== null) {
	            // Copy mapping
	            if (sourceRoot) {
	              mapping.source = util.relative(sourceRoot, original.source);
	            } else {
	              mapping.source = original.source;
	            }
	            mapping.originalLine = original.line;
	            mapping.originalColumn = original.column;
	            if (original.name !== null && mapping.name !== null) {
	              // Only use the identifier name if it's an identifier
	              // in both SourceMaps
	              mapping.name = original.name;
	            }
	          }
	        }

	        var source = mapping.source;
	        if (source && !newSources.has(source)) {
	          newSources.add(source);
	        }

	        var name = mapping.name;
	        if (name && !newNames.has(name)) {
	          newNames.add(name);
	        }

	      }, this);
	      this._sources = newSources;
	      this._names = newNames;

	      // Copy sourcesContents of applied map.
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          if (sourceRoot) {
	            sourceFile = util.relative(sourceRoot, sourceFile);
	          }
	          this.setSourceContent(sourceFile, content);
	        }
	      }, this);
	    };

	  /**
	   * A mapping can have one of the three levels of data:
	   *
	   *   1. Just the generated position.
	   *   2. The Generated position, original position, and original source.
	   *   3. Generated and original position, original source, as well as a name
	   *      token.
	   *
	   * To maintain consistency, we validate that any new mapping being added falls
	   * in to one of these categories.
	   */
	  SourceMapGenerator.prototype._validateMapping =
	    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                                aName) {
	      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	          && aGenerated.line > 0 && aGenerated.column >= 0
	          && !aOriginal && !aSource && !aName) {
	        // Case 1.
	        return;
	      }
	      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	               && aGenerated.line > 0 && aGenerated.column >= 0
	               && aOriginal.line > 0 && aOriginal.column >= 0
	               && aSource) {
	        // Cases 2 and 3.
	        return;
	      }
	      else {
	        throw new Error('Invalid mapping: ' + JSON.stringify({
	          generated: aGenerated,
	          source: aSource,
	          orginal: aOriginal,
	          name: aName
	        }));
	      }
	    };

	  /**
	   * Serialize the accumulated mappings in to the stream of base 64 VLQs
	   * specified by the source map format.
	   */
	  SourceMapGenerator.prototype._serializeMappings =
	    function SourceMapGenerator_serializeMappings() {
	      var previousGeneratedColumn = 0;
	      var previousGeneratedLine = 1;
	      var previousOriginalColumn = 0;
	      var previousOriginalLine = 0;
	      var previousName = 0;
	      var previousSource = 0;
	      var result = '';
	      var mapping;

	      // The mappings must be guaranteed to be in sorted order before we start
	      // serializing them or else the generated line numbers (which are defined
	      // via the ';' separators) will be all messed up. Note: it might be more
	      // performant to maintain the sorting as we insert them, rather than as we
	      // serialize them, but the big O is the same either way.
	      this._mappings.sort(util.compareByGeneratedPositions);

	      for (var i = 0, len = this._mappings.length; i < len; i++) {
	        mapping = this._mappings[i];

	        if (mapping.generatedLine !== previousGeneratedLine) {
	          previousGeneratedColumn = 0;
	          while (mapping.generatedLine !== previousGeneratedLine) {
	            result += ';';
	            previousGeneratedLine++;
	          }
	        }
	        else {
	          if (i > 0) {
	            if (!util.compareByGeneratedPositions(mapping, this._mappings[i - 1])) {
	              continue;
	            }
	            result += ',';
	          }
	        }

	        result += base64VLQ.encode(mapping.generatedColumn
	                                   - previousGeneratedColumn);
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (mapping.source) {
	          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
	                                     - previousSource);
	          previousSource = this._sources.indexOf(mapping.source);

	          // lines are stored 0-based in SourceMap spec version 3
	          result += base64VLQ.encode(mapping.originalLine - 1
	                                     - previousOriginalLine);
	          previousOriginalLine = mapping.originalLine - 1;

	          result += base64VLQ.encode(mapping.originalColumn
	                                     - previousOriginalColumn);
	          previousOriginalColumn = mapping.originalColumn;

	          if (mapping.name) {
	            result += base64VLQ.encode(this._names.indexOf(mapping.name)
	                                       - previousName);
	            previousName = this._names.indexOf(mapping.name);
	          }
	        }
	      }

	      return result;
	    };

	  SourceMapGenerator.prototype._generateSourcesContent =
	    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	      return aSources.map(function (source) {
	        if (!this._sourcesContents) {
	          return null;
	        }
	        if (aSourceRoot) {
	          source = util.relative(aSourceRoot, source);
	        }
	        var key = util.toSetString(source);
	        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
	                                                    key)
	          ? this._sourcesContents[key]
	          : null;
	      }, this);
	    };

	  /**
	   * Externalize the source map.
	   */
	  SourceMapGenerator.prototype.toJSON =
	    function SourceMapGenerator_toJSON() {
	      var map = {
	        version: this._version,
	        file: this._file,
	        sources: this._sources.toArray(),
	        names: this._names.toArray(),
	        mappings: this._serializeMappings()
	      };
	      if (this._sourceRoot) {
	        map.sourceRoot = this._sourceRoot;
	      }
	      if (this._sourcesContents) {
	        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	      }

	      return map;
	    };

	  /**
	   * Render the source map being generated to a string.
	   */
	  SourceMapGenerator.prototype.toString =
	    function SourceMapGenerator_toString() {
	      return JSON.stringify(this);
	    };

	  exports.SourceMapGenerator = SourceMapGenerator;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/*global exports:true*/

	/**
	 * Implements ES6 destructuring assignment and pattern matchng.
	 *
	 * function init({port, ip, coords: [x, y]}) {
	 *   return (x && y) ? {id, port} : {ip};
	 * };
	 *
	 * function init($__0) {
	 *   var
	 *    port = $__0.port,
	 *    ip = $__0.ip,
	 *    $__1 = $__0.coords,
	 *    x = $__1[0],
	 *    y = $__1[1];
	 *   return (x && y) ? {id, port} : {ip};
	 * }
	 *
	 * var x, {ip, port} = init({ip, port});
	 *
	 * var x, $__0 = init({ip, port}), ip = $__0.ip, port = $__0.port;
	 *
	 */
	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);

	var reservedWordsHelper = __webpack_require__(18);
	var restParamVisitors = __webpack_require__(26);
	var restPropertyHelpers = __webpack_require__(190);

	// -------------------------------------------------------
	// 1. Structured variable declarations.
	//
	// var [a, b] = [b, a];
	// var {x, y} = {y, x};
	// -------------------------------------------------------

	function visitStructuredVariable(traverse, node, path, state) {
	  // Allocate new temp for the pattern.
	  utils.append(utils.getTempVar(state.localScope.tempVarIndex) + '=', state);
	  // Skip the pattern and assign the init to the temp.
	  utils.catchupWhiteSpace(node.init.range[0], state);
	  traverse(node.init, path, state);
	  utils.catchup(node.init.range[1], state);
	  // Render the destructured data.
	  utils.append(',' + getDestructuredComponents(node.id, state), state);
	  state.localScope.tempVarIndex++;
	  return false;
	}

	visitStructuredVariable.test = function(node, path, state) {
	  return node.type === Syntax.VariableDeclarator &&
	    isStructuredPattern(node.id);
	};

	function isStructuredPattern(node) {
	  return node.type === Syntax.ObjectPattern ||
	    node.type === Syntax.ArrayPattern;
	}

	// Main function which does actual recursive destructuring
	// of nested complex structures.
	function getDestructuredComponents(node, state) {
	  var tmpIndex = state.localScope.tempVarIndex;
	  var components = [];
	  var patternItems = getPatternItems(node);

	  for (var idx = 0; idx < patternItems.length; idx++) {
	    var item = patternItems[idx];
	    if (!item) {
	      continue;
	    }

	    if (item.type === Syntax.SpreadElement) {
	      // Spread/rest of an array.
	      // TODO(dmitrys): support spread in the middle of a pattern
	      // and also for function param patterns: [x, ...xs, y]
	      components.push(item.argument.name +
	        '=Array.prototype.slice.call(' +
	        utils.getTempVar(tmpIndex) + ',' + idx + ')'
	      );
	      continue;
	    }

	    if (item.type === Syntax.SpreadProperty) {
	      var restExpression = restPropertyHelpers.renderRestExpression(
	        utils.getTempVar(tmpIndex),
	        patternItems
	      );
	      components.push(item.argument.name + '=' + restExpression);
	      continue;
	    }

	    // Depending on pattern type (Array or Object), we get
	    // corresponding pattern item parts.
	    var accessor = getPatternItemAccessor(node, item, tmpIndex, idx);
	    var value = getPatternItemValue(node, item);

	    // TODO(dmitrys): implement default values: {x, y=5}
	    if (value.type === Syntax.Identifier) {
	      // Simple pattern item.
	      components.push(value.name + '=' + accessor);
	    } else {
	      // Complex sub-structure.
	      components.push(
	        utils.getTempVar(++state.localScope.tempVarIndex) + '=' + accessor +
	        ',' + getDestructuredComponents(value, state)
	      );
	    }
	  }

	  return components.join(',');
	}

	function getPatternItems(node) {
	  return node.properties || node.elements;
	}

	function getPatternItemAccessor(node, patternItem, tmpIndex, idx) {
	  var tmpName = utils.getTempVar(tmpIndex);
	  if (node.type === Syntax.ObjectPattern) {
	    if (reservedWordsHelper.isReservedWord(patternItem.key.name)) {
	      return tmpName + '["' + patternItem.key.name + '"]';
	    } else if (patternItem.key.type === Syntax.Literal) {
	      return tmpName + '[' + JSON.stringify(patternItem.key.value) + ']';
	    } else if (patternItem.key.type === Syntax.Identifier) {
	      return tmpName + '.' + patternItem.key.name;
	    }
	  } else if (node.type === Syntax.ArrayPattern) {
	    return tmpName + '[' + idx + ']';
	  }
	}

	function getPatternItemValue(node, patternItem) {
	  return node.type === Syntax.ObjectPattern
	    ? patternItem.value
	    : patternItem;
	}

	// -------------------------------------------------------
	// 2. Assignment expression.
	//
	// [a, b] = [b, a];
	// ({x, y} = {y, x});
	// -------------------------------------------------------

	function visitStructuredAssignment(traverse, node, path, state) {
	  var exprNode = node.expression;
	  utils.append('var ' + utils.getTempVar(state.localScope.tempVarIndex) + '=', state);

	  utils.catchupWhiteSpace(exprNode.right.range[0], state);
	  traverse(exprNode.right, path, state);
	  utils.catchup(exprNode.right.range[1], state);

	  utils.append(
	    ';' + getDestructuredComponents(exprNode.left, state) + ';',
	    state
	  );

	  utils.catchupWhiteSpace(node.range[1], state);
	  state.localScope.tempVarIndex++;
	  return false;
	}

	visitStructuredAssignment.test = function(node, path, state) {
	  // We consider the expression statement rather than just assignment
	  // expression to cover case with object patters which should be
	  // wrapped in grouping operator: ({x, y} = {y, x});
	  return node.type === Syntax.ExpressionStatement &&
	    node.expression.type === Syntax.AssignmentExpression &&
	    isStructuredPattern(node.expression.left);
	};

	// -------------------------------------------------------
	// 3. Structured parameter.
	//
	// function foo({x, y}) { ... }
	// -------------------------------------------------------

	function visitStructuredParameter(traverse, node, path, state) {
	  utils.append(utils.getTempVar(getParamIndex(node, path)), state);
	  utils.catchupWhiteSpace(node.range[1], state);
	  return true;
	}

	function getParamIndex(paramNode, path) {
	  var funcNode = path[0];
	  var tmpIndex = 0;
	  for (var k = 0; k < funcNode.params.length; k++) {
	    var param = funcNode.params[k];
	    if (param === paramNode) {
	      break;
	    }
	    if (isStructuredPattern(param)) {
	      tmpIndex++;
	    }
	  }
	  return tmpIndex;
	}

	visitStructuredParameter.test = function(node, path, state) {
	  return isStructuredPattern(node) && isFunctionNode(path[0]);
	};

	function isFunctionNode(node) {
	  return (node.type == Syntax.FunctionDeclaration ||
	    node.type == Syntax.FunctionExpression ||
	    node.type == Syntax.MethodDefinition ||
	    node.type == Syntax.ArrowFunctionExpression);
	}

	// -------------------------------------------------------
	// 4. Function body for structured parameters.
	//
	// function foo({x, y}) { x; y; }
	// -------------------------------------------------------

	function visitFunctionBodyForStructuredParameter(traverse, node, path, state) {
	  var funcNode = path[0];

	  utils.catchup(funcNode.body.range[0] + 1, state);
	  renderDestructuredComponents(funcNode, state);

	  if (funcNode.rest) {
	    utils.append(
	      restParamVisitors.renderRestParamSetup(funcNode, state),
	      state
	    );
	  }

	  return true;
	}

	function renderDestructuredComponents(funcNode, state) {
	  var destructuredComponents = [];

	  for (var k = 0; k < funcNode.params.length; k++) {
	    var param = funcNode.params[k];
	    if (isStructuredPattern(param)) {
	      destructuredComponents.push(
	        getDestructuredComponents(param, state)
	      );
	      state.localScope.tempVarIndex++;
	    }
	  }

	  if (destructuredComponents.length) {
	    utils.append('var ' + destructuredComponents.join(',') + ';', state);
	  }
	}

	visitFunctionBodyForStructuredParameter.test = function(node, path, state) {
	  return node.type === Syntax.BlockStatement && isFunctionNode(path[0]);
	};

	exports.visitorList = [
	  visitStructuredVariable,
	  visitStructuredAssignment,
	  visitStructuredParameter,
	  visitFunctionBodyForStructuredParameter
	];

	exports.renderDestructuredComponents = renderDestructuredComponents;



/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var Playground = __webpack_require__(57);

	module.exports = Playground;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _React = __webpack_require__(8);

	var _React2 = _interopRequireDefault(_React);

	var propTypesArray = [{
	  key: 'array',
	  test: _React2['default'].PropTypes.array,
	  isRequired: _React2['default'].PropTypes.array.isRequired
	}, {
	  key: 'boolean',
	  test: _React2['default'].PropTypes.bool,
	  isRequired: _React2['default'].PropTypes.bool.isRequired
	}, {
	  key: 'function',
	  test: _React2['default'].PropTypes.func,
	  isRequired: _React2['default'].PropTypes.func.isRequired
	}, {
	  key: 'number',
	  test: _React2['default'].PropTypes.number,
	  isRequired: _React2['default'].PropTypes.number.isRequired
	}, {
	  key: 'object',
	  test: _React2['default'].PropTypes.object,
	  isRequired: _React2['default'].PropTypes.array.isRequired
	}, {
	  key: 'string',
	  test: _React2['default'].PropTypes.string,
	  isRequired: _React2['default'].PropTypes.string.isRequired
	}, {
	  key: 'node',
	  test: _React2['default'].PropTypes.node,
	  isRequired: _React2['default'].PropTypes.node.isRequired
	}, {
	  key: 'element',
	  test: _React2['default'].PropTypes.element,
	  isRequired: _React2['default'].PropTypes.element.isRequired
	}];

	var getReactPropType = function getReactPropType(propTypeFunc) {
	  var propType = {
	    name: 'custom',
	    isRequire: false
	  };

	  for (var i = 0; i < propTypesArray.length; i++) {
	    if (propTypeFunc === propTypesArray[i].test) {
	      propType.name = propTypesArray[i].key;

	      break;
	    }

	    if (propTypeFunc === propTypesArray[i].isRequired) {
	      propType.name = propTypesArray[i].key;
	      propType.isRequired = true;

	      break;
	    }
	  }

	  return propType;
	};

	module.exports = _React2['default'].createClass({
	  displayName: 'exports',

	  propTypes: {
	    componentClass: _React2['default'].PropTypes.renderable,
	    propDescriptionMap: _React2['default'].PropTypes.object,
	    ignore: _React2['default'].PropTypes.array
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      propDescriptionMap: {},
	      ignore: []
	    };
	  },
	  render: function render() {
	    var propTypes = [];

	    for (var propName in this.props.componentClass.propTypes) {
	      if (this.props.ignore.indexOf(propName)) {
	        propTypes.push({
	          propName: propName,
	          type: getReactPropType(this.props.componentClass.propTypes[propName]),
	          description: this.props.propDescriptionMap[propName] || ''
	        });
	      }
	    }

	    return _React2['default'].createElement(
	      'div',
	      null,
	      _React2['default'].createElement(
	        'ul',
	        null,
	        propTypes.map(function (propObj) {
	          return _React2['default'].createElement(
	            'li',
	            { key: propObj.propName },
	            _React2['default'].createElement(
	              'b',
	              null,
	              propObj.propName
	            ),
	            _React2['default'].createElement(
	              'i',
	              null,
	              ': ' + propObj.type.name
	            ),
	            propObj.description && ' - ' + propObj.description,
	            _React2['default'].createElement(
	              'b',
	              null,
	              propObj.type.isRequired ? ' required' : ''
	            )
	          );
	        })
	      )
	    );
	  }
	});

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _React = __webpack_require__(8);

	var _React2 = _interopRequireDefault(_React);

	/* eslint new-cap:0 no-unused-vars:0 */
	'use strict';

	var Editor = _React2['default'].createClass({
	  displayName: 'Editor',

	  componentDidMount: function componentDidMount() {
	    this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), {
	      mode: 'javascript',
	      lineNumbers: false,
	      lineWrapping: true,
	      smartIndent: false,
	      matchBrackets: true,
	      theme: this.props.theme,
	      readOnly: this.props.readOnly
	    });
	    this.editor.on('change', this._handleChange);
	  },

	  componentDidUpdate: function componentDidUpdate() {
	    if (this.props.readOnly) {
	      this.editor.setValue(this.props.codeText);
	    }
	  },

	  _handleChange: function _handleChange() {
	    if (!this.props.readOnly && this.props.onChange) {
	      this.props.onChange(this.editor.getValue());
	    }
	  },

	  render: function render() {
	    var editor = _React2['default'].createElement('textarea', { ref: 'editor', defaultValue: this.props.codeText });

	    return _React2['default'].createElement(
	      'div',
	      { style: this.props.style, className: this.props.className },
	      editor
	    );
	  }
	});

	exports['default'] = Editor;
	module.exports = exports['default'];

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _React = __webpack_require__(8);

	var _React2 = _interopRequireDefault(_React);

	var _Editor = __webpack_require__(56);

	var _Editor2 = _interopRequireDefault(_Editor);

	var _Preview = __webpack_require__(58);

	var _Preview2 = _interopRequireDefault(_Preview);

	var _Doc = __webpack_require__(55);

	var _Doc2 = _interopRequireDefault(_Doc);

	/* eslint new-cap:0 no-unused-vars:0 */
	'use strict';

	var ReactPlayground = _React2['default'].createClass({
	  displayName: 'ReactPlayground',

	  propTypes: {
	    codeText: _React2['default'].PropTypes.string.isRequired,
	    scope: _React2['default'].PropTypes.object.isRequired,
	    collapsableCode: _React2['default'].PropTypes.bool,
	    docClass: _React2['default'].PropTypes.renderable,
	    propDescriptionMap: _React2['default'].PropTypes.string,
	    theme: _React2['default'].PropTypes.string,
	    noRender: _React2['default'].PropTypes.bool
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      theme: 'monokai',
	      noRender: false
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      code: this.props.codeText,
	      expandedCode: false
	    };
	  },

	  _handleCodeChange: function _handleCodeChange(code) {
	    this.setState({ code: code });
	  },

	  _toggleCode: function _toggleCode() {
	    this.setState({
	      expandedCode: !this.state.expandedCode
	    });
	  },

	  render: function render() {
	    return _React2['default'].createElement(
	      'div',
	      { className: 'playground' + (this.props.collapsableCode ? ' collapsableCode' : '') },
	      this.props.docClass ? _React2['default'].createElement(_Doc2['default'], {
	        componentClass: this.props.docClass,
	        propDescriptionMap: this.props.propDescriptionMap }) : '',
	      _React2['default'].createElement(
	        'div',
	        { className: 'playgroundCode' + (this.state.expandedCode ? ' expandedCode' : '') },
	        _React2['default'].createElement(_Editor2['default'], {
	          onChange: this._handleCodeChange,
	          className: 'playgroundStage',
	          codeText: this.state.code,
	          theme: this.props.theme })
	      ),
	      this.props.collapsableCode ? _React2['default'].createElement(
	        'div',
	        { className: 'playgroundToggleCodeBar' },
	        _React2['default'].createElement(
	          'span',
	          { className: 'playgroundToggleCodeLink', onClick: this._toggleCode },
	          this.state.expandedCode ? 'collapse' : 'expand'
	        )
	      ) : '',
	      _React2['default'].createElement(
	        'div',
	        { className: 'playgroundPreview' },
	        _React2['default'].createElement(_Preview2['default'], {
	          code: this.state.code,
	          scope: this.props.scope,
	          noRender: this.props.noRender })
	      )
	    );
	  } });

	exports['default'] = ReactPlayground;
	module.exports = exports['default'];

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _React = __webpack_require__(8);

	var _React2 = _interopRequireDefault(_React);

	var _JSXTransform = __webpack_require__(176);

	var _JSXTransform2 = _interopRequireDefault(_JSXTransform);

	var _babel = __webpack_require__(199);

	var _babel2 = _interopRequireDefault(_babel);

	/* eslint new-cap:0 no-unused-vars:0 */
	'use strict';

	var Preview = _React2['default'].createClass({
	  displayName: 'Preview',

	  propTypes: {
	    code: _React2['default'].PropTypes.string.isRequired,
	    scope: _React2['default'].PropTypes.object.isRequired
	  },

	  getInitialState: function getInitialState() {
	    return {
	      error: null
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this._executeCode();
	  },

	  componentDidUpdate: function componentDidUpdate(prevProps) {
	    clearTimeout(this.timeoutID);
	    if (this.props.code !== prevProps.code) {
	      this._executeCode();
	    }
	  },

	  _compileCode: function _compileCode() {
	    if (this.props.noRender) {
	      return _babel2['default'].transform('(function(' + Object.keys(this.props.scope).join(',') + ', mountNode) {' + 'return React.createClass({' + 'render: function(){' + 'return (' + this.props.code + ')' + '}' + '});' + '\n});', { stage: 1 }).code;
	    } else {
	      return _babel2['default'].transform('(function(' + Object.keys(this.props.scope).join(',') + ', mountNode) {' + this.props.code + '\n});', { stage: 1 }).code;
	    }
	  },

	  _setTimeout: function _setTimeout() {
	    clearTimeout(this.timeoutID);
	    this.timeoutID = setTimeout.apply(null, arguments);
	  },

	  _executeCode: function _executeCode() {
	    var mountNode = this.refs.mount.getDOMNode();

	    try {

	      var scope = [];

	      for (var s in this.props.scope) {
	        if (this.props.scope.hasOwnProperty(s)) {
	          scope.push(this.props.scope[s]);
	        }
	      }

	      scope.push(mountNode);

	      var compiledCode = this._compileCode();
	      if (this.props.noRender) {
	        var Component = _React2['default'].createElement(eval(compiledCode).apply(null, scope));
	        _React2['default'].render(Component, mountNode);
	      } else {
	        eval(compiledCode).apply(null, scope);
	      }

	      this.setState({
	        error: null
	      });
	    } catch (err) {
	      var self = this;
	      this._setTimeout(function () {
	        self.setState({
	          error: err.toString()
	        });
	      }, 500);
	    }
	  },

	  render: function render() {
	    return _React2['default'].createElement(
	      'div',
	      null,
	      this.state.error !== null ? _React2['default'].createElement(
	        'div',
	        { className: 'playgroundError' },
	        this.state.error
	      ) : null,
	      _React2['default'].createElement('div', { ref: 'mount', className: 'previewArea' })
	    );
	  } });

	exports['default'] = Preview;
	module.exports = exports['default'];

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"100": "💯",
		"911": "🚨",
		"1234": "🔢",
		"smile": "😀",
		"happy": "😆",
		"joy": "😂",
		"pleased": "☺️",
		"smiley": "😃",
		"haha": "😆",
		"grinning": "😀",
		"blush": "☺️",
		"proud": "😊",
		"relaxed": "☺️",
		"wink": "😉",
		"flirt": "😘",
		"heart_eyes": "😍",
		"love": "💘",
		"crush": "😍",
		"kissing_heart": "😘",
		"kissing_closed_eyes": "😚",
		"kissing": "😗",
		"kissing_smiling_eyes": "😙",
		"stuck_out_tongue_winking_eye": "😜",
		"prank": "😝",
		"silly": "😜",
		"stuck_out_tongue_closed_eyes": "😝",
		"stuck_out_tongue": "😛",
		"flushed": "😳",
		"grin": "😁",
		"pensive": "😔",
		"relieved": "😌",
		"whew": "😌",
		"unamused": "😒",
		"meh": "😐",
		"disappointed": "😞",
		"sad": "🙍",
		"persevere": "😣",
		"struggling": "😣",
		"cry": "😭",
		"tear": "😿",
		"tears": "😂",
		"sob": "😭",
		"bawling": "😭",
		"sleepy": "😪",
		"tired": "😩",
		"disappointed_relieved": "😥",
		"phew": "😥",
		"sweat": "😓",
		"nervous": "😟",
		"cold_sweat": "😰",
		"sweat_smile": "😅",
		"hot": "😅",
		"weary": "😩",
		"tired_face": "😫",
		"upset": "😫",
		"whine": "😫",
		"fearful": "😨",
		"scared": "😨",
		"shocked": "😱",
		"oops": "😨",
		"scream": "😱",
		"horror": "🙀",
		"angry": "💢",
		"mad": "😠",
		"annoyed": "😠",
		"rage": "😡",
		"triumph": "😤",
		"smug": "😏",
		"confounded": "😖",
		"laughing": "😆",
		"satisfied": "😆",
		"yum": "😋",
		"tongue": "👅",
		"lick": "😋",
		"mask": "😷",
		"sick": "😷",
		"ill": "😷",
		"sunglasses": "😎",
		"cool": "🆒",
		"sleeping": "💤",
		"zzz": "💤",
		"dizzy_face": "😵",
		"astonished": "😲",
		"amazed": "😲",
		"gasp": "😲",
		"worried": "😟",
		"frowning": "😦",
		"anguished": "😧",
		"stunned": "😧",
		"smiling_imp": "😈",
		"devil": "👿",
		"evil": "👿",
		"horns": "👿",
		"imp": "👿",
		"open_mouth": "😮",
		"surprise": "😮",
		"impressed": "😮",
		"wow": "😮",
		"grimacing": "😬",
		"neutral_face": "😐",
		"confused": "❓",
		"hushed": "😯",
		"silence": "😶",
		"speechless": "😯",
		"no_mouth": "😶",
		"mute": "📴",
		"innocent": "😇",
		"angel": "👼",
		"smirk": "😏",
		"expressionless": "😑",
		"man_with_gua_pi_mao": "👲",
		"man_with_turban": "👳",
		"cop": "👮",
		"police": "👮",
		"law": "👮",
		"construction_worker": "👷",
		"helmet": "👷",
		"guardsman": "💂",
		"baby": "👶",
		"child": "👪",
		"newborn": "👶",
		"boy": "👱",
		"girl": "👧",
		"man": "👨",
		"mustache": "👨",
		"father": "👨",
		"dad": "👨",
		"woman": "👩",
		"girls": "👩",
		"older_man": "👴",
		"older_woman": "👵",
		"person_with_blond_hair": "👱",
		"princess": "👸",
		"blonde": "👸",
		"crown": "👑",
		"royal": "👑",
		"smiley_cat": "😺",
		"smile_cat": "😸",
		"heart_eyes_cat": "😻",
		"kissing_cat": "😽",
		"smirk_cat": "😼",
		"scream_cat": "🙀",
		"crying_cat_face": "😿",
		"joy_cat": "😹",
		"pouting_cat": "😾",
		"japanese_ogre": "👹",
		"monster": "👹",
		"japanese_goblin": "👺",
		"see_no_evil": "🙈",
		"monkey": "🐒",
		"blind": "🙈",
		"ignore": "🙈",
		"hear_no_evil": "🙉",
		"deaf": "🙉",
		"speak_no_evil": "🙊",
		"hush": "🙊",
		"skull": "💀",
		"dead": "💀",
		"danger": "💀",
		"poison": "💀",
		"alien": "👽",
		"ufo": "👽",
		"hankey": "💩",
		"poop": "💩",
		"shit": "💩",
		"crap": "💩",
		"fire": "🔥",
		"burn": "🔥",
		"sparkles": "✨",
		"shiny": "✨",
		"star2": "🌟",
		"dizzy": "💫",
		"star": "⭐",
		"boom": "💣",
		"collision": "💥",
		"explode": "💥",
		"anger": "💢",
		"sweat_drops": "💦",
		"water": "💧",
		"workout": "🏃",
		"droplet": "💧",
		"dash": "💨",
		"wind": "💨",
		"blow": "💨",
		"fast": "💨",
		"ear": "👂",
		"hear": "👂",
		"sound": "🔔",
		"listen": "👂",
		"eyes": "👀",
		"look": "👀",
		"see": "👀",
		"watch": "⌚",
		"nose": "👃",
		"smell": "👃",
		"taste": "👅",
		"lips": "👄",
		"kiss": "💋",
		"+1": "👍",
		"thumbsup": "👍",
		"approve": "👍",
		"ok": "🆗",
		"-1": "👎",
		"thumbsdown": "👎",
		"disapprove": "👎",
		"bury": "👎",
		"ok_hand": "👌",
		"facepunch": "👊",
		"punch": "👊",
		"attack": "👊",
		"fist": "✊",
		"power": "🔋",
		"v": "✌️",
		"victory": "✌️",
		"peace": "✌️",
		"wave": "👋",
		"goodbye": "👋",
		"hand": "✋",
		"raised_hand": "✋",
		"highfive": "✋",
		"stop": "🙅",
		"open_hands": "👐",
		"point_up_2": "👆",
		"point_down": "👇",
		"point_right": "👉",
		"point_left": "👈",
		"raised_hands": "🙌",
		"hooray": "🙌",
		"pray": "🙏",
		"please": "🙏",
		"hope": "🙏",
		"wish": "🙏",
		"point_up": "☝️",
		"clap": "👏",
		"praise": "👏",
		"applause": "👏",
		"muscle": "💪",
		"flex": "💪",
		"bicep": "💪",
		"strong": "💪",
		"walking": "🚶",
		"runner": "🏃",
		"running": "👟",
		"exercise": "🏃",
		"marathon": "🎽",
		"dancer": "💃",
		"dress": "👗",
		"couple": "👭",
		"date": "📅",
		"family": "👪",
		"home": "👪",
		"parents": "👪",
		"two_men_holding_hands": "👬",
		"two_women_holding_hands": "👭",
		"couplekiss": "💏",
		"couple_with_heart": "💑",
		"dancers": "👯",
		"bunny": "🐰",
		"ok_woman": "🙆",
		"no_good": "🙅",
		"halt": "🙅",
		"information_desk_person": "💁",
		"raising_hand": "🙋",
		"massage": "💆",
		"spa": "💆",
		"haircut": "💇",
		"beauty": "💅",
		"nail_care": "💅",
		"manicure": "💅",
		"bride_with_veil": "👰",
		"marriage": "💒",
		"wedding": "💒",
		"person_with_pouting_face": "🙎",
		"person_frowning": "🙍",
		"bow": "🙇",
		"respect": "🙇",
		"thanks": "🙇",
		"tophat": "🎩",
		"hat": "🎩",
		"classy": "🎩",
		"king": "👑",
		"queen": "👑",
		"womans_hat": "👒",
		"athletic_shoe": "👟",
		"sneaker": "👟",
		"sport": "👟",
		"mans_shoe": "👞",
		"shoe": "👠",
		"sandal": "👡",
		"high_heel": "👠",
		"boot": "👢",
		"shirt": "👔",
		"tshirt": "👕",
		"necktie": "👔",
		"formal": "👔",
		"womans_clothes": "👚",
		"running_shirt_with_sash": "🎽",
		"jeans": "👖",
		"pants": "👖",
		"kimono": "👘",
		"bikini": "👙",
		"beach": "🐚",
		"briefcase": "💼",
		"business": "💼",
		"handbag": "👜",
		"bag": "👝",
		"pouch": "👝",
		"purse": "👛",
		"eyeglasses": "👓",
		"glasses": "👓",
		"ribbon": "🎀",
		"closed_umbrella": "🌂",
		"weather": "❄️",
		"rain": "☔",
		"lipstick": "💋",
		"makeup": "💄",
		"yellow_heart": "💛",
		"blue_heart": "💙",
		"purple_heart": "💜",
		"green_heart": "💚",
		"heart": "💘",
		"broken_heart": "💔",
		"heartpulse": "💗",
		"heartbeat": "💓",
		"two_hearts": "💕",
		"sparkling_heart": "💖",
		"revolving_hearts": "💞",
		"cupid": "💘",
		"love_letter": "💌",
		"email": "✉️",
		"envelope": "✉️",
		"ring": "💍",
		"engaged": "💍",
		"gem": "💎",
		"diamond": "💎",
		"bust_in_silhouette": "👤",
		"user": "👤",
		"busts_in_silhouette": "👥",
		"users": "👥",
		"group": "👥",
		"team": "👥",
		"speech_balloon": "💬",
		"comment": "💬",
		"footprints": "👣",
		"feet": "🐾",
		"tracks": "👣",
		"thought_balloon": "💭",
		"thinking": "💭",
		"dog": "🐩",
		"pet": "🐹",
		"wolf": "🐺",
		"cat": "🐱",
		"mouse": "🐭",
		"hamster": "🐹",
		"rabbit": "🐰",
		"frog": "🐸",
		"tiger": "🐯",
		"koala": "🐨",
		"bear": "🐻",
		"pig": "🐷",
		"pig_nose": "🐽",
		"cow": "🐮",
		"boar": "🐗",
		"monkey_face": "🐵",
		"horse": "🐴",
		"sheep": "🐑",
		"elephant": "🐘",
		"panda_face": "🐼",
		"penguin": "🐧",
		"bird": "🐦",
		"baby_chick": "🐤",
		"hatched_chick": "🐥",
		"hatching_chick": "🐣",
		"chicken": "🍗",
		"snake": "🐍",
		"turtle": "🐢",
		"slow": "🐌",
		"bug": "🐞",
		"bee": "🐝",
		"honeybee": "🐝",
		"ant": "🐜",
		"beetle": "🐞",
		"snail": "🐌",
		"octopus": "🐙",
		"shell": "🐚",
		"sea": "🌊",
		"tropical_fish": "🐠",
		"fish": "🐟",
		"dolphin": "🐬",
		"flipper": "🐬",
		"whale": "🐳",
		"whale2": "🐋",
		"cow2": "🐄",
		"ram": "🐏",
		"rat": "🐀",
		"water_buffalo": "🐃",
		"tiger2": "🐅",
		"rabbit2": "🐇",
		"dragon": "🐉",
		"racehorse": "🐎",
		"speed": "🐎",
		"goat": "🐐",
		"rooster": "🐓",
		"dog2": "🐕",
		"pig2": "🐖",
		"mouse2": "🐁",
		"ox": "🐂",
		"dragon_face": "🐲",
		"blowfish": "🐡",
		"crocodile": "🐊",
		"camel": "🐫",
		"dromedary_camel": "🐪",
		"desert": "🐪",
		"leopard": "🐆",
		"cat2": "🐈",
		"poodle": "🐩",
		"paw_prints": "🐾",
		"bouquet": "💐",
		"flowers": "💐",
		"cherry_blossom": "🌸",
		"flower": "🌹",
		"spring": "🌸",
		"tulip": "🌷",
		"four_leaf_clover": "🍀",
		"luck": "🍀",
		"rose": "🌹",
		"sunflower": "🌻",
		"hibiscus": "🌺",
		"maple_leaf": "🍁",
		"canada": "🍁",
		"leaves": "🍃",
		"leaf": "🍃",
		"fallen_leaf": "🍂",
		"autumn": "🍂",
		"herb": "🌿",
		"ear_of_rice": "🌾",
		"mushroom": "🍄",
		"cactus": "🌵",
		"palm_tree": "🌴",
		"evergreen_tree": "🌲",
		"wood": "🌳",
		"deciduous_tree": "🌳",
		"chestnut": "🌰",
		"seedling": "🌱",
		"plant": "🌱",
		"blossom": "🌼",
		"globe_with_meridians": "🌐",
		"world": "🌏",
		"global": "🌐",
		"international": "🌏",
		"sun_with_face": "🌞",
		"summer": "🍹",
		"full_moon_with_face": "🌝",
		"new_moon_with_face": "🌚",
		"new_moon": "🌑",
		"waxing_crescent_moon": "🌒",
		"first_quarter_moon": "🌓",
		"moon": "🌔",
		"waxing_gibbous_moon": "🌔",
		"full_moon": "🌕",
		"waning_gibbous_moon": "🌖",
		"last_quarter_moon": "🌗",
		"waning_crescent_moon": "🌘",
		"last_quarter_moon_with_face": "🌜",
		"first_quarter_moon_with_face": "🌛",
		"crescent_moon": "🌙",
		"night": "🌙",
		"earth_africa": "🌍",
		"globe": "🌏",
		"earth_americas": "🌎",
		"earth_asia": "🌏",
		"volcano": "🌋",
		"milky_way": "🌌",
		"stars": "🌠",
		"sunny": "☀️",
		"partly_sunny": "⛅",
		"cloud": "☁️",
		"zap": "⚡",
		"lightning": "⚡",
		"thunder": "⚡",
		"umbrella": "☔",
		"snowflake": "❄️",
		"winter": "⛄",
		"cold": "❄️",
		"snowman": "⛄",
		"christmas": "🎁",
		"cyclone": "🌀",
		"swirl": "🌀",
		"foggy": "🌁",
		"karl": "🌁",
		"rainbow": "🌈",
		"pride": "🌈",
		"ocean": "🌊",
		"bamboo": "🎍",
		"gift_heart": "💝",
		"chocolates": "💝",
		"dolls": "🎎",
		"school_satchel": "🎒",
		"mortar_board": "🎓",
		"education": "🎓",
		"college": "🎓",
		"university": "🎓",
		"graduation": "🎓",
		"flags": "🎏",
		"fireworks": "🎆",
		"festival": "🎆",
		"celebration": "🎆",
		"sparkler": "🎇",
		"wind_chime": "🎐",
		"rice_scene": "🎑",
		"jack_o_lantern": "🎃",
		"halloween": "👻",
		"ghost": "👻",
		"santa": "🎅",
		"christmas_tree": "🎄",
		"gift": "🎁",
		"present": "🎁",
		"birthday": "🎂",
		"tanabata_tree": "🎋",
		"tada": "🎉",
		"party": "🎂",
		"confetti_ball": "🎊",
		"balloon": "🎈",
		"crossed_flags": "🎌",
		"crystal_ball": "🔮",
		"fortune": "🔮",
		"movie_camera": "🎥",
		"film": "🎦",
		"video": "🎥",
		"camera": "📷",
		"photo": "📷",
		"video_camera": "📹",
		"vhs": "📼",
		"cd": "💿",
		"dvd": "📀",
		"minidisc": "💽",
		"floppy_disk": "💾",
		"save": "💾",
		"computer": "💻",
		"desktop": "💻",
		"screen": "💻",
		"iphone": "📱",
		"smartphone": "📱",
		"mobile": "📱",
		"phone": "📞",
		"telephone": "☎️",
		"telephone_receiver": "📞",
		"call": "📲",
		"pager": "📟",
		"fax": "📠",
		"satellite": "📡",
		"signal": "📡",
		"tv": "📺",
		"radio": "📻",
		"podcast": "📻",
		"loud_sound": "🔊",
		"volume": "🔕",
		"speaker": "🔈",
		"bell": "🔔",
		"notification": "🔔",
		"no_bell": "🔕",
		"off": "📴",
		"loudspeaker": "📢",
		"announcement": "📢",
		"mega": "📣",
		"hourglass_flowing_sand": "⏳",
		"time": "⌚",
		"hourglass": "⌛",
		"alarm_clock": "⏰",
		"morning": "⏰",
		"unlock": "🔓",
		"security": "🔐",
		"lock": "🔑",
		"private": "🔒",
		"lock_with_ink_pen": "🔏",
		"closed_lock_with_key": "🔐",
		"key": "🔑",
		"password": "🔑",
		"mag_right": "🔎",
		"bulb": "💡",
		"idea": "💡",
		"light": "💡",
		"flashlight": "🔦",
		"high_brightness": "🔆",
		"low_brightness": "🔅",
		"electric_plug": "🔌",
		"battery": "🔋",
		"mag": "🔍",
		"search": "🔍",
		"zoom": "🔍",
		"bathtub": "🛁",
		"bath": "🚿",
		"shower": "🚿",
		"toilet": "🚾",
		"wc": "🚾",
		"wrench": "🔧",
		"tool": "🔨",
		"nut_and_bolt": "🔩",
		"hammer": "🔨",
		"door": "🚪",
		"smoking": "🚬",
		"cigarette": "🚬",
		"bomb": "💣",
		"gun": "🔫",
		"shoot": "🔫",
		"weapon": "🔫",
		"hocho": "🔪",
		"knife": "🔪",
		"cut": "✂️",
		"chop": "🔪",
		"pill": "💊",
		"health": "💉",
		"medicine": "💊",
		"syringe": "💉",
		"hospital": "🏥",
		"needle": "💉",
		"moneybag": "💰",
		"dollar": "💸",
		"cream": "💰",
		"yen": "💴",
		"money": "💵",
		"pound": "💷",
		"euro": "💶",
		"credit_card": "💳",
		"subscription": "💳",
		"money_with_wings": "💸",
		"calling": "📲",
		"incoming": "📲",
		"e-mail": "📧",
		"inbox_tray": "📥",
		"outbox_tray": "📤",
		"letter": "✉️",
		"envelope_with_arrow": "📩",
		"incoming_envelope": "📨",
		"postal_horn": "📯",
		"mailbox": "📫",
		"mailbox_closed": "📪",
		"mailbox_with_mail": "📬",
		"mailbox_with_no_mail": "📭",
		"postbox": "📮",
		"package": "📦",
		"shipping": "📦",
		"memo": "📝",
		"pencil": "📝",
		"document": "📜",
		"note": "📝",
		"page_facing_up": "📄",
		"page_with_curl": "📃",
		"bookmark_tabs": "📑",
		"bar_chart": "📊",
		"stats": "📊",
		"metrics": "📉",
		"chart_with_upwards_trend": "📈",
		"graph": "📉",
		"chart_with_downwards_trend": "📉",
		"scroll": "📜",
		"clipboard": "📋",
		"calendar": "📆",
		"schedule": "📆",
		"card_index": "📇",
		"file_folder": "📁",
		"directory": "📁",
		"open_file_folder": "📂",
		"scissors": "✂️",
		"pushpin": "📌",
		"location": "📍",
		"paperclip": "📎",
		"black_nib": "✒️",
		"pencil2": "✏️",
		"straight_ruler": "📏",
		"triangular_ruler": "📐",
		"closed_book": "📕",
		"green_book": "📗",
		"blue_book": "📘",
		"orange_book": "📙",
		"notebook": "📓",
		"notebook_with_decorative_cover": "📔",
		"ledger": "📒",
		"books": "📚",
		"library": "📚",
		"book": "📖",
		"open_book": "📖",
		"bookmark": "🔖",
		"name_badge": "📛",
		"microscope": "🔬",
		"science": "🔬",
		"laboratory": "🔬",
		"investigate": "🔬",
		"telescope": "🔭",
		"newspaper": "📰",
		"press": "📰",
		"art": "🎨",
		"design": "🎨",
		"paint": "🎨",
		"clapper": "🎬",
		"microphone": "🎤",
		"sing": "🎤",
		"headphones": "🎧",
		"music": "🎶",
		"earphones": "🎧",
		"musical_score": "🎼",
		"musical_note": "🎵",
		"notes": "🎶",
		"musical_keyboard": "🎹",
		"piano": "🎹",
		"violin": "🎻",
		"trumpet": "🎺",
		"saxophone": "🎷",
		"guitar": "🎸",
		"rock": "🎸",
		"space_invader": "👾",
		"game": "👾",
		"retro": "👾",
		"video_game": "🎮",
		"play": "🎮",
		"controller": "🎮",
		"console": "🎮",
		"black_joker": "🃏",
		"flower_playing_cards": "🎴",
		"mahjong": "🀄",
		"game_die": "🎲",
		"dice": "🎲",
		"gambling": "🎲",
		"dart": "🎯",
		"target": "🎯",
		"football": "🏈",
		"sports": "🎾",
		"basketball": "🏀",
		"soccer": "⚽",
		"baseball": "⚾️",
		"tennis": "🎾",
		"8ball": "🎱",
		"pool": "🎱",
		"billiards": "🎱",
		"rugby_football": "🏉",
		"bowling": "🎳",
		"golf": "⛳",
		"mountain_bicyclist": "🚵",
		"bicyclist": "🚴",
		"checkered_flag": "🏁",
		"milestone": "🏁",
		"finish": "🏁",
		"horse_racing": "🏇",
		"trophy": "🏆",
		"award": "🏆",
		"contest": "🏆",
		"winner": "🏆",
		"ski": "🎿",
		"snowboarder": "🏂",
		"swimmer": "🏊",
		"surfer": "🏄",
		"fishing_pole_and_fish": "🎣",
		"coffee": "☕",
		"cafe": "☕",
		"espresso": "☕",
		"tea": "🍵",
		"green": "♻️",
		"breakfast": "🍳",
		"sake": "🍶",
		"baby_bottle": "🍼",
		"milk": "🍼",
		"beer": "🍺",
		"drink": "🍸",
		"beers": "🍻",
		"drinks": "🍻",
		"cocktail": "🍸",
		"tropical_drink": "🍹",
		"vacation": "🍹",
		"wine_glass": "🍷",
		"fork_and_knife": "🍴",
		"cutlery": "🍴",
		"pizza": "🍕",
		"hamburger": "🍔",
		"burger": "🍔",
		"fries": "🍟",
		"poultry_leg": "🍗",
		"meat": "🍗",
		"meat_on_bone": "🍖",
		"spaghetti": "🍝",
		"pasta": "🍝",
		"curry": "🍛",
		"fried_shrimp": "🍤",
		"tempura": "🍤",
		"bento": "🍱",
		"sushi": "🍣",
		"fish_cake": "🍥",
		"rice_ball": "🍙",
		"rice_cracker": "🍘",
		"rice": "🍚",
		"ramen": "🍜",
		"noodle": "🍜",
		"stew": "🍲",
		"oden": "🍢",
		"dango": "🍡",
		"egg": "🍳",
		"bread": "🍞",
		"toast": "🍞",
		"doughnut": "🍩",
		"custard": "🍮",
		"icecream": "🍦",
		"ice_cream": "🍨",
		"shaved_ice": "🍧",
		"cake": "🍰",
		"dessert": "🍰",
		"cookie": "🍪",
		"chocolate_bar": "🍫",
		"candy": "🍬",
		"sweet": "🍬",
		"lollipop": "🍭",
		"honey_pot": "🍯",
		"apple": "🍎",
		"green_apple": "🍏",
		"fruit": "🍌",
		"tangerine": "🍊",
		"lemon": "🍋",
		"cherries": "🍒",
		"grapes": "🍇",
		"watermelon": "🍉",
		"strawberry": "🍓",
		"peach": "🍑",
		"melon": "🍈",
		"banana": "🍌",
		"pear": "🍐",
		"pineapple": "🍍",
		"sweet_potato": "🍠",
		"eggplant": "🍆",
		"aubergine": "🍆",
		"tomato": "🍅",
		"corn": "🌽",
		"house": "🏠",
		"house_with_garden": "🏡",
		"school": "🏫",
		"office": "🏢",
		"post_office": "🏣",
		"bank": "🏦",
		"convenience_store": "🏪",
		"love_hotel": "🏩",
		"hotel": "🏨",
		"church": "⛪",
		"department_store": "🏬",
		"european_post_office": "🏤",
		"city_sunrise": "🌇",
		"city_sunset": "🌆",
		"japanese_castle": "🏯",
		"european_castle": "🏰",
		"tent": "⛺",
		"camping": "⛺",
		"factory": "🏭",
		"tokyo_tower": "🗼",
		"japan": "🇯🇵",
		"mount_fuji": "🗻",
		"sunrise_over_mountains": "🌄",
		"sunrise": "🌅",
		"night_with_stars": "🌃",
		"statue_of_liberty": "🗽",
		"bridge_at_night": "🌉",
		"carousel_horse": "🎠",
		"ferris_wheel": "🎡",
		"fountain": "⛲",
		"roller_coaster": "🎢",
		"ship": "🚀",
		"boat": "⛵",
		"sailboat": "⛵",
		"speedboat": "🚤",
		"rowboat": "🚣",
		"anchor": "⚓",
		"rocket": "🚀",
		"launch": "🚀",
		"airplane": "✈️",
		"flight": "✈️",
		"seat": "💺",
		"helicopter": "🚁",
		"steam_locomotive": "🚂",
		"train": "🚋",
		"tram": "🚊",
		"station": "🚉",
		"mountain_railway": "🚞",
		"train2": "🚆",
		"bullettrain_side": "🚄",
		"bullettrain_front": "🚅",
		"light_rail": "🚈",
		"metro": "🚇",
		"monorail": "🚝",
		"railway_car": "🚃",
		"trolleybus": "🚎",
		"bus": "🚌",
		"oncoming_bus": "🚍",
		"blue_car": "🚙",
		"oncoming_automobile": "🚘",
		"car": "🚗",
		"red_car": "🚗",
		"taxi": "🚕",
		"oncoming_taxi": "🚖",
		"articulated_lorry": "🚛",
		"truck": "🚚",
		"rotating_light": "🚨",
		"emergency": "🆘",
		"police_car": "🚓",
		"oncoming_police_car": "🚔",
		"fire_engine": "🚒",
		"ambulance": "🚑",
		"minibus": "🚐",
		"bike": "🚲",
		"bicycle": "🚲",
		"aerial_tramway": "🚡",
		"suspension_railway": "🚟",
		"mountain_cableway": "🚠",
		"tractor": "🚜",
		"barber": "💈",
		"busstop": "🚏",
		"ticket": "🎫",
		"vertical_traffic_light": "🚦",
		"semaphore": "🚦",
		"traffic_light": "🚥",
		"warning": "⚠️",
		"wip": "🚧",
		"construction": "🚧",
		"beginner": "🔰",
		"fuelpump": "⛽",
		"izakaya_lantern": "🏮",
		"lantern": "🏮",
		"slot_machine": "🎰",
		"hotsprings": "♨️",
		"moyai": "🗿",
		"stone": "🗿",
		"circus_tent": "🎪",
		"performing_arts": "🎭",
		"theater": "🎭",
		"drama": "🎭",
		"round_pushpin": "📍",
		"triangular_flag_on_post": "🚩",
		"jp": "🇯🇵",
		"kr": "🇰🇷",
		"korea": "🇰🇷",
		"de": "🇩🇪",
		"flag": "🇬🇧",
		"germany": "🇩🇪",
		"cn": "🇨🇳",
		"china": "🇨🇳",
		"us": "🇺🇸",
		"united": "🇺🇸",
		"america": "🇺🇸",
		"fr": "🇫🇷",
		"france": "🇫🇷",
		"french": "🇫🇷",
		"es": "🇪🇸",
		"spain": "🇪🇸",
		"it": "🇮🇹",
		"italy": "🇮🇹",
		"ru": "🇷🇺",
		"russia": "🇷🇺",
		"gb": "🇬🇧",
		"uk": "🇬🇧",
		"british": "🇬🇧",
		"one": "1️⃣",
		"two": "2️⃣",
		"three": "3️⃣",
		"four": "4️⃣",
		"five": "5️⃣",
		"six": "6️⃣",
		"seven": "7️⃣",
		"eight": "8️⃣",
		"nine": "9️⃣",
		"zero": "0️⃣",
		"keycap_ten": "🔟",
		"numbers": "🔢",
		"hash": "#️⃣",
		"number": "#️⃣",
		"symbols": "🔣",
		"arrow_up": "⬆️",
		"arrow_down": "⬇️",
		"arrow_left": "⬅️",
		"arrow_right": "➡️",
		"capital_abcd": "🔠",
		"letters": "🔠",
		"abcd": "🔡",
		"abc": "🔤",
		"alphabet": "🔤",
		"arrow_upper_right": "↗️",
		"arrow_upper_left": "↖️",
		"arrow_lower_right": "↘️",
		"arrow_lower_left": "↙️",
		"left_right_arrow": "↔️",
		"arrow_up_down": "↕️",
		"arrows_counterclockwise": "🔄",
		"sync": "🔄",
		"arrow_backward": "◀️",
		"arrow_forward": "▶️",
		"arrow_up_small": "🔼",
		"arrow_down_small": "🔽",
		"leftwards_arrow_with_hook": "↩️",
		"return": "↩️",
		"arrow_right_hook": "↪️",
		"information_source": "ℹ️",
		"rewind": "⏪",
		"fast_forward": "⏩",
		"arrow_double_up": "⏫",
		"arrow_double_down": "⏬",
		"arrow_heading_down": "⤵️",
		"arrow_heading_up": "⤴️",
		"yes": "🆗",
		"twisted_rightwards_arrows": "🔀",
		"shuffle": "🔀",
		"repeat": "🔁",
		"loop": "➿",
		"repeat_one": "🔂",
		"new": "🆕",
		"fresh": "🆕",
		"up": "🆙",
		"free": "🆓",
		"ng": "🆖",
		"signal_strength": "📶",
		"wifi": "📶",
		"cinema": "🎦",
		"movie": "🎦",
		"koko": "🈁",
		"u6307": "🈯",
		"u7a7a": "🈳",
		"u6e80": "🈵",
		"u5408": "🈴",
		"u7981": "🈲",
		"ideograph_advantage": "🉐",
		"u5272": "🈹",
		"u55b6": "🈺",
		"u6709": "🈶",
		"u7121": "🈚",
		"restroom": "🚾",
		"mens": "🚹",
		"womens": "🚺",
		"baby_symbol": "🚼",
		"potable_water": "🚰",
		"put_litter_in_its_place": "🚮",
		"parking": "🅿️",
		"wheelchair": "♿",
		"accessibility": "♿",
		"no_smoking": "🚭",
		"u6708": "🈷️",
		"u7533": "🈸",
		"sa": "🈂️",
		"m": "Ⓜ️",
		"passport_control": "🛂",
		"baggage_claim": "🛄",
		"airport": "🛄",
		"left_luggage": "🛅",
		"customs": "🛃",
		"accept": "🉑",
		"secret": "㊙️",
		"congratulations": "㊗️",
		"cl": "🆑",
		"sos": "🆘",
		"help": "🆘",
		"id": "🆔",
		"no_entry_sign": "🚫",
		"block": "🚫",
		"forbidden": "🚫",
		"underage": "🔞",
		"no_mobile_phones": "📵",
		"do_not_litter": "🚯",
		"non-potable_water": "🚱",
		"no_bicycles": "🚳",
		"no_pedestrians": "🚷",
		"children_crossing": "🚸",
		"no_entry": "⛔",
		"limit": "⛔",
		"eight_spoked_asterisk": "✳️",
		"sparkle": "❇️",
		"negative_squared_cross_mark": "❎",
		"white_check_mark": "✅",
		"eight_pointed_black_star": "✴️",
		"heart_decoration": "💟",
		"vs": "🆚",
		"vibration_mode": "📳",
		"mobile_phone_off": "📴",
		"a": "🅰️",
		"b": "🅱️",
		"ab": "🆎",
		"o2": "🅾️",
		"diamond_shape_with_a_dot_inside": "💠",
		"recycle": "♻️",
		"environment": "♻️",
		"aries": "♈",
		"taurus": "♉",
		"gemini": "♊",
		"cancer": "♋",
		"leo": "♌",
		"virgo": "♍",
		"libra": "♎",
		"scorpius": "♏",
		"sagittarius": "♐",
		"capricorn": "♑",
		"aquarius": "♒",
		"pisces": "♓",
		"ophiuchus": "⛎",
		"six_pointed_star": "🔯",
		"atm": "🏧",
		"chart": "💹",
		"heavy_dollar_sign": "💲",
		"currency_exchange": "💱",
		"copyright": "©️",
		"registered": "®️",
		"tm": "™️",
		"trademark": "™️",
		"x": "❌",
		"bangbang": "‼️",
		"interrobang": "⁉️",
		"exclamation": "❗",
		"heavy_exclamation_mark": "❗",
		"bang": "❗",
		"question": "❓",
		"grey_exclamation": "❕",
		"grey_question": "❔",
		"o": "⭕",
		"top": "🔝",
		"end": "🔚",
		"back": "🔙",
		"on": "🔛",
		"soon": "🔜",
		"arrows_clockwise": "🔃",
		"clock12": "🕛",
		"clock1230": "🕧",
		"clock1": "🕐",
		"clock130": "🕜",
		"clock2": "🕑",
		"clock230": "🕝",
		"clock3": "🕒",
		"clock330": "🕞",
		"clock4": "🕓",
		"clock430": "🕟",
		"clock5": "🕔",
		"clock530": "🕠",
		"clock6": "🕕",
		"clock7": "🕖",
		"clock8": "🕗",
		"clock9": "🕘",
		"clock10": "🕙",
		"clock11": "🕚",
		"clock630": "🕡",
		"clock730": "🕢",
		"clock830": "🕣",
		"clock930": "🕤",
		"clock1030": "🕥",
		"clock1130": "🕦",
		"heavy_multiplication_x": "✖️",
		"heavy_plus_sign": "➕",
		"heavy_minus_sign": "➖",
		"heavy_division_sign": "➗",
		"spades": "♠️",
		"hearts": "♥️",
		"clubs": "♣️",
		"diamonds": "♦️",
		"white_flower": "💮",
		"score": "💯",
		"perfect": "💯",
		"heavy_check_mark": "✔️",
		"ballot_box_with_check": "☑️",
		"radio_button": "🔘",
		"link": "🔗",
		"curly_loop": "➰",
		"wavy_dash": "〰️",
		"part_alternation_mark": "〽️",
		"trident": "🔱",
		"black_medium_square": "◼️",
		"white_medium_square": "◻️",
		"black_medium_small_square": "◾",
		"white_medium_small_square": "◽",
		"black_small_square": "▪️",
		"white_small_square": "▫️",
		"small_red_triangle": "🔺",
		"black_square_button": "🔲",
		"white_square_button": "🔳",
		"black_circle": "⚫",
		"white_circle": "⚪",
		"red_circle": "🔴",
		"large_blue_circle": "🔵",
		"small_red_triangle_down": "🔻",
		"white_large_square": "⬜",
		"black_large_square": "⬛",
		"large_orange_diamond": "🔶",
		"large_blue_diamond": "🔷",
		"small_orange_diamond": "🔸",
		"small_blue_diamond": "🔹"
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"Aacute": "Á",
		"aacute": "á",
		"Abreve": "Ă",
		"abreve": "ă",
		"ac": "∾",
		"acd": "∿",
		"acE": "∾̳",
		"Acirc": "Â",
		"acirc": "â",
		"acute": "´",
		"Acy": "А",
		"acy": "а",
		"AElig": "Æ",
		"aelig": "æ",
		"af": "⁡",
		"Afr": "𝔄",
		"afr": "𝔞",
		"Agrave": "À",
		"agrave": "à",
		"alefsym": "ℵ",
		"aleph": "ℵ",
		"Alpha": "Α",
		"alpha": "α",
		"Amacr": "Ā",
		"amacr": "ā",
		"amalg": "⨿",
		"amp": "&",
		"AMP": "&",
		"andand": "⩕",
		"And": "⩓",
		"and": "∧",
		"andd": "⩜",
		"andslope": "⩘",
		"andv": "⩚",
		"ang": "∠",
		"ange": "⦤",
		"angle": "∠",
		"angmsdaa": "⦨",
		"angmsdab": "⦩",
		"angmsdac": "⦪",
		"angmsdad": "⦫",
		"angmsdae": "⦬",
		"angmsdaf": "⦭",
		"angmsdag": "⦮",
		"angmsdah": "⦯",
		"angmsd": "∡",
		"angrt": "∟",
		"angrtvb": "⊾",
		"angrtvbd": "⦝",
		"angsph": "∢",
		"angst": "Å",
		"angzarr": "⍼",
		"Aogon": "Ą",
		"aogon": "ą",
		"Aopf": "𝔸",
		"aopf": "𝕒",
		"apacir": "⩯",
		"ap": "≈",
		"apE": "⩰",
		"ape": "≊",
		"apid": "≋",
		"apos": "'",
		"ApplyFunction": "⁡",
		"approx": "≈",
		"approxeq": "≊",
		"Aring": "Å",
		"aring": "å",
		"Ascr": "𝒜",
		"ascr": "𝒶",
		"Assign": "≔",
		"ast": "*",
		"asymp": "≈",
		"asympeq": "≍",
		"Atilde": "Ã",
		"atilde": "ã",
		"Auml": "Ä",
		"auml": "ä",
		"awconint": "∳",
		"awint": "⨑",
		"backcong": "≌",
		"backepsilon": "϶",
		"backprime": "‵",
		"backsim": "∽",
		"backsimeq": "⋍",
		"Backslash": "∖",
		"Barv": "⫧",
		"barvee": "⊽",
		"barwed": "⌅",
		"Barwed": "⌆",
		"barwedge": "⌅",
		"bbrk": "⎵",
		"bbrktbrk": "⎶",
		"bcong": "≌",
		"Bcy": "Б",
		"bcy": "б",
		"bdquo": "„",
		"becaus": "∵",
		"because": "∵",
		"Because": "∵",
		"bemptyv": "⦰",
		"bepsi": "϶",
		"bernou": "ℬ",
		"Bernoullis": "ℬ",
		"Beta": "Β",
		"beta": "β",
		"beth": "ℶ",
		"between": "≬",
		"Bfr": "𝔅",
		"bfr": "𝔟",
		"bigcap": "⋂",
		"bigcirc": "◯",
		"bigcup": "⋃",
		"bigodot": "⨀",
		"bigoplus": "⨁",
		"bigotimes": "⨂",
		"bigsqcup": "⨆",
		"bigstar": "★",
		"bigtriangledown": "▽",
		"bigtriangleup": "△",
		"biguplus": "⨄",
		"bigvee": "⋁",
		"bigwedge": "⋀",
		"bkarow": "⤍",
		"blacklozenge": "⧫",
		"blacksquare": "▪",
		"blacktriangle": "▴",
		"blacktriangledown": "▾",
		"blacktriangleleft": "◂",
		"blacktriangleright": "▸",
		"blank": "␣",
		"blk12": "▒",
		"blk14": "░",
		"blk34": "▓",
		"block": "█",
		"bne": "=⃥",
		"bnequiv": "≡⃥",
		"bNot": "⫭",
		"bnot": "⌐",
		"Bopf": "𝔹",
		"bopf": "𝕓",
		"bot": "⊥",
		"bottom": "⊥",
		"bowtie": "⋈",
		"boxbox": "⧉",
		"boxdl": "┐",
		"boxdL": "╕",
		"boxDl": "╖",
		"boxDL": "╗",
		"boxdr": "┌",
		"boxdR": "╒",
		"boxDr": "╓",
		"boxDR": "╔",
		"boxh": "─",
		"boxH": "═",
		"boxhd": "┬",
		"boxHd": "╤",
		"boxhD": "╥",
		"boxHD": "╦",
		"boxhu": "┴",
		"boxHu": "╧",
		"boxhU": "╨",
		"boxHU": "╩",
		"boxminus": "⊟",
		"boxplus": "⊞",
		"boxtimes": "⊠",
		"boxul": "┘",
		"boxuL": "╛",
		"boxUl": "╜",
		"boxUL": "╝",
		"boxur": "└",
		"boxuR": "╘",
		"boxUr": "╙",
		"boxUR": "╚",
		"boxv": "│",
		"boxV": "║",
		"boxvh": "┼",
		"boxvH": "╪",
		"boxVh": "╫",
		"boxVH": "╬",
		"boxvl": "┤",
		"boxvL": "╡",
		"boxVl": "╢",
		"boxVL": "╣",
		"boxvr": "├",
		"boxvR": "╞",
		"boxVr": "╟",
		"boxVR": "╠",
		"bprime": "‵",
		"breve": "˘",
		"Breve": "˘",
		"brvbar": "¦",
		"bscr": "𝒷",
		"Bscr": "ℬ",
		"bsemi": "⁏",
		"bsim": "∽",
		"bsime": "⋍",
		"bsolb": "⧅",
		"bsol": "\\",
		"bsolhsub": "⟈",
		"bull": "•",
		"bullet": "•",
		"bump": "≎",
		"bumpE": "⪮",
		"bumpe": "≏",
		"Bumpeq": "≎",
		"bumpeq": "≏",
		"Cacute": "Ć",
		"cacute": "ć",
		"capand": "⩄",
		"capbrcup": "⩉",
		"capcap": "⩋",
		"cap": "∩",
		"Cap": "⋒",
		"capcup": "⩇",
		"capdot": "⩀",
		"CapitalDifferentialD": "ⅅ",
		"caps": "∩︀",
		"caret": "⁁",
		"caron": "ˇ",
		"Cayleys": "ℭ",
		"ccaps": "⩍",
		"Ccaron": "Č",
		"ccaron": "č",
		"Ccedil": "Ç",
		"ccedil": "ç",
		"Ccirc": "Ĉ",
		"ccirc": "ĉ",
		"Cconint": "∰",
		"ccups": "⩌",
		"ccupssm": "⩐",
		"Cdot": "Ċ",
		"cdot": "ċ",
		"cedil": "¸",
		"Cedilla": "¸",
		"cemptyv": "⦲",
		"cent": "¢",
		"centerdot": "·",
		"CenterDot": "·",
		"cfr": "𝔠",
		"Cfr": "ℭ",
		"CHcy": "Ч",
		"chcy": "ч",
		"check": "✓",
		"checkmark": "✓",
		"Chi": "Χ",
		"chi": "χ",
		"circ": "ˆ",
		"circeq": "≗",
		"circlearrowleft": "↺",
		"circlearrowright": "↻",
		"circledast": "⊛",
		"circledcirc": "⊚",
		"circleddash": "⊝",
		"CircleDot": "⊙",
		"circledR": "®",
		"circledS": "Ⓢ",
		"CircleMinus": "⊖",
		"CirclePlus": "⊕",
		"CircleTimes": "⊗",
		"cir": "○",
		"cirE": "⧃",
		"cire": "≗",
		"cirfnint": "⨐",
		"cirmid": "⫯",
		"cirscir": "⧂",
		"ClockwiseContourIntegral": "∲",
		"CloseCurlyDoubleQuote": "”",
		"CloseCurlyQuote": "’",
		"clubs": "♣",
		"clubsuit": "♣",
		"colon": ":",
		"Colon": "∷",
		"Colone": "⩴",
		"colone": "≔",
		"coloneq": "≔",
		"comma": ",",
		"commat": "@",
		"comp": "∁",
		"compfn": "∘",
		"complement": "∁",
		"complexes": "ℂ",
		"cong": "≅",
		"congdot": "⩭",
		"Congruent": "≡",
		"conint": "∮",
		"Conint": "∯",
		"ContourIntegral": "∮",
		"copf": "𝕔",
		"Copf": "ℂ",
		"coprod": "∐",
		"Coproduct": "∐",
		"copy": "©",
		"COPY": "©",
		"copysr": "℗",
		"CounterClockwiseContourIntegral": "∳",
		"crarr": "↵",
		"cross": "✗",
		"Cross": "⨯",
		"Cscr": "𝒞",
		"cscr": "𝒸",
		"csub": "⫏",
		"csube": "⫑",
		"csup": "⫐",
		"csupe": "⫒",
		"ctdot": "⋯",
		"cudarrl": "⤸",
		"cudarrr": "⤵",
		"cuepr": "⋞",
		"cuesc": "⋟",
		"cularr": "↶",
		"cularrp": "⤽",
		"cupbrcap": "⩈",
		"cupcap": "⩆",
		"CupCap": "≍",
		"cup": "∪",
		"Cup": "⋓",
		"cupcup": "⩊",
		"cupdot": "⊍",
		"cupor": "⩅",
		"cups": "∪︀",
		"curarr": "↷",
		"curarrm": "⤼",
		"curlyeqprec": "⋞",
		"curlyeqsucc": "⋟",
		"curlyvee": "⋎",
		"curlywedge": "⋏",
		"curren": "¤",
		"curvearrowleft": "↶",
		"curvearrowright": "↷",
		"cuvee": "⋎",
		"cuwed": "⋏",
		"cwconint": "∲",
		"cwint": "∱",
		"cylcty": "⌭",
		"dagger": "†",
		"Dagger": "‡",
		"daleth": "ℸ",
		"darr": "↓",
		"Darr": "↡",
		"dArr": "⇓",
		"dash": "‐",
		"Dashv": "⫤",
		"dashv": "⊣",
		"dbkarow": "⤏",
		"dblac": "˝",
		"Dcaron": "Ď",
		"dcaron": "ď",
		"Dcy": "Д",
		"dcy": "д",
		"ddagger": "‡",
		"ddarr": "⇊",
		"DD": "ⅅ",
		"dd": "ⅆ",
		"DDotrahd": "⤑",
		"ddotseq": "⩷",
		"deg": "°",
		"Del": "∇",
		"Delta": "Δ",
		"delta": "δ",
		"demptyv": "⦱",
		"dfisht": "⥿",
		"Dfr": "𝔇",
		"dfr": "𝔡",
		"dHar": "⥥",
		"dharl": "⇃",
		"dharr": "⇂",
		"DiacriticalAcute": "´",
		"DiacriticalDot": "˙",
		"DiacriticalDoubleAcute": "˝",
		"DiacriticalGrave": "`",
		"DiacriticalTilde": "˜",
		"diam": "⋄",
		"diamond": "⋄",
		"Diamond": "⋄",
		"diamondsuit": "♦",
		"diams": "♦",
		"die": "¨",
		"DifferentialD": "ⅆ",
		"digamma": "ϝ",
		"disin": "⋲",
		"div": "÷",
		"divide": "÷",
		"divideontimes": "⋇",
		"divonx": "⋇",
		"DJcy": "Ђ",
		"djcy": "ђ",
		"dlcorn": "⌞",
		"dlcrop": "⌍",
		"dollar": "$",
		"Dopf": "𝔻",
		"dopf": "𝕕",
		"Dot": "¨",
		"dot": "˙",
		"DotDot": "⃜",
		"doteq": "≐",
		"doteqdot": "≑",
		"DotEqual": "≐",
		"dotminus": "∸",
		"dotplus": "∔",
		"dotsquare": "⊡",
		"doublebarwedge": "⌆",
		"DoubleContourIntegral": "∯",
		"DoubleDot": "¨",
		"DoubleDownArrow": "⇓",
		"DoubleLeftArrow": "⇐",
		"DoubleLeftRightArrow": "⇔",
		"DoubleLeftTee": "⫤",
		"DoubleLongLeftArrow": "⟸",
		"DoubleLongLeftRightArrow": "⟺",
		"DoubleLongRightArrow": "⟹",
		"DoubleRightArrow": "⇒",
		"DoubleRightTee": "⊨",
		"DoubleUpArrow": "⇑",
		"DoubleUpDownArrow": "⇕",
		"DoubleVerticalBar": "∥",
		"DownArrowBar": "⤓",
		"downarrow": "↓",
		"DownArrow": "↓",
		"Downarrow": "⇓",
		"DownArrowUpArrow": "⇵",
		"DownBreve": "̑",
		"downdownarrows": "⇊",
		"downharpoonleft": "⇃",
		"downharpoonright": "⇂",
		"DownLeftRightVector": "⥐",
		"DownLeftTeeVector": "⥞",
		"DownLeftVectorBar": "⥖",
		"DownLeftVector": "↽",
		"DownRightTeeVector": "⥟",
		"DownRightVectorBar": "⥗",
		"DownRightVector": "⇁",
		"DownTeeArrow": "↧",
		"DownTee": "⊤",
		"drbkarow": "⤐",
		"drcorn": "⌟",
		"drcrop": "⌌",
		"Dscr": "𝒟",
		"dscr": "𝒹",
		"DScy": "Ѕ",
		"dscy": "ѕ",
		"dsol": "⧶",
		"Dstrok": "Đ",
		"dstrok": "đ",
		"dtdot": "⋱",
		"dtri": "▿",
		"dtrif": "▾",
		"duarr": "⇵",
		"duhar": "⥯",
		"dwangle": "⦦",
		"DZcy": "Џ",
		"dzcy": "џ",
		"dzigrarr": "⟿",
		"Eacute": "É",
		"eacute": "é",
		"easter": "⩮",
		"Ecaron": "Ě",
		"ecaron": "ě",
		"Ecirc": "Ê",
		"ecirc": "ê",
		"ecir": "≖",
		"ecolon": "≕",
		"Ecy": "Э",
		"ecy": "э",
		"eDDot": "⩷",
		"Edot": "Ė",
		"edot": "ė",
		"eDot": "≑",
		"ee": "ⅇ",
		"efDot": "≒",
		"Efr": "𝔈",
		"efr": "𝔢",
		"eg": "⪚",
		"Egrave": "È",
		"egrave": "è",
		"egs": "⪖",
		"egsdot": "⪘",
		"el": "⪙",
		"Element": "∈",
		"elinters": "⏧",
		"ell": "ℓ",
		"els": "⪕",
		"elsdot": "⪗",
		"Emacr": "Ē",
		"emacr": "ē",
		"empty": "∅",
		"emptyset": "∅",
		"EmptySmallSquare": "◻",
		"emptyv": "∅",
		"EmptyVerySmallSquare": "▫",
		"emsp13": " ",
		"emsp14": " ",
		"emsp": " ",
		"ENG": "Ŋ",
		"eng": "ŋ",
		"ensp": " ",
		"Eogon": "Ę",
		"eogon": "ę",
		"Eopf": "𝔼",
		"eopf": "𝕖",
		"epar": "⋕",
		"eparsl": "⧣",
		"eplus": "⩱",
		"epsi": "ε",
		"Epsilon": "Ε",
		"epsilon": "ε",
		"epsiv": "ϵ",
		"eqcirc": "≖",
		"eqcolon": "≕",
		"eqsim": "≂",
		"eqslantgtr": "⪖",
		"eqslantless": "⪕",
		"Equal": "⩵",
		"equals": "=",
		"EqualTilde": "≂",
		"equest": "≟",
		"Equilibrium": "⇌",
		"equiv": "≡",
		"equivDD": "⩸",
		"eqvparsl": "⧥",
		"erarr": "⥱",
		"erDot": "≓",
		"escr": "ℯ",
		"Escr": "ℰ",
		"esdot": "≐",
		"Esim": "⩳",
		"esim": "≂",
		"Eta": "Η",
		"eta": "η",
		"ETH": "Ð",
		"eth": "ð",
		"Euml": "Ë",
		"euml": "ë",
		"euro": "€",
		"excl": "!",
		"exist": "∃",
		"Exists": "∃",
		"expectation": "ℰ",
		"exponentiale": "ⅇ",
		"ExponentialE": "ⅇ",
		"fallingdotseq": "≒",
		"Fcy": "Ф",
		"fcy": "ф",
		"female": "♀",
		"ffilig": "ﬃ",
		"fflig": "ﬀ",
		"ffllig": "ﬄ",
		"Ffr": "𝔉",
		"ffr": "𝔣",
		"filig": "ﬁ",
		"FilledSmallSquare": "◼",
		"FilledVerySmallSquare": "▪",
		"fjlig": "fj",
		"flat": "♭",
		"fllig": "ﬂ",
		"fltns": "▱",
		"fnof": "ƒ",
		"Fopf": "𝔽",
		"fopf": "𝕗",
		"forall": "∀",
		"ForAll": "∀",
		"fork": "⋔",
		"forkv": "⫙",
		"Fouriertrf": "ℱ",
		"fpartint": "⨍",
		"frac12": "½",
		"frac13": "⅓",
		"frac14": "¼",
		"frac15": "⅕",
		"frac16": "⅙",
		"frac18": "⅛",
		"frac23": "⅔",
		"frac25": "⅖",
		"frac34": "¾",
		"frac35": "⅗",
		"frac38": "⅜",
		"frac45": "⅘",
		"frac56": "⅚",
		"frac58": "⅝",
		"frac78": "⅞",
		"frasl": "⁄",
		"frown": "⌢",
		"fscr": "𝒻",
		"Fscr": "ℱ",
		"gacute": "ǵ",
		"Gamma": "Γ",
		"gamma": "γ",
		"Gammad": "Ϝ",
		"gammad": "ϝ",
		"gap": "⪆",
		"Gbreve": "Ğ",
		"gbreve": "ğ",
		"Gcedil": "Ģ",
		"Gcirc": "Ĝ",
		"gcirc": "ĝ",
		"Gcy": "Г",
		"gcy": "г",
		"Gdot": "Ġ",
		"gdot": "ġ",
		"ge": "≥",
		"gE": "≧",
		"gEl": "⪌",
		"gel": "⋛",
		"geq": "≥",
		"geqq": "≧",
		"geqslant": "⩾",
		"gescc": "⪩",
		"ges": "⩾",
		"gesdot": "⪀",
		"gesdoto": "⪂",
		"gesdotol": "⪄",
		"gesl": "⋛︀",
		"gesles": "⪔",
		"Gfr": "𝔊",
		"gfr": "𝔤",
		"gg": "≫",
		"Gg": "⋙",
		"ggg": "⋙",
		"gimel": "ℷ",
		"GJcy": "Ѓ",
		"gjcy": "ѓ",
		"gla": "⪥",
		"gl": "≷",
		"glE": "⪒",
		"glj": "⪤",
		"gnap": "⪊",
		"gnapprox": "⪊",
		"gne": "⪈",
		"gnE": "≩",
		"gneq": "⪈",
		"gneqq": "≩",
		"gnsim": "⋧",
		"Gopf": "𝔾",
		"gopf": "𝕘",
		"grave": "`",
		"GreaterEqual": "≥",
		"GreaterEqualLess": "⋛",
		"GreaterFullEqual": "≧",
		"GreaterGreater": "⪢",
		"GreaterLess": "≷",
		"GreaterSlantEqual": "⩾",
		"GreaterTilde": "≳",
		"Gscr": "𝒢",
		"gscr": "ℊ",
		"gsim": "≳",
		"gsime": "⪎",
		"gsiml": "⪐",
		"gtcc": "⪧",
		"gtcir": "⩺",
		"gt": ">",
		"GT": ">",
		"Gt": "≫",
		"gtdot": "⋗",
		"gtlPar": "⦕",
		"gtquest": "⩼",
		"gtrapprox": "⪆",
		"gtrarr": "⥸",
		"gtrdot": "⋗",
		"gtreqless": "⋛",
		"gtreqqless": "⪌",
		"gtrless": "≷",
		"gtrsim": "≳",
		"gvertneqq": "≩︀",
		"gvnE": "≩︀",
		"Hacek": "ˇ",
		"hairsp": " ",
		"half": "½",
		"hamilt": "ℋ",
		"HARDcy": "Ъ",
		"hardcy": "ъ",
		"harrcir": "⥈",
		"harr": "↔",
		"hArr": "⇔",
		"harrw": "↭",
		"Hat": "^",
		"hbar": "ℏ",
		"Hcirc": "Ĥ",
		"hcirc": "ĥ",
		"hearts": "♥",
		"heartsuit": "♥",
		"hellip": "…",
		"hercon": "⊹",
		"hfr": "𝔥",
		"Hfr": "ℌ",
		"HilbertSpace": "ℋ",
		"hksearow": "⤥",
		"hkswarow": "⤦",
		"hoarr": "⇿",
		"homtht": "∻",
		"hookleftarrow": "↩",
		"hookrightarrow": "↪",
		"hopf": "𝕙",
		"Hopf": "ℍ",
		"horbar": "―",
		"HorizontalLine": "─",
		"hscr": "𝒽",
		"Hscr": "ℋ",
		"hslash": "ℏ",
		"Hstrok": "Ħ",
		"hstrok": "ħ",
		"HumpDownHump": "≎",
		"HumpEqual": "≏",
		"hybull": "⁃",
		"hyphen": "‐",
		"Iacute": "Í",
		"iacute": "í",
		"ic": "⁣",
		"Icirc": "Î",
		"icirc": "î",
		"Icy": "И",
		"icy": "и",
		"Idot": "İ",
		"IEcy": "Е",
		"iecy": "е",
		"iexcl": "¡",
		"iff": "⇔",
		"ifr": "𝔦",
		"Ifr": "ℑ",
		"Igrave": "Ì",
		"igrave": "ì",
		"ii": "ⅈ",
		"iiiint": "⨌",
		"iiint": "∭",
		"iinfin": "⧜",
		"iiota": "℩",
		"IJlig": "Ĳ",
		"ijlig": "ĳ",
		"Imacr": "Ī",
		"imacr": "ī",
		"image": "ℑ",
		"ImaginaryI": "ⅈ",
		"imagline": "ℐ",
		"imagpart": "ℑ",
		"imath": "ı",
		"Im": "ℑ",
		"imof": "⊷",
		"imped": "Ƶ",
		"Implies": "⇒",
		"incare": "℅",
		"in": "∈",
		"infin": "∞",
		"infintie": "⧝",
		"inodot": "ı",
		"intcal": "⊺",
		"int": "∫",
		"Int": "∬",
		"integers": "ℤ",
		"Integral": "∫",
		"intercal": "⊺",
		"Intersection": "⋂",
		"intlarhk": "⨗",
		"intprod": "⨼",
		"InvisibleComma": "⁣",
		"InvisibleTimes": "⁢",
		"IOcy": "Ё",
		"iocy": "ё",
		"Iogon": "Į",
		"iogon": "į",
		"Iopf": "𝕀",
		"iopf": "𝕚",
		"Iota": "Ι",
		"iota": "ι",
		"iprod": "⨼",
		"iquest": "¿",
		"iscr": "𝒾",
		"Iscr": "ℐ",
		"isin": "∈",
		"isindot": "⋵",
		"isinE": "⋹",
		"isins": "⋴",
		"isinsv": "⋳",
		"isinv": "∈",
		"it": "⁢",
		"Itilde": "Ĩ",
		"itilde": "ĩ",
		"Iukcy": "І",
		"iukcy": "і",
		"Iuml": "Ï",
		"iuml": "ï",
		"Jcirc": "Ĵ",
		"jcirc": "ĵ",
		"Jcy": "Й",
		"jcy": "й",
		"Jfr": "𝔍",
		"jfr": "𝔧",
		"jmath": "ȷ",
		"Jopf": "𝕁",
		"jopf": "𝕛",
		"Jscr": "𝒥",
		"jscr": "𝒿",
		"Jsercy": "Ј",
		"jsercy": "ј",
		"Jukcy": "Є",
		"jukcy": "є",
		"Kappa": "Κ",
		"kappa": "κ",
		"kappav": "ϰ",
		"Kcedil": "Ķ",
		"kcedil": "ķ",
		"Kcy": "К",
		"kcy": "к",
		"Kfr": "𝔎",
		"kfr": "𝔨",
		"kgreen": "ĸ",
		"KHcy": "Х",
		"khcy": "х",
		"KJcy": "Ќ",
		"kjcy": "ќ",
		"Kopf": "𝕂",
		"kopf": "𝕜",
		"Kscr": "𝒦",
		"kscr": "𝓀",
		"lAarr": "⇚",
		"Lacute": "Ĺ",
		"lacute": "ĺ",
		"laemptyv": "⦴",
		"lagran": "ℒ",
		"Lambda": "Λ",
		"lambda": "λ",
		"lang": "⟨",
		"Lang": "⟪",
		"langd": "⦑",
		"langle": "⟨",
		"lap": "⪅",
		"Laplacetrf": "ℒ",
		"laquo": "«",
		"larrb": "⇤",
		"larrbfs": "⤟",
		"larr": "←",
		"Larr": "↞",
		"lArr": "⇐",
		"larrfs": "⤝",
		"larrhk": "↩",
		"larrlp": "↫",
		"larrpl": "⤹",
		"larrsim": "⥳",
		"larrtl": "↢",
		"latail": "⤙",
		"lAtail": "⤛",
		"lat": "⪫",
		"late": "⪭",
		"lates": "⪭︀",
		"lbarr": "⤌",
		"lBarr": "⤎",
		"lbbrk": "❲",
		"lbrace": "{",
		"lbrack": "[",
		"lbrke": "⦋",
		"lbrksld": "⦏",
		"lbrkslu": "⦍",
		"Lcaron": "Ľ",
		"lcaron": "ľ",
		"Lcedil": "Ļ",
		"lcedil": "ļ",
		"lceil": "⌈",
		"lcub": "{",
		"Lcy": "Л",
		"lcy": "л",
		"ldca": "⤶",
		"ldquo": "“",
		"ldquor": "„",
		"ldrdhar": "⥧",
		"ldrushar": "⥋",
		"ldsh": "↲",
		"le": "≤",
		"lE": "≦",
		"LeftAngleBracket": "⟨",
		"LeftArrowBar": "⇤",
		"leftarrow": "←",
		"LeftArrow": "←",
		"Leftarrow": "⇐",
		"LeftArrowRightArrow": "⇆",
		"leftarrowtail": "↢",
		"LeftCeiling": "⌈",
		"LeftDoubleBracket": "⟦",
		"LeftDownTeeVector": "⥡",
		"LeftDownVectorBar": "⥙",
		"LeftDownVector": "⇃",
		"LeftFloor": "⌊",
		"leftharpoondown": "↽",
		"leftharpoonup": "↼",
		"leftleftarrows": "⇇",
		"leftrightarrow": "↔",
		"LeftRightArrow": "↔",
		"Leftrightarrow": "⇔",
		"leftrightarrows": "⇆",
		"leftrightharpoons": "⇋",
		"leftrightsquigarrow": "↭",
		"LeftRightVector": "⥎",
		"LeftTeeArrow": "↤",
		"LeftTee": "⊣",
		"LeftTeeVector": "⥚",
		"leftthreetimes": "⋋",
		"LeftTriangleBar": "⧏",
		"LeftTriangle": "⊲",
		"LeftTriangleEqual": "⊴",
		"LeftUpDownVector": "⥑",
		"LeftUpTeeVector": "⥠",
		"LeftUpVectorBar": "⥘",
		"LeftUpVector": "↿",
		"LeftVectorBar": "⥒",
		"LeftVector": "↼",
		"lEg": "⪋",
		"leg": "⋚",
		"leq": "≤",
		"leqq": "≦",
		"leqslant": "⩽",
		"lescc": "⪨",
		"les": "⩽",
		"lesdot": "⩿",
		"lesdoto": "⪁",
		"lesdotor": "⪃",
		"lesg": "⋚︀",
		"lesges": "⪓",
		"lessapprox": "⪅",
		"lessdot": "⋖",
		"lesseqgtr": "⋚",
		"lesseqqgtr": "⪋",
		"LessEqualGreater": "⋚",
		"LessFullEqual": "≦",
		"LessGreater": "≶",
		"lessgtr": "≶",
		"LessLess": "⪡",
		"lesssim": "≲",
		"LessSlantEqual": "⩽",
		"LessTilde": "≲",
		"lfisht": "⥼",
		"lfloor": "⌊",
		"Lfr": "𝔏",
		"lfr": "𝔩",
		"lg": "≶",
		"lgE": "⪑",
		"lHar": "⥢",
		"lhard": "↽",
		"lharu": "↼",
		"lharul": "⥪",
		"lhblk": "▄",
		"LJcy": "Љ",
		"ljcy": "љ",
		"llarr": "⇇",
		"ll": "≪",
		"Ll": "⋘",
		"llcorner": "⌞",
		"Lleftarrow": "⇚",
		"llhard": "⥫",
		"lltri": "◺",
		"Lmidot": "Ŀ",
		"lmidot": "ŀ",
		"lmoustache": "⎰",
		"lmoust": "⎰",
		"lnap": "⪉",
		"lnapprox": "⪉",
		"lne": "⪇",
		"lnE": "≨",
		"lneq": "⪇",
		"lneqq": "≨",
		"lnsim": "⋦",
		"loang": "⟬",
		"loarr": "⇽",
		"lobrk": "⟦",
		"longleftarrow": "⟵",
		"LongLeftArrow": "⟵",
		"Longleftarrow": "⟸",
		"longleftrightarrow": "⟷",
		"LongLeftRightArrow": "⟷",
		"Longleftrightarrow": "⟺",
		"longmapsto": "⟼",
		"longrightarrow": "⟶",
		"LongRightArrow": "⟶",
		"Longrightarrow": "⟹",
		"looparrowleft": "↫",
		"looparrowright": "↬",
		"lopar": "⦅",
		"Lopf": "𝕃",
		"lopf": "𝕝",
		"loplus": "⨭",
		"lotimes": "⨴",
		"lowast": "∗",
		"lowbar": "_",
		"LowerLeftArrow": "↙",
		"LowerRightArrow": "↘",
		"loz": "◊",
		"lozenge": "◊",
		"lozf": "⧫",
		"lpar": "(",
		"lparlt": "⦓",
		"lrarr": "⇆",
		"lrcorner": "⌟",
		"lrhar": "⇋",
		"lrhard": "⥭",
		"lrm": "‎",
		"lrtri": "⊿",
		"lsaquo": "‹",
		"lscr": "𝓁",
		"Lscr": "ℒ",
		"lsh": "↰",
		"Lsh": "↰",
		"lsim": "≲",
		"lsime": "⪍",
		"lsimg": "⪏",
		"lsqb": "[",
		"lsquo": "‘",
		"lsquor": "‚",
		"Lstrok": "Ł",
		"lstrok": "ł",
		"ltcc": "⪦",
		"ltcir": "⩹",
		"lt": "<",
		"LT": "<",
		"Lt": "≪",
		"ltdot": "⋖",
		"lthree": "⋋",
		"ltimes": "⋉",
		"ltlarr": "⥶",
		"ltquest": "⩻",
		"ltri": "◃",
		"ltrie": "⊴",
		"ltrif": "◂",
		"ltrPar": "⦖",
		"lurdshar": "⥊",
		"luruhar": "⥦",
		"lvertneqq": "≨︀",
		"lvnE": "≨︀",
		"macr": "¯",
		"male": "♂",
		"malt": "✠",
		"maltese": "✠",
		"Map": "⤅",
		"map": "↦",
		"mapsto": "↦",
		"mapstodown": "↧",
		"mapstoleft": "↤",
		"mapstoup": "↥",
		"marker": "▮",
		"mcomma": "⨩",
		"Mcy": "М",
		"mcy": "м",
		"mdash": "—",
		"mDDot": "∺",
		"measuredangle": "∡",
		"MediumSpace": " ",
		"Mellintrf": "ℳ",
		"Mfr": "𝔐",
		"mfr": "𝔪",
		"mho": "℧",
		"micro": "µ",
		"midast": "*",
		"midcir": "⫰",
		"mid": "∣",
		"middot": "·",
		"minusb": "⊟",
		"minus": "−",
		"minusd": "∸",
		"minusdu": "⨪",
		"MinusPlus": "∓",
		"mlcp": "⫛",
		"mldr": "…",
		"mnplus": "∓",
		"models": "⊧",
		"Mopf": "𝕄",
		"mopf": "𝕞",
		"mp": "∓",
		"mscr": "𝓂",
		"Mscr": "ℳ",
		"mstpos": "∾",
		"Mu": "Μ",
		"mu": "μ",
		"multimap": "⊸",
		"mumap": "⊸",
		"nabla": "∇",
		"Nacute": "Ń",
		"nacute": "ń",
		"nang": "∠⃒",
		"nap": "≉",
		"napE": "⩰̸",
		"napid": "≋̸",
		"napos": "ŉ",
		"napprox": "≉",
		"natural": "♮",
		"naturals": "ℕ",
		"natur": "♮",
		"nbsp": " ",
		"nbump": "≎̸",
		"nbumpe": "≏̸",
		"ncap": "⩃",
		"Ncaron": "Ň",
		"ncaron": "ň",
		"Ncedil": "Ņ",
		"ncedil": "ņ",
		"ncong": "≇",
		"ncongdot": "⩭̸",
		"ncup": "⩂",
		"Ncy": "Н",
		"ncy": "н",
		"ndash": "–",
		"nearhk": "⤤",
		"nearr": "↗",
		"neArr": "⇗",
		"nearrow": "↗",
		"ne": "≠",
		"nedot": "≐̸",
		"NegativeMediumSpace": "​",
		"NegativeThickSpace": "​",
		"NegativeThinSpace": "​",
		"NegativeVeryThinSpace": "​",
		"nequiv": "≢",
		"nesear": "⤨",
		"nesim": "≂̸",
		"NestedGreaterGreater": "≫",
		"NestedLessLess": "≪",
		"NewLine": "\n",
		"nexist": "∄",
		"nexists": "∄",
		"Nfr": "𝔑",
		"nfr": "𝔫",
		"ngE": "≧̸",
		"nge": "≱",
		"ngeq": "≱",
		"ngeqq": "≧̸",
		"ngeqslant": "⩾̸",
		"nges": "⩾̸",
		"nGg": "⋙̸",
		"ngsim": "≵",
		"nGt": "≫⃒",
		"ngt": "≯",
		"ngtr": "≯",
		"nGtv": "≫̸",
		"nharr": "↮",
		"nhArr": "⇎",
		"nhpar": "⫲",
		"ni": "∋",
		"nis": "⋼",
		"nisd": "⋺",
		"niv": "∋",
		"NJcy": "Њ",
		"njcy": "њ",
		"nlarr": "↚",
		"nlArr": "⇍",
		"nldr": "‥",
		"nlE": "≦̸",
		"nle": "≰",
		"nleftarrow": "↚",
		"nLeftarrow": "⇍",
		"nleftrightarrow": "↮",
		"nLeftrightarrow": "⇎",
		"nleq": "≰",
		"nleqq": "≦̸",
		"nleqslant": "⩽̸",
		"nles": "⩽̸",
		"nless": "≮",
		"nLl": "⋘̸",
		"nlsim": "≴",
		"nLt": "≪⃒",
		"nlt": "≮",
		"nltri": "⋪",
		"nltrie": "⋬",
		"nLtv": "≪̸",
		"nmid": "∤",
		"NoBreak": "⁠",
		"NonBreakingSpace": " ",
		"nopf": "𝕟",
		"Nopf": "ℕ",
		"Not": "⫬",
		"not": "¬",
		"NotCongruent": "≢",
		"NotCupCap": "≭",
		"NotDoubleVerticalBar": "∦",
		"NotElement": "∉",
		"NotEqual": "≠",
		"NotEqualTilde": "≂̸",
		"NotExists": "∄",
		"NotGreater": "≯",
		"NotGreaterEqual": "≱",
		"NotGreaterFullEqual": "≧̸",
		"NotGreaterGreater": "≫̸",
		"NotGreaterLess": "≹",
		"NotGreaterSlantEqual": "⩾̸",
		"NotGreaterTilde": "≵",
		"NotHumpDownHump": "≎̸",
		"NotHumpEqual": "≏̸",
		"notin": "∉",
		"notindot": "⋵̸",
		"notinE": "⋹̸",
		"notinva": "∉",
		"notinvb": "⋷",
		"notinvc": "⋶",
		"NotLeftTriangleBar": "⧏̸",
		"NotLeftTriangle": "⋪",
		"NotLeftTriangleEqual": "⋬",
		"NotLess": "≮",
		"NotLessEqual": "≰",
		"NotLessGreater": "≸",
		"NotLessLess": "≪̸",
		"NotLessSlantEqual": "⩽̸",
		"NotLessTilde": "≴",
		"NotNestedGreaterGreater": "⪢̸",
		"NotNestedLessLess": "⪡̸",
		"notni": "∌",
		"notniva": "∌",
		"notnivb": "⋾",
		"notnivc": "⋽",
		"NotPrecedes": "⊀",
		"NotPrecedesEqual": "⪯̸",
		"NotPrecedesSlantEqual": "⋠",
		"NotReverseElement": "∌",
		"NotRightTriangleBar": "⧐̸",
		"NotRightTriangle": "⋫",
		"NotRightTriangleEqual": "⋭",
		"NotSquareSubset": "⊏̸",
		"NotSquareSubsetEqual": "⋢",
		"NotSquareSuperset": "⊐̸",
		"NotSquareSupersetEqual": "⋣",
		"NotSubset": "⊂⃒",
		"NotSubsetEqual": "⊈",
		"NotSucceeds": "⊁",
		"NotSucceedsEqual": "⪰̸",
		"NotSucceedsSlantEqual": "⋡",
		"NotSucceedsTilde": "≿̸",
		"NotSuperset": "⊃⃒",
		"NotSupersetEqual": "⊉",
		"NotTilde": "≁",
		"NotTildeEqual": "≄",
		"NotTildeFullEqual": "≇",
		"NotTildeTilde": "≉",
		"NotVerticalBar": "∤",
		"nparallel": "∦",
		"npar": "∦",
		"nparsl": "⫽⃥",
		"npart": "∂̸",
		"npolint": "⨔",
		"npr": "⊀",
		"nprcue": "⋠",
		"nprec": "⊀",
		"npreceq": "⪯̸",
		"npre": "⪯̸",
		"nrarrc": "⤳̸",
		"nrarr": "↛",
		"nrArr": "⇏",
		"nrarrw": "↝̸",
		"nrightarrow": "↛",
		"nRightarrow": "⇏",
		"nrtri": "⋫",
		"nrtrie": "⋭",
		"nsc": "⊁",
		"nsccue": "⋡",
		"nsce": "⪰̸",
		"Nscr": "𝒩",
		"nscr": "𝓃",
		"nshortmid": "∤",
		"nshortparallel": "∦",
		"nsim": "≁",
		"nsime": "≄",
		"nsimeq": "≄",
		"nsmid": "∤",
		"nspar": "∦",
		"nsqsube": "⋢",
		"nsqsupe": "⋣",
		"nsub": "⊄",
		"nsubE": "⫅̸",
		"nsube": "⊈",
		"nsubset": "⊂⃒",
		"nsubseteq": "⊈",
		"nsubseteqq": "⫅̸",
		"nsucc": "⊁",
		"nsucceq": "⪰̸",
		"nsup": "⊅",
		"nsupE": "⫆̸",
		"nsupe": "⊉",
		"nsupset": "⊃⃒",
		"nsupseteq": "⊉",
		"nsupseteqq": "⫆̸",
		"ntgl": "≹",
		"Ntilde": "Ñ",
		"ntilde": "ñ",
		"ntlg": "≸",
		"ntriangleleft": "⋪",
		"ntrianglelefteq": "⋬",
		"ntriangleright": "⋫",
		"ntrianglerighteq": "⋭",
		"Nu": "Ν",
		"nu": "ν",
		"num": "#",
		"numero": "№",
		"numsp": " ",
		"nvap": "≍⃒",
		"nvdash": "⊬",
		"nvDash": "⊭",
		"nVdash": "⊮",
		"nVDash": "⊯",
		"nvge": "≥⃒",
		"nvgt": ">⃒",
		"nvHarr": "⤄",
		"nvinfin": "⧞",
		"nvlArr": "⤂",
		"nvle": "≤⃒",
		"nvlt": "<⃒",
		"nvltrie": "⊴⃒",
		"nvrArr": "⤃",
		"nvrtrie": "⊵⃒",
		"nvsim": "∼⃒",
		"nwarhk": "⤣",
		"nwarr": "↖",
		"nwArr": "⇖",
		"nwarrow": "↖",
		"nwnear": "⤧",
		"Oacute": "Ó",
		"oacute": "ó",
		"oast": "⊛",
		"Ocirc": "Ô",
		"ocirc": "ô",
		"ocir": "⊚",
		"Ocy": "О",
		"ocy": "о",
		"odash": "⊝",
		"Odblac": "Ő",
		"odblac": "ő",
		"odiv": "⨸",
		"odot": "⊙",
		"odsold": "⦼",
		"OElig": "Œ",
		"oelig": "œ",
		"ofcir": "⦿",
		"Ofr": "𝔒",
		"ofr": "𝔬",
		"ogon": "˛",
		"Ograve": "Ò",
		"ograve": "ò",
		"ogt": "⧁",
		"ohbar": "⦵",
		"ohm": "Ω",
		"oint": "∮",
		"olarr": "↺",
		"olcir": "⦾",
		"olcross": "⦻",
		"oline": "‾",
		"olt": "⧀",
		"Omacr": "Ō",
		"omacr": "ō",
		"Omega": "Ω",
		"omega": "ω",
		"Omicron": "Ο",
		"omicron": "ο",
		"omid": "⦶",
		"ominus": "⊖",
		"Oopf": "𝕆",
		"oopf": "𝕠",
		"opar": "⦷",
		"OpenCurlyDoubleQuote": "“",
		"OpenCurlyQuote": "‘",
		"operp": "⦹",
		"oplus": "⊕",
		"orarr": "↻",
		"Or": "⩔",
		"or": "∨",
		"ord": "⩝",
		"order": "ℴ",
		"orderof": "ℴ",
		"ordf": "ª",
		"ordm": "º",
		"origof": "⊶",
		"oror": "⩖",
		"orslope": "⩗",
		"orv": "⩛",
		"oS": "Ⓢ",
		"Oscr": "𝒪",
		"oscr": "ℴ",
		"Oslash": "Ø",
		"oslash": "ø",
		"osol": "⊘",
		"Otilde": "Õ",
		"otilde": "õ",
		"otimesas": "⨶",
		"Otimes": "⨷",
		"otimes": "⊗",
		"Ouml": "Ö",
		"ouml": "ö",
		"ovbar": "⌽",
		"OverBar": "‾",
		"OverBrace": "⏞",
		"OverBracket": "⎴",
		"OverParenthesis": "⏜",
		"para": "¶",
		"parallel": "∥",
		"par": "∥",
		"parsim": "⫳",
		"parsl": "⫽",
		"part": "∂",
		"PartialD": "∂",
		"Pcy": "П",
		"pcy": "п",
		"percnt": "%",
		"period": ".",
		"permil": "‰",
		"perp": "⊥",
		"pertenk": "‱",
		"Pfr": "𝔓",
		"pfr": "𝔭",
		"Phi": "Φ",
		"phi": "φ",
		"phiv": "ϕ",
		"phmmat": "ℳ",
		"phone": "☎",
		"Pi": "Π",
		"pi": "π",
		"pitchfork": "⋔",
		"piv": "ϖ",
		"planck": "ℏ",
		"planckh": "ℎ",
		"plankv": "ℏ",
		"plusacir": "⨣",
		"plusb": "⊞",
		"pluscir": "⨢",
		"plus": "+",
		"plusdo": "∔",
		"plusdu": "⨥",
		"pluse": "⩲",
		"PlusMinus": "±",
		"plusmn": "±",
		"plussim": "⨦",
		"plustwo": "⨧",
		"pm": "±",
		"Poincareplane": "ℌ",
		"pointint": "⨕",
		"popf": "𝕡",
		"Popf": "ℙ",
		"pound": "£",
		"prap": "⪷",
		"Pr": "⪻",
		"pr": "≺",
		"prcue": "≼",
		"precapprox": "⪷",
		"prec": "≺",
		"preccurlyeq": "≼",
		"Precedes": "≺",
		"PrecedesEqual": "⪯",
		"PrecedesSlantEqual": "≼",
		"PrecedesTilde": "≾",
		"preceq": "⪯",
		"precnapprox": "⪹",
		"precneqq": "⪵",
		"precnsim": "⋨",
		"pre": "⪯",
		"prE": "⪳",
		"precsim": "≾",
		"prime": "′",
		"Prime": "″",
		"primes": "ℙ",
		"prnap": "⪹",
		"prnE": "⪵",
		"prnsim": "⋨",
		"prod": "∏",
		"Product": "∏",
		"profalar": "⌮",
		"profline": "⌒",
		"profsurf": "⌓",
		"prop": "∝",
		"Proportional": "∝",
		"Proportion": "∷",
		"propto": "∝",
		"prsim": "≾",
		"prurel": "⊰",
		"Pscr": "𝒫",
		"pscr": "𝓅",
		"Psi": "Ψ",
		"psi": "ψ",
		"puncsp": " ",
		"Qfr": "𝔔",
		"qfr": "𝔮",
		"qint": "⨌",
		"qopf": "𝕢",
		"Qopf": "ℚ",
		"qprime": "⁗",
		"Qscr": "𝒬",
		"qscr": "𝓆",
		"quaternions": "ℍ",
		"quatint": "⨖",
		"quest": "?",
		"questeq": "≟",
		"quot": "\"",
		"QUOT": "\"",
		"rAarr": "⇛",
		"race": "∽̱",
		"Racute": "Ŕ",
		"racute": "ŕ",
		"radic": "√",
		"raemptyv": "⦳",
		"rang": "⟩",
		"Rang": "⟫",
		"rangd": "⦒",
		"range": "⦥",
		"rangle": "⟩",
		"raquo": "»",
		"rarrap": "⥵",
		"rarrb": "⇥",
		"rarrbfs": "⤠",
		"rarrc": "⤳",
		"rarr": "→",
		"Rarr": "↠",
		"rArr": "⇒",
		"rarrfs": "⤞",
		"rarrhk": "↪",
		"rarrlp": "↬",
		"rarrpl": "⥅",
		"rarrsim": "⥴",
		"Rarrtl": "⤖",
		"rarrtl": "↣",
		"rarrw": "↝",
		"ratail": "⤚",
		"rAtail": "⤜",
		"ratio": "∶",
		"rationals": "ℚ",
		"rbarr": "⤍",
		"rBarr": "⤏",
		"RBarr": "⤐",
		"rbbrk": "❳",
		"rbrace": "}",
		"rbrack": "]",
		"rbrke": "⦌",
		"rbrksld": "⦎",
		"rbrkslu": "⦐",
		"Rcaron": "Ř",
		"rcaron": "ř",
		"Rcedil": "Ŗ",
		"rcedil": "ŗ",
		"rceil": "⌉",
		"rcub": "}",
		"Rcy": "Р",
		"rcy": "р",
		"rdca": "⤷",
		"rdldhar": "⥩",
		"rdquo": "”",
		"rdquor": "”",
		"rdsh": "↳",
		"real": "ℜ",
		"realine": "ℛ",
		"realpart": "ℜ",
		"reals": "ℝ",
		"Re": "ℜ",
		"rect": "▭",
		"reg": "®",
		"REG": "®",
		"ReverseElement": "∋",
		"ReverseEquilibrium": "⇋",
		"ReverseUpEquilibrium": "⥯",
		"rfisht": "⥽",
		"rfloor": "⌋",
		"rfr": "𝔯",
		"Rfr": "ℜ",
		"rHar": "⥤",
		"rhard": "⇁",
		"rharu": "⇀",
		"rharul": "⥬",
		"Rho": "Ρ",
		"rho": "ρ",
		"rhov": "ϱ",
		"RightAngleBracket": "⟩",
		"RightArrowBar": "⇥",
		"rightarrow": "→",
		"RightArrow": "→",
		"Rightarrow": "⇒",
		"RightArrowLeftArrow": "⇄",
		"rightarrowtail": "↣",
		"RightCeiling": "⌉",
		"RightDoubleBracket": "⟧",
		"RightDownTeeVector": "⥝",
		"RightDownVectorBar": "⥕",
		"RightDownVector": "⇂",
		"RightFloor": "⌋",
		"rightharpoondown": "⇁",
		"rightharpoonup": "⇀",
		"rightleftarrows": "⇄",
		"rightleftharpoons": "⇌",
		"rightrightarrows": "⇉",
		"rightsquigarrow": "↝",
		"RightTeeArrow": "↦",
		"RightTee": "⊢",
		"RightTeeVector": "⥛",
		"rightthreetimes": "⋌",
		"RightTriangleBar": "⧐",
		"RightTriangle": "⊳",
		"RightTriangleEqual": "⊵",
		"RightUpDownVector": "⥏",
		"RightUpTeeVector": "⥜",
		"RightUpVectorBar": "⥔",
		"RightUpVector": "↾",
		"RightVectorBar": "⥓",
		"RightVector": "⇀",
		"ring": "˚",
		"risingdotseq": "≓",
		"rlarr": "⇄",
		"rlhar": "⇌",
		"rlm": "‏",
		"rmoustache": "⎱",
		"rmoust": "⎱",
		"rnmid": "⫮",
		"roang": "⟭",
		"roarr": "⇾",
		"robrk": "⟧",
		"ropar": "⦆",
		"ropf": "𝕣",
		"Ropf": "ℝ",
		"roplus": "⨮",
		"rotimes": "⨵",
		"RoundImplies": "⥰",
		"rpar": ")",
		"rpargt": "⦔",
		"rppolint": "⨒",
		"rrarr": "⇉",
		"Rrightarrow": "⇛",
		"rsaquo": "›",
		"rscr": "𝓇",
		"Rscr": "ℛ",
		"rsh": "↱",
		"Rsh": "↱",
		"rsqb": "]",
		"rsquo": "’",
		"rsquor": "’",
		"rthree": "⋌",
		"rtimes": "⋊",
		"rtri": "▹",
		"rtrie": "⊵",
		"rtrif": "▸",
		"rtriltri": "⧎",
		"RuleDelayed": "⧴",
		"ruluhar": "⥨",
		"rx": "℞",
		"Sacute": "Ś",
		"sacute": "ś",
		"sbquo": "‚",
		"scap": "⪸",
		"Scaron": "Š",
		"scaron": "š",
		"Sc": "⪼",
		"sc": "≻",
		"sccue": "≽",
		"sce": "⪰",
		"scE": "⪴",
		"Scedil": "Ş",
		"scedil": "ş",
		"Scirc": "Ŝ",
		"scirc": "ŝ",
		"scnap": "⪺",
		"scnE": "⪶",
		"scnsim": "⋩",
		"scpolint": "⨓",
		"scsim": "≿",
		"Scy": "С",
		"scy": "с",
		"sdotb": "⊡",
		"sdot": "⋅",
		"sdote": "⩦",
		"searhk": "⤥",
		"searr": "↘",
		"seArr": "⇘",
		"searrow": "↘",
		"sect": "§",
		"semi": ";",
		"seswar": "⤩",
		"setminus": "∖",
		"setmn": "∖",
		"sext": "✶",
		"Sfr": "𝔖",
		"sfr": "𝔰",
		"sfrown": "⌢",
		"sharp": "♯",
		"SHCHcy": "Щ",
		"shchcy": "щ",
		"SHcy": "Ш",
		"shcy": "ш",
		"ShortDownArrow": "↓",
		"ShortLeftArrow": "←",
		"shortmid": "∣",
		"shortparallel": "∥",
		"ShortRightArrow": "→",
		"ShortUpArrow": "↑",
		"shy": "­",
		"Sigma": "Σ",
		"sigma": "σ",
		"sigmaf": "ς",
		"sigmav": "ς",
		"sim": "∼",
		"simdot": "⩪",
		"sime": "≃",
		"simeq": "≃",
		"simg": "⪞",
		"simgE": "⪠",
		"siml": "⪝",
		"simlE": "⪟",
		"simne": "≆",
		"simplus": "⨤",
		"simrarr": "⥲",
		"slarr": "←",
		"SmallCircle": "∘",
		"smallsetminus": "∖",
		"smashp": "⨳",
		"smeparsl": "⧤",
		"smid": "∣",
		"smile": "⌣",
		"smt": "⪪",
		"smte": "⪬",
		"smtes": "⪬︀",
		"SOFTcy": "Ь",
		"softcy": "ь",
		"solbar": "⌿",
		"solb": "⧄",
		"sol": "/",
		"Sopf": "𝕊",
		"sopf": "𝕤",
		"spades": "♠",
		"spadesuit": "♠",
		"spar": "∥",
		"sqcap": "⊓",
		"sqcaps": "⊓︀",
		"sqcup": "⊔",
		"sqcups": "⊔︀",
		"Sqrt": "√",
		"sqsub": "⊏",
		"sqsube": "⊑",
		"sqsubset": "⊏",
		"sqsubseteq": "⊑",
		"sqsup": "⊐",
		"sqsupe": "⊒",
		"sqsupset": "⊐",
		"sqsupseteq": "⊒",
		"square": "□",
		"Square": "□",
		"SquareIntersection": "⊓",
		"SquareSubset": "⊏",
		"SquareSubsetEqual": "⊑",
		"SquareSuperset": "⊐",
		"SquareSupersetEqual": "⊒",
		"SquareUnion": "⊔",
		"squarf": "▪",
		"squ": "□",
		"squf": "▪",
		"srarr": "→",
		"Sscr": "𝒮",
		"sscr": "𝓈",
		"ssetmn": "∖",
		"ssmile": "⌣",
		"sstarf": "⋆",
		"Star": "⋆",
		"star": "☆",
		"starf": "★",
		"straightepsilon": "ϵ",
		"straightphi": "ϕ",
		"strns": "¯",
		"sub": "⊂",
		"Sub": "⋐",
		"subdot": "⪽",
		"subE": "⫅",
		"sube": "⊆",
		"subedot": "⫃",
		"submult": "⫁",
		"subnE": "⫋",
		"subne": "⊊",
		"subplus": "⪿",
		"subrarr": "⥹",
		"subset": "⊂",
		"Subset": "⋐",
		"subseteq": "⊆",
		"subseteqq": "⫅",
		"SubsetEqual": "⊆",
		"subsetneq": "⊊",
		"subsetneqq": "⫋",
		"subsim": "⫇",
		"subsub": "⫕",
		"subsup": "⫓",
		"succapprox": "⪸",
		"succ": "≻",
		"succcurlyeq": "≽",
		"Succeeds": "≻",
		"SucceedsEqual": "⪰",
		"SucceedsSlantEqual": "≽",
		"SucceedsTilde": "≿",
		"succeq": "⪰",
		"succnapprox": "⪺",
		"succneqq": "⪶",
		"succnsim": "⋩",
		"succsim": "≿",
		"SuchThat": "∋",
		"sum": "∑",
		"Sum": "∑",
		"sung": "♪",
		"sup1": "¹",
		"sup2": "²",
		"sup3": "³",
		"sup": "⊃",
		"Sup": "⋑",
		"supdot": "⪾",
		"supdsub": "⫘",
		"supE": "⫆",
		"supe": "⊇",
		"supedot": "⫄",
		"Superset": "⊃",
		"SupersetEqual": "⊇",
		"suphsol": "⟉",
		"suphsub": "⫗",
		"suplarr": "⥻",
		"supmult": "⫂",
		"supnE": "⫌",
		"supne": "⊋",
		"supplus": "⫀",
		"supset": "⊃",
		"Supset": "⋑",
		"supseteq": "⊇",
		"supseteqq": "⫆",
		"supsetneq": "⊋",
		"supsetneqq": "⫌",
		"supsim": "⫈",
		"supsub": "⫔",
		"supsup": "⫖",
		"swarhk": "⤦",
		"swarr": "↙",
		"swArr": "⇙",
		"swarrow": "↙",
		"swnwar": "⤪",
		"szlig": "ß",
		"Tab": "\t",
		"target": "⌖",
		"Tau": "Τ",
		"tau": "τ",
		"tbrk": "⎴",
		"Tcaron": "Ť",
		"tcaron": "ť",
		"Tcedil": "Ţ",
		"tcedil": "ţ",
		"Tcy": "Т",
		"tcy": "т",
		"tdot": "⃛",
		"telrec": "⌕",
		"Tfr": "𝔗",
		"tfr": "𝔱",
		"there4": "∴",
		"therefore": "∴",
		"Therefore": "∴",
		"Theta": "Θ",
		"theta": "θ",
		"thetasym": "ϑ",
		"thetav": "ϑ",
		"thickapprox": "≈",
		"thicksim": "∼",
		"ThickSpace": "  ",
		"ThinSpace": " ",
		"thinsp": " ",
		"thkap": "≈",
		"thksim": "∼",
		"THORN": "Þ",
		"thorn": "þ",
		"tilde": "˜",
		"Tilde": "∼",
		"TildeEqual": "≃",
		"TildeFullEqual": "≅",
		"TildeTilde": "≈",
		"timesbar": "⨱",
		"timesb": "⊠",
		"times": "×",
		"timesd": "⨰",
		"tint": "∭",
		"toea": "⤨",
		"topbot": "⌶",
		"topcir": "⫱",
		"top": "⊤",
		"Topf": "𝕋",
		"topf": "𝕥",
		"topfork": "⫚",
		"tosa": "⤩",
		"tprime": "‴",
		"trade": "™",
		"TRADE": "™",
		"triangle": "▵",
		"triangledown": "▿",
		"triangleleft": "◃",
		"trianglelefteq": "⊴",
		"triangleq": "≜",
		"triangleright": "▹",
		"trianglerighteq": "⊵",
		"tridot": "◬",
		"trie": "≜",
		"triminus": "⨺",
		"TripleDot": "⃛",
		"triplus": "⨹",
		"trisb": "⧍",
		"tritime": "⨻",
		"trpezium": "⏢",
		"Tscr": "𝒯",
		"tscr": "𝓉",
		"TScy": "Ц",
		"tscy": "ц",
		"TSHcy": "Ћ",
		"tshcy": "ћ",
		"Tstrok": "Ŧ",
		"tstrok": "ŧ",
		"twixt": "≬",
		"twoheadleftarrow": "↞",
		"twoheadrightarrow": "↠",
		"Uacute": "Ú",
		"uacute": "ú",
		"uarr": "↑",
		"Uarr": "↟",
		"uArr": "⇑",
		"Uarrocir": "⥉",
		"Ubrcy": "Ў",
		"ubrcy": "ў",
		"Ubreve": "Ŭ",
		"ubreve": "ŭ",
		"Ucirc": "Û",
		"ucirc": "û",
		"Ucy": "У",
		"ucy": "у",
		"udarr": "⇅",
		"Udblac": "Ű",
		"udblac": "ű",
		"udhar": "⥮",
		"ufisht": "⥾",
		"Ufr": "𝔘",
		"ufr": "𝔲",
		"Ugrave": "Ù",
		"ugrave": "ù",
		"uHar": "⥣",
		"uharl": "↿",
		"uharr": "↾",
		"uhblk": "▀",
		"ulcorn": "⌜",
		"ulcorner": "⌜",
		"ulcrop": "⌏",
		"ultri": "◸",
		"Umacr": "Ū",
		"umacr": "ū",
		"uml": "¨",
		"UnderBar": "_",
		"UnderBrace": "⏟",
		"UnderBracket": "⎵",
		"UnderParenthesis": "⏝",
		"Union": "⋃",
		"UnionPlus": "⊎",
		"Uogon": "Ų",
		"uogon": "ų",
		"Uopf": "𝕌",
		"uopf": "𝕦",
		"UpArrowBar": "⤒",
		"uparrow": "↑",
		"UpArrow": "↑",
		"Uparrow": "⇑",
		"UpArrowDownArrow": "⇅",
		"updownarrow": "↕",
		"UpDownArrow": "↕",
		"Updownarrow": "⇕",
		"UpEquilibrium": "⥮",
		"upharpoonleft": "↿",
		"upharpoonright": "↾",
		"uplus": "⊎",
		"UpperLeftArrow": "↖",
		"UpperRightArrow": "↗",
		"upsi": "υ",
		"Upsi": "ϒ",
		"upsih": "ϒ",
		"Upsilon": "Υ",
		"upsilon": "υ",
		"UpTeeArrow": "↥",
		"UpTee": "⊥",
		"upuparrows": "⇈",
		"urcorn": "⌝",
		"urcorner": "⌝",
		"urcrop": "⌎",
		"Uring": "Ů",
		"uring": "ů",
		"urtri": "◹",
		"Uscr": "𝒰",
		"uscr": "𝓊",
		"utdot": "⋰",
		"Utilde": "Ũ",
		"utilde": "ũ",
		"utri": "▵",
		"utrif": "▴",
		"uuarr": "⇈",
		"Uuml": "Ü",
		"uuml": "ü",
		"uwangle": "⦧",
		"vangrt": "⦜",
		"varepsilon": "ϵ",
		"varkappa": "ϰ",
		"varnothing": "∅",
		"varphi": "ϕ",
		"varpi": "ϖ",
		"varpropto": "∝",
		"varr": "↕",
		"vArr": "⇕",
		"varrho": "ϱ",
		"varsigma": "ς",
		"varsubsetneq": "⊊︀",
		"varsubsetneqq": "⫋︀",
		"varsupsetneq": "⊋︀",
		"varsupsetneqq": "⫌︀",
		"vartheta": "ϑ",
		"vartriangleleft": "⊲",
		"vartriangleright": "⊳",
		"vBar": "⫨",
		"Vbar": "⫫",
		"vBarv": "⫩",
		"Vcy": "В",
		"vcy": "в",
		"vdash": "⊢",
		"vDash": "⊨",
		"Vdash": "⊩",
		"VDash": "⊫",
		"Vdashl": "⫦",
		"veebar": "⊻",
		"vee": "∨",
		"Vee": "⋁",
		"veeeq": "≚",
		"vellip": "⋮",
		"verbar": "|",
		"Verbar": "‖",
		"vert": "|",
		"Vert": "‖",
		"VerticalBar": "∣",
		"VerticalLine": "|",
		"VerticalSeparator": "❘",
		"VerticalTilde": "≀",
		"VeryThinSpace": " ",
		"Vfr": "𝔙",
		"vfr": "𝔳",
		"vltri": "⊲",
		"vnsub": "⊂⃒",
		"vnsup": "⊃⃒",
		"Vopf": "𝕍",
		"vopf": "𝕧",
		"vprop": "∝",
		"vrtri": "⊳",
		"Vscr": "𝒱",
		"vscr": "𝓋",
		"vsubnE": "⫋︀",
		"vsubne": "⊊︀",
		"vsupnE": "⫌︀",
		"vsupne": "⊋︀",
		"Vvdash": "⊪",
		"vzigzag": "⦚",
		"Wcirc": "Ŵ",
		"wcirc": "ŵ",
		"wedbar": "⩟",
		"wedge": "∧",
		"Wedge": "⋀",
		"wedgeq": "≙",
		"weierp": "℘",
		"Wfr": "𝔚",
		"wfr": "𝔴",
		"Wopf": "𝕎",
		"wopf": "𝕨",
		"wp": "℘",
		"wr": "≀",
		"wreath": "≀",
		"Wscr": "𝒲",
		"wscr": "𝓌",
		"xcap": "⋂",
		"xcirc": "◯",
		"xcup": "⋃",
		"xdtri": "▽",
		"Xfr": "𝔛",
		"xfr": "𝔵",
		"xharr": "⟷",
		"xhArr": "⟺",
		"Xi": "Ξ",
		"xi": "ξ",
		"xlarr": "⟵",
		"xlArr": "⟸",
		"xmap": "⟼",
		"xnis": "⋻",
		"xodot": "⨀",
		"Xopf": "𝕏",
		"xopf": "𝕩",
		"xoplus": "⨁",
		"xotime": "⨂",
		"xrarr": "⟶",
		"xrArr": "⟹",
		"Xscr": "𝒳",
		"xscr": "𝓍",
		"xsqcup": "⨆",
		"xuplus": "⨄",
		"xutri": "△",
		"xvee": "⋁",
		"xwedge": "⋀",
		"Yacute": "Ý",
		"yacute": "ý",
		"YAcy": "Я",
		"yacy": "я",
		"Ycirc": "Ŷ",
		"ycirc": "ŷ",
		"Ycy": "Ы",
		"ycy": "ы",
		"yen": "¥",
		"Yfr": "𝔜",
		"yfr": "𝔶",
		"YIcy": "Ї",
		"yicy": "ї",
		"Yopf": "𝕐",
		"yopf": "𝕪",
		"Yscr": "𝒴",
		"yscr": "𝓎",
		"YUcy": "Ю",
		"yucy": "ю",
		"yuml": "ÿ",
		"Yuml": "Ÿ",
		"Zacute": "Ź",
		"zacute": "ź",
		"Zcaron": "Ž",
		"zcaron": "ž",
		"Zcy": "З",
		"zcy": "з",
		"Zdot": "Ż",
		"zdot": "ż",
		"zeetrf": "ℨ",
		"ZeroWidthSpace": "​",
		"Zeta": "Ζ",
		"zeta": "ζ",
		"zfr": "𝔷",
		"Zfr": "ℨ",
		"ZHcy": "Ж",
		"zhcy": "ж",
		"zigrarr": "⇝",
		"zopf": "𝕫",
		"Zopf": "ℤ",
		"Zscr": "𝒵",
		"zscr": "𝓏",
		"zwj": "‍",
		"zwnj": "‌"
	}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Creates an array with all falsey values removed. The values `false`, `null`,
	 * `0`, `""`, `undefined`, and `NaN` are falsey.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to compact.
	 * @returns {Array} Returns the new array of filtered values.
	 * @example
	 *
	 * _.compact([0, 1, false, 2, '', 3]);
	 * // => [1, 2, 3]
	 */
	function compact(array) {
	  var index = -1,
	      length = array ? array.length : 0,
	      resIndex = -1,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (value) {
	      result[++resIndex] = value;
	    }
	  }
	  return result;
	}

	module.exports = compact;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}

	module.exports = last;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(4);

	/**
	 * The inverse of `_.pairs`; this method returns an object composed from arrays
	 * of property names and values. Provide either a single two dimensional array,
	 * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
	 * and one of corresponding values.
	 *
	 * @static
	 * @memberOf _
	 * @alias object
	 * @category Array
	 * @param {Array} props The property names.
	 * @param {Array} [values=[]] The property values.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * _.zipObject([['fred', 30], ['barney', 40]]);
	 * // => { 'fred': 30, 'barney': 40 }
	 *
	 * _.zipObject(['fred', 'barney'], [30, 40]);
	 * // => { 'fred': 30, 'barney': 40 }
	 */
	function zipObject(props, values) {
	  var index = -1,
	      length = props ? props.length : 0,
	      result = {};

	  if (length && !values && !isArray(props[0])) {
	    values = [];
	  }
	  while (++index < length) {
	    var key = props[index];
	    if (values) {
	      result[key] = values[index];
	    } else if (key) {
	      result[key[0]] = key[1];
	    }
	  }
	  return result;
	}

	module.exports = zipObject;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var arrayReduce = __webpack_require__(67),
	    baseEach = __webpack_require__(28),
	    createReduce = __webpack_require__(88);

	/**
	 * Reduces `collection` to a value which is the accumulated result of running
	 * each element in `collection` through `iteratee`, where each successive
	 * invocation is supplied the return value of the previous. If `accumulator`
	 * is not provided the first element of `collection` is used as the initial
	 * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
	 * (accumulator, value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as interatees for methods like
	 * `_.reduce`, `_.reduceRight`, and `_.transform`.
	 *
	 * The guarded methods are:
	 * `assign`, `defaults`, `includes`, `merge`, `sortByAll`, and `sortByOrder`
	 *
	 * @static
	 * @memberOf _
	 * @alias foldl, inject
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {*} [thisArg] The `this` binding of `iteratee`.
	 * @returns {*} Returns the accumulated value.
	 * @example
	 *
	 * _.reduce([1, 2], function(total, n) {
	 *   return total + n;
	 * });
	 * // => 3
	 *
	 * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
	 *   result[key] = n * 3;
	 *   return result;
	 * }, {});
	 * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
	 */
	var reduce = createReduce(arrayReduce, baseEach);

	module.exports = reduce;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(27),
	    baseMap = __webpack_require__(76),
	    baseSortBy = __webpack_require__(82),
	    compareAscending = __webpack_require__(83),
	    isIterateeCall = __webpack_require__(21);

	/**
	 * Creates an array of elements, sorted in ascending order by the results of
	 * running each element in a collection through `iteratee`. This method performs
	 * a stable sort, that is, it preserves the original sort order of equal elements.
	 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	 * (value, index|key, collection).
	 *
	 * If a property name is provided for `iteratee` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `iteratee` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `iteratee`.
	 * @returns {Array} Returns the new sorted array.
	 * @example
	 *
	 * _.sortBy([1, 2, 3], function(n) {
	 *   return Math.sin(n);
	 * });
	 * // => [3, 1, 2]
	 *
	 * _.sortBy([1, 2, 3], function(n) {
	 *   return this.sin(n);
	 * }, Math);
	 * // => [3, 1, 2]
	 *
	 * var users = [
	 *   { 'user': 'fred' },
	 *   { 'user': 'pebbles' },
	 *   { 'user': 'barney' }
	 * ];
	 *
	 * // using the `_.property` callback shorthand
	 * _.pluck(_.sortBy(users, 'user'), 'user');
	 * // => ['barney', 'fred', 'pebbles']
	 */
	function sortBy(collection, iteratee, thisArg) {
	  if (collection == null) {
	    return [];
	  }
	  if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	    iteratee = null;
	  }
	  var index = -1;
	  iteratee = baseCallback(iteratee, thisArg, 3);

	  var result = baseMap(collection, function(value, key, collection) {
	    return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
	  });
	  return baseSortBy(result, compareAscending);
	}

	module.exports = sortBy;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);

	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}

	module.exports = restParam;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `_.reduce` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initFromArray] Specify using the first element of `array`
	 *  as the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initFromArray) {
	  var index = -1,
	      length = array.length;

	  if (initFromArray && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	module.exports = arrayReduce;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var getSymbols = __webpack_require__(35),
	    keys = __webpack_require__(11);

	/** Used for native method references. */
	var arrayProto = Array.prototype;

	/** Native method references. */
	var push = arrayProto.push;

	/**
	 * A specialized version of `_.assign` for customizing assigned values without
	 * support for argument juggling, multiple sources, and `this` binding `customizer`
	 * functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 */
	function assignWith(object, source, customizer) {
	  var props = keys(source);
	  push.apply(props, getSymbols(source));

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);

	    if ((result === result ? (result !== value) : (value === value)) ||
	        (value === undefined && !(key in object))) {
	      object[key] = result;
	    }
	  }
	  return object;
	}

	module.exports = assignWith;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var baseCopy = __webpack_require__(71),
	    getSymbols = __webpack_require__(35),
	    isNative = __webpack_require__(9),
	    keys = __webpack_require__(11);

	/** Native method references. */
	var preventExtensions = isNative(preventExtensions = Object.preventExtensions) && preventExtensions;

	/** Used as `baseAssign`. */
	var nativeAssign = (function() {
	  // Avoid `Object.assign` in Firefox 34-37 which have an early implementation
	  // with a now defunct try/catch behavior. See https://bugzilla.mozilla.org/show_bug.cgi?id=1103344
	  // for more details.
	  //
	  // Use `Object.preventExtensions` on a plain object instead of simply using
	  // `Object('x')` because Chrome and IE fail to throw an error when attempting
	  // to assign values to readonly indexes of strings.
	  var func = preventExtensions && isNative(func = Object.assign) && func;
	  try {
	    if (func) {
	      var object = preventExtensions({ '1': 0 });
	      object[0] = 1;
	    }
	  } catch(e) {
	    // Only attempt in strict mode.
	    try { func(object, 'xo'); } catch(e) {}
	    return !object[1] && func;
	  }
	  return false;
	}());

	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	var baseAssign = nativeAssign || function(object, source) {
	  return source == null
	    ? object
	    : baseCopy(source, getSymbols(source), baseCopy(source, keys(source), object));
	};

	module.exports = baseAssign;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `compareAscending` which compares values and
	 * sorts them in ascending order without guaranteeing a stable sort.
	 *
	 * @private
	 * @param {*} value The value to compare to `other`.
	 * @param {*} other The value to compare to `value`.
	 * @returns {number} Returns the sort order indicator for `value`.
	 */
	function baseCompareAscending(value, other) {
	  if (value !== other) {
	    var valIsReflexive = value === value,
	        othIsReflexive = other === other;

	    if (value > other || !valIsReflexive || (value === undefined && othIsReflexive)) {
	      return 1;
	    }
	    if (value < other || !othIsReflexive || (other === undefined && valIsReflexive)) {
	      return -1;
	    }
	  }
	  return 0;
	}

	module.exports = baseCompareAscending;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property names to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, props, object) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}

	module.exports = baseCopy;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(29),
	    keysIn = __webpack_require__(40);

	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}

	module.exports = baseForIn;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(29),
	    keys = __webpack_require__(11);

	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(90),
	    equalByTag = __webpack_require__(91),
	    equalObjects = __webpack_require__(92),
	    isArray = __webpack_require__(4),
	    isTypedArray = __webpack_require__(97);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (valWrapped || othWrapped) {
	      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	module.exports = baseIsEqualDeep;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(31);

	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} props The source property names to match.
	 * @param {Array} values The source values to match.
	 * @param {Array} strictCompareFlags Strict comparison flags for source values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	  var index = -1,
	      length = props.length,
	      noCustomizer = !customizer;

	  while (++index < length) {
	    if ((noCustomizer && strictCompareFlags[index])
	          ? values[index] !== object[props[index]]
	          : !(props[index] in object)
	        ) {
	      return false;
	    }
	  }
	  index = -1;
	  while (++index < length) {
	    var key = props[index],
	        objValue = object[key],
	        srcValue = values[index];

	    if (noCustomizer && strictCompareFlags[index]) {
	      var result = objValue !== undefined || (key in object);
	    } else {
	      result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (result === undefined) {
	        result = baseIsEqual(srcValue, objValue, customizer, true);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(28),
	    isArrayLike = __webpack_require__(13);

	/**
	 * The base implementation of `_.map` without support for callback shorthands
	 * and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function baseMap(collection, iteratee) {
	  var index = -1,
	      result = isArrayLike(collection) ? Array(collection.length) : [];

	  baseEach(collection, function(value, key, collection) {
	    result[++index] = iteratee(value, key, collection);
	  });
	  return result;
	}

	module.exports = baseMap;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(75),
	    constant = __webpack_require__(42),
	    isStrictComparable = __webpack_require__(37),
	    keys = __webpack_require__(11),
	    toObject = __webpack_require__(5);

	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var props = keys(source),
	      length = props.length;

	  if (!length) {
	    return constant(true);
	  }
	  if (length == 1) {
	    var key = props[0],
	        value = source[key];

	    if (isStrictComparable(value)) {
	      return function(object) {
	        if (object == null) {
	          return false;
	        }
	        return object[key] === value && (value !== undefined || (key in toObject(object)));
	      };
	    }
	  }
	  var values = Array(length),
	      strictCompareFlags = Array(length);

	  while (length--) {
	    value = source[props[length]];
	    values[length] = value;
	    strictCompareFlags[length] = isStrictComparable(value);
	  }
	  return function(object) {
	    return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
	  };
	}

	module.exports = baseMatches;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(30),
	    baseIsEqual = __webpack_require__(31),
	    baseSlice = __webpack_require__(81),
	    isArray = __webpack_require__(4),
	    isKey = __webpack_require__(36),
	    isStrictComparable = __webpack_require__(37),
	    last = __webpack_require__(62),
	    toObject = __webpack_require__(5),
	    toPath = __webpack_require__(38);

	/**
	 * The base implementation of `_.matchesProperty` which does not which does
	 * not clone `value`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} value The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, value) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(value),
	      pathKey = (path + '');

	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === value
	      ? (value !== undefined || (key in object))
	      : baseIsEqual(value, object[key], null, true);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(30),
	    toPath = __webpack_require__(38);

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}

	module.exports = basePropertyDeep;


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.reduce` and `_.reduceRight` without support
	 * for callback shorthands and `this` binding, which iterates over `collection`
	 * using the provided `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} accumulator The initial value.
	 * @param {boolean} initFromCollection Specify using the first or last element
	 *  of `collection` as the initial value.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @returns {*} Returns the accumulated value.
	 */
	function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
	  eachFunc(collection, function(value, index, collection) {
	    accumulator = initFromCollection
	      ? (initFromCollection = false, value)
	      : iteratee(accumulator, value, index, collection);
	  });
	  return accumulator;
	}

	module.exports = baseReduce;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;

	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	module.exports = baseSlice;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.sortBy` which uses `comparer` to define
	 * the sort order of `array` and replaces criteria objects with their
	 * corresponding values.
	 *
	 * @private
	 * @param {Array} array The array to sort.
	 * @param {Function} comparer The function to define sort order.
	 * @returns {Array} Returns `array`.
	 */
	function baseSortBy(array, comparer) {
	  var length = array.length;

	  array.sort(comparer);
	  while (length--) {
	    array[length] = array[length].value;
	  }
	  return array;
	}

	module.exports = baseSortBy;


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var baseCompareAscending = __webpack_require__(70);

	/**
	 * Used by `_.sortBy` to compare transformed elements of a collection and stable
	 * sort them in ascending order.
	 *
	 * @private
	 * @param {Object} object The object to compare to `other`.
	 * @param {Object} other The object to compare to `object`.
	 * @returns {number} Returns the sort order indicator for `object`.
	 */
	function compareAscending(object, other) {
	  return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
	}

	module.exports = compareAscending;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var bindCallback = __webpack_require__(33),
	    isIterateeCall = __webpack_require__(21),
	    restParam = __webpack_require__(66);

	/**
	 * Creates a function that assigns properties of source object(s) to a given
	 * destination object.
	 *
	 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return restParam(function(object, sources) {
	    var index = -1,
	        length = object == null ? 0 : sources.length,
	        customizer = length > 2 && sources[length - 2],
	        guard = length > 2 && sources[2],
	        thisArg = length > 1 && sources[length - 1];

	    if (typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = typeof thisArg == 'function' ? thisArg : null;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? null : customizer;
	      length = 1;
	    }
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  });
	}

	module.exports = createAssigner;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(34),
	    isLength = __webpack_require__(6),
	    toObject = __webpack_require__(5);

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    var length = collection ? getLength(collection) : 0;
	    if (!isLength(length)) {
	      return eachFunc(collection, iteratee);
	    }
	    var index = fromRight ? length : -1,
	        iterable = toObject(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	module.exports = createBaseEach;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(5);

	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;

	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var deburr = __webpack_require__(100),
	    words = __webpack_require__(102);

	/**
	 * Creates a function that produces compound words out of the words in a
	 * given string.
	 *
	 * @private
	 * @param {Function} callback The function to combine each word.
	 * @returns {Function} Returns the new compounder function.
	 */
	function createCompounder(callback) {
	  return function(string) {
	    var index = -1,
	        array = words(deburr(string)),
	        length = array.length,
	        result = '';

	    while (++index < length) {
	      result = callback(result, array[index], index);
	    }
	    return result;
	  };
	}

	module.exports = createCompounder;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(27),
	    baseReduce = __webpack_require__(80),
	    isArray = __webpack_require__(4);

	/**
	 * Creates a function for `_.reduce` or `_.reduceRight`.
	 *
	 * @private
	 * @param {Function} arrayFunc The function to iterate over an array.
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @returns {Function} Returns the new each function.
	 */
	function createReduce(arrayFunc, eachFunc) {
	  return function(collection, iteratee, accumulator, thisArg) {
	    var initFromArray = arguments.length < 3;
	    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
	      ? arrayFunc(collection, iteratee, accumulator, initFromArray)
	      : baseReduce(collection, baseCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
	  };
	}

	module.exports = createReduce;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/** Used to map latin-1 supplementary letters to basic latin letters. */
	var deburredLetters = {
	  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	  '\xc7': 'C',  '\xe7': 'c',
	  '\xd0': 'D',  '\xf0': 'd',
	  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	  '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	  '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	  '\xd1': 'N',  '\xf1': 'n',
	  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	  '\xc6': 'Ae', '\xe6': 'ae',
	  '\xde': 'Th', '\xfe': 'th',
	  '\xdf': 'ss'
	};

	/**
	 * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
	 *
	 * @private
	 * @param {string} letter The matched letter to deburr.
	 * @returns {string} Returns the deburred letter.
	 */
	function deburrLetter(letter) {
	  return deburredLetters[letter];
	}

	module.exports = deburrLetter;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length,
	      result = true;

	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Deep compare the contents, ignoring non-numeric properties.
	  while (result && ++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    result = undefined;
	    if (customizer) {
	      result = isLoose
	        ? customizer(othValue, arrValue, index)
	        : customizer(arrValue, othValue, index);
	    }
	    if (result === undefined) {
	      // Recursively compare arrays (susceptible to call stack limits).
	      if (isLoose) {
	        var othIndex = othLength;
	        while (othIndex--) {
	          othValue = other[othIndex];
	          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          if (result) {
	            break;
	          }
	        }
	      } else {
	        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	      }
	    }
	  }
	  return !!result;
	}

	module.exports = equalArrays;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} value The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        : object == +other;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(11);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var skipCtor = isLoose,
	      index = -1;

	  while (++index < objLength) {
	    var key = objProps[index],
	        result = isLoose ? key in other : hasOwnProperty.call(other, key);

	    if (result) {
	      var objValue = object[key],
	          othValue = other[key];

	      result = undefined;
	      if (customizer) {
	        result = isLoose
	          ? customizer(othValue, objValue, key)
	          : customizer(objValue, othValue, key);
	      }
	      if (result === undefined) {
	        // Recursively compare objects (susceptible to call stack limits).
	        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalObjects;


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var baseForIn = __webpack_require__(72),
	    isObjectLike = __webpack_require__(7);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * A fallback implementation of `_.isPlainObject` which checks if `value`
	 * is an object created by the `Object` constructor or has a `[[Prototype]]`
	 * of `null`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 */
	function shimIsPlainObject(value) {
	  var Ctor;

	  // Exit early for non `Object` objects.
	  if (!(isObjectLike(value) && objToString.call(value) == objectTag) ||
	      (!hasOwnProperty.call(value, 'constructor') &&
	        (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	    return false;
	  }
	  // IE < 9 iterates inherited properties before own properties. If the first
	  // iterated property is an object's own property then there are no inherited
	  // enumerable properties.
	  var result;
	  // In most environments an object's own properties are iterated before
	  // its inherited properties. If the last iterated property is an object's
	  // own property then there are no inherited enumerable properties.
	  baseForIn(value, function(subValue, key) {
	    result = key;
	  });
	  return result === undefined || hasOwnProperty.call(value, result);
	}

	module.exports = shimIsPlainObject;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(39),
	    isArray = __webpack_require__(4),
	    isIndex = __webpack_require__(20),
	    isLength = __webpack_require__(6),
	    keysIn = __webpack_require__(40),
	    support = __webpack_require__(41);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = shimKeys;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(9),
	    shimIsPlainObject = __webpack_require__(93);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Native method references. */
	var getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * **Note:** This method assumes objects created by the `Object` constructor
	 * have no inherited enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
	  if (!(value && objToString.call(value) == objectTag)) {
	    return false;
	  }
	  var valueOf = value.valueOf,
	      objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

	  return objProto
	    ? (value == objProto || getPrototypeOf(value) == objProto)
	    : shimIsPlainObject(value);
	};

	module.exports = isPlainObject;


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(7);

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
	}

	module.exports = isString;


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(6),
	    isObjectLike = __webpack_require__(7);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}

	module.exports = isTypedArray;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var assignWith = __webpack_require__(68),
	    baseAssign = __webpack_require__(69),
	    createAssigner = __webpack_require__(84);

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it is invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * **Note:** This method mutates `object` and is based on
	 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return _.isUndefined(value) ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(function(object, source, customizer) {
	  return customizer
	    ? assignWith(object, source, customizer)
	    : baseAssign(object, source);
	});

	module.exports = assign;


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var createCompounder = __webpack_require__(87);

	/**
	 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to convert.
	 * @returns {string} Returns the camel cased string.
	 * @example
	 *
	 * _.camelCase('Foo Bar');
	 * // => 'fooBar'
	 *
	 * _.camelCase('--foo-bar');
	 * // => 'fooBar'
	 *
	 * _.camelCase('__foo_bar__');
	 * // => 'fooBar'
	 */
	var camelCase = createCompounder(function(result, word, index) {
	  word = word.toLowerCase();
	  return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
	});

	module.exports = camelCase;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(12),
	    deburrLetter = __webpack_require__(89);

	/** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
	var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

	/** Used to match latin-1 supplementary letters (excluding mathematical operators). */
	var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

	/**
	 * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	 * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to deburr.
	 * @returns {string} Returns the deburred string.
	 * @example
	 *
	 * _.deburr('déjà vu');
	 * // => 'deja vu'
	 */
	function deburr(string) {
	  string = baseToString(string);
	  return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
	}

	module.exports = deburr;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(12);

	/**
	 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
	 * In addition to special characters the forward slash is escaped to allow for
	 * easier `eval` use and `Function` compilation.
	 */
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);

	/**
	 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return (string && reHasRegExpChars.test(string))
	    ? string.replace(reRegExpChars, '\\$&')
	    : string;
	}

	module.exports = escapeRegExp;


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(12),
	    isIterateeCall = __webpack_require__(21);

	/** Used to match words to create compound words. */
	var reWords = (function() {
	  var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
	      lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

	  return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
	}());

	/**
	 * Splits `string` into an array of its words.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to inspect.
	 * @param {RegExp|string} [pattern] The pattern to match words.
	 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	 * @returns {Array} Returns the words of `string`.
	 * @example
	 *
	 * _.words('fred, barney, & pebbles');
	 * // => ['fred', 'barney', 'pebbles']
	 *
	 * _.words('fred, barney, & pebbles', /[^, ]+/g);
	 * // => ['fred', 'barney', '&', 'pebbles']
	 */
	function words(string, pattern, guard) {
	  if (guard && isIterateeCall(string, pattern, guard)) {
	    pattern = null;
	  }
	  string = baseToString(string);
	  return string.match(pattern || reWords) || [];
	}

	module.exports = words;


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(32),
	    basePropertyDeep = __webpack_require__(79),
	    isKey = __webpack_require__(36);

	/**
	 * Creates a function which returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}

	module.exports = property;


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	// Enclose abbreviations in <abbr> tags
	//
	'use strict';


	var PUNCT_CHARS = ' \n()[]\'".,!?-';


	module.exports = function sub_plugin(md) {
	  var escapeRE        = md.utils.escapeRE,
	      arrayReplaceAt  = md.utils.arrayReplaceAt;


	  function abbr_def(state, startLine, endLine, silent) {
	    var label, title, ch, labelStart, labelEnd,
	        pos = state.bMarks[startLine] + state.tShift[startLine],
	        max = state.eMarks[startLine];

	    if (pos + 2 >= max) { return false; }

	    if (state.src.charCodeAt(pos++) !== 0x2A/* * */) { return false; }
	    if (state.src.charCodeAt(pos++) !== 0x5B/* [ */) { return false; }

	    labelStart = pos;

	    for (; pos < max; pos++) {
	      ch = state.src.charCodeAt(pos);
	      if (ch === 0x5B /* [ */) {
	        return false;
	      } else if (ch === 0x5D /* ] */) {
	        labelEnd = pos;
	        break;
	      } else if (ch === 0x5C /* \ */) {
	        pos++;
	      }
	    }

	    if (labelEnd < 0 || state.src.charCodeAt(labelEnd + 1) !== 0x3A/* : */) {
	      return false;
	    }

	    if (silent) { return true; }

	    label = state.src.slice(labelStart, labelEnd).replace(/\\(.)/g, '$1');
	    title = state.src.slice(labelEnd + 2, max).trim();
	    if (title.length === 0) { return false; }
	    if (!state.env.abbreviations) { state.env.abbreviations = {}; }
	    // prepend ':' to avoid conflict with Object.prototype members
	    if (typeof state.env.abbreviations[':' + label] === 'undefined') {
	      state.env.abbreviations[':' + label] = title;
	    }

	    state.line = startLine + 1;
	    return true;
	  }


	  function abbr_replace(state) {
	    var i, j, l, tokens, token, text, nodes, pos, reg, m, regText,
	        currentToken,
	        blockTokens = state.tokens;

	    if (!state.env.abbreviations) { return; }
	    if (!state.env.abbrRegExp) {
	      regText = '(^|[' + PUNCT_CHARS.split('').map(escapeRE).join('') + '])'
	              + '(' + Object.keys(state.env.abbreviations).map(function (x) {
	                        return x.substr(1);
	                      }).sort(function (a, b) {
	                        return b.length - a.length;
	                      }).map(escapeRE).join('|') + ')'
	              + '($|[' + PUNCT_CHARS.split('').map(escapeRE).join('') + '])';
	      state.env.abbrRegExp = new RegExp(regText, 'g');
	    }
	    reg = state.env.abbrRegExp;

	    for (j = 0, l = blockTokens.length; j < l; j++) {
	      if (blockTokens[j].type !== 'inline') { continue; }
	      tokens = blockTokens[j].children;

	      // We scan from the end, to keep position when new tags added.
	      for (i = tokens.length - 1; i >= 0; i--) {
	        currentToken = tokens[i];
	        if (currentToken.type !== 'text') { continue; }

	        pos = 0;
	        text = currentToken.content;
	        reg.lastIndex = 0;
	        nodes = [];

	        while ((m = reg.exec(text))) {
	          if (reg.lastIndex > pos) {
	            token         = new state.Token('text', '', 0);
	            token.content = text.slice(pos, m.index + m[1].length);
	            nodes.push(token);
	          }

	          token         = new state.Token('abbr_open', 'abbr', 1);
	          token.attrs   = [ [ 'title', state.env.abbreviations[':' + m[2]] ] ];
	          nodes.push(token);

	          token         = new state.Token('text', '', 0);
	          token.content = m[2];
	          nodes.push(token);

	          token         = new state.Token('abbr_close', 'abbr', -1);
	          nodes.push(token);

	          pos = reg.lastIndex - m[3].length;
	        }

	        if (!nodes.length) { continue; }

	        if (pos < text.length) {
	          token         = new state.Token('text', '', 0);
	          token.content = text.slice(pos);
	          nodes.push(token);
	        }

	        // replace current node
	        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
	      }
	    }
	  }

	  md.block.ruler.before('reference', 'abbr_def', abbr_def, { alt: [ 'paragraph', 'reference' ] });
	  md.core.ruler.after('inline', 'abbr_replace', abbr_replace);
	};


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	// Process block-level custom containers
	//
	'use strict';


	module.exports = function container_plugin(md, name, options) {

	  function validateDefault(params) {
	    return params.trim().split(' ', 2)[0] === name;
	  }

	  function renderDefault(tokens, idx, _options, env, self) {

	    // add a class to the opening tag
	    if (tokens[idx].nesting === 1) {
	      tokens[idx].attrPush([ 'class', name ]);
	    }

	    return self.renderToken(tokens, idx, _options, env, self);
	  }

	  options = options || {};

	  var min_markers = 3,
	      marker_str  = options.marker || ':',
	      marker_char = marker_str.charCodeAt(0),
	      marker_len  = marker_str.length,
	      validate    = options.validate || validateDefault,
	      render      = options.render || renderDefault;

	  function container(state, startLine, endLine, silent) {
	    var pos, nextLine, marker_count, markup, params, token,
	        old_parent, old_line_max,
	        auto_closed = false,
	        start = state.bMarks[startLine] + state.tShift[startLine],
	        max = state.eMarks[startLine];

	    // Check out the first character quickly,
	    // this should filter out most of non-containers
	    //
	    if (marker_char !== state.src.charCodeAt(start)) { return false; }

	    // Check out the rest of the marker string
	    //
	    for (pos = start + 1; pos <= max; pos++) {
	      if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
	        break;
	      }
	    }

	    marker_count = Math.floor((pos - start) / marker_len);
	    if (marker_count < min_markers) { return false; }
	    pos -= (pos - start) % marker_len;

	    markup = state.src.slice(start, pos);
	    params = state.src.slice(pos, max);
	    if (!validate(params)) { return false; }

	    // Since start is found, we can report success here in validation mode
	    //
	    if (silent) { return true; }

	    // Search for the end of the block
	    //
	    nextLine = startLine;

	    for (;;) {
	      nextLine++;
	      if (nextLine >= endLine) {
	        // unclosed block should be autoclosed by end of document.
	        // also block seems to be autoclosed by end of parent
	        break;
	      }

	      start = state.bMarks[nextLine] + state.tShift[nextLine];
	      max = state.eMarks[nextLine];

	      if (start < max && state.tShift[nextLine] < state.blkIndent) {
	        // non-empty line with negative indent should stop the list:
	        // - ```
	        //  test
	        break;
	      }

	      if (marker_char !== state.src.charCodeAt(start)) { continue; }

	      if (state.tShift[nextLine] - state.blkIndent >= 4) {
	        // closing fence should be indented less than 4 spaces
	        continue;
	      }

	      for (pos = start + 1; pos <= max; pos++) {
	        if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
	          break;
	        }
	      }

	      // closing code fence must be at least as long as the opening one
	      if (Math.floor((pos - start) / marker_len) < marker_count) { continue; }

	      // make sure tail has spaces only
	      pos -= (pos - start) % marker_len;
	      pos = state.skipSpaces(pos);

	      if (pos < max) { continue; }

	      // found!
	      auto_closed = true;
	      break;
	    }

	    old_parent = state.parentType;
	    old_line_max = state.lineMax;
	    state.parentType = 'container';

	    // this will prevent lazy continuations from ever going past our end marker
	    state.lineMax = nextLine;

	    token        = state.push('container_' + name + '_open', 'div', 1);
	    token.markup = markup;
	    token.block  = true;
	    token.info   = params;
	    token.map    = [ startLine, nextLine ];

	    state.md.block.tokenize(state, startLine + 1, nextLine);

	    token        = state.push('container_' + name + '_close', 'div', -1);
	    token.markup = state.src.slice(start, pos);
	    token.block  = true;

	    state.parentType = old_parent;
	    state.lineMax = old_line_max;
	    state.line = nextLine + (auto_closed ? 1 : 0);

	    return true;
	  }

	  md.block.ruler.before('fence', 'container_' + name, container, {
	    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
	  });
	  md.renderer.rules['container_' + name + '_open'] = render;
	  md.renderer.rules['container_' + name + '_close'] = render;
	};


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// Process definition lists
	//
	'use strict';


	// Search `[:~][\n ]`, returns next pos after marker on success
	// or -1 on fail.
	function skipMarker(state, line) {
	  var pos, marker,
	      start = state.bMarks[line] + state.tShift[line],
	      max = state.eMarks[line];

	  if (start >= max) { return -1; }

	  // Check bullet
	  marker = state.src.charCodeAt(start++);
	  if (marker !== 0x7E/* ~ */ && marker !== 0x3A/* : */) { return -1; }

	  pos = state.skipSpaces(start);

	  // require space after ":"
	  if (start === pos) { return -1; }

	  // no empty definitions, e.g. "  : "
	  if (pos >= max) { return -1; }

	  return pos;
	}

	function markTightParagraphs(state, idx) {
	  var i, l,
	      level = state.level + 2;

	  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
	    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
	      state.tokens[i + 2].hidden = true;
	      state.tokens[i].hidden = true;
	      i += 2;
	    }
	  }
	}

	function deflist(state, startLine, endLine, silent) {
	  var contentStart,
	      ddLine,
	      dtLine,
	      itemLines,
	      listLines,
	      listTokIdx,
	      nextLine,
	      oldIndent,
	      oldDDIndent,
	      oldParentType,
	      oldTShift,
	      oldTight,
	      prevEmptyEnd,
	      tight,
	      token;

	  if (silent) {
	    // quirk: validation mode validates a dd block only, not a whole deflist
	    if (state.ddIndent < 0) { return false; }
	    return skipMarker(state, startLine) >= 0;
	  }

	  nextLine = startLine + 1;
	  if (state.isEmpty(nextLine)) {
	    if (++nextLine > endLine) { return false; }
	  }

	  if (state.tShift[nextLine] < state.blkIndent) { return false; }
	  contentStart = skipMarker(state, nextLine);
	  if (contentStart < 0) { return false; }

	  // Start list
	  listTokIdx = state.tokens.length;

	  token     = state.push('dl_open', 'dl', 1);
	  token.map = listLines = [ startLine, 0 ];

	  //
	  // Iterate list items
	  //

	  dtLine = startLine;
	  ddLine = nextLine;

	  // One definition list can contain multiple DTs,
	  // and one DT can be followed by multiple DDs.
	  //
	  // Thus, there is two loops here, and label is
	  // needed to break out of the second one
	  //
	  /*eslint no-labels:0,block-scoped-var:0*/
	  OUTER:
	  for (;;) {
	    tight = true;
	    prevEmptyEnd = false;

	    token          = state.push('dt_open', 'dt', 1);
	    token.map      = [ dtLine, dtLine ];

	    token          = state.push('inline', '', 0);
	    token.map      = [ dtLine, dtLine ];
	    token.content  = state.getLines(dtLine, dtLine + 1, state.blkIndent, false).trim();
	    token.children = [];

	    token          = state.push('dt_close', 'dt', -1);

	    for (;;) {
	      token     = state.push('dd_open', 'dd', 1);
	      token.map = itemLines = [ nextLine, 0 ];

	      oldTight = state.tight;
	      oldDDIndent = state.ddIndent;
	      oldIndent = state.blkIndent;
	      oldTShift = state.tShift[ddLine];
	      oldParentType = state.parentType;
	      state.blkIndent = state.ddIndent = state.tShift[ddLine] + 2;
	      state.tShift[ddLine] = contentStart - state.bMarks[ddLine];
	      state.tight = true;
	      state.parentType = 'deflist';

	      state.md.block.tokenize(state, ddLine, endLine, true);

	      // If any of list item is tight, mark list as tight
	      if (!state.tight || prevEmptyEnd) {
	        tight = false;
	      }
	      // Item become loose if finish with empty line,
	      // but we should filter last element, because it means list finish
	      prevEmptyEnd = (state.line - ddLine) > 1 && state.isEmpty(state.line - 1);

	      state.tShift[ddLine] = oldTShift;
	      state.tight = oldTight;
	      state.parentType = oldParentType;
	      state.blkIndent = oldIndent;
	      state.ddIndent = oldDDIndent;

	      token = state.push('dd_close', 'dd', -1);

	      itemLines[1] = nextLine = state.line;

	      if (nextLine >= endLine) { break OUTER; }

	      if (state.tShift[nextLine] < state.blkIndent) { break OUTER; }
	      contentStart = skipMarker(state, nextLine);
	      if (contentStart < 0) { break; }

	      ddLine = nextLine;

	      // go to the next loop iteration:
	      // insert DD tag and repeat checking
	    }

	    if (nextLine >= endLine) { break; }
	    dtLine = nextLine;

	    if (state.isEmpty(dtLine)) { break; }
	    if (state.tShift[dtLine] < state.blkIndent) { break; }

	    ddLine = dtLine + 1;
	    if (ddLine >= endLine) { break; }
	    if (state.isEmpty(ddLine)) { ddLine++; }
	    if (ddLine >= endLine) { break; }

	    if (state.tShift[ddLine] < state.blkIndent) { break; }
	    contentStart = skipMarker(state, ddLine);
	    if (contentStart < 0) { break; }

	    // go to the next loop iteration:
	    // insert DT and DD tags and repeat checking
	  }

	  // Finilize list
	  token = state.push('dl_close', 'dl', -1);

	  listLines[1] = nextLine;

	  state.line = nextLine;

	  // mark paragraphs tight if needed
	  if (tight) {
	    markTightParagraphs(state, listTokIdx);
	  }

	  return true;
	}


	module.exports = function sub_plugin(md) {
	  md.block.ruler.before('paragraph', 'deflist', deflist, { alt: [ 'paragraph', 'reference' ] });
	};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	var emojies_full      = __webpack_require__(59);
	var emojies_shortcuts = __webpack_require__(108);
	var emoji_html        = __webpack_require__(110);
	var emoji_replace     = __webpack_require__(111);
	var normalize_opts    = __webpack_require__(109);


	module.exports = function emoji_plugin(md, options) {
	  var conf = options || {};

	  var opts = normalize_opts({
	    emojies: conf.defs || emojies_full,
	    shortcuts: conf.shortcuts || emojies_shortcuts,
	    enabled: conf.enabled || []
	  });

	  md.renderer.rules.emoji = emoji_html;

	  md.core.ruler.push('emoji', emoji_replace(md, opts.emojies, opts.shortcuts, opts.scanRE));
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// Emoticons -> Emoji mapping.
	//
	// (!) Some patterns skipped, to avoid collisions
	// without increase matcher complicity. Than can change in future.
	//
	// Places to look for more emoticons info:
	//
	// - http://en.wikipedia.org/wiki/List_of_emoticons#Western
	// - https://github.com/wooorm/emoticon/blob/master/Support.md
	// - http://factoryjoe.com/projects/emoticons/
	//
	'use strict';

	module.exports = {
	  mad:              [ '>:(', '>:-(' ], // angry
	  blush:            [ ':")', ':-")' ],
	  broken_heart:     [ '</3', '<\\3' ],
	  // :/ & :\ disabled due conflicts, untill logic improved
	  confused:         [ /*':\\',*/ ':-\\', /*':/',*/ ':-/' ], // twemoji shows question
	  cry:              [ ":'(", ":'-(", ':,(', ':,-(' ],
	  frowning:         [ ':(', ':-(' ],
	  heart:            [ '<3' ],
	  imp:              [ ']:(', ']:-(' ],
	  innocent:         [ 'o:)', 'O:)', 'o:-)', 'O:-)', '0:)', '0:-)' ],
	  joy:              [ ":')", ":'-)", ':,)', ':,-)', ":'D", ":'-D", ':,D', ':,-D' ],
	  kissing:          [ ':*', ':-*' ],
	  laughing:         [ 'x-)', 'X-)' ],
	  neutral_face:     [ ':|', ':-|' ],
	  open_mouth:       [ ':o', ':-o', ':O', ':-O' ],
	  rage:             [ ':@', ':-@' ],
	  smile:            [ ':D', ':-D' ],
	  smiley:           [ ':)', ':-)' ],
	  smiling_imp:      [ ']:)', ']:-)' ],
	  sob:              [ ":,'(", ":,'-(", ';(', ';-(' ],
	  stuck_out_tongue: [ ':P', ':-P' ],
	  sunglasses:       [ '8-)', 'B-)' ],
	  sweat:            [ ',:(', ',:-(' ],
	  sweat_smile:      [ ',:)', ',:-)' ],
	  unamused:         [ ':s', ':-S', ':z', ':-Z', ':$', ':-$' ],
	  wink:             [ ';)', ';-)' ]
	};


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	// Convert input options to more useable format
	// and compile search regexp

	'use strict';


	function quoteRE (str) {
	  return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
	}


	module.exports = function normalize_opts(options) {
	  var emojies = options.emojies,
	      shortcuts;

	  // Filter emojies by whitelist, if needed
	  if (options.enabled.length) {
	    emojies = Object.keys(emojies).reduce(function (acc, key) {
	      if (options.enabled.indexOf(key) >= 0) {
	        acc[key] = emojies[key];
	      }
	      return acc;
	    }, {});
	  }

	  // Flatten shortcuts to simple object: { alias: emoji_name }
	  shortcuts = Object.keys(options.shortcuts).reduce(function (acc, key) {
	    // Skip aliases for filtered emojies, to reduce regexp
	    if (!emojies[key]) { return acc; }

	    if (Array.isArray(options.shortcuts[key])) {
	      options.shortcuts[key].forEach(function (alias) {
	        acc[alias] = key;
	      });
	      return acc;
	    }

	    acc[options.shortcuts[key]] = key;
	    return acc;
	  }, {});

	  // Compile regexp
	  var names = Object.keys(emojies)
	                .map(function (name) { return ':' + name + ':'; })
	                .concat(Object.keys(shortcuts))
	                .map(function (name) { return quoteRE(name); })
	                .sort()
	                .reverse()
	                .join('|');
	  var scanRE = RegExp(names, 'g');


	  return {
	    emojies: emojies,
	    shortcuts: shortcuts,
	    scanRE: scanRE
	  };
	};


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function emoji_html(tokens, idx /*, options, env */) {
	  return tokens[idx].content;
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	// Emojies & shortcuts replacement logic.
	//
	// Note: In theory, it could be faster to parse :smile: in inline chain and
	// leave only shortcuts here. But, who care...
	//

	'use strict';


	module.exports = function create_rule(md, emojies, shortcuts, compiledRE) {
	  var arrayReplaceAt = md.utils.arrayReplaceAt;

	  function splitTextToken(text, level, Token) {
	    var token, last_pos = 0, nodes = [];

	    text.replace(compiledRE, function(match, offset) {
	      var emoji_name;
	      // Validate emoji name
	      if (shortcuts.hasOwnProperty(match)) {
	        // replace shortcut with full name
	        emoji_name = shortcuts[match];
	      } else {
	        emoji_name = match.slice(1, -1);
	      }

	      // Add new tokens to pending list
	      if (offset > last_pos) {
	        token         = new Token('text', '', 0);
	        token.content = text.slice(last_pos, offset);
	        nodes.push(token);
	      }

	      token         = new Token('emoji', '', 0);
	      token.markup  = emoji_name;
	      token.content = emojies[emoji_name];
	      nodes.push(token);

	      last_pos = offset + match.length;
	    });

	    if (last_pos < text.length) {
	      token         = new Token('text', '', 0);
	      token.content = text.slice(last_pos);
	      nodes.push(token);
	    }

	    return nodes;
	  }

	  return function emoji_replace(state) {
	    var i, j, l, tokens, token,
	        blockTokens = state.tokens;

	    for (j = 0, l = blockTokens.length; j < l; j++) {
	      if (blockTokens[j].type !== 'inline') { continue; }
	      tokens = blockTokens[j].children;

	      // We scan from the end, to keep position when new tags added.
	      // Use reversed logic in links start/end match
	      for (i = tokens.length - 1; i >= 0; i--) {
	        token = tokens[i];

	        if (token.type === 'text' && compiledRE.test(token.content)) {
	          // replace current node
	          blockTokens[j].children = tokens = arrayReplaceAt(
	            tokens, i, splitTextToken(token.content, token.level, state.Token)
	          );
	        }
	      }
	    }
	  };
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	// Process footnotes
	//
	'use strict';

	////////////////////////////////////////////////////////////////////////////////
	// Renderer partials

	function _footnote_ref(tokens, idx) {
	  var n = Number(tokens[idx].meta.id + 1).toString();
	  var id = 'fnref' + n;
	  if (tokens[idx].meta.subId > 0) {
	    id += ':' + tokens[idx].meta.subId;
	  }
	  return '<sup class="footnote-ref"><a href="#fn' + n + '" id="' + id + '">[' + n + ']</a></sup>';
	}
	function _footnote_block_open(tokens, idx, options) {
	  return (options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') +
	         '<section class="footnotes">\n' +
	         '<ol class="footnotes-list">\n';
	}
	function _footnote_block_close() {
	  return '</ol>\n</section>\n';
	}
	function _footnote_open(tokens, idx) {
	  var id = Number(tokens[idx].meta.id + 1).toString();
	  return '<li id="fn' + id + '"  class="footnote-item">';
	}
	function _footnote_close() {
	  return '</li>\n';
	}
	function _footnote_anchor(tokens, idx) {
	  var n = Number(tokens[idx].meta.id + 1).toString();
	  var id = 'fnref' + n;
	  if (tokens[idx].meta.subId > 0) {
	    id += ':' + tokens[idx].meta.subId;
	  }
	  return ' <a href="#' + id + '" class="footnote-backref">\u21a9</a>'; /* ↩ */
	}

	////////////////////////////////////////////////////////////////////////////////


	module.exports = function sub_plugin(md) {
	  var parseLinkLabel = md.helpers.parseLinkLabel;

	  md.renderer.rules.footnote_ref          = _footnote_ref;
	  md.renderer.rules.footnote_block_open   = _footnote_block_open;
	  md.renderer.rules.footnote_block_close  = _footnote_block_close;
	  md.renderer.rules.footnote_open         = _footnote_open;
	  md.renderer.rules.footnote_close        = _footnote_close;
	  md.renderer.rules.footnote_anchor       = _footnote_anchor;

	  // Process footnote block definition
	  function footnote_def(state, startLine, endLine, silent) {
	    var oldBMark, oldTShift, oldParentType, pos, label, token,
	        start = state.bMarks[startLine] + state.tShift[startLine],
	        max = state.eMarks[startLine];

	    // line should be at least 5 chars - "[^x]:"
	    if (start + 4 > max) { return false; }

	    if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
	    if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) { return false; }

	    for (pos = start + 2; pos < max; pos++) {
	      if (state.src.charCodeAt(pos) === 0x20) { return false; }
	      if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
	        break;
	      }
	    }

	    if (pos === start + 2) { return false; } // no empty footnote labels
	    if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 0x3A /* : */) { return false; }
	    if (silent) { return true; }
	    pos++;

	    if (!state.env.footnotes) { state.env.footnotes = {}; }
	    if (!state.env.footnotes.refs) { state.env.footnotes.refs = {}; }
	    label = state.src.slice(start + 2, pos - 2);
	    state.env.footnotes.refs[':' + label] = -1;

	    token       = new state.Token('footnote_reference_open', '', 1);
	    token.meta  = { label: label };
	    token.level = state.level++;
	    state.tokens.push(token);

	    oldBMark = state.bMarks[startLine];
	    oldTShift = state.tShift[startLine];
	    oldParentType = state.parentType;
	    state.tShift[startLine] = state.skipSpaces(pos) - pos;
	    state.bMarks[startLine] = pos;
	    state.blkIndent += 4;
	    state.parentType = 'footnote';

	    if (state.tShift[startLine] < state.blkIndent) {
	      state.tShift[startLine] += state.blkIndent;
	      state.bMarks[startLine] -= state.blkIndent;
	    }

	    state.md.block.tokenize(state, startLine, endLine, true);

	    state.parentType = oldParentType;
	    state.blkIndent -= 4;
	    state.tShift[startLine] = oldTShift;
	    state.bMarks[startLine] = oldBMark;

	    token       = new state.Token('footnote_reference_close', '', -1);
	    token.level = --state.level;
	    state.tokens.push(token);

	    return true;
	  }

	  // Process inline footnotes (^[...])
	  function footnote_inline(state, silent) {
	    var labelStart,
	        labelEnd,
	        footnoteId,
	        oldLength,
	        token,
	        max = state.posMax,
	        start = state.pos;

	    if (start + 2 >= max) { return false; }
	    if (state.src.charCodeAt(start) !== 0x5E/* ^ */) { return false; }
	    if (state.src.charCodeAt(start + 1) !== 0x5B/* [ */) { return false; }

	    labelStart = start + 2;
	    labelEnd = parseLinkLabel(state, start + 1);

	    // parser failed to find ']', so it's not a valid note
	    if (labelEnd < 0) { return false; }

	    // We found the end of the link, and know for a fact it's a valid link;
	    // so all that's left to do is to call tokenizer.
	    //
	    if (!silent) {
	      if (!state.env.footnotes) { state.env.footnotes = {}; }
	      if (!state.env.footnotes.list) { state.env.footnotes.list = []; }
	      footnoteId = state.env.footnotes.list.length;

	      state.pos = labelStart;
	      state.posMax = labelEnd;

	      token      = state.push('footnote_ref', '', 0);
	      token.meta = { id: footnoteId };

	      oldLength = state.tokens.length;
	      state.md.inline.tokenize(state);
	      state.env.footnotes.list[footnoteId] = { tokens: state.tokens.splice(oldLength) };
	    }

	    state.pos = labelEnd + 1;
	    state.posMax = max;
	    return true;
	  }

	  // Process footnote references ([^...])
	  function footnote_ref(state, silent) {
	    var label,
	        pos,
	        footnoteId,
	        footnoteSubId,
	        token,
	        max = state.posMax,
	        start = state.pos;

	    // should be at least 4 chars - "[^x]"
	    if (start + 3 > max) { return false; }

	    if (!state.env.footnotes || !state.env.footnotes.refs) { return false; }
	    if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
	    if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) { return false; }

	    for (pos = start + 2; pos < max; pos++) {
	      if (state.src.charCodeAt(pos) === 0x20) { return false; }
	      if (state.src.charCodeAt(pos) === 0x0A) { return false; }
	      if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
	        break;
	      }
	    }

	    if (pos === start + 2) { return false; } // no empty footnote labels
	    if (pos >= max) { return false; }
	    pos++;

	    label = state.src.slice(start + 2, pos - 1);
	    if (typeof state.env.footnotes.refs[':' + label] === 'undefined') { return false; }

	    if (!silent) {
	      if (!state.env.footnotes.list) { state.env.footnotes.list = []; }

	      if (state.env.footnotes.refs[':' + label] < 0) {
	        footnoteId = state.env.footnotes.list.length;
	        state.env.footnotes.list[footnoteId] = { label: label, count: 0 };
	        state.env.footnotes.refs[':' + label] = footnoteId;
	      } else {
	        footnoteId = state.env.footnotes.refs[':' + label];
	      }

	      footnoteSubId = state.env.footnotes.list[footnoteId].count;
	      state.env.footnotes.list[footnoteId].count++;

	      token      = state.push('footnote_ref', '', 0);
	      token.meta = { id: footnoteId, subId: footnoteSubId };
	    }

	    state.pos = pos;
	    state.posMax = max;
	    return true;
	  }

	  // Glue footnote tokens to end of token stream
	  function footnote_tail(state) {
	    var i, l, j, t, lastParagraph, list, token, tokens, current, currentLabel,
	        insideRef = false,
	        refTokens = {};

	    if (!state.env.footnotes) { return; }

	    state.tokens = state.tokens.filter(function(tok) {
	      if (tok.type === 'footnote_reference_open') {
	        insideRef = true;
	        current = [];
	        currentLabel = tok.meta.label;
	        return false;
	      }
	      if (tok.type === 'footnote_reference_close') {
	        insideRef = false;
	        // prepend ':' to avoid conflict with Object.prototype members
	        refTokens[':' + currentLabel] = current;
	        return false;
	      }
	      if (insideRef) { current.push(tok); }
	      return !insideRef;
	    });

	    if (!state.env.footnotes.list) { return; }
	    list = state.env.footnotes.list;

	    token = new state.Token('footnote_block_open', '', 1);
	    state.tokens.push(token);

	    for (i = 0, l = list.length; i < l; i++) {
	      token      = new state.Token('footnote_open', '', 1);
	      token.meta = { id: i };
	      state.tokens.push(token);

	      if (list[i].tokens) {
	        tokens = [];

	        token          = new state.Token('paragraph_open', 'p', 1);
	        token.block    = true;
	        tokens.push(token);

	        token          = new state.Token('inline', '', 0);
	        token.children = list[i].tokens;
	        token.content  = '';
	        tokens.push(token);

	        token          = new state.Token('paragraph_close', 'p', -1);
	        token.block    = true;
	        tokens.push(token);

	      } else if (list[i].label) {
	        tokens = refTokens[':' + list[i].label];
	      }

	      state.tokens = state.tokens.concat(tokens);
	      if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
	        lastParagraph = state.tokens.pop();
	      } else {
	        lastParagraph = null;
	      }

	      t = list[i].count > 0 ? list[i].count : 1;
	      for (j = 0; j < t; j++) {
	        token      = new state.Token('footnote_anchor', '', 0);
	        token.meta = { id: i, subId: j };
	        state.tokens.push(token);
	      }

	      if (lastParagraph) {
	        state.tokens.push(lastParagraph);
	      }

	      token = new state.Token('footnote_close', '', -1);
	      state.tokens.push(token);
	    }

	    token = new state.Token('footnote_block_close', '', -1);
	    state.tokens.push(token);
	  }

	  md.block.ruler.before('reference', 'footnote_def', footnote_def, { alt: [ 'paragraph', 'reference' ] });
	  md.inline.ruler.after('image', 'footnote_inline', footnote_inline);
	  md.inline.ruler.after('footnote_inline', 'footnote_ref', footnote_ref);
	  md.core.ruler.after('inline', 'footnote_tail', footnote_tail);
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	// parse sequence of markers,
	// "start" should point at a valid marker
	function scanDelims(state, start) {
	  var pos = start, lastChar, nextChar, count,
	      isLastWhiteSpace, isLastPunctChar,
	      isNextWhiteSpace, isNextPunctChar,
	      can_open = true,
	      can_close = true,
	      max = state.posMax,
	      marker = state.src.charCodeAt(start),
	      isWhiteSpace = state.md.utils.isWhiteSpace,
	      isPunctChar = state.md.utils.isPunctChar,
	      isMdAsciiPunct = state.md.utils.isMdAsciiPunct;

	  // treat beginning of the line as a whitespace
	  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : 0x20;

	  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }

	  if (pos >= max) {
	    can_open = false;
	  }

	  count = pos - start;

	  // treat end of the line as a whitespace
	  nextChar = pos < max ? state.src.charCodeAt(pos) : 0x20;

	  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
	  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

	  isLastWhiteSpace = isWhiteSpace(lastChar);
	  isNextWhiteSpace = isWhiteSpace(nextChar);

	  if (isNextWhiteSpace) {
	    can_open = false;
	  } else if (isNextPunctChar) {
	    if (!(isLastWhiteSpace || isLastPunctChar)) {
	      can_open = false;
	    }
	  }

	  if (isLastWhiteSpace) {
	    can_close = false;
	  } else if (isLastPunctChar) {
	    if (!(isNextWhiteSpace || isNextPunctChar)) {
	      can_close = false;
	    }
	  }

	  return {
	    can_open: can_open,
	    can_close: can_close,
	    delims: count
	  };
	}


	function insert(state, silent) {
	  var startCount,
	      count,
	      tagCount,
	      found,
	      stack,
	      res,
	      token,
	      max = state.posMax,
	      start = state.pos,
	      marker = state.src.charCodeAt(start);

	  if (marker !== 0x2B/* + */) { return false; }
	  if (silent) { return false; } // don't run any pairs in validation mode

	  res = scanDelims(state, start);
	  startCount = res.delims;

	  if (!res.can_open) {
	    state.pos += startCount;
	    // Earlier we checked !silent, but this implementation does not need it
	    state.pending += state.src.slice(start, state.pos);
	    return true;
	  }

	  stack = Math.floor(startCount / 2);
	  if (stack <= 0) { return false; }
	  state.pos = start + startCount;

	  while (state.pos < max) {
	    if (state.src.charCodeAt(state.pos) === marker) {
	      res = scanDelims(state, state.pos);
	      count = res.delims;
	      tagCount = Math.floor(count / 2);
	      if (res.can_close) {
	        if (tagCount >= stack) {
	          state.pos += count - 2;
	          found = true;
	          break;
	        }
	        stack -= tagCount;
	        state.pos += count;
	        continue;
	      }

	      if (res.can_open) { stack += tagCount; }
	      state.pos += count;
	      continue;
	    }

	    state.md.inline.skipToken(state);
	  }

	  if (!found) {
	    // parser failed to find ending tag, so it's not valid emphasis
	    state.pos = start;
	    return false;
	  }

	  // found!
	  state.posMax = state.pos;
	  state.pos = start + 2;

	  // Earlier we checked !silent, but this implementation does not need it
	  token        = state.push('ins_open', 'ins', 1);
	  token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);

	  state.md.inline.tokenize(state);

	  token        = state.push('ins_close', 'ins', -1);
	  token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);

	  state.pos = state.posMax + 2;
	  state.posMax = max;
	  return true;
	}


	module.exports = function ins_plugin(md) {
	  md.inline.ruler.before('emphasis', 'ins', insert);
	};


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	// parse sequence of markers,
	// "start" should point at a valid marker
	function scanDelims(state, start) {
	  var pos = start, lastChar, nextChar, count,
	      isLastWhiteSpace, isLastPunctChar,
	      isNextWhiteSpace, isNextPunctChar,
	      can_open = true,
	      can_close = true,
	      max = state.posMax,
	      marker = state.src.charCodeAt(start),
	      isWhiteSpace = state.md.utils.isWhiteSpace,
	      isPunctChar = state.md.utils.isPunctChar,
	      isMdAsciiPunct = state.md.utils.isMdAsciiPunct;

	  // treat beginning of the line as a whitespace
	  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : 0x20;

	  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }

	  if (pos >= max) {
	    can_open = false;
	  }

	  count = pos - start;

	  // treat end of the line as a whitespace
	  nextChar = pos < max ? state.src.charCodeAt(pos) : 0x20;

	  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
	  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

	  isLastWhiteSpace = isWhiteSpace(lastChar);
	  isNextWhiteSpace = isWhiteSpace(nextChar);

	  if (isNextWhiteSpace) {
	    can_open = false;
	  } else if (isNextPunctChar) {
	    if (!(isLastWhiteSpace || isLastPunctChar)) {
	      can_open = false;
	    }
	  }

	  if (isLastWhiteSpace) {
	    can_close = false;
	  } else if (isLastPunctChar) {
	    if (!(isNextWhiteSpace || isNextPunctChar)) {
	      can_close = false;
	    }
	  }

	  return {
	    can_open: can_open,
	    can_close: can_close,
	    delims: count
	  };
	}


	function mark(state, silent) {
	  var startCount,
	      count,
	      tagCount,
	      found,
	      stack,
	      res,
	      token,
	      max = state.posMax,
	      start = state.pos,
	      marker = state.src.charCodeAt(start);

	  if (marker !== 0x3D/* = */) { return false; }
	  if (silent) { return false; } // don't run any pairs in validation mode

	  res = scanDelims(state, start);
	  startCount = res.delims;

	  if (!res.can_open) {
	    state.pos += startCount;
	    // Earlier we checked !silent, but this implementation does not need it
	    state.pending += state.src.slice(start, state.pos);
	    return true;
	  }

	  stack = Math.floor(startCount / 2);
	  if (stack <= 0) { return false; }
	  state.pos = start + startCount;

	  while (state.pos < max) {
	    if (state.src.charCodeAt(state.pos) === marker) {
	      res = scanDelims(state, state.pos);
	      count = res.delims;
	      tagCount = Math.floor(count / 2);
	      if (res.can_close) {
	        if (tagCount >= stack) {
	          state.pos += count - 2;
	          found = true;
	          break;
	        }
	        stack -= tagCount;
	        state.pos += count;
	        continue;
	      }

	      if (res.can_open) { stack += tagCount; }
	      state.pos += count;
	      continue;
	    }

	    state.md.inline.skipToken(state);
	  }

	  if (!found) {
	    // parser failed to find ending tag, so it's not valid emphasis
	    state.pos = start;
	    return false;
	  }

	  // found!
	  state.posMax = state.pos;
	  state.pos = start + 2;

	  // Earlier we checked !silent, but this implementation does not need it
	  token        = state.push('mark_open', 'mark', 1);
	  token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);

	  state.md.inline.tokenize(state);

	  token        = state.push('mark_close', 'mark', -1);
	  token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);

	  state.pos = state.posMax + 2;
	  state.posMax = max;
	  return true;
	}


	module.exports = function mark_plugin(md) {
	  md.inline.ruler.before('emphasis', 'mark', mark);
	};


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// Process ~subscript~

	'use strict';

	// same as UNESCAPE_MD_RE plus a space
	var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;


	function subscript(state, silent) {
	  var found,
	      content,
	      token,
	      max = state.posMax,
	      start = state.pos;

	  if (state.src.charCodeAt(start) !== 0x7E/* ~ */) { return false; }
	  if (silent) { return false; } // don't run any pairs in validation mode
	  if (start + 2 >= max) { return false; }

	  state.pos = start + 1;

	  while (state.pos < max) {
	    if (state.src.charCodeAt(state.pos) === 0x7E/* ~ */) {
	      found = true;
	      break;
	    }

	    state.md.inline.skipToken(state);
	  }

	  if (!found || start + 1 === state.pos) {
	    state.pos = start;
	    return false;
	  }

	  content = state.src.slice(start + 1, state.pos);

	  // don't allow unescaped spaces/newlines inside
	  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
	    state.pos = start;
	    return false;
	  }

	  // found!
	  state.posMax = state.pos;
	  state.pos = start + 1;

	  // Earlier we checked !silent, but this implementation does not need it
	  token         = state.push('sub_open', 'sub', 1);
	  token.markup  = '~';

	  token         = state.push('text', '', 0);
	  token.content = content.replace(UNESCAPE_RE, '$1');

	  token         = state.push('sub_close', 'sub', -1);
	  token.markup  = '~';

	  state.pos = state.posMax + 1;
	  state.posMax = max;
	  return true;
	}


	module.exports = function sub_plugin(md) {
	  md.inline.ruler.after('emphasis', 'sub', subscript);
	};


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// Process ^superscript^

	'use strict';

	// same as UNESCAPE_MD_RE plus a space
	var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

	function superscript(state, silent) {
	  var found,
	      content,
	      token,
	      max = state.posMax,
	      start = state.pos;

	  if (state.src.charCodeAt(start) !== 0x5E/* ^ */) { return false; }
	  if (silent) { return false; } // don't run any pairs in validation mode
	  if (start + 2 >= max) { return false; }

	  state.pos = start + 1;

	  while (state.pos < max) {
	    if (state.src.charCodeAt(state.pos) === 0x5E/* ^ */) {
	      found = true;
	      break;
	    }

	    state.md.inline.skipToken(state);
	  }

	  if (!found || start + 1 === state.pos) {
	    state.pos = start;
	    return false;
	  }

	  content = state.src.slice(start + 1, state.pos);

	  // don't allow unescaped spaces/newlines inside
	  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
	    state.pos = start;
	    return false;
	  }

	  // found!
	  state.posMax = state.pos;
	  state.pos = start + 1;

	  // Earlier we checked !silent, but this implementation does not need it
	  token         = state.push('sup_open', 'sup', 1);
	  token.markup  = '^';

	  token         = state.push('text', '', 0);
	  token.content = content.replace(UNESCAPE_RE, '$1');

	  token         = state.push('sup_close', 'sup', -1);
	  token.markup  = '^';

	  state.pos = state.posMax + 1;
	  state.posMax = max;
	  return true;
	}


	module.exports = function sup_plugin(md) {
	  md.inline.ruler.after('emphasis', 'sup', superscript);
	};


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	module.exports = __webpack_require__(122);


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// List of valid html blocks names, accorting to commonmark spec
	// http://jgm.github.io/CommonMark/spec.html#html-blocks

	'use strict';

	var html_blocks = {};

	[
	  'article',
	  'aside',
	  'button',
	  'blockquote',
	  'body',
	  'canvas',
	  'caption',
	  'col',
	  'colgroup',
	  'dd',
	  'div',
	  'dl',
	  'dt',
	  'embed',
	  'fieldset',
	  'figcaption',
	  'figure',
	  'footer',
	  'form',
	  'h1',
	  'h2',
	  'h3',
	  'h4',
	  'h5',
	  'h6',
	  'header',
	  'hgroup',
	  'hr',
	  'iframe',
	  'li',
	  'map',
	  'object',
	  'ol',
	  'output',
	  'p',
	  'pre',
	  'progress',
	  'script',
	  'section',
	  'style',
	  'table',
	  'tbody',
	  'td',
	  'textarea',
	  'tfoot',
	  'th',
	  'tr',
	  'thead',
	  'ul',
	  'video'
	].forEach(function (name) { html_blocks[name] = true; });


	module.exports = html_blocks;


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	// Regexps to match html elements

	'use strict';

	var attr_name     = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

	var unquoted      = '[^"\'=<>`\\x00-\\x20]+';
	var single_quoted = "'[^']*'";
	var double_quoted = '"[^"]*"';

	var attr_value  = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

	var attribute   = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

	var open_tag    = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';

	var close_tag   = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
	var comment     = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
	var processing  = '<[?].*?[?]>';
	var declaration = '<![A-Z]+\\s+[^>]*>';
	var cdata       = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

	var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
	                        '|' + processing + '|' + declaration + '|' + cdata + ')');

	module.exports.HTML_TAG_RE = HTML_TAG_RE;


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	// List of valid url schemas, accorting to commonmark spec
	// http://jgm.github.io/CommonMark/spec.html#autolinks

	'use strict';


	module.exports = [
	  'coap',
	  'doi',
	  'javascript',
	  'aaa',
	  'aaas',
	  'about',
	  'acap',
	  'cap',
	  'cid',
	  'crid',
	  'data',
	  'dav',
	  'dict',
	  'dns',
	  'file',
	  'ftp',
	  'geo',
	  'go',
	  'gopher',
	  'h323',
	  'http',
	  'https',
	  'iax',
	  'icap',
	  'im',
	  'imap',
	  'info',
	  'ipp',
	  'iris',
	  'iris.beep',
	  'iris.xpc',
	  'iris.xpcs',
	  'iris.lwz',
	  'ldap',
	  'mailto',
	  'mid',
	  'msrp',
	  'msrps',
	  'mtqp',
	  'mupdate',
	  'news',
	  'nfs',
	  'ni',
	  'nih',
	  'nntp',
	  'opaquelocktoken',
	  'pop',
	  'pres',
	  'rtsp',
	  'service',
	  'session',
	  'shttp',
	  'sieve',
	  'sip',
	  'sips',
	  'sms',
	  'snmp',
	  'soap.beep',
	  'soap.beeps',
	  'tag',
	  'tel',
	  'telnet',
	  'tftp',
	  'thismessage',
	  'tn3270',
	  'tip',
	  'tv',
	  'urn',
	  'vemmi',
	  'ws',
	  'wss',
	  'xcon',
	  'xcon-userid',
	  'xmlrpc.beep',
	  'xmlrpc.beeps',
	  'xmpp',
	  'z39.50r',
	  'z39.50s',
	  'adiumxtra',
	  'afp',
	  'afs',
	  'aim',
	  'apt',
	  'attachment',
	  'aw',
	  'beshare',
	  'bitcoin',
	  'bolo',
	  'callto',
	  'chrome',
	  'chrome-extension',
	  'com-eventbrite-attendee',
	  'content',
	  'cvs',
	  'dlna-playsingle',
	  'dlna-playcontainer',
	  'dtn',
	  'dvb',
	  'ed2k',
	  'facetime',
	  'feed',
	  'finger',
	  'fish',
	  'gg',
	  'git',
	  'gizmoproject',
	  'gtalk',
	  'hcp',
	  'icon',
	  'ipn',
	  'irc',
	  'irc6',
	  'ircs',
	  'itms',
	  'jar',
	  'jms',
	  'keyparc',
	  'lastfm',
	  'ldaps',
	  'magnet',
	  'maps',
	  'market',
	  'message',
	  'mms',
	  'ms-help',
	  'msnim',
	  'mumble',
	  'mvn',
	  'notes',
	  'oid',
	  'palm',
	  'paparazzi',
	  'platform',
	  'proxy',
	  'psyc',
	  'query',
	  'res',
	  'resource',
	  'rmi',
	  'rsync',
	  'rtmp',
	  'secondlife',
	  'sftp',
	  'sgn',
	  'skype',
	  'smb',
	  'soldat',
	  'spotify',
	  'ssh',
	  'steam',
	  'svn',
	  'teamspeak',
	  'things',
	  'udp',
	  'unreal',
	  'ut2004',
	  'ventrilo',
	  'view-source',
	  'webcal',
	  'wtai',
	  'wyciwyg',
	  'xfire',
	  'xri',
	  'ymsgr'
	];


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	// Just a shortcut for bulk export
	'use strict';


	exports.parseLinkLabel       = __webpack_require__(22);
	exports.parseLinkDestination = __webpack_require__(14);
	exports.parseLinkTitle       = __webpack_require__(15);


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	// Main perser class

	'use strict';


	var utils        = __webpack_require__(1);
	var helpers      = __webpack_require__(121);
	var Renderer     = __webpack_require__(129);
	var ParserCore   = __webpack_require__(124);
	var ParserBlock  = __webpack_require__(123);
	var ParserInline = __webpack_require__(125);
	var LinkifyIt    = __webpack_require__(161);
	var mdurl        = __webpack_require__(45);
	var punycode     = __webpack_require__(173);


	var config = {
	  'default': __webpack_require__(127),
	  zero: __webpack_require__(128),
	  commonmark: __webpack_require__(126)
	};

	////////////////////////////////////////////////////////////////////////////////
	//
	// This validator can prohibit more than really needed to prevent XSS. It's a
	// tradeoff to keep code simple and to be secure by default.
	//
	// If you need different setup - override validator method as you wish. Or
	// replace it with dummy function and use external sanitizer.
	//

	var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
	var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

	function validateLink(url) {
	  // url should be normalized at this point, and existing entities are decoded
	  var str = url.trim().toLowerCase();

	  return BAD_PROTO_RE.test(str) ? (GOOD_DATA_RE.test(str) ? true : false) : true;
	}

	////////////////////////////////////////////////////////////////////////////////


	var RECODE_HOSTNAME_FOR = [ 'http:', 'https:', 'mailto:' ];

	function normalizeLink(url) {
	  var parsed = mdurl.parse(url, true);

	  if (parsed.hostname) {
	    // Encode hostnames in urls like:
	    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
	    //
	    // We don't encode unknown schemas, because it's likely that we encode
	    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
	    //
	    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
	      try {
	        parsed.hostname = punycode.toASCII(parsed.hostname);
	      } catch(er) {}
	    }
	  }

	  return mdurl.encode(mdurl.format(parsed));
	}

	function normalizeLinkText(url) {
	  var parsed = mdurl.parse(url, true);

	  if (parsed.hostname) {
	    // Encode hostnames in urls like:
	    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
	    //
	    // We don't encode unknown schemas, because it's likely that we encode
	    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
	    //
	    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
	      try {
	        parsed.hostname = punycode.toUnicode(parsed.hostname);
	      } catch(er) {}
	    }
	  }

	  return mdurl.decode(mdurl.format(parsed));
	}


	/**
	 * class MarkdownIt
	 *
	 * Main parser/renderer class.
	 *
	 * ##### Usage
	 *
	 * ```javascript
	 * // node.js, "classic" way:
	 * var MarkdownIt = require('markdown-it'),
	 *     md = new MarkdownIt();
	 * var result = md.render('# markdown-it rulezz!');
	 *
	 * // node.js, the same, but with sugar:
	 * var md = require('markdown-it')();
	 * var result = md.render('# markdown-it rulezz!');
	 *
	 * // browser without AMD, added to "window" on script load
	 * // Note, there are no dash.
	 * var md = window.markdownit();
	 * var result = md.render('# markdown-it rulezz!');
	 * ```
	 *
	 * Single line rendering, without paragraph wrap:
	 *
	 * ```javascript
	 * var md = require('markdown-it')();
	 * var result = md.renderInline('__markdown-it__ rulezz!');
	 * ```
	 **/

	/**
	 * new MarkdownIt([presetName, options])
	 * - presetName (String): optional, `commonmark` / `zero`
	 * - options (Object)
	 *
	 * Creates parser instanse with given config. Can be called without `new`.
	 *
	 * ##### presetName
	 *
	 * MarkdownIt provides named presets as a convenience to quickly
	 * enable/disable active syntax rules and options for common use cases.
	 *
	 * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
	 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
	 * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
	 *   similar to GFM, used when no preset name given. Enables all available rules,
	 *   but still without html, typographer & autolinker.
	 * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
	 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
	 *   For example, when you need only `bold` and `italic` markup and nothing else.
	 *
	 * ##### options:
	 *
	 * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
	 *   That's not safe! You may need external sanitizer to protect output from XSS.
	 *   It's better to extend features via plugins, instead of enabling HTML.
	 * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
	 *   (`<br />`). This is needed only for full CommonMark compatibility. In real
	 *   world you will need HTML output.
	 * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
	 * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
	 *   Can be useful for external highlighters.
	 * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
	 * - __typographer__  - `false`. Set `true` to enable [some language-neutral
	 *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
	 *   quotes beautification (smartquotes).
	 * - __quotes__ - `“”‘’`, string. Double + single quotes replacement pairs, when
	 *   typographer enabled and smartquotes on. Set doubles to '«»' for Russian,
	 *   '„“' for German.
	 * - __highlight__ - `null`. Highlighter function for fenced code blocks.
	 *   Highlighter `function (str, lang)` should return escaped HTML. It can also
	 *   return empty string if the source was not changed and should be escaped externaly.
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * // commonmark mode
	 * var md = require('markdown-it')('commonmark');
	 *
	 * // default mode
	 * var md = require('markdown-it')();
	 *
	 * // enable everything
	 * var md = require('markdown-it')({
	 *   html: true,
	 *   linkify: true,
	 *   typographer: true
	 * });
	 * ```
	 *
	 * ##### Syntax highlighting
	 *
	 * ```js
	 * var hljs = require('highlight.js') // https://highlightjs.org/
	 *
	 * var md = require('markdown-it')({
	 *   highlight: function (str, lang) {
	 *     if (lang && hljs.getLanguage(lang)) {
	 *       try {
	 *         return hljs.highlight(lang, str).value;
	 *       } catch (__) {}
	 *     }
	 *
	 *     try {
	 *       return hljs.highlightAuto(str).value;
	 *     } catch (__) {}
	 *
	 *     return ''; // use external default escaping
	 *   }
	 * });
	 * ```
	 **/
	function MarkdownIt(presetName, options) {
	  if (!(this instanceof MarkdownIt)) {
	    return new MarkdownIt(presetName, options);
	  }

	  if (!options) {
	    if (!utils.isString(presetName)) {
	      options = presetName || {};
	      presetName = 'default';
	    }
	  }

	  /**
	   * MarkdownIt#inline -> ParserInline
	   *
	   * Instance of [[ParserInline]]. You may need it to add new rules when
	   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
	   * [[MarkdownIt.enable]].
	   **/
	  this.inline = new ParserInline();

	  /**
	   * MarkdownIt#block -> ParserBlock
	   *
	   * Instance of [[ParserBlock]]. You may need it to add new rules when
	   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
	   * [[MarkdownIt.enable]].
	   **/
	  this.block = new ParserBlock();

	  /**
	   * MarkdownIt#core -> Core
	   *
	   * Instance of [[Core]] chain executor. You may need it to add new rules when
	   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
	   * [[MarkdownIt.enable]].
	   **/
	  this.core = new ParserCore();

	  /**
	   * MarkdownIt#renderer -> Renderer
	   *
	   * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
	   * rules for new token types, generated by plugins.
	   *
	   * ##### Example
	   *
	   * ```javascript
	   * var md = require('markdown-it')();
	   *
	   * function myToken(tokens, idx, options, env, self) {
	   *   //...
	   *   return result;
	   * };
	   *
	   * md.renderer.rules['my_token'] = myToken
	   * ```
	   *
	   * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
	   **/
	  this.renderer = new Renderer();

	  /**
	   * MarkdownIt#linkify -> LinkifyIt
	   *
	   * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
	   * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
	   * rule.
	   **/
	  this.linkify = new LinkifyIt();

	  /**
	   * MarkdownIt#validateLink(url) -> Boolean
	   *
	   * Link validation function. CommonMark allows too much in links. By default
	   * we disable `javascript:` and `vbscript:` schemas. You can change this
	   * behaviour.
	   *
	   * ```javascript
	   * var md = require('markdown-it')();
	   * // enable everything
	   * md.validateLink = function () { return true; }
	   * ```
	   **/
	  this.validateLink = validateLink;

	  /**
	   * MarkdownIt#normalizeLink(url) -> String
	   *
	   * Function used to encode link url to a machine-readable format,
	   * which includes url-encoding, punycode, etc.
	   **/
	  this.normalizeLink = normalizeLink;

	  /**
	   * MarkdownIt#normalizeLinkText(url) -> String
	   *
	   * Function used to decode link url to a human-readable format`
	   **/
	  this.normalizeLinkText = normalizeLinkText;


	  // Expose utils & helpers for easy acces from plugins

	  /**
	   * MarkdownIt#utils -> utils
	   *
	   * Assorted utility functions, useful to write plugins. See details
	   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
	   **/
	  this.utils = utils;

	  /**
	   * MarkdownIt#helpers -> helpers
	   *
	   * Link components parser functions, useful to write plugins. See details
	   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
	   **/
	  this.helpers = helpers;


	  this.options = {};
	  this.configure(presetName);

	  if (options) { this.set(options); }
	}


	/** chainable
	 * MarkdownIt.set(options)
	 *
	 * Set parser options (in the same format as in constructor). Probably, you
	 * will never need it, but you can change options after constructor call.
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * var md = require('markdown-it')()
	 *             .set({ html: true, breaks: true })
	 *             .set({ typographer, true });
	 * ```
	 *
	 * __Note:__ To achieve the best possible performance, don't modify a
	 * `markdown-it` instance options on the fly. If you need multiple configurations
	 * it's best to create multiple instances and initialize each with separate
	 * config.
	 **/
	MarkdownIt.prototype.set = function (options) {
	  utils.assign(this.options, options);
	  return this;
	};


	/** chainable, internal
	 * MarkdownIt.configure(presets)
	 *
	 * Batch load of all options and compenent settings. This is internal method,
	 * and you probably will not need it. But if you with - see available presets
	 * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
	 *
	 * We strongly recommend to use presets instead of direct config loads. That
	 * will give better compatibility with next versions.
	 **/
	MarkdownIt.prototype.configure = function (presets) {
	  var self = this, presetName;

	  if (utils.isString(presets)) {
	    presetName = presets;
	    presets = config[presetName];
	    if (!presets) { throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name'); }
	  }

	  if (!presets) { throw new Error('Wrong `markdown-it` preset, can\'t be empty'); }

	  if (presets.options) { self.set(presets.options); }

	  if (presets.components) {
	    Object.keys(presets.components).forEach(function (name) {
	      if (presets.components[name].rules) {
	        self[name].ruler.enableOnly(presets.components[name].rules);
	      }
	    });
	  }
	  return this;
	};


	/** chainable
	 * MarkdownIt.enable(list, ignoreInvalid)
	 * - list (String|Array): rule name or list of rule names to enable
	 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
	 *
	 * Enable list or rules. It will automatically find appropriate components,
	 * containing rules with given names. If rule not found, and `ignoreInvalid`
	 * not set - throws exception.
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * var md = require('markdown-it')()
	 *             .enable(['sub', 'sup'])
	 *             .disable('smartquotes');
	 * ```
	 **/
	MarkdownIt.prototype.enable = function (list, ignoreInvalid) {
	  var result = [];

	  if (!Array.isArray(list)) { list = [ list ]; }

	  [ 'core', 'block', 'inline' ].forEach(function (chain) {
	    result = result.concat(this[chain].ruler.enable(list, true));
	  }, this);

	  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

	  if (missed.length && !ignoreInvalid) {
	    throw new Error('MarkdownIt. Failed to enable unknown rule(s): ' + missed);
	  }

	  return this;
	};


	/** chainable
	 * MarkdownIt.disable(list, ignoreInvalid)
	 * - list (String|Array): rule name or list of rule names to disable.
	 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
	 *
	 * The same as [[MarkdownIt.enable]], but turn specified rules off.
	 **/
	MarkdownIt.prototype.disable = function (list, ignoreInvalid) {
	  var result = [];

	  if (!Array.isArray(list)) { list = [ list ]; }

	  [ 'core', 'block', 'inline' ].forEach(function (chain) {
	    result = result.concat(this[chain].ruler.disable(list, true));
	  }, this);

	  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

	  if (missed.length && !ignoreInvalid) {
	    throw new Error('MarkdownIt. Failed to disable unknown rule(s): ' + missed);
	  }
	  return this;
	};


	/** chainable
	 * MarkdownIt.use(plugin, params)
	 *
	 * Load specified plugin with given params into current parser instance.
	 * It's just a sugar to call `plugin(md, params)` with curring.
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * var iterator = require('markdown-it-for-inline');
	 * var md = require('markdown-it')()
	 *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
	 *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
	 *             });
	 * ```
	 **/
	MarkdownIt.prototype.use = function (plugin /*, params, ... */) {
	  var args = [ this ].concat(Array.prototype.slice.call(arguments, 1));
	  plugin.apply(plugin, args);
	  return this;
	};


	/** internal
	 * MarkdownIt.parse(src, env) -> Array
	 * - src (String): source string
	 * - env (Object): environment sandbox
	 *
	 * Parse input string and returns list of block tokens (special token type
	 * "inline" will contain list of inline tokens). You should not call this
	 * method directly, until you write custom renderer (for example, to produce
	 * AST).
	 *
	 * `env` is used to pass data between "distributed" rules and return additional
	 * metadata like reference info, needed for for renderer. It also can be used to
	 * inject data in specific cases. Usually, you will be ok to pass `{}`,
	 * and then pass updated object to renderer.
	 **/
	MarkdownIt.prototype.parse = function (src, env) {
	  var state = new this.core.State(src, this, env);

	  this.core.process(state);

	  return state.tokens;
	};


	/**
	 * MarkdownIt.render(src [, env]) -> String
	 * - src (String): source string
	 * - env (Object): environment sandbox
	 *
	 * Render markdown string into html. It does all magic for you :).
	 *
	 * `env` can be used to inject additional metadata (`{}` by default).
	 * But you will not need it with high probability. See also comment
	 * in [[MarkdownIt.parse]].
	 **/
	MarkdownIt.prototype.render = function (src, env) {
	  env = env || {};

	  return this.renderer.render(this.parse(src, env), this.options, env);
	};


	/** internal
	 * MarkdownIt.parseInline(src, env) -> Array
	 * - src (String): source string
	 * - env (Object): environment sandbox
	 *
	 * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
	 * block tokens list with the single `inline` element, containing parsed inline
	 * tokens in `children` property. Also updates `env` object.
	 **/
	MarkdownIt.prototype.parseInline = function (src, env) {
	  var state = new this.core.State(src, this, env);

	  state.inlineMode = true;
	  this.core.process(state);

	  return state.tokens;
	};


	/**
	 * MarkdownIt.renderInline(src [, env]) -> String
	 * - src (String): source string
	 * - env (Object): environment sandbox
	 *
	 * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
	 * will NOT be wrapped into `<p>` tags.
	 **/
	MarkdownIt.prototype.renderInline = function (src, env) {
	  env = env || {};

	  return this.renderer.render(this.parseInline(src, env), this.options, env);
	};


	module.exports = MarkdownIt;


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	/** internal
	 * class ParserBlock
	 *
	 * Block-level tokenizer.
	 **/
	'use strict';


	var Ruler           = __webpack_require__(23);


	var _rules = [
	  // First 2 params - rule name & source. Secondary array - list of rules,
	  // which can be terminated by this one.
	  [ 'code',       __webpack_require__(131) ],
	  [ 'fence',      __webpack_require__(132),      [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
	  [ 'blockquote', __webpack_require__(130), [ 'paragraph', 'reference', 'list' ] ],
	  [ 'hr',         __webpack_require__(134),         [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
	  [ 'list',       __webpack_require__(137),       [ 'paragraph', 'reference', 'blockquote' ] ],
	  [ 'reference',  __webpack_require__(139) ],
	  [ 'heading',    __webpack_require__(133),    [ 'paragraph', 'reference', 'blockquote' ] ],
	  [ 'lheading',   __webpack_require__(136) ],
	  [ 'html_block', __webpack_require__(135), [ 'paragraph', 'reference', 'blockquote' ] ],
	  [ 'table',      __webpack_require__(141),      [ 'paragraph', 'reference' ] ],
	  [ 'paragraph',  __webpack_require__(138) ]
	];


	/**
	 * new ParserBlock()
	 **/
	function ParserBlock() {
	  /**
	   * ParserBlock#ruler -> Ruler
	   *
	   * [[Ruler]] instance. Keep configuration of block rules.
	   **/
	  this.ruler = new Ruler();

	  for (var i = 0; i < _rules.length; i++) {
	    this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
	  }
	}


	// Generate tokens for input range
	//
	ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
	  var ok, i,
	      rules = this.ruler.getRules(''),
	      len = rules.length,
	      line = startLine,
	      hasEmptyLines = false,
	      maxNesting = state.md.options.maxNesting;

	  while (line < endLine) {
	    state.line = line = state.skipEmptyLines(line);
	    if (line >= endLine) { break; }

	    // Termination condition for nested calls.
	    // Nested calls currently used for blockquotes & lists
	    if (state.tShift[line] < state.blkIndent) { break; }

	    // If nesting level exceeded - skip tail to the end. That's not ordinary
	    // situation and we should not care about content.
	    if (state.level >= maxNesting) {
	      state.line = endLine;
	      break;
	    }

	    // Try all possible rules.
	    // On success, rule should:
	    //
	    // - update `state.line`
	    // - update `state.tokens`
	    // - return true

	    for (i = 0; i < len; i++) {
	      ok = rules[i](state, line, endLine, false);
	      if (ok) { break; }
	    }

	    // set state.tight iff we had an empty line before current tag
	    // i.e. latest empty line should not count
	    state.tight = !hasEmptyLines;

	    // paragraph might "eat" one newline after it in nested lists
	    if (state.isEmpty(state.line - 1)) {
	      hasEmptyLines = true;
	    }

	    line = state.line;

	    if (line < endLine && state.isEmpty(line)) {
	      hasEmptyLines = true;
	      line++;

	      // two empty lines should stop the parser in list mode
	      if (line < endLine && state.parentType === 'list' && state.isEmpty(line)) { break; }
	      state.line = line;
	    }
	  }
	};


	/**
	 * ParserBlock.parse(str, md, env, outTokens)
	 *
	 * Process input string and push block tokens into `outTokens`
	 **/
	ParserBlock.prototype.parse = function (src, md, env, outTokens) {
	  var state;

	  if (!src) { return []; }

	  state = new this.State(src, md, env, outTokens);

	  this.tokenize(state, state.line, state.lineMax);
	};


	ParserBlock.prototype.State = __webpack_require__(140);


	module.exports = ParserBlock;


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	/** internal
	 * class Core
	 *
	 * Top-level rules executor. Glues block/inline parsers and does intermediate
	 * transformations.
	 **/
	'use strict';


	var Ruler  = __webpack_require__(23);


	var _rules = [
	  [ 'normalize',      __webpack_require__(145)      ],
	  [ 'block',          __webpack_require__(142)          ],
	  [ 'inline',         __webpack_require__(143)         ],
	  [ 'linkify',        __webpack_require__(144)        ],
	  [ 'replacements',   __webpack_require__(146)   ],
	  [ 'smartquotes',    __webpack_require__(147)    ]
	];


	/**
	 * new Core()
	 **/
	function Core() {
	  /**
	   * Core#ruler -> Ruler
	   *
	   * [[Ruler]] instance. Keep configuration of core rules.
	   **/
	  this.ruler = new Ruler();

	  for (var i = 0; i < _rules.length; i++) {
	    this.ruler.push(_rules[i][0], _rules[i][1]);
	  }
	}


	/**
	 * Core.process(state)
	 *
	 * Executes core chain rules.
	 **/
	Core.prototype.process = function (state) {
	  var i, l, rules;

	  rules = this.ruler.getRules('');

	  for (i = 0, l = rules.length; i < l; i++) {
	    rules[i](state);
	  }
	};

	Core.prototype.State = __webpack_require__(148);


	module.exports = Core;


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	/** internal
	 * class ParserInline
	 *
	 * Tokenizes paragraph content.
	 **/
	'use strict';


	var Ruler           = __webpack_require__(23);


	////////////////////////////////////////////////////////////////////////////////
	// Parser rules

	var _rules = [
	  [ 'text',            __webpack_require__(160) ],
	  [ 'newline',         __webpack_require__(157) ],
	  [ 'escape',          __webpack_require__(153) ],
	  [ 'backticks',       __webpack_require__(150) ],
	  [ 'strikethrough',   __webpack_require__(159) ],
	  [ 'emphasis',        __webpack_require__(151) ],
	  [ 'link',            __webpack_require__(156) ],
	  [ 'image',           __webpack_require__(155) ],
	  [ 'autolink',        __webpack_require__(149) ],
	  [ 'html_inline',     __webpack_require__(154) ],
	  [ 'entity',          __webpack_require__(152) ]
	];


	/**
	 * new ParserInline()
	 **/
	function ParserInline() {
	  /**
	   * ParserInline#ruler -> Ruler
	   *
	   * [[Ruler]] instance. Keep configuration of inline rules.
	   **/
	  this.ruler = new Ruler();

	  for (var i = 0; i < _rules.length; i++) {
	    this.ruler.push(_rules[i][0], _rules[i][1]);
	  }
	}


	// Skip single token by running all rules in validation mode;
	// returns `true` if any rule reported success
	//
	ParserInline.prototype.skipToken = function (state) {
	  var i, pos = state.pos,
	      rules = this.ruler.getRules(''),
	      len = rules.length,
	      maxNesting = state.md.options.maxNesting,
	      cache = state.cache;


	  if (typeof cache[pos] !== 'undefined') {
	    state.pos = cache[pos];
	    return;
	  }

	  /*istanbul ignore else*/
	  if (state.level < maxNesting) {
	    for (i = 0; i < len; i++) {
	      if (rules[i](state, true)) {
	        cache[pos] = state.pos;
	        return;
	      }
	    }
	  }

	  state.pos++;
	  cache[pos] = state.pos;
	};


	// Generate tokens for input range
	//
	ParserInline.prototype.tokenize = function (state) {
	  var ok, i,
	      rules = this.ruler.getRules(''),
	      len = rules.length,
	      end = state.posMax,
	      maxNesting = state.md.options.maxNesting;

	  while (state.pos < end) {
	    // Try all possible rules.
	    // On success, rule should:
	    //
	    // - update `state.pos`
	    // - update `state.tokens`
	    // - return true

	    if (state.level < maxNesting) {
	      for (i = 0; i < len; i++) {
	        ok = rules[i](state, false);
	        if (ok) { break; }
	      }
	    }

	    if (ok) {
	      if (state.pos >= end) { break; }
	      continue;
	    }

	    state.pending += state.src[state.pos++];
	  }

	  if (state.pending) {
	    state.pushPending();
	  }
	};


	/**
	 * ParserInline.parse(str, md, env, outTokens)
	 *
	 * Process input string and push inline tokens into `outTokens`
	 **/
	ParserInline.prototype.parse = function (str, md, env, outTokens) {
	  var state = new this.State(str, md, env, outTokens);

	  this.tokenize(state);
	};


	ParserInline.prototype.State = __webpack_require__(158);


	module.exports = ParserInline;


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	// Commonmark default options

	'use strict';


	module.exports = {
	  options: {
	    html:         true,         // Enable HTML tags in source
	    xhtmlOut:     true,         // Use '/' to close single tags (<br />)
	    breaks:       false,        // Convert '\n' in paragraphs into <br>
	    langPrefix:   'language-',  // CSS language prefix for fenced blocks
	    linkify:      false,        // autoconvert URL-like texts to links

	    // Enable some language-neutral replacements + quotes beautification
	    typographer:  false,

	    // Double + single quotes replacement pairs, when typographer enabled,
	    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
	    quotes: '\u201c\u201d\u2018\u2019' /* “”‘’ */,

	    // Highlighter function. Should return escaped HTML,
	    // or '' if input not changed
	    //
	    // function (/*str, lang*/) { return ''; }
	    //
	    highlight: null,

	    maxNesting:   20            // Internal protection, recursion limit
	  },

	  components: {

	    core: {
	      rules: [
	        'normalize',
	        'block',
	        'inline'
	      ]
	    },

	    block: {
	      rules: [
	        'blockquote',
	        'code',
	        'fence',
	        'heading',
	        'hr',
	        'html_block',
	        'lheading',
	        'list',
	        'reference',
	        'paragraph'
	      ]
	    },

	    inline: {
	      rules: [
	        'autolink',
	        'backticks',
	        'emphasis',
	        'entity',
	        'escape',
	        'html_inline',
	        'image',
	        'link',
	        'newline',
	        'text'
	      ]
	    }
	  }
	};


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	// markdown-it default options

	'use strict';


	module.exports = {
	  options: {
	    html:         false,        // Enable HTML tags in source
	    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
	    breaks:       false,        // Convert '\n' in paragraphs into <br>
	    langPrefix:   'language-',  // CSS language prefix for fenced blocks
	    linkify:      false,        // autoconvert URL-like texts to links

	    // Enable some language-neutral replacements + quotes beautification
	    typographer:  false,

	    // Double + single quotes replacement pairs, when typographer enabled,
	    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
	    quotes: '\u201c\u201d\u2018\u2019' /* “”‘’ */,

	    // Highlighter function. Should return escaped HTML,
	    // or '' if input not changed
	    //
	    // function (/*str, lang*/) { return ''; }
	    //
	    highlight: null,

	    maxNesting:   20            // Internal protection, recursion limit
	  },

	  components: {

	    core: {},
	    block: {},
	    inline: {}
	  }
	};


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	// "Zero" preset, with nothing enabled. Useful for manual configuring of simple
	// modes. For example, to parse bold/italic only.

	'use strict';


	module.exports = {
	  options: {
	    html:         false,        // Enable HTML tags in source
	    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
	    breaks:       false,        // Convert '\n' in paragraphs into <br>
	    langPrefix:   'language-',  // CSS language prefix for fenced blocks
	    linkify:      false,        // autoconvert URL-like texts to links

	    // Enable some language-neutral replacements + quotes beautification
	    typographer:  false,

	    // Double + single quotes replacement pairs, when typographer enabled,
	    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
	    quotes: '\u201c\u201d\u2018\u2019' /* “”‘’ */,

	    // Highlighter function. Should return escaped HTML,
	    // or '' if input not changed
	    //
	    // function (/*str, lang*/) { return ''; }
	    //
	    highlight: null,

	    maxNesting:   20            // Internal protection, recursion limit
	  },

	  components: {

	    core: {
	      rules: [
	        'normalize',
	        'block',
	        'inline'
	      ]
	    },

	    block: {
	      rules: [
	        'paragraph'
	      ]
	    },

	    inline: {
	      rules: [
	        'text'
	      ]
	    }
	  }
	};


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * class Renderer
	 *
	 * Generates HTML from parsed token stream. Each instance has independent
	 * copy of rules. Those can be rewritten with ease. Also, you can add new
	 * rules if you create plugin and adds new token types.
	 **/
	'use strict';


	var assign          = __webpack_require__(1).assign;
	var unescapeAll     = __webpack_require__(1).unescapeAll;
	var escapeHtml      = __webpack_require__(1).escapeHtml;


	////////////////////////////////////////////////////////////////////////////////

	var default_rules = {};


	default_rules.code_inline = function (tokens, idx /*, options, env */) {
	  return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
	};


	default_rules.code_block = function (tokens, idx /*, options, env */) {
	  return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>\n';
	};


	default_rules.fence = function (tokens, idx, options, env, self) {
	  var token = tokens[idx],
	      langName = '',
	      highlighted;

	  if (token.info) {
	    langName = unescapeAll(token.info.trim().split(/\s+/g)[0]);
	    token.attrPush([ 'class', options.langPrefix + langName ]);
	  }

	  if (options.highlight) {
	    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
	  } else {
	    highlighted = escapeHtml(token.content);
	  }

	  return  '<pre><code' + self.renderAttrs(token) + '>'
	        + highlighted
	        + '</code></pre>\n';
	};


	default_rules.image = function (tokens, idx, options, env, self) {
	  var token = tokens[idx];

	  // "alt" attr MUST be set, even if empty. Because it's mandatory and
	  // should be placed on proper position for tests.
	  //
	  // Replace content with actual value

	  token.attrs[token.attrIndex('alt')][1] =
	    self.renderInlineAsText(token.children, options, env);

	  return self.renderToken(tokens, idx, options);
	};


	default_rules.hardbreak = function (tokens, idx, options /*, env */) {
	  return options.xhtmlOut ? '<br />\n' : '<br>\n';
	};
	default_rules.softbreak = function (tokens, idx, options /*, env */) {
	  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
	};


	default_rules.text = function (tokens, idx /*, options, env */) {
	  return escapeHtml(tokens[idx].content);
	};


	default_rules.html_block = function (tokens, idx /*, options, env */) {
	  return tokens[idx].content;
	};
	default_rules.html_inline = function (tokens, idx /*, options, env */) {
	  return tokens[idx].content;
	};


	/**
	 * new Renderer()
	 *
	 * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
	 **/
	function Renderer() {

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
	   * md.renderer.rules.strong_open  = function () { return '<b>'; };
	   * md.renderer.rules.strong_close = function () { return '</b>'; };
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
	  this.rules = assign({}, default_rules);
	}


	/**
	 * Renderer.renderAttrs(token) -> String
	 *
	 * Render token attributes to string.
	 **/
	Renderer.prototype.renderAttrs = function renderAttrs(token) {
	  var i, l, result;

	  if (!token.attrs) { return ''; }

	  result = '';

	  for (i = 0, l = token.attrs.length; i < l; i++) {
	    result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
	  }

	  return result;
	};


	/**
	 * Renderer.renderToken(tokens, idx, options) -> String
	 * - tokens (Array): list of tokens
	 * - idx (Numbed): token index to render
	 * - options (Object): params of parser instance
	 *
	 * Default token renderer. Can be overriden by custom function
	 * in [[Renderer#rules]].
	 **/
	Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
	  var nextToken,
	      result = '',
	      needLf = false,
	      token = tokens[idx];

	  // Tight list paragraphs
	  if (token.hidden) {
	    return '';
	  }

	  // Insert a newline between hidden paragraph and subsequent opening
	  // block-level tag.
	  //
	  // For example, here we should insert a newline before blockquote:
	  //  - a
	  //    >
	  //
	  if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
	    result += '\n';
	  }

	  // Add token name, e.g. `<img`
	  result += (token.nesting === -1 ? '</' : '<') + token.tag;

	  // Encode attributes, e.g. `<img src="foo"`
	  result += this.renderAttrs(token);

	  // Add a slash for self-closing tags, e.g. `<img src="foo" /`
	  if (token.nesting === 0 && options.xhtmlOut) {
	    result += ' /';
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

	  result += needLf ? '>\n' : '>';

	  return result;
	};


	/**
	 * Renderer.renderInline(tokens, options, env) -> String
	 * - tokens (Array): list on block tokens to renter
	 * - options (Object): params of parser instance
	 * - env (Object): additional data from parsed input (references, for example)
	 *
	 * The same as [[Renderer.render]], but for single token of `inline` type.
	 **/
	Renderer.prototype.renderInline = function (tokens, options, env) {
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
	Renderer.prototype.renderInlineAsText = function (tokens, options, env) {
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
	};


	/**
	 * Renderer.render(tokens, options, env) -> String
	 * - tokens (Array): list on block tokens to renter
	 * - options (Object): params of parser instance
	 * - env (Object): additional data from parsed input (references, for example)
	 *
	 * Takes token stream and generates HTML. Probably, you will never need to call
	 * this method directly.
	 **/
	Renderer.prototype.render = function (tokens, options, env) {
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
	};

	module.exports = Renderer;


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	// Block quotes

	'use strict';


	module.exports = function blockquote(state, startLine, endLine, silent) {
	  var nextLine, lastLineEmpty, oldTShift, oldBMarks, oldIndent, oldParentType, lines,
	      terminatorRules, token,
	      i, l, terminate,
	      pos = state.bMarks[startLine] + state.tShift[startLine],
	      max = state.eMarks[startLine];

	  // check the block quote marker
	  if (state.src.charCodeAt(pos++) !== 0x3E/* > */) { return false; }

	  // we know that it's going to be a valid blockquote,
	  // so no point trying to find the end of it in silent mode
	  if (silent) { return true; }

	  // skip one optional space after '>'
	  if (state.src.charCodeAt(pos) === 0x20) { pos++; }

	  oldIndent = state.blkIndent;
	  state.blkIndent = 0;

	  oldBMarks = [ state.bMarks[startLine] ];
	  state.bMarks[startLine] = pos;

	  // check if we have an empty blockquote
	  pos = pos < max ? state.skipSpaces(pos) : pos;
	  lastLineEmpty = pos >= max;

	  oldTShift = [ state.tShift[startLine] ];
	  state.tShift[startLine] = pos - state.bMarks[startLine];

	  terminatorRules = state.md.block.ruler.getRules('blockquote');

	  // Search the end of the block
	  //
	  // Block ends with either:
	  //  1. an empty line outside:
	  //     ```
	  //     > test
	  //
	  //     ```
	  //  2. an empty line inside:
	  //     ```
	  //     >
	  //     test
	  //     ```
	  //  3. another tag
	  //     ```
	  //     > test
	  //      - - -
	  //     ```
	  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
	    pos = state.bMarks[nextLine] + state.tShift[nextLine];
	    max = state.eMarks[nextLine];

	    if (pos >= max) {
	      // Case 1: line is not inside the blockquote, and this line is empty.
	      break;
	    }

	    if (state.src.charCodeAt(pos++) === 0x3E/* > */) {
	      // This line is inside the blockquote.

	      // skip one optional space after '>'
	      if (state.src.charCodeAt(pos) === 0x20) { pos++; }

	      oldBMarks.push(state.bMarks[nextLine]);
	      state.bMarks[nextLine] = pos;

	      pos = pos < max ? state.skipSpaces(pos) : pos;
	      lastLineEmpty = pos >= max;

	      oldTShift.push(state.tShift[nextLine]);
	      state.tShift[nextLine] = pos - state.bMarks[nextLine];
	      continue;
	    }

	    // Case 2: line is not inside the blockquote, and the last line was empty.
	    if (lastLineEmpty) { break; }

	    // Case 3: another tag found.
	    terminate = false;
	    for (i = 0, l = terminatorRules.length; i < l; i++) {
	      if (terminatorRules[i](state, nextLine, endLine, true)) {
	        terminate = true;
	        break;
	      }
	    }
	    if (terminate) { break; }

	    oldBMarks.push(state.bMarks[nextLine]);
	    oldTShift.push(state.tShift[nextLine]);

	    // A negative number means that this is a paragraph continuation;
	    //
	    // Any negative number will do the job here, but it's better for it
	    // to be large enough to make any bugs obvious.
	    state.tShift[nextLine] = -1337;
	  }

	  oldParentType = state.parentType;
	  state.parentType = 'blockquote';

	  token        = state.push('blockquote_open', 'blockquote', 1);
	  token.markup = '>';
	  token.map    = lines = [ startLine, 0 ];

	  state.md.block.tokenize(state, startLine, nextLine);

	  token        = state.push('blockquote_close', 'blockquote', -1);
	  token.markup = '>';

	  state.parentType = oldParentType;
	  lines[1] = state.line;

	  // Restore original tShift; this might not be necessary since the parser
	  // has already been here, but just to make sure we can do that.
	  for (i = 0; i < oldTShift.length; i++) {
	    state.bMarks[i + startLine] = oldBMarks[i];
	    state.tShift[i + startLine] = oldTShift[i];
	  }
	  state.blkIndent = oldIndent;

	  return true;
	};


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	// Code block (4 spaces padded)

	'use strict';


	module.exports = function code(state, startLine, endLine/*, silent*/) {
	  var nextLine, last, token;

	  if (state.tShift[startLine] - state.blkIndent < 4) { return false; }

	  last = nextLine = startLine + 1;

	  while (nextLine < endLine) {
	    if (state.isEmpty(nextLine)) {
	      nextLine++;
	      continue;
	    }
	    if (state.tShift[nextLine] - state.blkIndent >= 4) {
	      nextLine++;
	      last = nextLine;
	      continue;
	    }
	    break;
	  }

	  state.line = nextLine;

	  token         = state.push('code_block', 'code', 0);
	  token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
	  token.map     = [ startLine, state.line ];

	  return true;
	};


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	// fences (``` lang, ~~~ lang)

	'use strict';


	module.exports = function fence(state, startLine, endLine, silent) {
	  var marker, len, params, nextLine, mem, token, markup,
	      haveEndMarker = false,
	      pos = state.bMarks[startLine] + state.tShift[startLine],
	      max = state.eMarks[startLine];

	  if (pos + 3 > max) { return false; }

	  marker = state.src.charCodeAt(pos);

	  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
	    return false;
	  }

	  // scan marker length
	  mem = pos;
	  pos = state.skipChars(pos, marker);

	  len = pos - mem;

	  if (len < 3) { return false; }

	  markup = state.src.slice(mem, pos);
	  params = state.src.slice(pos, max);

	  if (params.indexOf('`') >= 0) { return false; }

	  // Since start is found, we can report success here in validation mode
	  if (silent) { return true; }

	  // search end of block
	  nextLine = startLine;

	  for (;;) {
	    nextLine++;
	    if (nextLine >= endLine) {
	      // unclosed block should be autoclosed by end of document.
	      // also block seems to be autoclosed by end of parent
	      break;
	    }

	    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
	    max = state.eMarks[nextLine];

	    if (pos < max && state.tShift[nextLine] < state.blkIndent) {
	      // non-empty line with negative indent should stop the list:
	      // - ```
	      //  test
	      break;
	    }

	    if (state.src.charCodeAt(pos) !== marker) { continue; }

	    if (state.tShift[nextLine] - state.blkIndent >= 4) {
	      // closing fence should be indented less than 4 spaces
	      continue;
	    }

	    pos = state.skipChars(pos, marker);

	    // closing code fence must be at least as long as the opening one
	    if (pos - mem < len) { continue; }

	    // make sure tail has spaces only
	    pos = state.skipSpaces(pos);

	    if (pos < max) { continue; }

	    haveEndMarker = true;
	    // found!
	    break;
	  }

	  // If a fence has heading spaces, they should be removed from its inner block
	  len = state.tShift[startLine];

	  state.line = nextLine + (haveEndMarker ? 1 : 0);

	  token         = state.push('fence', 'code', 0);
	  token.info    = params;
	  token.content = state.getLines(startLine + 1, nextLine, len, true);
	  token.markup  = markup;
	  token.map     = [ startLine, state.line ];

	  return true;
	};


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	// heading (#, ##, ...)

	'use strict';


	module.exports = function heading(state, startLine, endLine, silent) {
	  var ch, level, tmp, token,
	      pos = state.bMarks[startLine] + state.tShift[startLine],
	      max = state.eMarks[startLine];

	  ch  = state.src.charCodeAt(pos);

	  if (ch !== 0x23/* # */ || pos >= max) { return false; }

	  // count heading level
	  level = 1;
	  ch = state.src.charCodeAt(++pos);
	  while (ch === 0x23/* # */ && pos < max && level <= 6) {
	    level++;
	    ch = state.src.charCodeAt(++pos);
	  }

	  if (level > 6 || (pos < max && ch !== 0x20/* space */)) { return false; }

	  if (silent) { return true; }

	  // Let's cut tails like '    ###  ' from the end of string

	  max = state.skipCharsBack(max, 0x20, pos); // space
	  tmp = state.skipCharsBack(max, 0x23, pos); // #
	  if (tmp > pos && state.src.charCodeAt(tmp - 1) === 0x20/* space */) {
	    max = tmp;
	  }

	  state.line = startLine + 1;

	  token        = state.push('heading_open', 'h' + String(level), 1);
	  token.markup = '########'.slice(0, level);
	  token.map    = [ startLine, state.line ];

	  token          = state.push('inline', '', 0);
	  token.content  = state.src.slice(pos, max).trim();
	  token.map      = [ startLine, state.line ];
	  token.children = [];

	  token        = state.push('heading_close', 'h' + String(level), -1);
	  token.markup = '########'.slice(0, level);

	  return true;
	};


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	// Horizontal rule

	'use strict';


	module.exports = function hr(state, startLine, endLine, silent) {
	  var marker, cnt, ch, token,
	      pos = state.bMarks[startLine] + state.tShift[startLine],
	      max = state.eMarks[startLine];

	  marker = state.src.charCodeAt(pos++);

	  // Check hr marker
	  if (marker !== 0x2A/* * */ &&
	      marker !== 0x2D/* - */ &&
	      marker !== 0x5F/* _ */) {
	    return false;
	  }

	  // markers can be mixed with spaces, but there should be at least 3 one

	  cnt = 1;
	  while (pos < max) {
	    ch = state.src.charCodeAt(pos++);
	    if (ch !== marker && ch !== 0x20/* space */) { return false; }
	    if (ch === marker) { cnt++; }
	  }

	  if (cnt < 3) { return false; }

	  if (silent) { return true; }

	  state.line = startLine + 1;

	  token        = state.push('hr', 'hr', 0);
	  token.map    = [ startLine, state.line ];
	  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));

	  return true;
	};


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	// HTML block

	'use strict';


	var block_names = __webpack_require__(118);


	var HTML_TAG_OPEN_RE = /^<([a-zA-Z][a-zA-Z0-9]{0,14})[\s\/>]/;
	var HTML_TAG_CLOSE_RE = /^<\/([a-zA-Z][a-zA-Z0-9]{0,14})[\s>]/;

	function isLetter(ch) {
	  /*eslint no-bitwise:0*/
	  var lc = ch | 0x20; // to lower case
	  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
	}

	module.exports = function html_block(state, startLine, endLine, silent) {
	  var ch, match, nextLine, token,
	      pos = state.bMarks[startLine],
	      max = state.eMarks[startLine],
	      shift = state.tShift[startLine];

	  pos += shift;

	  if (!state.md.options.html) { return false; }

	  if (shift > 3 || pos + 2 >= max) { return false; }

	  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

	  ch = state.src.charCodeAt(pos + 1);

	  if (ch === 0x21/* ! */ || ch === 0x3F/* ? */) {
	    // Directive start / comment start / processing instruction start
	    if (silent) { return true; }

	  } else if (ch === 0x2F/* / */ || isLetter(ch)) {

	    // Probably start or end of tag
	    if (ch === 0x2F/* \ */) {
	      // closing tag
	      match = state.src.slice(pos, max).match(HTML_TAG_CLOSE_RE);
	      if (!match) { return false; }
	    } else {
	      // opening tag
	      match = state.src.slice(pos, max).match(HTML_TAG_OPEN_RE);
	      if (!match) { return false; }
	    }
	    // Make sure tag name is valid
	    if (block_names[match[1].toLowerCase()] !== true) { return false; }
	    if (silent) { return true; }

	  } else {
	    return false;
	  }

	  // If we are here - we detected HTML block.
	  // Let's roll down till empty line (block end).
	  nextLine = startLine + 1;
	  while (nextLine < state.lineMax && !state.isEmpty(nextLine)) {
	    nextLine++;
	  }

	  state.line = nextLine;

	  token         = state.push('html_block', '', 0);
	  token.map     = [ startLine, state.line ];
	  token.content = state.getLines(startLine, nextLine, 0, true);

	  return true;
	};


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	// lheading (---, ===)

	'use strict';


	module.exports = function lheading(state, startLine, endLine/*, silent*/) {
	  var marker, pos, max, token, level,
	      next = startLine + 1;

	  if (next >= endLine) { return false; }
	  if (state.tShift[next] < state.blkIndent) { return false; }

	  // Scan next line

	  if (state.tShift[next] - state.blkIndent > 3) { return false; }

	  pos = state.bMarks[next] + state.tShift[next];
	  max = state.eMarks[next];

	  if (pos >= max) { return false; }

	  marker = state.src.charCodeAt(pos);

	  if (marker !== 0x2D/* - */ && marker !== 0x3D/* = */) { return false; }

	  pos = state.skipChars(pos, marker);

	  pos = state.skipSpaces(pos);

	  if (pos < max) { return false; }

	  pos = state.bMarks[startLine] + state.tShift[startLine];

	  state.line = next + 1;
	  level = (marker === 0x3D/* = */ ? 1 : 2);

	  token          = state.push('heading_open', 'h' + String(level), 1);
	  token.markup   = String.fromCharCode(marker);
	  token.map      = [ startLine, state.line ];

	  token          = state.push('inline', '', 0);
	  token.content  = state.src.slice(pos, state.eMarks[startLine]).trim();
	  token.map      = [ startLine, state.line - 1 ];
	  token.children = [];

	  token          = state.push('heading_close', 'h' + String(level), -1);
	  token.markup   = String.fromCharCode(marker);

	  return true;
	};


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	// Lists

	'use strict';


	// Search `[-+*][\n ]`, returns next pos arter marker on success
	// or -1 on fail.
	function skipBulletListMarker(state, startLine) {
	  var marker, pos, max;

	  pos = state.bMarks[startLine] + state.tShift[startLine];
	  max = state.eMarks[startLine];

	  marker = state.src.charCodeAt(pos++);
	  // Check bullet
	  if (marker !== 0x2A/* * */ &&
	      marker !== 0x2D/* - */ &&
	      marker !== 0x2B/* + */) {
	    return -1;
	  }

	  if (pos < max && state.src.charCodeAt(pos) !== 0x20) {
	    // " 1.test " - is not a list item
	    return -1;
	  }

	  return pos;
	}

	// Search `\d+[.)][\n ]`, returns next pos arter marker on success
	// or -1 on fail.
	function skipOrderedListMarker(state, startLine) {
	  var ch,
	      pos = state.bMarks[startLine] + state.tShift[startLine],
	      max = state.eMarks[startLine];

	  // List marker should have at least 2 chars (digit + dot)
	  if (pos + 1 >= max) { return -1; }

	  ch = state.src.charCodeAt(pos++);

	  if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) { return -1; }

	  for (;;) {
	    // EOL -> fail
	    if (pos >= max) { return -1; }

	    ch = state.src.charCodeAt(pos++);

	    if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {
	      continue;
	    }

	    // found valid marker
	    if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
	      break;
	    }

	    return -1;
	  }


	  if (pos < max && state.src.charCodeAt(pos) !== 0x20/* space */) {
	    // " 1.test " - is not a list item
	    return -1;
	  }
	  return pos;
	}

	function markTightParagraphs(state, idx) {
	  var i, l,
	      level = state.level + 2;

	  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
	    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
	      state.tokens[i + 2].hidden = true;
	      state.tokens[i].hidden = true;
	      i += 2;
	    }
	  }
	}


	module.exports = function list(state, startLine, endLine, silent) {
	  var nextLine,
	      indent,
	      oldTShift,
	      oldIndent,
	      oldTight,
	      oldParentType,
	      start,
	      posAfterMarker,
	      max,
	      indentAfterMarker,
	      markerValue,
	      markerCharCode,
	      isOrdered,
	      contentStart,
	      listTokIdx,
	      prevEmptyEnd,
	      listLines,
	      itemLines,
	      tight = true,
	      terminatorRules,
	      token,
	      i, l, terminate;

	  // Detect list type and position after marker
	  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
	    isOrdered = true;
	  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
	    isOrdered = false;
	  } else {
	    return false;
	  }

	  // We should terminate list on style change. Remember first one to compare.
	  markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

	  // For validation mode we can terminate immediately
	  if (silent) { return true; }

	  // Start list
	  listTokIdx = state.tokens.length;

	  if (isOrdered) {
	    start = state.bMarks[startLine] + state.tShift[startLine];
	    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

	    token       = state.push('ordered_list_open', 'ol', 1);
	    if (markerValue > 1) {
	      token.attrs = [ [ 'start', markerValue ] ];
	    }

	  } else {
	    token       = state.push('bullet_list_open', 'ul', 1);
	  }

	  token.map    = listLines = [ startLine, 0 ];
	  token.markup = String.fromCharCode(markerCharCode);

	  //
	  // Iterate list items
	  //

	  nextLine = startLine;
	  prevEmptyEnd = false;
	  terminatorRules = state.md.block.ruler.getRules('list');

	  while (nextLine < endLine) {
	    contentStart = state.skipSpaces(posAfterMarker);
	    max = state.eMarks[nextLine];

	    if (contentStart >= max) {
	      // trimming space in "-    \n  3" case, indent is 1 here
	      indentAfterMarker = 1;
	    } else {
	      indentAfterMarker = contentStart - posAfterMarker;
	    }

	    // If we have more than 4 spaces, the indent is 1
	    // (the rest is just indented code block)
	    if (indentAfterMarker > 4) { indentAfterMarker = 1; }

	    // "  -  test"
	    //  ^^^^^ - calculating total length of this thing
	    indent = (posAfterMarker - state.bMarks[nextLine]) + indentAfterMarker;

	    // Run subparser & write tokens
	    token        = state.push('list_item_open', 'li', 1);
	    token.markup = String.fromCharCode(markerCharCode);
	    token.map    = itemLines = [ startLine, 0 ];

	    oldIndent = state.blkIndent;
	    oldTight = state.tight;
	    oldTShift = state.tShift[startLine];
	    oldParentType = state.parentType;
	    state.tShift[startLine] = contentStart - state.bMarks[startLine];
	    state.blkIndent = indent;
	    state.tight = true;
	    state.parentType = 'list';

	    state.md.block.tokenize(state, startLine, endLine, true);

	    // If any of list item is tight, mark list as tight
	    if (!state.tight || prevEmptyEnd) {
	      tight = false;
	    }
	    // Item become loose if finish with empty line,
	    // but we should filter last element, because it means list finish
	    prevEmptyEnd = (state.line - startLine) > 1 && state.isEmpty(state.line - 1);

	    state.blkIndent = oldIndent;
	    state.tShift[startLine] = oldTShift;
	    state.tight = oldTight;
	    state.parentType = oldParentType;

	    token        = state.push('list_item_close', 'li', -1);
	    token.markup = String.fromCharCode(markerCharCode);

	    nextLine = startLine = state.line;
	    itemLines[1] = nextLine;
	    contentStart = state.bMarks[startLine];

	    if (nextLine >= endLine) { break; }

	    if (state.isEmpty(nextLine)) {
	      break;
	    }

	    //
	    // Try to check if list is terminated or continued.
	    //
	    if (state.tShift[nextLine] < state.blkIndent) { break; }

	    // fail if terminating block found
	    terminate = false;
	    for (i = 0, l = terminatorRules.length; i < l; i++) {
	      if (terminatorRules[i](state, nextLine, endLine, true)) {
	        terminate = true;
	        break;
	      }
	    }
	    if (terminate) { break; }

	    // fail if list has another type
	    if (isOrdered) {
	      posAfterMarker = skipOrderedListMarker(state, nextLine);
	      if (posAfterMarker < 0) { break; }
	    } else {
	      posAfterMarker = skipBulletListMarker(state, nextLine);
	      if (posAfterMarker < 0) { break; }
	    }

	    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
	  }

	  // Finilize list
	  if (isOrdered) {
	    token = state.push('ordered_list_close', 'ol', -1);
	  } else {
	    token = state.push('bullet_list_close', 'ul', -1);
	  }
	  token.markup = String.fromCharCode(markerCharCode);

	  listLines[1] = nextLine;
	  state.line = nextLine;

	  // mark paragraphs tight if needed
	  if (tight) {
	    markTightParagraphs(state, listTokIdx);
	  }

	  return true;
	};


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	// Paragraph

	'use strict';


	module.exports = function paragraph(state, startLine/*, endLine*/) {
	  var content, terminate, i, l, token,
	      nextLine = startLine + 1,
	      terminatorRules = state.md.block.ruler.getRules('paragraph'),
	      endLine = state.lineMax;

	  // jump line-by-line until empty one or EOF
	  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
	    // this would be a code block normally, but after paragraph
	    // it's considered a lazy continuation regardless of what's there
	    if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

	    // Some tags can terminate paragraph without empty line.
	    terminate = false;
	    for (i = 0, l = terminatorRules.length; i < l; i++) {
	      if (terminatorRules[i](state, nextLine, endLine, true)) {
	        terminate = true;
	        break;
	      }
	    }
	    if (terminate) { break; }
	  }

	  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

	  state.line = nextLine;

	  token          = state.push('paragraph_open', 'p', 1);
	  token.map      = [ startLine, state.line ];

	  token          = state.push('inline', '', 0);
	  token.content  = content;
	  token.map      = [ startLine, state.line ];
	  token.children = [];

	  token          = state.push('paragraph_close', 'p', -1);

	  return true;
	};


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	var parseLinkDestination = __webpack_require__(14);
	var parseLinkTitle       = __webpack_require__(15);
	var normalizeReference   = __webpack_require__(1).normalizeReference;


	module.exports = function reference(state, startLine, _endLine, silent) {
	  var ch,
	      destEndPos,
	      destEndLineNo,
	      endLine,
	      href,
	      i,
	      l,
	      label,
	      labelEnd,
	      res,
	      start,
	      str,
	      terminate,
	      terminatorRules,
	      title,
	      lines = 0,
	      pos = state.bMarks[startLine] + state.tShift[startLine],
	      max = state.eMarks[startLine],
	      nextLine = startLine + 1;

	  if (state.src.charCodeAt(pos) !== 0x5B/* [ */) { return false; }

	  // Simple check to quickly interrupt scan on [link](url) at the start of line.
	  // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
	  while (++pos < max) {
	    if (state.src.charCodeAt(pos) === 0x5D /* ] */ &&
	        state.src.charCodeAt(pos - 1) !== 0x5C/* \ */) {
	      if (pos + 1 === max) { return false; }
	      if (state.src.charCodeAt(pos + 1) !== 0x3A/* : */) { return false; }
	      break;
	    }
	  }

	  endLine = state.lineMax;

	  // jump line-by-line until empty one or EOF
	  terminatorRules = state.md.block.ruler.getRules('reference');

	  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
	    // this would be a code block normally, but after paragraph
	    // it's considered a lazy continuation regardless of what's there
	    if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

	    // Some tags can terminate paragraph without empty line.
	    terminate = false;
	    for (i = 0, l = terminatorRules.length; i < l; i++) {
	      if (terminatorRules[i](state, nextLine, endLine, true)) {
	        terminate = true;
	        break;
	      }
	    }
	    if (terminate) { break; }
	  }

	  str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
	  max = str.length;

	  for (pos = 1; pos < max; pos++) {
	    ch = str.charCodeAt(pos);
	    if (ch === 0x5B /* [ */) {
	      return false;
	    } else if (ch === 0x5D /* ] */) {
	      labelEnd = pos;
	      break;
	    } else if (ch === 0x0A /* \n */) {
	      lines++;
	    } else if (ch === 0x5C /* \ */) {
	      pos++;
	      if (pos < max && str.charCodeAt(pos) === 0x0A) {
	        lines++;
	      }
	    }
	  }

	  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return false; }

	  // [label]:   destination   'title'
	  //         ^^^ skip optional whitespace here
	  for (pos = labelEnd + 2; pos < max; pos++) {
	    ch = str.charCodeAt(pos);
	    if (ch === 0x0A) {
	      lines++;
	    } else if (ch === 0x20) {
	      /*eslint no-empty:0*/
	    } else {
	      break;
	    }
	  }

	  // [label]:   destination   'title'
	  //            ^^^^^^^^^^^ parse this
	  res = parseLinkDestination(str, pos, max);
	  if (!res.ok) { return false; }

	  href = state.md.normalizeLink(res.str);
	  if (!state.md.validateLink(href)) { return false; }

	  pos = res.pos;
	  lines += res.lines;

	  // save cursor state, we could require to rollback later
	  destEndPos = pos;
	  destEndLineNo = lines;

	  // [label]:   destination   'title'
	  //                       ^^^ skipping those spaces
	  start = pos;
	  for (; pos < max; pos++) {
	    ch = str.charCodeAt(pos);
	    if (ch === 0x0A) {
	      lines++;
	    } else if (ch === 0x20) {
	      /*eslint no-empty:0*/
	    } else {
	      break;
	    }
	  }

	  // [label]:   destination   'title'
	  //                          ^^^^^^^ parse this
	  res = parseLinkTitle(str, pos, max);
	  if (pos < max && start !== pos && res.ok) {
	    title = res.str;
	    pos = res.pos;
	    lines += res.lines;
	  } else {
	    title = '';
	    pos = destEndPos;
	    lines = destEndLineNo;
	  }

	  // skip trailing spaces until the rest of the line
	  while (pos < max && str.charCodeAt(pos) === 0x20/* space */) { pos++; }

	  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
	    // garbage at the end of the line
	    return false;
	  }

	  // Reference can not terminate anything. This check is for safety only.
	  /*istanbul ignore if*/
	  if (silent) { return true; }

	  label = normalizeReference(str.slice(1, labelEnd));
	  if (typeof state.env.references === 'undefined') {
	    state.env.references = {};
	  }
	  if (typeof state.env.references[label] === 'undefined') {
	    state.env.references[label] = { title: title, href: href };
	  }

	  state.line = startLine + lines + 1;
	  return true;
	};


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	// Parser state class

	'use strict';

	var Token = __webpack_require__(24);


	function StateBlock(src, md, env, tokens) {
	  var ch, s, start, pos, len, indent, indent_found;

	  this.src = src;

	  // link to parser instance
	  this.md     = md;

	  this.env = env;

	  //
	  // Internal state vartiables
	  //

	  this.tokens = tokens;

	  this.bMarks = [];  // line begin offsets for fast jumps
	  this.eMarks = [];  // line end offsets for fast jumps
	  this.tShift = [];  // indent for each line

	  // block parser variables
	  this.blkIndent  = 0; // required block content indent
	                       // (for example, if we are in list)
	  this.line       = 0; // line index in src
	  this.lineMax    = 0; // lines count
	  this.tight      = false;  // loose/tight mode for lists
	  this.parentType = 'root'; // if `list`, block parser stops on two newlines
	  this.ddIndent   = -1; // indent of the current dd block (-1 if there isn't any)

	  this.level = 0;

	  // renderer
	  this.result = '';

	  // Create caches
	  // Generate markers.
	  s = this.src;
	  indent = 0;
	  indent_found = false;

	  for (start = pos = indent = 0, len = s.length; pos < len; pos++) {
	    ch = s.charCodeAt(pos);

	    if (!indent_found) {
	      if (ch === 0x20/* space */) {
	        indent++;
	        continue;
	      } else {
	        indent_found = true;
	      }
	    }

	    if (ch === 0x0A || pos === len - 1) {
	      if (ch !== 0x0A) { pos++; }
	      this.bMarks.push(start);
	      this.eMarks.push(pos);
	      this.tShift.push(indent);

	      indent_found = false;
	      indent = 0;
	      start = pos + 1;
	    }
	  }

	  // Push fake entry to simplify cache bounds checks
	  this.bMarks.push(s.length);
	  this.eMarks.push(s.length);
	  this.tShift.push(0);

	  this.lineMax = this.bMarks.length - 1; // don't count last fake line
	}

	// Push new token to "stream".
	//
	StateBlock.prototype.push = function (type, tag, nesting) {
	  var token = new Token(type, tag, nesting);
	  token.block = true;

	  if (nesting < 0) { this.level--; }
	  token.level = this.level;
	  if (nesting > 0) { this.level++; }

	  this.tokens.push(token);
	  return token;
	};

	StateBlock.prototype.isEmpty = function isEmpty(line) {
	  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
	};

	StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
	  for (var max = this.lineMax; from < max; from++) {
	    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
	      break;
	    }
	  }
	  return from;
	};

	// Skip spaces from given position.
	StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
	  for (var max = this.src.length; pos < max; pos++) {
	    if (this.src.charCodeAt(pos) !== 0x20/* space */) { break; }
	  }
	  return pos;
	};

	// Skip char codes from given position
	StateBlock.prototype.skipChars = function skipChars(pos, code) {
	  for (var max = this.src.length; pos < max; pos++) {
	    if (this.src.charCodeAt(pos) !== code) { break; }
	  }
	  return pos;
	};

	// Skip char codes reverse from given position - 1
	StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
	  if (pos <= min) { return pos; }

	  while (pos > min) {
	    if (code !== this.src.charCodeAt(--pos)) { return pos + 1; }
	  }
	  return pos;
	};

	// cut lines range from source.
	StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
	  var i, first, last, queue, shift,
	      line = begin;

	  if (begin >= end) {
	    return '';
	  }

	  // Opt: don't use push queue for single line;
	  if (line + 1 === end) {
	    first = this.bMarks[line] + Math.min(this.tShift[line], indent);
	    last = keepLastLF ? this.bMarks[end] : this.eMarks[end - 1];
	    return this.src.slice(first, last);
	  }

	  queue = new Array(end - begin);

	  for (i = 0; line < end; line++, i++) {
	    shift = this.tShift[line];
	    if (shift > indent) { shift = indent; }
	    if (shift < 0) { shift = 0; }

	    first = this.bMarks[line] + shift;

	    if (line + 1 < end || keepLastLF) {
	      // No need for bounds check because we have fake entry on tail.
	      last = this.eMarks[line] + 1;
	    } else {
	      last = this.eMarks[line];
	    }

	    queue[i] = this.src.slice(first, last);
	  }

	  return queue.join('');
	};

	// re-export Token class to use in block rules
	StateBlock.prototype.Token = Token;


	module.exports = StateBlock;


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	// GFM table, non-standard

	'use strict';


	function getLine(state, line) {
	  var pos = state.bMarks[line] + state.blkIndent,
	      max = state.eMarks[line];

	  return state.src.substr(pos, max - pos);
	}

	function escapedSplit(str) {
	  var result = [],
	      pos = 0,
	      max = str.length,
	      ch,
	      escapes = 0,
	      lastPos = 0,
	      backTicked = false,
	      lastBackTick = 0;

	  ch  = str.charCodeAt(pos);

	  while (pos < max) {
	    if (ch === 0x60/* ` */ && (escapes % 2 === 0)) {
	      backTicked = !backTicked;
	      lastBackTick = pos;
	    } else if (ch === 0x7c/* | */ && (escapes % 2 === 0) && !backTicked) {
	      result.push(str.substring(lastPos, pos));
	      lastPos = pos + 1;
	    } else if (ch === 0x5c/* \ */) {
	      escapes++;
	    } else {
	      escapes = 0;
	    }

	    pos++;

	    // If there was an un-closed backtick, go back to just after
	    // the last backtick, but as if it was a normal character
	    if (pos === max && backTicked) {
	      backTicked = false;
	      pos = lastBackTick + 1;
	    }

	    ch = str.charCodeAt(pos);
	  }

	  result.push(str.substring(lastPos));

	  return result;
	}


	module.exports = function table(state, startLine, endLine, silent) {
	  var ch, lineText, pos, i, nextLine, rows, token,
	      aligns, t, tableLines, tbodyLines;

	  // should have at least three lines
	  if (startLine + 2 > endLine) { return false; }

	  nextLine = startLine + 1;

	  if (state.tShift[nextLine] < state.blkIndent) { return false; }

	  // first character of the second line should be '|' or '-'

	  pos = state.bMarks[nextLine] + state.tShift[nextLine];
	  if (pos >= state.eMarks[nextLine]) { return false; }

	  ch = state.src.charCodeAt(pos);
	  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */) { return false; }

	  lineText = getLine(state, startLine + 1);
	  if (!/^[-:| ]+$/.test(lineText)) { return false; }

	  rows = lineText.split('|');
	  if (rows.length < 2) { return false; }
	  aligns = [];
	  for (i = 0; i < rows.length; i++) {
	    t = rows[i].trim();
	    if (!t) {
	      // allow empty columns before and after table, but not in between columns;
	      // e.g. allow ` |---| `, disallow ` ---||--- `
	      if (i === 0 || i === rows.length - 1) {
	        continue;
	      } else {
	        return false;
	      }
	    }

	    if (!/^:?-+:?$/.test(t)) { return false; }
	    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
	      aligns.push(t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right');
	    } else if (t.charCodeAt(0) === 0x3A/* : */) {
	      aligns.push('left');
	    } else {
	      aligns.push('');
	    }
	  }

	  lineText = getLine(state, startLine).trim();
	  if (lineText.indexOf('|') === -1) { return false; }
	  rows = escapedSplit(lineText.replace(/^\||\|$/g, ''));
	  if (aligns.length !== rows.length) { return false; }
	  if (silent) { return true; }

	  token     = state.push('table_open', 'table', 1);
	  token.map = tableLines = [ startLine, 0 ];

	  token     = state.push('thead_open', 'thead', 1);
	  token.map = [ startLine, startLine + 1 ];

	  token     = state.push('tr_open', 'tr', 1);
	  token.map = [ startLine, startLine + 1 ];

	  for (i = 0; i < rows.length; i++) {
	    token          = state.push('th_open', 'th', 1);
	    token.map      = [ startLine, startLine + 1 ];
	    if (aligns[i]) {
	      token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
	    }

	    token          = state.push('inline', '', 0);
	    token.content  = rows[i].trim();
	    token.map      = [ startLine, startLine + 1 ];
	    token.children = [];

	    token          = state.push('th_close', 'th', -1);
	  }

	  token     = state.push('tr_close', 'tr', -1);
	  token     = state.push('thead_close', 'thead', -1);

	  token     = state.push('tbody_open', 'tbody', 1);
	  token.map = tbodyLines = [ startLine + 2, 0 ];

	  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
	    if (state.tShift[nextLine] < state.blkIndent) { break; }

	    lineText = getLine(state, nextLine).trim();
	    if (lineText.indexOf('|') === -1) { break; }
	    rows = escapedSplit(lineText.replace(/^\||\|$/g, ''));

	    // set number of columns to number of columns in header row
	    rows.length = aligns.length;

	    token = state.push('tr_open', 'tr', 1);
	    for (i = 0; i < rows.length; i++) {
	      token          = state.push('td_open', 'td', 1);
	      if (aligns[i]) {
	        token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
	      }

	      token          = state.push('inline', '', 0);
	      token.content  = rows[i] ? rows[i].trim() : '';
	      token.children = [];

	      token          = state.push('td_close', 'td', -1);
	    }
	    token = state.push('tr_close', 'tr', -1);
	  }
	  token = state.push('tbody_close', 'tbody', -1);
	  token = state.push('table_close', 'table', -1);

	  tableLines[1] = tbodyLines[1] = nextLine;
	  state.line = nextLine;
	  return true;
	};


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	module.exports = function block(state) {
	  var token;

	  if (state.inlineMode) {
	    token          = new state.Token('inline', '', 0);
	    token.content  = state.src;
	    token.map      = [ 0, 1 ];
	    token.children = [];
	    state.tokens.push(token);
	  } else {
	    state.md.block.parse(state.src, state.md, state.env, state.tokens);
	  }
	};


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function inline(state) {
	  var tokens = state.tokens, tok, i, l;

	  // Parse inlines
	  for (i = 0, l = tokens.length; i < l; i++) {
	    tok = tokens[i];
	    if (tok.type === 'inline') {
	      state.md.inline.parse(tok.content, state.md, state.env, tok.children);
	    }
	  }
	};


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	// Replace link-like texts with link nodes.
	//
	// Currently restricted by `md.validateLink()` to http/https/ftp
	//
	'use strict';


	var arrayReplaceAt = __webpack_require__(1).arrayReplaceAt;


	function isLinkOpen(str) {
	  return /^<a[>\s]/i.test(str);
	}
	function isLinkClose(str) {
	  return /^<\/a\s*>/i.test(str);
	}


	module.exports = function linkify(state) {
	  var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
	      level, htmlLinkLevel, url, fullUrl, urlText,
	      blockTokens = state.tokens,
	      links;

	  if (!state.md.options.linkify) { return; }

	  for (j = 0, l = blockTokens.length; j < l; j++) {
	    if (blockTokens[j].type !== 'inline' ||
	        !state.md.linkify.pretest(blockTokens[j].content)) {
	      continue;
	    }

	    tokens = blockTokens[j].children;

	    htmlLinkLevel = 0;

	    // We scan from the end, to keep position when new tags added.
	    // Use reversed logic in links start/end match
	    for (i = tokens.length - 1; i >= 0; i--) {
	      currentToken = tokens[i];

	      // Skip content of markdown links
	      if (currentToken.type === 'link_close') {
	        i--;
	        while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
	          i--;
	        }
	        continue;
	      }

	      // Skip content of html tag links
	      if (currentToken.type === 'html_inline') {
	        if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
	          htmlLinkLevel--;
	        }
	        if (isLinkClose(currentToken.content)) {
	          htmlLinkLevel++;
	        }
	      }
	      if (htmlLinkLevel > 0) { continue; }

	      if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

	        text = currentToken.content;
	        links = state.md.linkify.match(text);

	        // Now split string to nodes
	        nodes = [];
	        level = currentToken.level;
	        lastPos = 0;

	        for (ln = 0; ln < links.length; ln++) {

	          url = links[ln].url;
	          fullUrl = state.md.normalizeLink(url);
	          if (!state.md.validateLink(fullUrl)) { continue; }

	          urlText = links[ln].text;

	          // Linkifier might send raw hostnames like "example.com", where url
	          // starts with domain name. So we prepend http:// in those cases,
	          // and remove it afterwards.
	          //
	          if (!links[ln].schema) {
	            urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
	          } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
	            urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
	          } else {
	            urlText = state.md.normalizeLinkText(urlText);
	          }

	          pos = links[ln].index;

	          if (pos > lastPos) {
	            token         = new state.Token('text', '', 0);
	            token.content = text.slice(lastPos, pos);
	            token.level   = level;
	            nodes.push(token);
	          }

	          token         = new state.Token('link_open', 'a', 1);
	          token.attrs   = [ [ 'href', fullUrl ] ];
	          token.level   = level++;
	          token.markup  = 'linkify';
	          token.info    = 'auto';
	          nodes.push(token);

	          token         = new state.Token('text', '', 0);
	          token.content = urlText;
	          token.level   = level;
	          nodes.push(token);

	          token         = new state.Token('link_close', 'a', -1);
	          token.level   = --level;
	          token.markup  = 'linkify';
	          token.info    = 'auto';
	          nodes.push(token);

	          lastPos = links[ln].lastIndex;
	        }
	        if (lastPos < text.length) {
	          token         = new state.Token('text', '', 0);
	          token.content = text.slice(lastPos);
	          token.level   = level;
	          nodes.push(token);
	        }

	        // replace current node
	        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
	      }
	    }
	  }
	};


/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	// Normalize input string

	'use strict';


	var TABS_SCAN_RE = /[\n\t]/g;
	var NEWLINES_RE  = /\r[\n\u0085]|[\u2424\u2028\u0085]/g;
	var NULL_RE      = /\u0000/g;


	module.exports = function inline(state) {
	  var str, lineStart, lastTabPos;

	  // Normalize newlines
	  str = state.src.replace(NEWLINES_RE, '\n');

	  // Replace NULL characters
	  str = str.replace(NULL_RE, '\uFFFD');

	  // Replace tabs with proper number of spaces (1..4)
	  if (str.indexOf('\t') >= 0) {
	    lineStart = 0;
	    lastTabPos = 0;

	    str = str.replace(TABS_SCAN_RE, function (match, offset) {
	      var result;
	      if (str.charCodeAt(offset) === 0x0A) {
	        lineStart = offset + 1;
	        lastTabPos = 0;
	        return match;
	      }
	      result = '    '.slice((offset - lineStart - lastTabPos) % 4);
	      lastTabPos = offset - lineStart + 1;
	      return result;
	    });
	  }

	  state.src = str;
	};


/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	// Simple typographyc replacements
	//
	// '' → ‘’
	// "" → “”. Set '«»' for Russian, '„“' for German, empty to disable
	// (c) (C) → ©
	// (tm) (TM) → ™
	// (r) (R) → ®
	// +- → ±
	// (p) (P) -> §
	// ... → … (also ?.... → ?.., !.... → !..)
	// ???????? → ???, !!!!! → !!!, `,,` → `,`
	// -- → &ndash;, --- → &mdash;
	//
	'use strict';

	// TODO:
	// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
	// - miltiplication 2 x 4 -> 2 × 4

	var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

	// Workaround for phantomjs - need regex without /g flag,
	// or root check will fail every second time
	var SCOPED_ABBR_TEST_RE = /\((c|tm|r|p)\)/i;

	var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
	var SCOPED_ABBR = {
	  'c': '©',
	  'r': '®',
	  'p': '§',
	  'tm': '™'
	};

	function replaceFn(match, name) {
	  return SCOPED_ABBR[name.toLowerCase()];
	}

	function replace_scoped(inlineTokens) {
	  var i, token;

	  for (i = inlineTokens.length - 1; i >= 0; i--) {
	    token = inlineTokens[i];
	    if (token.type === 'text') {
	      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
	    }
	  }
	}

	function replace_rare(inlineTokens) {
	  var i, token;

	  for (i = inlineTokens.length - 1; i >= 0; i--) {
	    token = inlineTokens[i];
	    if (token.type === 'text') {
	      if (RARE_RE.test(token.content)) {
	        token.content = token.content
	                    .replace(/\+-/g, '±')
	                    // .., ..., ....... -> …
	                    // but ?..... & !..... -> ?.. & !..
	                    .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
	                    .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
	                    // em-dash
	                    .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
	                    // en-dash
	                    .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
	                    .replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
	      }
	    }
	  }
	}


	module.exports = function replace(state) {
	  var blkIdx;

	  if (!state.md.options.typographer) { return; }

	  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

	    if (state.tokens[blkIdx].type !== 'inline') { continue; }

	    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
	      replace_scoped(state.tokens[blkIdx].children);
	    }

	    if (RARE_RE.test(state.tokens[blkIdx].content)) {
	      replace_rare(state.tokens[blkIdx].children);
	    }

	  }
	};


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	// Convert straight quotation marks to typographic ones
	//
	'use strict';


	var isWhiteSpace   = __webpack_require__(1).isWhiteSpace;
	var isPunctChar    = __webpack_require__(1).isPunctChar;
	var isMdAsciiPunct = __webpack_require__(1).isMdAsciiPunct;

	var QUOTE_TEST_RE = /['"]/;
	var QUOTE_RE = /['"]/g;
	var APOSTROPHE = '\u2019'; /* ’ */


	function replaceAt(str, index, ch) {
	  return str.substr(0, index) + ch + str.substr(index + 1);
	}

	function process_inlines(tokens, state) {
	  var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar,
	      isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace,
	      canOpen, canClose, j, isSingle, stack;

	  stack = [];

	  for (i = 0; i < tokens.length; i++) {
	    token = tokens[i];

	    thisLevel = tokens[i].level;

	    for (j = stack.length - 1; j >= 0; j--) {
	      if (stack[j].level <= thisLevel) { break; }
	    }
	    stack.length = j + 1;

	    if (token.type !== 'text') { continue; }

	    text = token.content;
	    pos = 0;
	    max = text.length;

	    /*eslint no-labels:0,block-scoped-var:0*/
	    OUTER:
	    while (pos < max) {
	      QUOTE_RE.lastIndex = pos;
	      t = QUOTE_RE.exec(text);
	      if (!t) { break; }

	      canOpen = canClose = true;
	      pos = t.index + 1;
	      isSingle = (t[0] === "'");

	      // treat begin/end of the line as a whitespace
	      lastChar = t.index - 1 >= 0 ? text.charCodeAt(t.index - 1) : 0x20;
	      nextChar = pos < max ? text.charCodeAt(pos) : 0x20;

	      isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
	      isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

	      isLastWhiteSpace = isWhiteSpace(lastChar);
	      isNextWhiteSpace = isWhiteSpace(nextChar);

	      if (isNextWhiteSpace) {
	        canOpen = false;
	      } else if (isNextPunctChar) {
	        if (!(isLastWhiteSpace || isLastPunctChar)) {
	          canOpen = false;
	        }
	      }

	      if (isLastWhiteSpace) {
	        canClose = false;
	      } else if (isLastPunctChar) {
	        if (!(isNextWhiteSpace || isNextPunctChar)) {
	          canClose = false;
	        }
	      }

	      if (nextChar === 0x22 /* " */ && t[0] === '"') {
	        if (lastChar >= 0x30 /* 0 */ && lastChar <= 0x39 /* 9 */) {
	          // special case: 1"" - count first quote as an inch
	          canClose = canOpen = false;
	        }
	      }

	      if (canOpen && canClose) {
	        // treat this as the middle of the word
	        canOpen = false;
	        canClose = isNextPunctChar;
	      }

	      if (!canOpen && !canClose) {
	        // middle of word
	        if (isSingle) {
	          token.content = replaceAt(token.content, t.index, APOSTROPHE);
	        }
	        continue;
	      }

	      if (canClose) {
	        // this could be a closing quote, rewind the stack to get a match
	        for (j = stack.length - 1; j >= 0; j--) {
	          item = stack[j];
	          if (stack[j].level < thisLevel) { break; }
	          if (item.single === isSingle && stack[j].level === thisLevel) {
	            item = stack[j];
	            if (isSingle) {
	              tokens[item.token].content = replaceAt(
	                tokens[item.token].content, item.pos, state.md.options.quotes[2]);
	              token.content = replaceAt(
	                token.content, t.index, state.md.options.quotes[3]);
	            } else {
	              tokens[item.token].content = replaceAt(
	                tokens[item.token].content, item.pos, state.md.options.quotes[0]);
	              token.content = replaceAt(token.content, t.index, state.md.options.quotes[1]);
	            }
	            stack.length = j;
	            continue OUTER;
	          }
	        }
	      }

	      if (canOpen) {
	        stack.push({
	          token: i,
	          pos: t.index,
	          single: isSingle,
	          level: thisLevel
	        });
	      } else if (canClose && isSingle) {
	        token.content = replaceAt(token.content, t.index, APOSTROPHE);
	      }
	    }
	  }
	}


	module.exports = function smartquotes(state) {
	  /*eslint max-depth:0*/
	  var blkIdx;

	  if (!state.md.options.typographer) { return; }

	  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

	    if (state.tokens[blkIdx].type !== 'inline' ||
	        !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
	      continue;
	    }

	    process_inlines(state.tokens[blkIdx].children, state);
	  }
	};


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	// Core state object
	//
	'use strict';

	var Token = __webpack_require__(24);


	function StateCore(src, md, env) {
	  this.src = src;
	  this.env = env;
	  this.tokens = [];
	  this.inlineMode = false;
	  this.md = md; // link to parser instance
	}

	// re-export Token class to use in core rules
	StateCore.prototype.Token = Token;


	module.exports = StateCore;


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	// Process autolinks '<protocol:...>'

	'use strict';

	var url_schemas = __webpack_require__(120);


	/*eslint max-len:0*/
	var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
	var AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;


	module.exports = function autolink(state, silent) {
	  var tail, linkMatch, emailMatch, url, fullUrl, token,
	      pos = state.pos;

	  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

	  tail = state.src.slice(pos);

	  if (tail.indexOf('>') < 0) { return false; }

	  if (AUTOLINK_RE.test(tail)) {
	    linkMatch = tail.match(AUTOLINK_RE);

	    if (url_schemas.indexOf(linkMatch[1].toLowerCase()) < 0) { return false; }

	    url = linkMatch[0].slice(1, -1);
	    fullUrl = state.md.normalizeLink(url);
	    if (!state.md.validateLink(fullUrl)) { return false; }

	    if (!silent) {
	      token         = state.push('link_open', 'a', 1);
	      token.attrs   = [ [ 'href', fullUrl ] ];

	      token         = state.push('text', '', 0);
	      token.content = state.md.normalizeLinkText(url);

	      token         = state.push('link_close', 'a', -1);
	    }

	    state.pos += linkMatch[0].length;
	    return true;
	  }

	  if (EMAIL_RE.test(tail)) {
	    emailMatch = tail.match(EMAIL_RE);

	    url = emailMatch[0].slice(1, -1);
	    fullUrl = state.md.normalizeLink('mailto:' + url);
	    if (!state.md.validateLink(fullUrl)) { return false; }

	    if (!silent) {
	      token         = state.push('link_open', 'a', 1);
	      token.attrs   = [ [ 'href', fullUrl ] ];
	      token.markup  = 'autolink';
	      token.info    = 'auto';

	      token         = state.push('text', '', 0);
	      token.content = state.md.normalizeLinkText(url);

	      token         = state.push('link_close', 'a', -1);
	      token.markup  = 'autolink';
	      token.info    = 'auto';
	    }

	    state.pos += emailMatch[0].length;
	    return true;
	  }

	  return false;
	};


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	// Parse backticks

	'use strict';

	module.exports = function backtick(state, silent) {
	  var start, max, marker, matchStart, matchEnd, token,
	      pos = state.pos,
	      ch = state.src.charCodeAt(pos);

	  if (ch !== 0x60/* ` */) { return false; }

	  start = pos;
	  pos++;
	  max = state.posMax;

	  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

	  marker = state.src.slice(start, pos);

	  matchStart = matchEnd = pos;

	  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
	    matchEnd = matchStart + 1;

	    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++; }

	    if (matchEnd - matchStart === marker.length) {
	      if (!silent) {
	        token         = state.push('code_inline', 'code', 0);
	        token.markup  = marker;
	        token.content = state.src.slice(pos, matchStart)
	                                 .replace(/[ \n]+/g, ' ')
	                                 .trim();
	      }
	      state.pos = matchEnd;
	      return true;
	    }
	  }

	  if (!silent) { state.pending += marker; }
	  state.pos += marker.length;
	  return true;
	};


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	// Process *this* and _that_
	//
	'use strict';


	var isWhiteSpace   = __webpack_require__(1).isWhiteSpace;
	var isPunctChar    = __webpack_require__(1).isPunctChar;
	var isMdAsciiPunct = __webpack_require__(1).isMdAsciiPunct;


	// parse sequence of emphasis markers,
	// "start" should point at a valid marker
	function scanDelims(state, start) {
	  var pos = start, lastChar, nextChar, count, can_open, can_close,
	      isLastWhiteSpace, isLastPunctChar,
	      isNextWhiteSpace, isNextPunctChar,
	      left_flanking = true,
	      right_flanking = true,
	      max = state.posMax,
	      marker = state.src.charCodeAt(start);

	  // treat beginning of the line as a whitespace
	  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : 0x20;

	  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }

	  count = pos - start;

	  // treat end of the line as a whitespace
	  nextChar = pos < max ? state.src.charCodeAt(pos) : 0x20;

	  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
	  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

	  isLastWhiteSpace = isWhiteSpace(lastChar);
	  isNextWhiteSpace = isWhiteSpace(nextChar);

	  if (isNextWhiteSpace) {
	    left_flanking = false;
	  } else if (isNextPunctChar) {
	    if (!(isLastWhiteSpace || isLastPunctChar)) {
	      left_flanking = false;
	    }
	  }

	  if (isLastWhiteSpace) {
	    right_flanking = false;
	  } else if (isLastPunctChar) {
	    if (!(isNextWhiteSpace || isNextPunctChar)) {
	      right_flanking = false;
	    }
	  }

	  if (marker === 0x5F /* _ */) {
	    // "_" inside a word can neither open nor close an emphasis
	    can_open  = left_flanking  && (!right_flanking || isLastPunctChar);
	    can_close = right_flanking && (!left_flanking  || isNextPunctChar);
	  } else {
	    can_open  = left_flanking;
	    can_close = right_flanking;
	  }

	  return {
	    can_open: can_open,
	    can_close: can_close,
	    delims: count
	  };
	}

	module.exports = function emphasis(state, silent) {
	  var startCount,
	      count,
	      found,
	      oldCount,
	      newCount,
	      stack,
	      res,
	      token,
	      max = state.posMax,
	      start = state.pos,
	      marker = state.src.charCodeAt(start);

	  if (marker !== 0x5F/* _ */ && marker !== 0x2A /* * */) { return false; }
	  if (silent) { return false; } // don't run any pairs in validation mode

	  res = scanDelims(state, start);
	  startCount = res.delims;
	  if (!res.can_open) {
	    state.pos += startCount;
	    // Earlier we checked !silent, but this implementation does not need it
	    state.pending += state.src.slice(start, state.pos);
	    return true;
	  }

	  state.pos = start + startCount;
	  stack = [ startCount ];

	  while (state.pos < max) {
	    if (state.src.charCodeAt(state.pos) === marker) {
	      res = scanDelims(state, state.pos);
	      count = res.delims;
	      if (res.can_close) {
	        oldCount = stack.pop();
	        newCount = count;

	        while (oldCount !== newCount) {
	          if (newCount < oldCount) {
	            stack.push(oldCount - newCount);
	            break;
	          }

	          // assert(newCount > oldCount)
	          newCount -= oldCount;

	          if (stack.length === 0) { break; }
	          state.pos += oldCount;
	          oldCount = stack.pop();
	        }

	        if (stack.length === 0) {
	          startCount = oldCount;
	          found = true;
	          break;
	        }
	        state.pos += count;
	        continue;
	      }

	      if (res.can_open) { stack.push(count); }
	      state.pos += count;
	      continue;
	    }

	    state.md.inline.skipToken(state);
	  }

	  if (!found) {
	    // parser failed to find ending tag, so it's not valid emphasis
	    state.pos = start;
	    return false;
	  }

	  // found!
	  state.posMax = state.pos;
	  state.pos = start + startCount;

	  // Earlier we checked !silent, but this implementation does not need it

	  // we have `startCount` starting and ending markers,
	  // now trying to serialize them into tokens
	  for (count = startCount; count > 1; count -= 2) {
	    token        = state.push('strong_open', 'strong', 1);
	    token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);
	  }
	  if (count % 2) {
	    token        = state.push('em_open', 'em', 1);
	    token.markup = String.fromCharCode(marker);
	  }

	  state.md.inline.tokenize(state);

	  if (count % 2) {
	    token        = state.push('em_close', 'em', -1);
	    token.markup = String.fromCharCode(marker);
	  }
	  for (count = startCount; count > 1; count -= 2) {
	    token        = state.push('strong_close', 'strong', -1);
	    token.markup = String.fromCharCode(marker) + String.fromCharCode(marker);
	  }

	  state.pos = state.posMax + startCount;
	  state.posMax = max;
	  return true;
	};


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	// Process html entity - &#123;, &#xAF;, &quot;, ...

	'use strict';

	var entities          = __webpack_require__(44);
	var has               = __webpack_require__(1).has;
	var isValidEntityCode = __webpack_require__(1).isValidEntityCode;
	var fromCodePoint     = __webpack_require__(1).fromCodePoint;


	var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i;
	var NAMED_RE   = /^&([a-z][a-z0-9]{1,31});/i;


	module.exports = function entity(state, silent) {
	  var ch, code, match, pos = state.pos, max = state.posMax;

	  if (state.src.charCodeAt(pos) !== 0x26/* & */) { return false; }

	  if (pos + 1 < max) {
	    ch = state.src.charCodeAt(pos + 1);

	    if (ch === 0x23 /* # */) {
	      match = state.src.slice(pos).match(DIGITAL_RE);
	      if (match) {
	        if (!silent) {
	          code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
	          state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
	        }
	        state.pos += match[0].length;
	        return true;
	      }
	    } else {
	      match = state.src.slice(pos).match(NAMED_RE);
	      if (match) {
	        if (has(entities, match[1])) {
	          if (!silent) { state.pending += entities[match[1]]; }
	          state.pos += match[0].length;
	          return true;
	        }
	      }
	    }
	  }

	  if (!silent) { state.pending += '&'; }
	  state.pos++;
	  return true;
	};


/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	// Proceess escaped chars and hardbreaks

	'use strict';

	var ESCAPED = [];

	for (var i = 0; i < 256; i++) { ESCAPED.push(0); }

	'\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
	  .split('').forEach(function(ch) { ESCAPED[ch.charCodeAt(0)] = 1; });


	module.exports = function escape(state, silent) {
	  var ch, pos = state.pos, max = state.posMax;

	  if (state.src.charCodeAt(pos) !== 0x5C/* \ */) { return false; }

	  pos++;

	  if (pos < max) {
	    ch = state.src.charCodeAt(pos);

	    if (ch < 256 && ESCAPED[ch] !== 0) {
	      if (!silent) { state.pending += state.src[pos]; }
	      state.pos += 2;
	      return true;
	    }

	    if (ch === 0x0A) {
	      if (!silent) {
	        state.push('hardbreak', 'br', 0);
	      }

	      pos++;
	      // skip leading whitespaces from next line
	      while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

	      state.pos = pos;
	      return true;
	    }
	  }

	  if (!silent) { state.pending += '\\'; }
	  state.pos++;
	  return true;
	};


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	// Process html tags

	'use strict';


	var HTML_TAG_RE = __webpack_require__(119).HTML_TAG_RE;


	function isLetter(ch) {
	  /*eslint no-bitwise:0*/
	  var lc = ch | 0x20; // to lower case
	  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
	}


	module.exports = function html_inline(state, silent) {
	  var ch, match, max, token,
	      pos = state.pos;

	  if (!state.md.options.html) { return false; }

	  // Check start
	  max = state.posMax;
	  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
	      pos + 2 >= max) {
	    return false;
	  }

	  // Quick fail on second char
	  ch = state.src.charCodeAt(pos + 1);
	  if (ch !== 0x21/* ! */ &&
	      ch !== 0x3F/* ? */ &&
	      ch !== 0x2F/* / */ &&
	      !isLetter(ch)) {
	    return false;
	  }

	  match = state.src.slice(pos).match(HTML_TAG_RE);
	  if (!match) { return false; }

	  if (!silent) {
	    token         = state.push('html_inline', '', 0);
	    token.content = state.src.slice(pos, pos + match[0].length);
	  }
	  state.pos += match[0].length;
	  return true;
	};


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	// Process ![image](<src> "title")

	'use strict';

	var parseLinkLabel       = __webpack_require__(22);
	var parseLinkDestination = __webpack_require__(14);
	var parseLinkTitle       = __webpack_require__(15);
	var normalizeReference   = __webpack_require__(1).normalizeReference;


	module.exports = function image(state, silent) {
	  var attrs,
	      code,
	      label,
	      labelEnd,
	      labelStart,
	      pos,
	      ref,
	      res,
	      title,
	      token,
	      tokens,
	      start,
	      href = '',
	      oldPos = state.pos,
	      max = state.posMax;

	  if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) { return false; }
	  if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }

	  labelStart = state.pos + 2;
	  labelEnd = parseLinkLabel(state, state.pos + 1, false);

	  // parser failed to find ']', so it's not a valid link
	  if (labelEnd < 0) { return false; }

	  pos = labelEnd + 1;
	  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
	    //
	    // Inline link
	    //

	    // [link](  <href>  "title"  )
	    //        ^^ skipping these spaces
	    pos++;
	    for (; pos < max; pos++) {
	      code = state.src.charCodeAt(pos);
	      if (code !== 0x20 && code !== 0x0A) { break; }
	    }
	    if (pos >= max) { return false; }

	    // [link](  <href>  "title"  )
	    //          ^^^^^^ parsing link destination
	    start = pos;
	    res = parseLinkDestination(state.src, pos, state.posMax);
	    if (res.ok) {
	      href = state.md.normalizeLink(res.str);
	      if (state.md.validateLink(href)) {
	        pos = res.pos;
	      } else {
	        href = '';
	      }
	    }

	    // [link](  <href>  "title"  )
	    //                ^^ skipping these spaces
	    start = pos;
	    for (; pos < max; pos++) {
	      code = state.src.charCodeAt(pos);
	      if (code !== 0x20 && code !== 0x0A) { break; }
	    }

	    // [link](  <href>  "title"  )
	    //                  ^^^^^^^ parsing link title
	    res = parseLinkTitle(state.src, pos, state.posMax);
	    if (pos < max && start !== pos && res.ok) {
	      title = res.str;
	      pos = res.pos;

	      // [link](  <href>  "title"  )
	      //                         ^^ skipping these spaces
	      for (; pos < max; pos++) {
	        code = state.src.charCodeAt(pos);
	        if (code !== 0x20 && code !== 0x0A) { break; }
	      }
	    } else {
	      title = '';
	    }

	    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
	      state.pos = oldPos;
	      return false;
	    }
	    pos++;
	  } else {
	    //
	    // Link reference
	    //
	    if (typeof state.env.references === 'undefined') { return false; }

	    // [foo]  [bar]
	    //      ^^ optional whitespace (can include newlines)
	    for (; pos < max; pos++) {
	      code = state.src.charCodeAt(pos);
	      if (code !== 0x20 && code !== 0x0A) { break; }
	    }

	    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
	      start = pos + 1;
	      pos = parseLinkLabel(state, pos);
	      if (pos >= 0) {
	        label = state.src.slice(start, pos++);
	      } else {
	        pos = labelEnd + 1;
	      }
	    } else {
	      pos = labelEnd + 1;
	    }

	    // covers label === '' and label === undefined
	    // (collapsed reference link and shortcut reference link respectively)
	    if (!label) { label = state.src.slice(labelStart, labelEnd); }

	    ref = state.env.references[normalizeReference(label)];
	    if (!ref) {
	      state.pos = oldPos;
	      return false;
	    }
	    href = ref.href;
	    title = ref.title;
	  }

	  //
	  // We found the end of the link, and know for a fact it's a valid link;
	  // so all that's left to do is to call tokenizer.
	  //
	  if (!silent) {
	    state.pos = labelStart;
	    state.posMax = labelEnd;

	    var newState = new state.md.inline.State(
	      state.src.slice(labelStart, labelEnd),
	      state.md,
	      state.env,
	      tokens = []
	    );
	    newState.md.inline.tokenize(newState);

	    token          = state.push('image', 'img', 0);
	    token.attrs    = attrs = [ [ 'src', href ], [ 'alt', '' ] ];
	    token.children = tokens;
	    if (title) {
	      attrs.push([ 'title', title ]);
	    }
	  }

	  state.pos = pos;
	  state.posMax = max;
	  return true;
	};


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	// Process [link](<to> "stuff")

	'use strict';

	var parseLinkLabel       = __webpack_require__(22);
	var parseLinkDestination = __webpack_require__(14);
	var parseLinkTitle       = __webpack_require__(15);
	var normalizeReference   = __webpack_require__(1).normalizeReference;


	module.exports = function link(state, silent) {
	  var attrs,
	      code,
	      label,
	      labelEnd,
	      labelStart,
	      pos,
	      res,
	      ref,
	      title,
	      token,
	      href = '',
	      oldPos = state.pos,
	      max = state.posMax,
	      start = state.pos;

	  if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }

	  labelStart = state.pos + 1;
	  labelEnd = parseLinkLabel(state, state.pos, true);

	  // parser failed to find ']', so it's not a valid link
	  if (labelEnd < 0) { return false; }

	  pos = labelEnd + 1;
	  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
	    //
	    // Inline link
	    //

	    // [link](  <href>  "title"  )
	    //        ^^ skipping these spaces
	    pos++;
	    for (; pos < max; pos++) {
	      code = state.src.charCodeAt(pos);
	      if (code !== 0x20 && code !== 0x0A) { break; }
	    }
	    if (pos >= max) { return false; }

	    // [link](  <href>  "title"  )
	    //          ^^^^^^ parsing link destination
	    start = pos;
	    res = parseLinkDestination(state.src, pos, state.posMax);
	    if (res.ok) {
	      href = state.md.normalizeLink(res.str);
	      if (state.md.validateLink(href)) {
	        pos = res.pos;
	      } else {
	        href = '';
	      }
	    }

	    // [link](  <href>  "title"  )
	    //                ^^ skipping these spaces
	    start = pos;
	    for (; pos < max; pos++) {
	      code = state.src.charCodeAt(pos);
	      if (code !== 0x20 && code !== 0x0A) { break; }
	    }

	    // [link](  <href>  "title"  )
	    //                  ^^^^^^^ parsing link title
	    res = parseLinkTitle(state.src, pos, state.posMax);
	    if (pos < max && start !== pos && res.ok) {
	      title = res.str;
	      pos = res.pos;

	      // [link](  <href>  "title"  )
	      //                         ^^ skipping these spaces
	      for (; pos < max; pos++) {
	        code = state.src.charCodeAt(pos);
	        if (code !== 0x20 && code !== 0x0A) { break; }
	      }
	    } else {
	      title = '';
	    }

	    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
	      state.pos = oldPos;
	      return false;
	    }
	    pos++;
	  } else {
	    //
	    // Link reference
	    //
	    if (typeof state.env.references === 'undefined') { return false; }

	    // [foo]  [bar]
	    //      ^^ optional whitespace (can include newlines)
	    for (; pos < max; pos++) {
	      code = state.src.charCodeAt(pos);
	      if (code !== 0x20 && code !== 0x0A) { break; }
	    }

	    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
	      start = pos + 1;
	      pos = parseLinkLabel(state, pos);
	      if (pos >= 0) {
	        label = state.src.slice(start, pos++);
	      } else {
	        pos = labelEnd + 1;
	      }
	    } else {
	      pos = labelEnd + 1;
	    }

	    // covers label === '' and label === undefined
	    // (collapsed reference link and shortcut reference link respectively)
	    if (!label) { label = state.src.slice(labelStart, labelEnd); }

	    ref = state.env.references[normalizeReference(label)];
	    if (!ref) {
	      state.pos = oldPos;
	      return false;
	    }
	    href = ref.href;
	    title = ref.title;
	  }

	  //
	  // We found the end of the link, and know for a fact it's a valid link;
	  // so all that's left to do is to call tokenizer.
	  //
	  if (!silent) {
	    state.pos = labelStart;
	    state.posMax = labelEnd;

	    token        = state.push('link_open', 'a', 1);
	    token.attrs  = attrs = [ [ 'href', href ] ];
	    if (title) {
	      attrs.push([ 'title', title ]);
	    }

	    state.md.inline.tokenize(state);

	    token        = state.push('link_close', 'a', -1);
	  }

	  state.pos = pos;
	  state.posMax = max;
	  return true;
	};


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	// Proceess '\n'

	'use strict';

	module.exports = function newline(state, silent) {
	  var pmax, max, pos = state.pos;

	  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

	  pmax = state.pending.length - 1;
	  max = state.posMax;

	  // '  \n' -> hardbreak
	  // Lookup in pending chars is bad practice! Don't copy to other rules!
	  // Pending string is stored in concat mode, indexed lookups will cause
	  // convertion to flat mode.
	  if (!silent) {
	    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
	      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
	        state.pending = state.pending.replace(/ +$/, '');
	        state.push('hardbreak', 'br', 0);
	      } else {
	        state.pending = state.pending.slice(0, -1);
	        state.push('softbreak', 'br', 0);
	      }

	    } else {
	      state.push('softbreak', 'br', 0);
	    }
	  }

	  pos++;

	  // skip heading spaces for next line
	  while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

	  state.pos = pos;
	  return true;
	};


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	// Inline parser state

	'use strict';


	var Token = __webpack_require__(24);

	function StateInline(src, md, env, outTokens) {
	  this.src = src;
	  this.env = env;
	  this.md = md;
	  this.tokens = outTokens;

	  this.pos = 0;
	  this.posMax = this.src.length;
	  this.level = 0;
	  this.pending = '';
	  this.pendingLevel = 0;

	  this.cache = {};        // Stores { start: end } pairs. Useful for backtrack
	                          // optimization of pairs parse (emphasis, strikes).
	}


	// Flush pending text
	//
	StateInline.prototype.pushPending = function () {
	  var token = new Token('text', '', 0);
	  token.content = this.pending;
	  token.level = this.pendingLevel;
	  this.tokens.push(token);
	  this.pending = '';
	  return token;
	};


	// Push new token to "stream".
	// If pending text exists - flush it as text token
	//
	StateInline.prototype.push = function (type, tag, nesting) {
	  if (this.pending) {
	    this.pushPending();
	  }

	  var token = new Token(type, tag, nesting);

	  if (nesting < 0) { this.level--; }
	  token.level = this.level;
	  if (nesting > 0) { this.level++; }

	  this.pendingLevel = this.level;
	  this.tokens.push(token);
	  return token;
	};

	// re-export Token class to use in block rules
	StateInline.prototype.Token = Token;


	module.exports = StateInline;


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	// ~~strike through~~
	//
	'use strict';


	var isWhiteSpace   = __webpack_require__(1).isWhiteSpace;
	var isPunctChar    = __webpack_require__(1).isPunctChar;
	var isMdAsciiPunct = __webpack_require__(1).isMdAsciiPunct;


	// parse sequence of markers,
	// "start" should point at a valid marker
	function scanDelims(state, start) {
	  var pos = start, lastChar, nextChar, count,
	      isLastWhiteSpace, isLastPunctChar,
	      isNextWhiteSpace, isNextPunctChar,
	      can_open = true,
	      can_close = true,
	      max = state.posMax,
	      marker = state.src.charCodeAt(start);

	  // treat beginning of the line as a whitespace
	  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : 0x20;

	  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }

	  if (pos >= max) {
	    can_open = false;
	  }

	  count = pos - start;

	  // treat end of the line as a whitespace
	  nextChar = pos < max ? state.src.charCodeAt(pos) : 0x20;

	  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
	  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

	  isLastWhiteSpace = isWhiteSpace(lastChar);
	  isNextWhiteSpace = isWhiteSpace(nextChar);

	  if (isNextWhiteSpace) {
	    can_open = false;
	  } else if (isNextPunctChar) {
	    if (!(isLastWhiteSpace || isLastPunctChar)) {
	      can_open = false;
	    }
	  }

	  if (isLastWhiteSpace) {
	    can_close = false;
	  } else if (isLastPunctChar) {
	    if (!(isNextWhiteSpace || isNextPunctChar)) {
	      can_close = false;
	    }
	  }

	  return {
	    can_open: can_open,
	    can_close: can_close,
	    delims: count
	  };
	}


	module.exports = function strikethrough(state, silent) {
	  var startCount,
	      count,
	      tagCount,
	      found,
	      stack,
	      res,
	      token,
	      max = state.posMax,
	      start = state.pos,
	      marker = state.src.charCodeAt(start);

	  if (marker !== 0x7E/* ~ */) { return false; }
	  if (silent) { return false; } // don't run any pairs in validation mode

	  res = scanDelims(state, start);
	  startCount = res.delims;
	  if (!res.can_open) {
	    state.pos += startCount;
	    // Earlier we checked !silent, but this implementation does not need it
	    state.pending += state.src.slice(start, state.pos);
	    return true;
	  }

	  stack = Math.floor(startCount / 2);
	  if (stack <= 0) { return false; }
	  state.pos = start + startCount;

	  while (state.pos < max) {
	    if (state.src.charCodeAt(state.pos) === marker) {
	      res = scanDelims(state, state.pos);
	      count = res.delims;
	      tagCount = Math.floor(count / 2);
	      if (res.can_close) {
	        if (tagCount >= stack) {
	          state.pos += count - 2;
	          found = true;
	          break;
	        }
	        stack -= tagCount;
	        state.pos += count;
	        continue;
	      }

	      if (res.can_open) { stack += tagCount; }
	      state.pos += count;
	      continue;
	    }

	    state.md.inline.skipToken(state);
	  }

	  if (!found) {
	    // parser failed to find ending tag, so it's not valid emphasis
	    state.pos = start;
	    return false;
	  }

	  // found!
	  state.posMax = state.pos;
	  state.pos = start + 2;

	  // Earlier we checked !silent, but this implementation does not need it
	  token        = state.push('s_open', 's', 1);
	  token.markup = '~~';

	  state.md.inline.tokenize(state);

	  token        = state.push('s_close', 's', -1);
	  token.markup = '~~';

	  state.pos = state.posMax + 2;
	  state.posMax = max;
	  return true;
	};


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	// Skip text characters for text token, place those to pending buffer
	// and increment current pos

	'use strict';


	// Rule to skip pure text
	// '{}$%@~+=:' reserved for extentions

	// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~

	// !!!! Don't confuse with "Markdown ASCII Punctuation" chars
	// http://spec.commonmark.org/0.15/#ascii-punctuation-character
	function isTerminatorChar(ch) {
	  switch (ch) {
	    case 0x0A/* \n */:
	    case 0x21/* ! */:
	    case 0x23/* # */:
	    case 0x24/* $ */:
	    case 0x25/* % */:
	    case 0x26/* & */:
	    case 0x2A/* * */:
	    case 0x2B/* + */:
	    case 0x2D/* - */:
	    case 0x3A/* : */:
	    case 0x3C/* < */:
	    case 0x3D/* = */:
	    case 0x3E/* > */:
	    case 0x40/* @ */:
	    case 0x5B/* [ */:
	    case 0x5C/* \ */:
	    case 0x5D/* ] */:
	    case 0x5E/* ^ */:
	    case 0x5F/* _ */:
	    case 0x60/* ` */:
	    case 0x7B/* { */:
	    case 0x7D/* } */:
	    case 0x7E/* ~ */:
	      return true;
	    default:
	      return false;
	  }
	}

	module.exports = function text(state, silent) {
	  var pos = state.pos;

	  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
	    pos++;
	  }

	  if (pos === state.pos) { return false; }

	  if (!silent) { state.pending += state.src.slice(state.pos, pos); }

	  state.pos = pos;

	  return true;
	};

	// Alternative implementation, for memory.
	//
	// It costs 10% of performance, but allows extend terminators list, if place it
	// to `ParcerInline` property. Probably, will switch to it sometime, such
	// flexibility required.

	/*
	var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

	module.exports = function text(state, silent) {
	  var pos = state.pos,
	      idx = state.src.slice(pos).search(TERMINATOR_RE);

	  // first char is terminator -> empty text
	  if (idx === 0) { return false; }

	  // no terminator -> text till end of string
	  if (idx < 0) {
	    if (!silent) { state.pending += state.src.slice(pos); }
	    state.pos = state.src.length;
	    return true;
	  }

	  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

	  state.pos += idx;

	  return true;
	};*/


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	////////////////////////////////////////////////////////////////////////////////
	// Helpers

	// Merge objects
	//
	function assign(obj /*from1, from2, from3, ...*/) {
	  var sources = Array.prototype.slice.call(arguments, 1);

	  sources.forEach(function (source) {
	    if (!source) { return; }

	    Object.keys(source).forEach(function (key) {
	      obj[key] = source[key];
	    });
	  });

	  return obj;
	}

	function _class(obj) { return Object.prototype.toString.call(obj); }
	function isString(obj) { return _class(obj) === '[object String]'; }
	function isObject(obj) { return _class(obj) === '[object Object]'; }
	function isRegExp(obj) { return _class(obj) === '[object RegExp]'; }
	function isFunction(obj) { return _class(obj) === '[object Function]'; }


	function escapeRE (str) { return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'); }

	////////////////////////////////////////////////////////////////////////////////


	var defaultOptions = {
	  fuzzyLink: true,
	  fuzzyEmail: true,
	  fuzzyIP: false
	};


	function isOptionsObj(obj) {
	  return Object.keys(obj || {}).reduce(function (acc, k) {
	    return acc || defaultOptions.hasOwnProperty(k);
	  }, false);
	}


	var defaultSchemas = {
	  'http:': {
	    validate: function (text, pos, self) {
	      var tail = text.slice(pos);

	      if (!self.re.http) {
	        // compile lazily, because "host"-containing variables can change on tlds update.
	        self.re.http =  new RegExp(
	          '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
	        );
	      }
	      if (self.re.http.test(tail)) {
	        return tail.match(self.re.http)[0].length;
	      }
	      return 0;
	    }
	  },
	  'https:':  'http:',
	  'ftp:':    'http:',
	  '//':      {
	    validate: function (text, pos, self) {
	      var tail = text.slice(pos);

	      if (!self.re.no_http) {
	      // compile lazily, becayse "host"-containing variables can change on tlds update.
	        self.re.no_http =  new RegExp(
	          '^' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
	        );
	      }

	      if (self.re.no_http.test(tail)) {
	        // should not be `://`, that protects from errors in protocol name
	        if (pos >= 3 && text[pos - 3] === ':') { return 0; }
	        return tail.match(self.re.no_http)[0].length;
	      }
	      return 0;
	    }
	  },
	  'mailto:': {
	    validate: function (text, pos, self) {
	      var tail = text.slice(pos);

	      if (!self.re.mailto) {
	        self.re.mailto =  new RegExp(
	          '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
	        );
	      }
	      if (self.re.mailto.test(tail)) {
	        return tail.match(self.re.mailto)[0].length;
	      }
	      return 0;
	    }
	  }
	};

	/*eslint-disable max-len*/

	// RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
	var tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

	// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
	var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');

	/*eslint-enable max-len*/

	////////////////////////////////////////////////////////////////////////////////

	function resetScanCache(self) {
	  self.__index__ = -1;
	  self.__text_cache__   = '';
	}

	function createValidator(re) {
	  return function (text, pos) {
	    var tail = text.slice(pos);

	    if (re.test(tail)) {
	      return tail.match(re)[0].length;
	    }
	    return 0;
	  };
	}

	function createNormalizer() {
	  return function (match, self) {
	    self.normalize(match);
	  };
	}

	// Schemas compiler. Build regexps.
	//
	function compile(self) {

	  // Load & clone RE patterns.
	  var re = self.re = assign({}, __webpack_require__(162));

	  // Define dynamic patterns
	  var tlds = self.__tlds__.slice();

	  if (!self.__tlds_replaced__) {
	    tlds.push(tlds_2ch_src_re);
	  }
	  tlds.push(re.src_xn);

	  re.src_tlds = tlds.join('|');

	  function untpl(tpl) { return tpl.replace('%TLDS%', re.src_tlds); }

	  re.email_fuzzy      = RegExp(untpl(re.tpl_email_fuzzy), 'i');
	  re.link_fuzzy       = RegExp(untpl(re.tpl_link_fuzzy), 'i');
	  re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
	  re.host_fuzzy_test  = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');

	  //
	  // Compile each schema
	  //

	  var aliases = [];

	  self.__compiled__ = {}; // Reset compiled data

	  function schemaError(name, val) {
	    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
	  }

	  Object.keys(self.__schemas__).forEach(function (name) {
	    var val = self.__schemas__[name];

	    // skip disabled methods
	    if (val === null) { return; }

	    var compiled = { validate: null, link: null };

	    self.__compiled__[name] = compiled;

	    if (isObject(val)) {
	      if (isRegExp(val.validate)) {
	        compiled.validate = createValidator(val.validate);
	      } else if (isFunction(val.validate)) {
	        compiled.validate = val.validate;
	      } else {
	        schemaError(name, val);
	      }

	      if (isFunction(val.normalize)) {
	        compiled.normalize = val.normalize;
	      } else if (!val.normalize) {
	        compiled.normalize = createNormalizer();
	      } else {
	        schemaError(name, val);
	      }

	      return;
	    }

	    if (isString(val)) {
	      aliases.push(name);
	      return;
	    }

	    schemaError(name, val);
	  });

	  //
	  // Compile postponed aliases
	  //

	  aliases.forEach(function (alias) {
	    if (!self.__compiled__[self.__schemas__[alias]]) {
	      // Silently fail on missed schemas to avoid errons on disable.
	      // schemaError(alias, self.__schemas__[alias]);
	      return;
	    }

	    self.__compiled__[alias].validate =
	      self.__compiled__[self.__schemas__[alias]].validate;
	    self.__compiled__[alias].normalize =
	      self.__compiled__[self.__schemas__[alias]].normalize;
	  });

	  //
	  // Fake record for guessed links
	  //
	  self.__compiled__[''] = { validate: null, normalize: createNormalizer() };

	  //
	  // Build schema condition
	  //
	  var slist = Object.keys(self.__compiled__)
	                      .filter(function(name) {
	                        // Filter disabled & fake schemas
	                        return name.length > 0 && self.__compiled__[name];
	                      })
	                      .map(escapeRE)
	                      .join('|');
	  // (?!_) cause 1.5x slowdown
	  self.re.schema_test   = RegExp('(^|(?!_)(?:>|' + re.src_ZPCc + '))(' + slist + ')', 'i');
	  self.re.schema_search = RegExp('(^|(?!_)(?:>|' + re.src_ZPCc + '))(' + slist + ')', 'ig');

	  self.re.pretest       = RegExp(
	                            '(' + self.re.schema_test.source + ')|' +
	                            '(' + self.re.host_fuzzy_test.source + ')|' +
	                            '@',
	                            'i');

	  //
	  // Cleanup
	  //

	  resetScanCache(self);
	}

	/**
	 * class Match
	 *
	 * Match result. Single element of array, returned by [[LinkifyIt#match]]
	 **/
	function Match(self, shift) {
	  var start = self.__index__,
	      end   = self.__last_index__,
	      text  = self.__text_cache__.slice(start, end);

	  /**
	   * Match#schema -> String
	   *
	   * Prefix (protocol) for matched string.
	   **/
	  this.schema    = self.__schema__.toLowerCase();
	  /**
	   * Match#index -> Number
	   *
	   * First position of matched string.
	   **/
	  this.index     = start + shift;
	  /**
	   * Match#lastIndex -> Number
	   *
	   * Next position after matched string.
	   **/
	  this.lastIndex = end + shift;
	  /**
	   * Match#raw -> String
	   *
	   * Matched string.
	   **/
	  this.raw       = text;
	  /**
	   * Match#text -> String
	   *
	   * Notmalized text of matched string.
	   **/
	  this.text      = text;
	  /**
	   * Match#url -> String
	   *
	   * Normalized url of matched string.
	   **/
	  this.url       = text;
	}

	function createMatch(self, shift) {
	  var match = new Match(self, shift);

	  self.__compiled__[match.schema].normalize(match, self);

	  return match;
	}


	/**
	 * class LinkifyIt
	 **/

	/**
	 * new LinkifyIt(schemas, options)
	 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
	 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
	 *
	 * Creates new linkifier instance with optional additional schemas.
	 * Can be called without `new` keyword for convenience.
	 *
	 * By default understands:
	 *
	 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
	 * - "fuzzy" links and emails (example.com, foo@bar.com).
	 *
	 * `schemas` is an object, where each key/value describes protocol/rule:
	 *
	 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
	 *   for example). `linkify-it` makes shure that prefix is not preceeded with
	 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
	 * - __value__ - rule to check tail after link prefix
	 *   - _String_ - just alias to existing rule
	 *   - _Object_
	 *     - _validate_ - validator function (should return matched length on success),
	 *       or `RegExp`.
	 *     - _normalize_ - optional function to normalize text & url of matched result
	 *       (for example, for @twitter mentions).
	 *
	 * `options`:
	 *
	 * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
	 * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
	 *   like version numbers. Default `false`.
	 * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
	 *
	 **/
	function LinkifyIt(schemas, options) {
	  if (!(this instanceof LinkifyIt)) {
	    return new LinkifyIt(schemas, options);
	  }

	  if (!options) {
	    if (isOptionsObj(schemas)) {
	      options = schemas;
	      schemas = {};
	    }
	  }

	  this.__opts__           = assign({}, defaultOptions, options);

	  // Cache last tested result. Used to skip repeating steps on next `match` call.
	  this.__index__          = -1;
	  this.__last_index__     = -1; // Next scan position
	  this.__schema__         = '';
	  this.__text_cache__     = '';

	  this.__schemas__        = assign({}, defaultSchemas, schemas);
	  this.__compiled__       = {};

	  this.__tlds__           = tlds_default;
	  this.__tlds_replaced__  = false;

	  this.re = {};

	  compile(this);
	}


	/** chainable
	 * LinkifyIt#add(schema, definition)
	 * - schema (String): rule name (fixed pattern prefix)
	 * - definition (String|RegExp|Object): schema definition
	 *
	 * Add new rule definition. See constructor description for details.
	 **/
	LinkifyIt.prototype.add = function add(schema, definition) {
	  this.__schemas__[schema] = definition;
	  compile(this);
	  return this;
	};


	/** chainable
	 * LinkifyIt#set(options)
	 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
	 *
	 * Set recognition options for links without schema.
	 **/
	LinkifyIt.prototype.set = function set(options) {
	  this.__opts__ = assign(this.__opts__, options);
	  return this;
	};


	/**
	 * LinkifyIt#test(text) -> Boolean
	 *
	 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
	 **/
	LinkifyIt.prototype.test = function test(text) {
	  // Reset scan cache
	  this.__text_cache__ = text;
	  this.__index__      = -1;

	  if (!text.length) { return false; }

	  var m, ml, me, len, shift, next, re, tld_pos, at_pos;

	  // try to scan for link with schema - that's the most simple rule
	  if (this.re.schema_test.test(text)) {
	    re = this.re.schema_search;
	    re.lastIndex = 0;
	    while ((m = re.exec(text)) !== null) {
	      len = this.testSchemaAt(text, m[2], re.lastIndex);
	      if (len) {
	        this.__schema__     = m[2];
	        this.__index__      = m.index + m[1].length;
	        this.__last_index__ = m.index + m[0].length + len;
	        break;
	      }
	    }
	  }

	  if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
	    // guess schemaless links
	    tld_pos = text.search(this.re.host_fuzzy_test);
	    if (tld_pos >= 0) {
	      // if tld is located after found link - no need to check fuzzy pattern
	      if (this.__index__ < 0 || tld_pos < this.__index__) {
	        if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {

	          shift = ml.index + ml[1].length;

	          if (this.__index__ < 0 || shift < this.__index__) {
	            this.__schema__     = '';
	            this.__index__      = shift;
	            this.__last_index__ = ml.index + ml[0].length;
	          }
	        }
	      }
	    }
	  }

	  if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
	    // guess schemaless emails
	    at_pos = text.indexOf('@');
	    if (at_pos >= 0) {
	      // We can't skip this check, because this cases are possible:
	      // 192.168.1.1@gmail.com, my.in@example.com
	      if ((me = text.match(this.re.email_fuzzy)) !== null) {

	        shift = me.index + me[1].length;
	        next  = me.index + me[0].length;

	        if (this.__index__ < 0 || shift < this.__index__ ||
	            (shift === this.__index__ && next > this.__last_index__)) {
	          this.__schema__     = 'mailto:';
	          this.__index__      = shift;
	          this.__last_index__ = next;
	        }
	      }
	    }
	  }

	  return this.__index__ >= 0;
	};


	/**
	 * LinkifyIt#pretest(text) -> Boolean
	 *
	 * Very quick check, that can give false positives. Returns true if link MAY BE
	 * can exists. Can be used for speed optimization, when you need to check that
	 * link NOT exists.
	 **/
	LinkifyIt.prototype.pretest = function pretest(text) {
	  return this.re.pretest.test(text);
	};


	/**
	 * LinkifyIt#testSchemaAt(text, name, position) -> Number
	 * - text (String): text to scan
	 * - name (String): rule (schema) name
	 * - position (Number): text offset to check from
	 *
	 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
	 * at given position. Returns length of found pattern (0 on fail).
	 **/
	LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
	  // If not supported schema check requested - terminate
	  if (!this.__compiled__[schema.toLowerCase()]) {
	    return 0;
	  }
	  return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
	};


	/**
	 * LinkifyIt#match(text) -> Array|null
	 *
	 * Returns array of found link descriptions or `null` on fail. We strongly
	 * to use [[LinkifyIt#test]] first, for best speed.
	 *
	 * ##### Result match description
	 *
	 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
	 *   protocol-neutral  links.
	 * - __index__ - offset of matched text
	 * - __lastIndex__ - index of next char after mathch end
	 * - __raw__ - matched text
	 * - __text__ - normalized text
	 * - __url__ - link, generated from matched text
	 **/
	LinkifyIt.prototype.match = function match(text) {
	  var shift = 0, result = [];

	  // Try to take previous element from cache, if .test() called before
	  if (this.__index__ >= 0 && this.__text_cache__ === text) {
	    result.push(createMatch(this, shift));
	    shift = this.__last_index__;
	  }

	  // Cut head if cache was used
	  var tail = shift ? text.slice(shift) : text;

	  // Scan string until end reached
	  while (this.test(tail)) {
	    result.push(createMatch(this, shift));

	    tail = tail.slice(this.__last_index__);
	    shift += this.__last_index__;
	  }

	  if (result.length) {
	    return result;
	  }

	  return null;
	};


	/** chainable
	 * LinkifyIt#tlds(list [, keepOld]) -> this
	 * - list (Array): list of tlds
	 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
	 *
	 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
	 * to avoid false positives. By default this algorythm used:
	 *
	 * - hostname with any 2-letter root zones are ok.
	 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
	 *   are ok.
	 * - encoded (`xn--...`) root zones are ok.
	 *
	 * If list is replaced, then exact match for 2-chars root zones will be checked.
	 **/
	LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
	  list = Array.isArray(list) ? list : [ list ];

	  if (!keepOld) {
	    this.__tlds__ = list.slice();
	    this.__tlds_replaced__ = true;
	    compile(this);
	    return this;
	  }

	  this.__tlds__ = this.__tlds__.concat(list)
	                                  .sort()
	                                  .filter(function(el, idx, arr) {
	                                    return el !== arr[idx - 1];
	                                  })
	                                  .reverse();

	  compile(this);
	  return this;
	};

	/**
	 * LinkifyIt#normalize(match)
	 *
	 * Default normalizer (if schema does not define it's own).
	 **/
	LinkifyIt.prototype.normalize = function normalize(match) {

	  // Do minimal possible changes by default. Need to collect feedback prior
	  // to move forward https://github.com/markdown-it/linkify-it/issues/1

	  if (!match.schema) { match.url = 'http://' + match.url; }

	  if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
	    match.url = 'mailto:' + match.url;
	  }
	};


	module.exports = LinkifyIt;


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Use direct extract instead of `regenerate` to reduse browserified size
	var src_Any = exports.src_Any = __webpack_require__(48).source;
	var src_Cc  = exports.src_Cc = __webpack_require__(46).source;
	var src_Z   = exports.src_Z  = __webpack_require__(47).source;
	var src_P   = exports.src_P  = __webpack_require__(25).source;

	// \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
	var src_ZPCc = exports.src_ZPCc = [ src_Z, src_P, src_Cc ].join('|');

	// \p{\Z\Cc} (white spaces + control)
	var src_ZCc = exports.src_ZCc = [ src_Z, src_Cc ].join('|');

	// All possible word characters (everything without punctuation, spaces & controls)
	// Defined via punctuation & spaces to save space
	// Should be something like \p{\L\N\S\M} (\w but without `_`)
	var src_pseudo_letter       = '(?:(?!' + src_ZPCc + ')' + src_Any + ')';
	// The same as abothe but without [0-9]
	var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';

	////////////////////////////////////////////////////////////////////////////////

	var src_ip4 = exports.src_ip4 =

	  '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

	exports.src_auth    = '(?:(?:(?!' + src_ZCc + ').)+@)?';

	var src_port = exports.src_port =

	  '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

	var src_host_terminator = exports.src_host_terminator =

	  '(?=$|' + src_ZPCc + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + src_ZPCc + '))';

	var src_path = exports.src_path =

	  '(?:' +
	    '[/?#]' +
	      '(?:' +
	        '(?!' + src_ZCc + '|[()[\\]{}.,"\'?!\\-]).|' +
	        '\\[(?:(?!' + src_ZCc + '|\\]).)*\\]|' +
	        '\\((?:(?!' + src_ZCc + '|[)]).)*\\)|' +
	        '\\{(?:(?!' + src_ZCc + '|[}]).)*\\}|' +
	        '\\"(?:(?!' + src_ZCc + '|["]).)+\\"|' +
	        "\\'(?:(?!" + src_ZCc + "|[']).)+\\'|" +
	        "\\'(?=" + src_pseudo_letter + ').|' +  // allow `I'm_king` if no pair found
	        '\\.{2,3}[a-zA-Z0-9%]|' + // github has ... in commit range links. Restrict to
	                                  // english & percent-encoded only, until more examples found.
	        '\\.(?!' + src_ZCc + '|[.]).|' +
	        '\\-(?!' + src_ZCc + '|--(?:[^-]|$))(?:[-]+|.)|' +  // `---` => long dash, terminate
	        '\\,(?!' + src_ZCc + ').|' +      // allow `,,,` in paths
	        '\\!(?!' + src_ZCc + '|[!]).|' +
	        '\\?(?!' + src_ZCc + '|[?]).' +
	      ')+' +
	    '|\\/' +
	  ')?';

	var src_email_name = exports.src_email_name =

	  '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+';

	var src_xn = exports.src_xn =

	  'xn--[a-z0-9\\-]{1,59}';

	// More to read about domain names
	// http://serverfault.com/questions/638260/

	var src_domain_root = exports.src_domain_root =

	  // Can't have digits and dashes
	  '(?:' +
	    src_xn +
	    '|' +
	    src_pseudo_letter_non_d + '{1,63}' +
	  ')';

	var src_domain = exports.src_domain =

	  '(?:' +
	    src_xn +
	    '|' +
	    '(?:' + src_pseudo_letter + ')' +
	    '|' +
	    // don't allow `--` in domain names, because:
	    // - that can conflict with markdown &mdash; / &ndash;
	    // - nobody use those anyway
	    '(?:' + src_pseudo_letter + '(?:-(?!-)|' + src_pseudo_letter + '){0,61}' + src_pseudo_letter + ')' +
	  ')';

	var src_host = exports.src_host =

	  '(?:' +
	    src_ip4 +
	  '|' +
	    '(?:(?:(?:' + src_domain + ')\\.)*' + src_domain_root + ')' +
	  ')';

	var tpl_host_fuzzy = exports.tpl_host_fuzzy =

	  '(?:' +
	    src_ip4 +
	  '|' +
	    '(?:(?:(?:' + src_domain + ')\\.)+(?:%TLDS%))' +
	  ')';

	var tpl_host_no_ip_fuzzy = exports.tpl_host_no_ip_fuzzy =

	  '(?:(?:(?:' + src_domain + ')\\.)+(?:%TLDS%))';

	exports.src_host_strict =

	  src_host + src_host_terminator;

	var tpl_host_fuzzy_strict = exports.tpl_host_fuzzy_strict =

	  tpl_host_fuzzy + src_host_terminator;

	exports.src_host_port_strict =

	  src_host + src_port + src_host_terminator;

	var tpl_host_port_fuzzy_strict = exports.tpl_host_port_fuzzy_strict =

	  tpl_host_fuzzy + src_port + src_host_terminator;

	var tpl_host_port_no_ip_fuzzy_strict = exports.tpl_host_port_no_ip_fuzzy_strict =

	  tpl_host_no_ip_fuzzy + src_port + src_host_terminator;


	////////////////////////////////////////////////////////////////////////////////
	// Main rules

	// Rude test fuzzy links by host, for quick deny
	exports.tpl_host_fuzzy_test =

	  'localhost|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + src_ZPCc + '|$))';

	exports.tpl_email_fuzzy =

	    '(^|>|' + src_ZCc + ')(' + src_email_name + '@' + tpl_host_fuzzy_strict + ')';

	exports.tpl_link_fuzzy =
	    // Fuzzy link can't be prepended with .:/\- and non punctuation.
	    // but can start with > (markdown blockquote)
	    '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + src_ZPCc + '))' +
	    '((?![$+<=>^`|])' + tpl_host_port_fuzzy_strict + src_path + ')';

	exports.tpl_link_no_ip_fuzzy =
	    // Fuzzy link can't be prepended with .:/\- and non punctuation.
	    // but can start with > (markdown blockquote)
	    '(^|(?![.:/\\-_@])(?:[$+<=>^`|]|' + src_ZPCc + '))' +
	    '((?![$+<=>^`|])' + tpl_host_port_no_ip_fuzzy_strict + src_path + ')';


/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';


	/* eslint-disable no-bitwise */

	var decodeCache = {};

	function getDecodeCache(exclude) {
	  var i, ch, cache = decodeCache[exclude];
	  if (cache) { return cache; }

	  cache = decodeCache[exclude] = [];

	  for (i = 0; i < 128; i++) {
	    ch = String.fromCharCode(i);
	    cache.push(ch);
	  }

	  for (i = 0; i < exclude.length; i++) {
	    ch = exclude.charCodeAt(i);
	    cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
	  }

	  return cache;
	}


	// Decode percent-encoded string.
	//
	function decode(string, exclude) {
	  var cache;

	  if (typeof exclude !== 'string') {
	    exclude = decode.defaultChars;
	  }

	  cache = getDecodeCache(exclude);

	  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
	    var i, l, b1, b2, b3, b4, char,
	        result = '';

	    for (i = 0, l = seq.length; i < l; i += 3) {
	      b1 = parseInt(seq.slice(i + 1, i + 3), 16);

	      if (b1 < 0x80) {
	        result += cache[b1];
	        continue;
	      }

	      if ((b1 & 0xE0) === 0xC0 && (i + 3 < l)) {
	        // 110xxxxx 10xxxxxx
	        b2 = parseInt(seq.slice(i + 4, i + 6), 16);

	        if ((b2 & 0xC0) === 0x80) {
	          char = ((b1 << 6) & 0x7C0) | (b2 & 0x3F);

	          if (char < 0x80) {
	            result += '\ufffd\ufffd';
	          } else {
	            result += String.fromCharCode(char);
	          }

	          i += 3;
	          continue;
	        }
	      }

	      if ((b1 & 0xF0) === 0xE0 && (i + 6 < l)) {
	        // 1110xxxx 10xxxxxx 10xxxxxx
	        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
	        b3 = parseInt(seq.slice(i + 7, i + 9), 16);

	        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
	          char = ((b1 << 12) & 0xF000) | ((b2 << 6) & 0xFC0) | (b3 & 0x3F);

	          if (char < 0x800 || (char >= 0xD800 && char <= 0xDFFF)) {
	            result += '\ufffd\ufffd\ufffd';
	          } else {
	            result += String.fromCharCode(char);
	          }

	          i += 6;
	          continue;
	        }
	      }

	      if ((b1 & 0xF8) === 0xF0 && (i + 9 < l)) {
	        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
	        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
	        b3 = parseInt(seq.slice(i + 7, i + 9), 16);
	        b4 = parseInt(seq.slice(i + 10, i + 12), 16);

	        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
	          char = ((b1 << 18) & 0x1C0000) | ((b2 << 12) & 0x3F000) | ((b3 << 6) & 0xFC0) | (b4 & 0x3F);

	          if (char < 0x10000 || char > 0x10FFFF) {
	            result += '\ufffd\ufffd\ufffd\ufffd';
	          } else {
	            char -= 0x10000;
	            result += String.fromCharCode(0xD800 + (char >> 10), 0xDC00 + (char & 0x3FF));
	          }

	          i += 9;
	          continue;
	        }
	      }

	      result += '\ufffd';
	    }

	    return result;
	  });
	}


	decode.defaultChars   = ';/?:@&=+$,#';
	decode.componentChars = '';


	module.exports = decode;


/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';


	var encodeCache = {};


	// Create a lookup array where anything but characters in `chars` string
	// and alphanumeric chars is percent-encoded.
	//
	function getEncodeCache(exclude) {
	  var i, ch, cache = encodeCache[exclude];
	  if (cache) { return cache; }

	  cache = encodeCache[exclude] = [];

	  for (i = 0; i < 128; i++) {
	    ch = String.fromCharCode(i);

	    if (/^[0-9a-z]$/i.test(ch)) {
	      // always allow unencoded alphanumeric characters
	      cache.push(ch);
	    } else {
	      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
	    }
	  }

	  for (i = 0; i < exclude.length; i++) {
	    cache[exclude.charCodeAt(i)] = exclude[i];
	  }

	  return cache;
	}


	// Encode unsafe characters with percent-encoding, skipping already
	// encoded sequences.
	//
	//  - string       - string to encode
	//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
	//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
	//
	function encode(string, exclude, keepEscaped) {
	  var i, l, code, nextCode, cache,
	      result = '';

	  if (typeof exclude !== 'string') {
	    // encode(string, keepEscaped)
	    keepEscaped  = exclude;
	    exclude = encode.defaultChars;
	  }

	  if (typeof keepEscaped === 'undefined') {
	    keepEscaped = true;
	  }

	  cache = getEncodeCache(exclude);

	  for (i = 0, l = string.length; i < l; i++) {
	    code = string.charCodeAt(i);

	    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
	      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
	        result += string.slice(i, i + 3);
	        i += 2;
	        continue;
	      }
	    }

	    if (code < 128) {
	      result += cache[code];
	      continue;
	    }

	    if (code >= 0xD800 && code <= 0xDFFF) {
	      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
	        nextCode = string.charCodeAt(i + 1);
	        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
	          result += encodeURIComponent(string[i] + string[i + 1]);
	          i++;
	          continue;
	        }
	      }
	      result += '%EF%BF%BD';
	      continue;
	    }

	    result += encodeURIComponent(string[i]);
	  }

	  return result;
	}

	encode.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
	encode.componentChars = "-_.!~*'()";


	module.exports = encode;


/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';


	module.exports = function format(url) {
	  var result = '';

	  result += url.protocol || '';
	  result += url.slashes ? '//' : '';
	  result += url.auth ? url.auth + '@' : '';

	  if (url.hostname && url.hostname.indexOf(':') !== -1) {
	    // ipv6 address
	    result += '[' + url.hostname + ']';
	  } else {
	    result += url.hostname || '';
	  }

	  result += url.port ? ':' + url.port : '';
	  result += url.pathname || '';
	  result += url.search || '';
	  result += url.hash || '';

	  return result;
	};


/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	//
	// Changes from joyent/node:
	//
	// 1. No leading slash in paths,
	//    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
	//
	// 2. Backslashes are not replaced with slashes,
	//    so `http:\\example.org\` is treated like a relative path
	//
	// 3. Trailing colon is treated like a part of the path,
	//    i.e. in `http://example.org:foo` pathname is `:foo`
	//
	// 4. Nothing is URL-encoded in the resulting object,
	//    (in joyent/node some chars in auth and paths are encoded)
	//
	// 5. `url.parse()` does not have `parseQueryString` argument
	//
	// 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
	//    which can be constructed using other parts of the url.
	//


	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.pathname = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = [ '<', '>', '"', '`', ' ', '\r', '\n', '\t' ],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = [ '{', '}', '|', '\\', '^', '`' ].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = [ '\'' ].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = [ '%', '/', '?', ';', '#' ].concat(autoEscape),
	    hostEndingChars = [ '/', '?', '#' ],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    /* eslint-disable no-script-url */
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    };
	    /* eslint-enable no-script-url */

	function urlParse(url, slashesDenoteHost) {
	  if (url && url instanceof Url) { return url; }

	  var u = new Url();
	  u.parse(url, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, slashesDenoteHost) {
	  var i, l, lowerProto, hec, slashes,
	      rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    lowerProto = proto.toLowerCase();
	    this.protocol = proto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (i = 0; i < hostEndingChars.length; i++) {
	      hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
	        hostEnd = hec;
	      }
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = auth;
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (i = 0; i < nonHostChars.length; i++) {
	      hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
	        hostEnd = hec;
	      }
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1) {
	      hostEnd = rest.length;
	    }

	    if (rest[hostEnd - 1] === ':') { hostEnd--; }
	    var host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost(host);

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) { continue; }
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    }

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	    }
	  }

	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    rest = rest.slice(0, qm);
	  }
	  if (rest) { this.pathname = rest; }
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '';
	  }

	  return this;
	};

	Url.prototype.parseHost = function(host) {
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) { this.hostname = host; }
	};

	module.exports = urlParse;


/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	module.exports=/[\xAD\u0600-\u0605\u061C\u06DD\u070F\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804\uDCBD|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports.Any = __webpack_require__(48);
	module.exports.Cc  = __webpack_require__(46);
	module.exports.Cf  = __webpack_require__(167);
	module.exports.P   = __webpack_require__(25);
	module.exports.Z   = __webpack_require__(47);


/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

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

	var _markdownIt = __webpack_require__(117);

	var _markdownIt2 = _interopRequireDefault(_markdownIt);

	var _react = __webpack_require__(8);

	var _react2 = _interopRequireDefault(_react);

	var _lodashLangIsPlainObject = __webpack_require__(95);

	var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

	var _lodashObjectAssign = __webpack_require__(98);

	var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

	var _lodashCollectionReduce = __webpack_require__(64);

	var _lodashCollectionReduce2 = _interopRequireDefault(_lodashCollectionReduce);

	var _lodashArrayZipObject = __webpack_require__(63);

	var _lodashArrayZipObject2 = _interopRequireDefault(_lodashArrayZipObject);

	var _lodashCollectionSortBy = __webpack_require__(65);

	var _lodashCollectionSortBy2 = _interopRequireDefault(_lodashCollectionSortBy);

	var _lodashArrayCompact = __webpack_require__(61);

	var _lodashArrayCompact2 = _interopRequireDefault(_lodashArrayCompact);

	var _lodashStringCamelCase = __webpack_require__(99);

	var _lodashStringCamelCase2 = _interopRequireDefault(_lodashStringCamelCase);

	var _lodashLangIsString = __webpack_require__(96);

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

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}(false ? (this.base64js = {}) : exports))


/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      nBits = -7,
	      i = isLE ? (nBytes - 1) : 0,
	      d = isLE ? -1 : 1,
	      s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c,
	      eLen = nBytes * 8 - mLen - 1,
	      eMax = (1 << eLen) - 1,
	      eBias = eMax >> 1,
	      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
	      i = isLE ? 0 : (nBytes - 1),
	      d = isLE ? 1 : -1,
	      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * isArray
	 */

	var isArray = Array.isArray;

	/**
	 * toString
	 */

	var str = Object.prototype.toString;

	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */

	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(198)(module), (function() { return this; }())))

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "var handleIterate = function(Tag, props, children) {\n  switch(Tag) {\n  case 'table':\n    props.className = 'table table-striped';\n    break;\n  case 'code':\n    if (props['data-language']) {\n      return <Tag {...props} dangerouslySetInnerHTML={{__html: window.hljs.highlight(props['data-language'], children[0]).value}} />\n    };\n    break;\n  }\n  return <Tag {...props}>{children}</Tag>;\n}\n\nclass ComponentExample extends React.Component {\n  render() {\n    return (\n      <div>\n        <MDReactComponent text='### (the following content is taken from [MarkdownIt Demo Page](https://markdown-it.github.io/), which is used now in this library as a parser)' />\n        <MDReactComponent text='-----' />\n        <MDReactComponent text={__markdownText__}\n                          onIterate={handleIterate}\n                          markdownOptions={{ typographer: true }}\n                          plugins={[\n                            __plugins__.abbr,\n                            {plugin: __plugins__.container, args: ['warning']},\n                            __plugins__.deflist,\n                            __plugins__.emoji,\n                            __plugins__.footnote,\n                            __plugins__.ins,\n                            __plugins__.mark,\n                            __plugins__.sub,\n                            __plugins__.sup\n                          ]} />\n        <MDReactComponent text='-----' />\n        <MDReactComponent text='#### This page is using [Component Playground](https://github.com/FormidableLabs/component-playground), check it out' />\n      </div>\n    )\n  }\n};\n\nReact.render(<ComponentExample/>, mountNode);"

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "------------\n\n# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n\n## Horizontal Rules\n\n___\n\n---\n\n***\n\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n\"Smartypants, double quotes\" and 'single quotes'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## Blockquotes\n\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## Code\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code \"fences\"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ \"title text!\")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg \"The Stormtroopocat\")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  \"The Dojocat\"\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).\n\n\n### [Emojies](https://github.com/markdown-it/markdown-it-emoji)\n\n> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:\n>\n> Shortcuts (emoticons): :-) :-( 8-) ;)\n\nsee [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.\n\n\n### [Subscipt](https://github.com/markdown-it/markdown-it-sub) / [Superscirpt](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O\n\n\n### [\\<ins>](https://github.com/markdown-it/markdown-it-ins)\n\n++Inserted text++\n\n\n### [\\<mark>](https://github.com/markdown-it/markdown-it-mark)\n\n==Marked text==\n\n\n### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)\n\nFootnote 1 link[^first].\n\nFootnote 2 link[^second].\n\nInline footnote^[Text of inline footnote] definition.\n\nDuplicated footnote reference[^second].\n\n[^first]: Footnote **can have markup**\n\n    and multiple paragraphs.\n\n[^second]: Footnote text.\n\n\n### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)\n\nTerm 1\n\n:   Definition 1\nwith lazy continuation.\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n_Compact style:_\n\nTerm 1\n  ~ Definition 1\n\nTerm 2\n  ~ Definition 2a\n  ~ Definition 2b\n\n\n### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)\n\nThis is HTML abbreviation example.\n\nIt converts \"HTML\", but keep intact partial entries like \"xxxHTMLyyy\" and so on.\n\n*[HTML]: Hyper Text Markup Language\n\n### [Custom containers](https://github.com/markdown-it/markdown-it-container)\n\n::: warning\n*here be dragons*\n:::\n"

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';
	/*eslint-disable no-undef*/
	var visitors = __webpack_require__(196);
	var transform = __webpack_require__(17).transform;
	var typesSyntax = __webpack_require__(193);
	var inlineSourceMap = __webpack_require__(197);

	module.exports = {
	  transform: function(input, options) {
	    options = processOptions(options);
	    var output = innerTransform(input, options);
	    var result = output.code;
	    if (options.sourceMap) {
	      var map = inlineSourceMap(
	        output.sourceMap,
	        input,
	        options.filename
	      );
	      result += '\n' + map;
	    }
	    return result;
	  },
	  transformWithDetails: function(input, options) {
	    options = processOptions(options);
	    var output = innerTransform(input, options);
	    var result = {};
	    result.code = output.code;
	    if (options.sourceMap) {
	      result.sourceMap = output.sourceMap.toJSON();
	    }
	    if (options.filename) {
	      result.sourceMap.sources = [options.filename];
	    }
	    return result;
	  }
	};

	/**
	 * Only copy the values that we need. We'll do some preprocessing to account for
	 * converting command line flags to options that jstransform can actually use.
	 */
	function processOptions(opts) {
	  opts = opts || {};
	  var options = {};

	  options.harmony = opts.harmony;
	  options.stripTypes = opts.stripTypes;
	  options.sourceMap = opts.sourceMap;
	  options.filename = opts.sourceFilename;

	  if (opts.es6module) {
	    options.sourceType = 'module';
	  }
	  if (opts.nonStrictEs6module) {
	    options.sourceType = 'nonStrictModule';
	  }

	  // Instead of doing any fancy validation, only look for 'es3'. If we have
	  // that, then use it. Otherwise use 'es5'.
	  options.es3 = opts.target === 'es3';
	  options.es5 = !options.es3;

	  return options;
	}

	function innerTransform(input, options) {
	  var visitorSets = ['react'];
	  if (options.harmony) {
	    visitorSets.push('harmony');
	  }

	  if (options.es3) {
	    visitorSets.push('es3');
	  }

	  if (options.stripTypes) {
	    // Stripping types needs to happen before the other transforms
	    // unfortunately, due to bad interactions. For example,
	    // es6-rest-param-visitors conflict with stripping rest param type
	    // annotation
	    input = transform(typesSyntax.visitorList, input, options).code;
	  }

	  var visitorList = visitors.getVisitorsBySet(visitorSets);
	  return transform(visitorList, input, options);
	}


/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	var Base62 = (function (my) {
	  my.chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

	  my.encode = function(i){
	    if (i === 0) {return '0'}
	    var s = ''
	    while (i > 0) {
	      s = this.chars[i % 62] + s
	      i = Math.floor(i/62)
	    }
	    return s
	  };
	  my.decode = function(a,b,c,d){
	    for (
	      b = c = (
	        a === (/\W|_|^$/.test(a += "") || a)
	      ) - 1;
	      d = a.charCodeAt(c++);
	    )
	    b = b * 62 + d - [, 48, 29, 87][d >> 5];
	    return b
	  };

	  return my;
	}({}));

	module.exports = Base62

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(52).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(181).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(182).SourceNode;


/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var charToIntMap = {};
	  var intToCharMap = {};

	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	    .split('')
	    .forEach(function (ch, index) {
	      charToIntMap[ch] = index;
	      intToCharMap[index] = ch;
	    });

	  /**
	   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	   */
	  exports.encode = function base64_encode(aNumber) {
	    if (aNumber in intToCharMap) {
	      return intToCharMap[aNumber];
	    }
	    throw new TypeError("Must be between 0 and 63: " + aNumber);
	  };

	  /**
	   * Decode a single base 64 digit to an integer.
	   */
	  exports.decode = function base64_decode(aChar) {
	    if (aChar in charToIntMap) {
	      return charToIntMap[aChar];
	    }
	    throw new TypeError("Not a valid base 64 digit: " + aChar);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * Recursive implementation of binary search.
	   *
	   * @param aLow Indices here and lower do not contain the needle.
	   * @param aHigh Indices here and higher do not contain the needle.
	   * @param aNeedle The element being searched for.
	   * @param aHaystack The non-empty array being searched.
	   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	   */
	  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
	    // This function terminates when one of the following is true:
	    //
	    //   1. We find the exact element we are looking for.
	    //
	    //   2. We did not find the exact element, but we can return the next
	    //      closest element that is less than that element.
	    //
	    //   3. We did not find the exact element, and there is no next-closest
	    //      element which is less than the one we are searching for, so we
	    //      return null.
	    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	    var cmp = aCompare(aNeedle, aHaystack[mid], true);
	    if (cmp === 0) {
	      // Found the element we are looking for.
	      return aHaystack[mid];
	    }
	    else if (cmp > 0) {
	      // aHaystack[mid] is greater than our needle.
	      if (aHigh - mid > 1) {
	        // The element is in the upper half.
	        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
	      }
	      // We did not find an exact match, return the next closest one
	      // (termination case 2).
	      return aHaystack[mid];
	    }
	    else {
	      // aHaystack[mid] is less than our needle.
	      if (mid - aLow > 1) {
	        // The element is in the lower half.
	        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
	      }
	      // The exact needle element was not found in this haystack. Determine if
	      // we are in termination case (2) or (3) and return the appropriate thing.
	      return aLow < 0
	        ? null
	        : aHaystack[aLow];
	    }
	  }

	  /**
	   * This is an implementation of binary search which will always try and return
	   * the next lowest value checked if there is no exact hit. This is because
	   * mappings between original and generated line/col pairs are single points,
	   * and there is an implicit region between each of them, so a miss just means
	   * that you aren't on the very start of a region.
	   *
	   * @param aNeedle The element you are looking for.
	   * @param aHaystack The array that is being searched.
	   * @param aCompare A function which takes the needle and an element in the
	   *     array and returns -1, 0, or 1 depending on whether the needle is less
	   *     than, equal to, or greater than the element, respectively.
	   */
	  exports.search = function search(aNeedle, aHaystack, aCompare) {
	    return aHaystack.length > 0
	      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
	      : null;
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(16);
	  var binarySearch = __webpack_require__(180);
	  var ArraySet = __webpack_require__(50).ArraySet;
	  var base64VLQ = __webpack_require__(51);

	  /**
	   * A SourceMapConsumer instance represents a parsed source map which we can
	   * query for information about the original file positions by giving it a file
	   * position in the generated source.
	   *
	   * The only parameter is the raw source map (either as a JSON string, or
	   * already parsed to an object). According to the spec, source maps have the
	   * following attributes:
	   *
	   *   - version: Which version of the source map spec this map is following.
	   *   - sources: An array of URLs to the original source files.
	   *   - names: An array of identifiers which can be referrenced by individual mappings.
	   *   - sourceRoot: Optional. The URL root from which all sources are relative.
	   *   - sourcesContent: Optional. An array of contents of the original source files.
	   *   - mappings: A string of base64 VLQs which contain the actual mappings.
	   *   - file: The generated file this source map is associated with.
	   *
	   * Here is an example source map, taken from the source map spec[0]:
	   *
	   *     {
	   *       version : 3,
	   *       file: "out.js",
	   *       sourceRoot : "",
	   *       sources: ["foo.js", "bar.js"],
	   *       names: ["src", "maps", "are", "fun"],
	   *       mappings: "AA,AB;;ABCDE;"
	   *     }
	   *
	   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	   */
	  function SourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    var version = util.getArg(sourceMap, 'version');
	    var sources = util.getArg(sourceMap, 'sources');
	    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	    // requires the array) to play nice here.
	    var names = util.getArg(sourceMap, 'names', []);
	    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	    var mappings = util.getArg(sourceMap, 'mappings');
	    var file = util.getArg(sourceMap, 'file', null);

	    // Once again, Sass deviates from the spec and supplies the version as a
	    // string rather than a number, so we use loose equality checking here.
	    if (version != this._version) {
	      throw new Error('Unsupported version: ' + version);
	    }

	    // Pass `true` below to allow duplicate names and sources. While source maps
	    // are intended to be compressed and deduplicated, the TypeScript compiler
	    // sometimes generates source maps with duplicates in them. See Github issue
	    // #72 and bugzil.la/889492.
	    this._names = ArraySet.fromArray(names, true);
	    this._sources = ArraySet.fromArray(sources, true);

	    this.sourceRoot = sourceRoot;
	    this.sourcesContent = sourcesContent;
	    this._mappings = mappings;
	    this.file = file;
	  }

	  /**
	   * Create a SourceMapConsumer from a SourceMapGenerator.
	   *
	   * @param SourceMapGenerator aSourceMap
	   *        The source map that will be consumed.
	   * @returns SourceMapConsumer
	   */
	  SourceMapConsumer.fromSourceMap =
	    function SourceMapConsumer_fromSourceMap(aSourceMap) {
	      var smc = Object.create(SourceMapConsumer.prototype);

	      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	      smc.sourceRoot = aSourceMap._sourceRoot;
	      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                              smc.sourceRoot);
	      smc.file = aSourceMap._file;

	      smc.__generatedMappings = aSourceMap._mappings.slice()
	        .sort(util.compareByGeneratedPositions);
	      smc.__originalMappings = aSourceMap._mappings.slice()
	        .sort(util.compareByOriginalPositions);

	      return smc;
	    };

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  SourceMapConsumer.prototype._version = 3;

	  /**
	   * The list of original sources.
	   */
	  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
	    get: function () {
	      return this._sources.toArray().map(function (s) {
	        return this.sourceRoot ? util.join(this.sourceRoot, s) : s;
	      }, this);
	    }
	  });

	  // `__generatedMappings` and `__originalMappings` are arrays that hold the
	  // parsed mapping coordinates from the source map's "mappings" attribute. They
	  // are lazily instantiated, accessed via the `_generatedMappings` and
	  // `_originalMappings` getters respectively, and we only parse the mappings
	  // and create these arrays once queried for a source location. We jump through
	  // these hoops because there can be many thousands of mappings, and parsing
	  // them is expensive, so we only want to do it if we must.
	  //
	  // Each object in the arrays is of the form:
	  //
	  //     {
	  //       generatedLine: The line number in the generated code,
	  //       generatedColumn: The column number in the generated code,
	  //       source: The path to the original source file that generated this
	  //               chunk of code,
	  //       originalLine: The line number in the original source that
	  //                     corresponds to this chunk of generated code,
	  //       originalColumn: The column number in the original source that
	  //                       corresponds to this chunk of generated code,
	  //       name: The name of the original symbol which generated this chunk of
	  //             code.
	  //     }
	  //
	  // All properties except for `generatedLine` and `generatedColumn` can be
	  // `null`.
	  //
	  // `_generatedMappings` is ordered by the generated positions.
	  //
	  // `_originalMappings` is ordered by the original positions.

	  SourceMapConsumer.prototype.__generatedMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	    get: function () {
	      if (!this.__generatedMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__generatedMappings;
	    }
	  });

	  SourceMapConsumer.prototype.__originalMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	    get: function () {
	      if (!this.__originalMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__originalMappings;
	    }
	  });

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  SourceMapConsumer.prototype._parseMappings =
	    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      var generatedLine = 1;
	      var previousGeneratedColumn = 0;
	      var previousOriginalLine = 0;
	      var previousOriginalColumn = 0;
	      var previousSource = 0;
	      var previousName = 0;
	      var mappingSeparator = /^[,;]/;
	      var str = aStr;
	      var mapping;
	      var temp;

	      while (str.length > 0) {
	        if (str.charAt(0) === ';') {
	          generatedLine++;
	          str = str.slice(1);
	          previousGeneratedColumn = 0;
	        }
	        else if (str.charAt(0) === ',') {
	          str = str.slice(1);
	        }
	        else {
	          mapping = {};
	          mapping.generatedLine = generatedLine;

	          // Generated column.
	          temp = base64VLQ.decode(str);
	          mapping.generatedColumn = previousGeneratedColumn + temp.value;
	          previousGeneratedColumn = mapping.generatedColumn;
	          str = temp.rest;

	          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
	            // Original source.
	            temp = base64VLQ.decode(str);
	            mapping.source = this._sources.at(previousSource + temp.value);
	            previousSource += temp.value;
	            str = temp.rest;
	            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
	              throw new Error('Found a source, but no line and column');
	            }

	            // Original line.
	            temp = base64VLQ.decode(str);
	            mapping.originalLine = previousOriginalLine + temp.value;
	            previousOriginalLine = mapping.originalLine;
	            // Lines are stored 0-based
	            mapping.originalLine += 1;
	            str = temp.rest;
	            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
	              throw new Error('Found a source and line, but no column');
	            }

	            // Original column.
	            temp = base64VLQ.decode(str);
	            mapping.originalColumn = previousOriginalColumn + temp.value;
	            previousOriginalColumn = mapping.originalColumn;
	            str = temp.rest;

	            if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
	              // Original name.
	              temp = base64VLQ.decode(str);
	              mapping.name = this._names.at(previousName + temp.value);
	              previousName += temp.value;
	              str = temp.rest;
	            }
	          }

	          this.__generatedMappings.push(mapping);
	          if (typeof mapping.originalLine === 'number') {
	            this.__originalMappings.push(mapping);
	          }
	        }
	      }

	      this.__originalMappings.sort(util.compareByOriginalPositions);
	    };

	  /**
	   * Find the mapping that best matches the hypothetical "needle" mapping that
	   * we are searching for in the given "haystack" of mappings.
	   */
	  SourceMapConsumer.prototype._findMapping =
	    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                           aColumnName, aComparator) {
	      // To return the position we are searching for, we must first find the
	      // mapping for the given position and then return the opposite position it
	      // points to. Because the mappings are sorted, we can use binary search to
	      // find the best mapping.

	      if (aNeedle[aLineName] <= 0) {
	        throw new TypeError('Line must be greater than or equal to 1, got '
	                            + aNeedle[aLineName]);
	      }
	      if (aNeedle[aColumnName] < 0) {
	        throw new TypeError('Column must be greater than or equal to 0, got '
	                            + aNeedle[aColumnName]);
	      }

	      return binarySearch.search(aNeedle, aMappings, aComparator);
	    };

	  /**
	   * Returns the original source, line, and column information for the generated
	   * source's line and column positions provided. The only argument is an object
	   * with the following properties:
	   *
	   *   - line: The line number in the generated source.
	   *   - column: The column number in the generated source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - source: The original source file, or null.
	   *   - line: The line number in the original source, or null.
	   *   - column: The column number in the original source, or null.
	   *   - name: The original identifier, or null.
	   */
	  SourceMapConsumer.prototype.originalPositionFor =
	    function SourceMapConsumer_originalPositionFor(aArgs) {
	      var needle = {
	        generatedLine: util.getArg(aArgs, 'line'),
	        generatedColumn: util.getArg(aArgs, 'column')
	      };

	      var mapping = this._findMapping(needle,
	                                      this._generatedMappings,
	                                      "generatedLine",
	                                      "generatedColumn",
	                                      util.compareByGeneratedPositions);

	      if (mapping) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source && this.sourceRoot) {
	          source = util.join(this.sourceRoot, source);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: util.getArg(mapping, 'name', null)
	        };
	      }

	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    };

	  /**
	   * Returns the original source content. The only argument is the url of the
	   * original source file. Returns null if no original source content is
	   * availible.
	   */
	  SourceMapConsumer.prototype.sourceContentFor =
	    function SourceMapConsumer_sourceContentFor(aSource) {
	      if (!this.sourcesContent) {
	        return null;
	      }

	      if (this.sourceRoot) {
	        aSource = util.relative(this.sourceRoot, aSource);
	      }

	      if (this._sources.has(aSource)) {
	        return this.sourcesContent[this._sources.indexOf(aSource)];
	      }

	      var url;
	      if (this.sourceRoot
	          && (url = util.urlParse(this.sourceRoot))) {
	        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	        // many users. We can help them out when they expect file:// URIs to
	        // behave like it would if they were running a local HTTP server. See
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	        if (url.scheme == "file"
	            && this._sources.has(fileUriAbsPath)) {
	          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	        }

	        if ((!url.path || url.path == "/")
	            && this._sources.has("/" + aSource)) {
	          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	        }
	      }

	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    };

	  /**
	   * Returns the generated line and column information for the original source,
	   * line, and column positions provided. The only argument is an object with
	   * the following properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *   - column: The column number in the original source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.generatedPositionFor =
	    function SourceMapConsumer_generatedPositionFor(aArgs) {
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: util.getArg(aArgs, 'column')
	      };

	      if (this.sourceRoot) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var mapping = this._findMapping(needle,
	                                      this._originalMappings,
	                                      "originalLine",
	                                      "originalColumn",
	                                      util.compareByOriginalPositions);

	      if (mapping) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null)
	        };
	      }

	      return {
	        line: null,
	        column: null
	      };
	    };

	  SourceMapConsumer.GENERATED_ORDER = 1;
	  SourceMapConsumer.ORIGINAL_ORDER = 2;

	  /**
	   * Iterate over each mapping between an original source/line/column and a
	   * generated line/column in this source map.
	   *
	   * @param Function aCallback
	   *        The function that is called with each mapping.
	   * @param Object aContext
	   *        Optional. If specified, this object will be the value of `this` every
	   *        time that `aCallback` is called.
	   * @param aOrder
	   *        Either `SourceMapConsumer.GENERATED_ORDER` or
	   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	   *        iterate over the mappings sorted by the generated file's line/column
	   *        order or the original's source/line/column order, respectively. Defaults to
	   *        `SourceMapConsumer.GENERATED_ORDER`.
	   */
	  SourceMapConsumer.prototype.eachMapping =
	    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	      var context = aContext || null;
	      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	      var mappings;
	      switch (order) {
	      case SourceMapConsumer.GENERATED_ORDER:
	        mappings = this._generatedMappings;
	        break;
	      case SourceMapConsumer.ORIGINAL_ORDER:
	        mappings = this._originalMappings;
	        break;
	      default:
	        throw new Error("Unknown order of iteration.");
	      }

	      var sourceRoot = this.sourceRoot;
	      mappings.map(function (mapping) {
	        var source = mapping.source;
	        if (source && sourceRoot) {
	          source = util.join(sourceRoot, source);
	        }
	        return {
	          source: source,
	          generatedLine: mapping.generatedLine,
	          generatedColumn: mapping.generatedColumn,
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: mapping.name
	        };
	      }).forEach(aCallback, context);
	    };

	  exports.SourceMapConsumer = SourceMapConsumer;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var SourceMapGenerator = __webpack_require__(52).SourceMapGenerator;
	  var util = __webpack_require__(16);

	  /**
	   * SourceNodes provide a way to abstract over interpolating/concatenating
	   * snippets of generated JavaScript source code while maintaining the line and
	   * column information associated with the original source code.
	   *
	   * @param aLine The original line number.
	   * @param aColumn The original column number.
	   * @param aSource The original source's filename.
	   * @param aChunks Optional. An array of strings which are snippets of
	   *        generated JS, or other SourceNodes.
	   * @param aName The original identifier.
	   */
	  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	    this.children = [];
	    this.sourceContents = {};
	    this.line = aLine === undefined ? null : aLine;
	    this.column = aColumn === undefined ? null : aColumn;
	    this.source = aSource === undefined ? null : aSource;
	    this.name = aName === undefined ? null : aName;
	    if (aChunks != null) this.add(aChunks);
	  }

	  /**
	   * Creates a SourceNode from generated code and a SourceMapConsumer.
	   *
	   * @param aGeneratedCode The generated code
	   * @param aSourceMapConsumer The SourceMap for the generated code
	   */
	  SourceNode.fromStringWithSourceMap =
	    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer) {
	      // The SourceNode we want to fill with the generated code
	      // and the SourceMap
	      var node = new SourceNode();

	      // The generated code
	      // Processed fragments are removed from this array.
	      var remainingLines = aGeneratedCode.split('\n');

	      // We need to remember the position of "remainingLines"
	      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

	      // The generate SourceNodes we need a code range.
	      // To extract it current and last mapping is used.
	      // Here we store the last mapping.
	      var lastMapping = null;

	      aSourceMapConsumer.eachMapping(function (mapping) {
	        if (lastMapping === null) {
	          // We add the generated code until the first mapping
	          // to the SourceNode without any mapping.
	          // Each line is added as separate string.
	          while (lastGeneratedLine < mapping.generatedLine) {
	            node.add(remainingLines.shift() + "\n");
	            lastGeneratedLine++;
	          }
	          if (lastGeneratedColumn < mapping.generatedColumn) {
	            var nextLine = remainingLines[0];
	            node.add(nextLine.substr(0, mapping.generatedColumn));
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	          }
	        } else {
	          // We add the code from "lastMapping" to "mapping":
	          // First check if there is a new line in between.
	          if (lastGeneratedLine < mapping.generatedLine) {
	            var code = "";
	            // Associate full lines with "lastMapping"
	            do {
	              code += remainingLines.shift() + "\n";
	              lastGeneratedLine++;
	              lastGeneratedColumn = 0;
	            } while (lastGeneratedLine < mapping.generatedLine);
	            // When we reached the correct line, we add code until we
	            // reach the correct column too.
	            if (lastGeneratedColumn < mapping.generatedColumn) {
	              var nextLine = remainingLines[0];
	              code += nextLine.substr(0, mapping.generatedColumn);
	              remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	              lastGeneratedColumn = mapping.generatedColumn;
	            }
	            // Create the SourceNode.
	            addMappingWithCode(lastMapping, code);
	          } else {
	            // There is no new line in between.
	            // Associate the code between "lastGeneratedColumn" and
	            // "mapping.generatedColumn" with "lastMapping"
	            var nextLine = remainingLines[0];
	            var code = nextLine.substr(0, mapping.generatedColumn -
	                                          lastGeneratedColumn);
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
	                                                lastGeneratedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	            addMappingWithCode(lastMapping, code);
	          }
	        }
	        lastMapping = mapping;
	      }, this);
	      // We have processed all mappings.
	      // Associate the remaining code in the current line with "lastMapping"
	      // and add the remaining lines without any mapping
	      addMappingWithCode(lastMapping, remainingLines.join("\n"));

	      // Copy sourcesContent into SourceNode
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content) {
	          node.setSourceContent(sourceFile, content);
	        }
	      });

	      return node;

	      function addMappingWithCode(mapping, code) {
	        if (mapping === null || mapping.source === undefined) {
	          node.add(code);
	        } else {
	          node.add(new SourceNode(mapping.originalLine,
	                                  mapping.originalColumn,
	                                  mapping.source,
	                                  code,
	                                  mapping.name));
	        }
	      }
	    };

	  /**
	   * Add a chunk of generated JS to this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.add = function SourceNode_add(aChunk) {
	    if (Array.isArray(aChunk)) {
	      aChunk.forEach(function (chunk) {
	        this.add(chunk);
	      }, this);
	    }
	    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
	      if (aChunk) {
	        this.children.push(aChunk);
	      }
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Add a chunk of generated JS to the beginning of this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	    if (Array.isArray(aChunk)) {
	      for (var i = aChunk.length-1; i >= 0; i--) {
	        this.prepend(aChunk[i]);
	      }
	    }
	    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
	      this.children.unshift(aChunk);
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Walk over the tree of JS snippets in this node and its children. The
	   * walking function is called once for each snippet of JS and is passed that
	   * snippet and the its original associated source's line/column location.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	    var chunk;
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      chunk = this.children[i];
	      if (chunk instanceof SourceNode) {
	        chunk.walk(aFn);
	      }
	      else {
	        if (chunk !== '') {
	          aFn(chunk, { source: this.source,
	                       line: this.line,
	                       column: this.column,
	                       name: this.name });
	        }
	      }
	    }
	  };

	  /**
	   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	   * each of `this.children`.
	   *
	   * @param aSep The separator.
	   */
	  SourceNode.prototype.join = function SourceNode_join(aSep) {
	    var newChildren;
	    var i;
	    var len = this.children.length;
	    if (len > 0) {
	      newChildren = [];
	      for (i = 0; i < len-1; i++) {
	        newChildren.push(this.children[i]);
	        newChildren.push(aSep);
	      }
	      newChildren.push(this.children[i]);
	      this.children = newChildren;
	    }
	    return this;
	  };

	  /**
	   * Call String.prototype.replace on the very right-most source snippet. Useful
	   * for trimming whitespace from the end of a source node, etc.
	   *
	   * @param aPattern The pattern to replace.
	   * @param aReplacement The thing to replace the pattern with.
	   */
	  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	    var lastChild = this.children[this.children.length - 1];
	    if (lastChild instanceof SourceNode) {
	      lastChild.replaceRight(aPattern, aReplacement);
	    }
	    else if (typeof lastChild === 'string') {
	      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	    }
	    else {
	      this.children.push(''.replace(aPattern, aReplacement));
	    }
	    return this;
	  };

	  /**
	   * Set the source content for a source file. This will be added to the SourceMapGenerator
	   * in the sourcesContent field.
	   *
	   * @param aSourceFile The filename of the source file
	   * @param aSourceContent The content of the source file
	   */
	  SourceNode.prototype.setSourceContent =
	    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	    };

	  /**
	   * Walk over the tree of SourceNodes. The walking function is called for each
	   * source file content and is passed the filename and source content.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walkSourceContents =
	    function SourceNode_walkSourceContents(aFn) {
	      for (var i = 0, len = this.children.length; i < len; i++) {
	        if (this.children[i] instanceof SourceNode) {
	          this.children[i].walkSourceContents(aFn);
	        }
	      }

	      var sources = Object.keys(this.sourceContents);
	      for (var i = 0, len = sources.length; i < len; i++) {
	        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	      }
	    };

	  /**
	   * Return the string representation of this source node. Walks over the tree
	   * and concatenates all the various snippets together to one string.
	   */
	  SourceNode.prototype.toString = function SourceNode_toString() {
	    var str = "";
	    this.walk(function (chunk) {
	      str += chunk;
	    });
	    return str;
	  };

	  /**
	   * Returns the string representation of this source node along with a source
	   * map.
	   */
	  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	    var generated = {
	      code: "",
	      line: 1,
	      column: 0
	    };
	    var map = new SourceMapGenerator(aArgs);
	    var sourceMappingActive = false;
	    var lastOriginalSource = null;
	    var lastOriginalLine = null;
	    var lastOriginalColumn = null;
	    var lastOriginalName = null;
	    this.walk(function (chunk, original) {
	      generated.code += chunk;
	      if (original.source !== null
	          && original.line !== null
	          && original.column !== null) {
	        if(lastOriginalSource !== original.source
	           || lastOriginalLine !== original.line
	           || lastOriginalColumn !== original.column
	           || lastOriginalName !== original.name) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	        lastOriginalSource = original.source;
	        lastOriginalLine = original.line;
	        lastOriginalColumn = original.column;
	        lastOriginalName = original.name;
	        sourceMappingActive = true;
	      } else if (sourceMappingActive) {
	        map.addMapping({
	          generated: {
	            line: generated.line,
	            column: generated.column
	          }
	        });
	        lastOriginalSource = null;
	        sourceMappingActive = false;
	      }
	      chunk.split('').forEach(function (ch) {
	        if (ch === '\n') {
	          generated.line++;
	          generated.column = 0;
	        } else {
	          generated.column++;
	        }
	      });
	    });
	    this.walkSourceContents(function (sourceFile, sourceContent) {
	      map.setSourceContent(sourceFile, sourceContent);
	    });

	    return { code: generated.code, map: map };
	  };

	  exports.SourceNode = SourceNode;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	var docblockRe = /^\s*(\/\*\*(.|\r?\n)*?\*\/)/;
	var ltrimRe = /^\s*/;
	/**
	 * @param {String} contents
	 * @return {String}
	 */
	function extract(contents) {
	  var match = contents.match(docblockRe);
	  if (match) {
	    return match[0].replace(ltrimRe, '') || '';
	  }
	  return '';
	}


	var commentStartRe = /^\/\*\*?/;
	var commentEndRe = /\*+\/$/;
	var wsRe = /[\t ]+/g;
	var stringStartRe = /(\r?\n|^) *\*/g;
	var multilineRe = /(?:^|\r?\n) *(@[^\r\n]*?) *\r?\n *([^@\r\n\s][^@\r\n]+?) *\r?\n/g;
	var propertyRe = /(?:^|\r?\n) *@(\S+) *([^\r\n]*)/g;

	/**
	 * @param {String} contents
	 * @return {Array}
	 */
	function parse(docblock) {
	  docblock = docblock
	    .replace(commentStartRe, '')
	    .replace(commentEndRe, '')
	    .replace(wsRe, ' ')
	    .replace(stringStartRe, '$1');

	  // Normalize multi-line directives
	  var prev = '';
	  while (prev != docblock) {
	    prev = docblock;
	    docblock = docblock.replace(multilineRe, "\n$1 $2\n");
	  }
	  docblock = docblock.trim();

	  var result = [];
	  var match;
	  while (match = propertyRe.exec(docblock)) {
	    result.push([match[1], match[2]]);
	  }

	  return result;
	}

	/**
	 * Same as parse but returns an object of prop: value instead of array of paris
	 * If a property appers more than once the last one will be returned
	 *
	 * @param {String} contents
	 * @return {Object}
	 */
	function parseAsObject(docblock) {
	  var pairs = parse(docblock);
	  var result = {};
	  for (var i = 0; i < pairs.length; i++) {
	    result[pairs[i][0]] = pairs[i][1];
	  }
	  return result;
	}


	exports.extract = extract;
	exports.parse = parse;
	exports.parseAsObject = parseAsObject;


/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*global exports:true*/

	/**
	 * Desugars ES6 Arrow functions to ES3 function expressions.
	 * If the function contains `this` expression -- automatically
	 * binds the function to current value of `this`.
	 *
	 * Single parameter, simple expression:
	 *
	 * [1, 2, 3].map(x => x * x);
	 *
	 * [1, 2, 3].map(function(x) { return x * x; });
	 *
	 * Several parameters, complex block:
	 *
	 * this.users.forEach((user, idx) => {
	 *   return this.isActive(idx) && this.send(user);
	 * });
	 *
	 * this.users.forEach(function(user, idx) {
	 *   return this.isActive(idx) && this.send(user);
	 * }.bind(this));
	 *
	 */
	var restParamVisitors = __webpack_require__(26);
	var destructuringVisitors = __webpack_require__(53);

	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);

	/**
	 * @public
	 */
	function visitArrowFunction(traverse, node, path, state) {
	  var notInExpression = (path[0].type === Syntax.ExpressionStatement);

	  // Wrap a function into a grouping operator, if it's not
	  // in the expression position.
	  if (notInExpression) {
	    utils.append('(', state);
	  }

	  utils.append('function', state);
	  renderParams(traverse, node, path, state);

	  // Skip arrow.
	  utils.catchupWhiteSpace(node.body.range[0], state);

	  var renderBody = node.body.type == Syntax.BlockStatement
	    ? renderStatementBody
	    : renderExpressionBody;

	  path.unshift(node);
	  renderBody(traverse, node, path, state);
	  path.shift();

	  // Bind the function only if `this` value is used
	  // inside it or inside any sub-expression.
	  var containsBindingSyntax =
	    utils.containsChildMatching(node.body, function(node) {
	      return node.type === Syntax.ThisExpression
	             || (node.type === Syntax.Identifier
	                 && node.name === "super");
	    });

	  if (containsBindingSyntax) {
	    utils.append('.bind(this)', state);
	  }

	  utils.catchupWhiteSpace(node.range[1], state);

	  // Close wrapper if not in the expression.
	  if (notInExpression) {
	    utils.append(')', state);
	  }

	  return false;
	}

	function renderParams(traverse, node, path, state) {
	  // To preserve inline typechecking directives, we
	  // distinguish between parens-free and paranthesized single param.
	  if (isParensFreeSingleParam(node, state) || !node.params.length) {
	    utils.append('(', state);
	  }
	  if (node.params.length !== 0) {
	    path.unshift(node);
	    traverse(node.params, path, state);
	    path.unshift();
	  }
	  utils.append(')', state);
	}

	function isParensFreeSingleParam(node, state) {
	  return node.params.length === 1 &&
	    state.g.source[state.g.position] !== '(';
	}

	function renderExpressionBody(traverse, node, path, state) {
	  // Wrap simple expression bodies into a block
	  // with explicit return statement.
	  utils.append('{', state);

	  // Special handling of rest param.
	  if (node.rest) {
	    utils.append(
	      restParamVisitors.renderRestParamSetup(node, state),
	      state
	    );
	  }

	  // Special handling of destructured params.
	  destructuringVisitors.renderDestructuredComponents(
	    node,
	    utils.updateState(state, {
	      localScope: {
	        parentNode: state.parentNode,
	        parentScope: state.parentScope,
	        identifiers: state.identifiers,
	        tempVarIndex: 0
	      }
	    })
	  );

	  utils.append('return ', state);
	  renderStatementBody(traverse, node, path, state);
	  utils.append(';}', state);
	}

	function renderStatementBody(traverse, node, path, state) {
	  traverse(node.body, path, state);
	  utils.catchup(node.body.range[1], state);
	}

	visitArrowFunction.test = function(node, path, state) {
	  return node.type === Syntax.ArrowFunctionExpression;
	};

	exports.visitorList = [
	  visitArrowFunction
	];



/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2004-present Facebook. All Rights Reserved.
	 */
	/*global exports:true*/

	/**
	 * Implements ES6 call spread.
	 *
	 * instance.method(a, b, c, ...d)
	 *
	 * instance.method.apply(instance, [a, b, c].concat(d))
	 *
	 */

	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);

	function process(traverse, node, path, state) {
	  utils.move(node.range[0], state);
	  traverse(node, path, state);
	  utils.catchup(node.range[1], state);
	}

	function visitCallSpread(traverse, node, path, state) {
	  utils.catchup(node.range[0], state);

	  if (node.type === Syntax.NewExpression) {
	    // Input  = new Set(1, 2, ...list)
	    // Output = new (Function.prototype.bind.apply(Set, [null, 1, 2].concat(list)))
	    utils.append('new (Function.prototype.bind.apply(', state);
	    process(traverse, node.callee, path, state);
	  } else if (node.callee.type === Syntax.MemberExpression) {
	    // Input  = get().fn(1, 2, ...more)
	    // Output = (_ = get()).fn.apply(_, [1, 2].apply(more))
	    var tempVar = utils.injectTempVar(state);
	    utils.append('(' + tempVar + ' = ', state);
	    process(traverse, node.callee.object, path, state);
	    utils.append(')', state);
	    if (node.callee.property.type === Syntax.Identifier) {
	      utils.append('.', state);
	      process(traverse, node.callee.property, path, state);
	    } else {
	      utils.append('[', state);
	      process(traverse, node.callee.property, path, state);
	      utils.append(']', state);
	    }
	    utils.append('.apply(' + tempVar, state);
	  } else {
	    // Input  = max(1, 2, ...list)
	    // Output = max.apply(null, [1, 2].concat(list))
	    var needsToBeWrappedInParenthesis =
	      node.callee.type === Syntax.FunctionDeclaration ||
	      node.callee.type === Syntax.FunctionExpression;
	    if (needsToBeWrappedInParenthesis) {
	      utils.append('(', state);
	    }
	    process(traverse, node.callee, path, state);
	    if (needsToBeWrappedInParenthesis) {
	      utils.append(')', state);
	    }
	    utils.append('.apply(null', state);
	  }
	  utils.append(', ', state);

	  var args = node.arguments.slice();
	  var spread = args.pop();
	  if (args.length || node.type === Syntax.NewExpression) {
	    utils.append('[', state);
	    if (node.type === Syntax.NewExpression) {
	      utils.append('null' + (args.length ? ', ' : ''), state);
	    }
	    while (args.length) {
	      var arg = args.shift();
	      utils.move(arg.range[0], state);
	      traverse(arg, path, state);
	      if (args.length) {
	        utils.catchup(args[0].range[0], state);
	      } else {
	        utils.catchup(arg.range[1], state);
	      }
	    }
	    utils.append('].concat(', state);
	    process(traverse, spread.argument, path, state);
	    utils.append(')', state);
	  } else {
	    process(traverse, spread.argument, path, state);
	  }
	  utils.append(node.type === Syntax.NewExpression ? '))' : ')', state);

	  utils.move(node.range[1], state);
	  return false;
	}

	visitCallSpread.test = function(node, path, state) {
	  return (
	    (
	      node.type === Syntax.CallExpression ||
	      node.type === Syntax.NewExpression
	    ) &&
	    node.arguments.length > 0 &&
	    node.arguments[node.arguments.length - 1].type === Syntax.SpreadElement
	  );
	};

	exports.visitorList = [
	  visitCallSpread,
	];


/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * @typechecks
	 */
	'use strict';

	var base62 = __webpack_require__(177);
	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);
	var reservedWordsHelper = __webpack_require__(18);

	var declareIdentInLocalScope = utils.declareIdentInLocalScope;
	var initScopeMetadata = utils.initScopeMetadata;

	var SUPER_PROTO_IDENT_PREFIX = '____SuperProtoOf';

	var _anonClassUUIDCounter = 0;
	var _mungedSymbolMaps = {};

	function resetSymbols() {
	  _anonClassUUIDCounter = 0;
	  _mungedSymbolMaps = {};
	}

	/**
	 * Used to generate a unique class for use with code-gens for anonymous class
	 * expressions.
	 *
	 * @param {object} state
	 * @return {string}
	 */
	function _generateAnonymousClassName(state) {
	  var mungeNamespace = state.mungeNamespace || '';
	  return '____Class' + mungeNamespace + base62.encode(_anonClassUUIDCounter++);
	}

	/**
	 * Given an identifier name, munge it using the current state's mungeNamespace.
	 *
	 * @param {string} identName
	 * @param {object} state
	 * @return {string}
	 */
	function _getMungedName(identName, state) {
	  var mungeNamespace = state.mungeNamespace;
	  var shouldMinify = state.g.opts.minify;

	  if (shouldMinify) {
	    if (!_mungedSymbolMaps[mungeNamespace]) {
	      _mungedSymbolMaps[mungeNamespace] = {
	        symbolMap: {},
	        identUUIDCounter: 0
	      };
	    }

	    var symbolMap = _mungedSymbolMaps[mungeNamespace].symbolMap;
	    if (!symbolMap[identName]) {
	      symbolMap[identName] =
	        base62.encode(_mungedSymbolMaps[mungeNamespace].identUUIDCounter++);
	    }
	    identName = symbolMap[identName];
	  }
	  return '$' + mungeNamespace + identName;
	}

	/**
	 * Extracts super class information from a class node.
	 *
	 * Information includes name of the super class and/or the expression string
	 * (if extending from an expression)
	 *
	 * @param {object} node
	 * @param {object} state
	 * @return {object}
	 */
	function _getSuperClassInfo(node, state) {
	  var ret = {
	    name: null,
	    expression: null
	  };
	  if (node.superClass) {
	    if (node.superClass.type === Syntax.Identifier) {
	      ret.name = node.superClass.name;
	    } else {
	      // Extension from an expression
	      ret.name = _generateAnonymousClassName(state);
	      ret.expression = state.g.source.substring(
	        node.superClass.range[0],
	        node.superClass.range[1]
	      );
	    }
	  }
	  return ret;
	}

	/**
	 * Used with .filter() to find the constructor method in a list of
	 * MethodDefinition nodes.
	 *
	 * @param {object} classElement
	 * @return {boolean}
	 */
	function _isConstructorMethod(classElement) {
	  return classElement.type === Syntax.MethodDefinition &&
	         classElement.key.type === Syntax.Identifier &&
	         classElement.key.name === 'constructor';
	}

	/**
	 * @param {object} node
	 * @param {object} state
	 * @return {boolean}
	 */
	function _shouldMungeIdentifier(node, state) {
	  return (
	    !!state.methodFuncNode &&
	    !utils.getDocblock(state).hasOwnProperty('preventMunge') &&
	    /^_(?!_)/.test(node.name)
	  );
	}

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassMethod(traverse, node, path, state) {
	  if (!state.g.opts.es5 && (node.kind === 'get' || node.kind === 'set')) {
	    throw new Error(
	      'This transform does not support ' + node.kind + 'ter methods for ES6 ' +
	      'classes. (line: ' + node.loc.start.line + ', col: ' +
	      node.loc.start.column + ')'
	    );
	  }
	  state = utils.updateState(state, {
	    methodNode: node
	  });
	  utils.catchup(node.range[0], state);
	  path.unshift(node);
	  traverse(node.value, path, state);
	  path.shift();
	  return false;
	}
	visitClassMethod.test = function(node, path, state) {
	  return node.type === Syntax.MethodDefinition;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassFunctionExpression(traverse, node, path, state) {
	  var methodNode = path[0];
	  var isGetter = methodNode.kind === 'get';
	  var isSetter = methodNode.kind === 'set';

	  state = utils.updateState(state, {
	    methodFuncNode: node
	  });

	  if (methodNode.key.name === 'constructor') {
	    utils.append('function ' + state.className, state);
	  } else {
	    var methodAccessorComputed = false;
	    var methodAccessor;
	    var prototypeOrStatic = methodNode.static ? '' : '.prototype';
	    var objectAccessor = state.className + prototypeOrStatic;

	    if (methodNode.key.type === Syntax.Identifier) {
	      // foo() {}
	      methodAccessor = methodNode.key.name;
	      if (_shouldMungeIdentifier(methodNode.key, state)) {
	        methodAccessor = _getMungedName(methodAccessor, state);
	      }
	      if (isGetter || isSetter) {
	        methodAccessor = JSON.stringify(methodAccessor);
	      } else if (reservedWordsHelper.isReservedWord(methodAccessor)) {
	        methodAccessorComputed = true;
	        methodAccessor = JSON.stringify(methodAccessor);
	      }
	    } else if (methodNode.key.type === Syntax.Literal) {
	      // 'foo bar'() {}  | get 'foo bar'() {} | set 'foo bar'() {}
	      methodAccessor = JSON.stringify(methodNode.key.value);
	      methodAccessorComputed = true;
	    }

	    if (isSetter || isGetter) {
	      utils.append(
	        'Object.defineProperty(' +
	          objectAccessor + ',' +
	          methodAccessor + ',' +
	          '{configurable:true,' +
	          methodNode.kind + ':function',
	        state
	      );
	    } else {
	      if (state.g.opts.es3) {
	        if (methodAccessorComputed) {
	          methodAccessor = '[' + methodAccessor + ']';
	        } else {
	          methodAccessor = '.' + methodAccessor;
	        }
	        utils.append(
	          objectAccessor +
	          methodAccessor + '=function' + (node.generator ? '*' : ''),
	          state
	        );
	      } else {
	        if (!methodAccessorComputed) {
	          methodAccessor = JSON.stringify(methodAccessor);
	        }
	        utils.append(
	          'Object.defineProperty(' +
	            objectAccessor + ',' +
	            methodAccessor + ',' +
	            '{writable:true,configurable:true,' +
	            'value:function' + (node.generator ? '*' : ''),
	          state
	        );
	      }
	    }
	  }
	  utils.move(methodNode.key.range[1], state);
	  utils.append('(', state);

	  var params = node.params;
	  if (params.length > 0) {
	    utils.catchupNewlines(params[0].range[0], state);
	    for (var i = 0; i < params.length; i++) {
	      utils.catchup(node.params[i].range[0], state);
	      path.unshift(node);
	      traverse(params[i], path, state);
	      path.shift();
	    }
	  }

	  var closingParenPosition = utils.getNextSyntacticCharOffset(')', state);
	  utils.catchupWhiteSpace(closingParenPosition, state);

	  var openingBracketPosition = utils.getNextSyntacticCharOffset('{', state);
	  utils.catchup(openingBracketPosition + 1, state);

	  if (!state.scopeIsStrict) {
	    utils.append('"use strict";', state);
	    state = utils.updateState(state, {
	      scopeIsStrict: true
	    });
	  }
	  utils.move(node.body.range[0] + '{'.length, state);

	  path.unshift(node);
	  traverse(node.body, path, state);
	  path.shift();
	  utils.catchup(node.body.range[1], state);

	  if (methodNode.key.name !== 'constructor') {
	    if (isGetter || isSetter || !state.g.opts.es3) {
	      utils.append('})', state);
	    }
	    utils.append(';', state);
	  }
	  return false;
	}
	visitClassFunctionExpression.test = function(node, path, state) {
	  return node.type === Syntax.FunctionExpression
	         && path[0].type === Syntax.MethodDefinition;
	};

	function visitClassMethodParam(traverse, node, path, state) {
	  var paramName = node.name;
	  if (_shouldMungeIdentifier(node, state)) {
	    paramName = _getMungedName(node.name, state);
	  }
	  utils.append(paramName, state);
	  utils.move(node.range[1], state);
	}
	visitClassMethodParam.test = function(node, path, state) {
	  if (!path[0] || !path[1]) {
	    return;
	  }

	  var parentFuncExpr = path[0];
	  var parentClassMethod = path[1];

	  return parentFuncExpr.type === Syntax.FunctionExpression
	         && parentClassMethod.type === Syntax.MethodDefinition
	         && node.type === Syntax.Identifier;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function _renderClassBody(traverse, node, path, state) {
	  var className = state.className;
	  var superClass = state.superClass;

	  // Set up prototype of constructor on same line as `extends` for line-number
	  // preservation. This relies on function-hoisting if a constructor function is
	  // defined in the class body.
	  if (superClass.name) {
	    // If the super class is an expression, we need to memoize the output of the
	    // expression into the generated class name variable and use that to refer
	    // to the super class going forward. Example:
	    //
	    //   class Foo extends mixin(Bar, Baz) {}
	    //     --transforms to--
	    //   function Foo() {} var ____Class0Blah = mixin(Bar, Baz);
	    if (superClass.expression !== null) {
	      utils.append(
	        'var ' + superClass.name + '=' + superClass.expression + ';',
	        state
	      );
	    }

	    var keyName = superClass.name + '____Key';
	    var keyNameDeclarator = '';
	    if (!utils.identWithinLexicalScope(keyName, state)) {
	      keyNameDeclarator = 'var ';
	      declareIdentInLocalScope(keyName, initScopeMetadata(node), state);
	    }
	    utils.append(
	      'for(' + keyNameDeclarator + keyName + ' in ' + superClass.name + '){' +
	        'if(' + superClass.name + '.hasOwnProperty(' + keyName + ')){' +
	          className + '[' + keyName + ']=' +
	            superClass.name + '[' + keyName + '];' +
	        '}' +
	      '}',
	      state
	    );

	    var superProtoIdentStr = SUPER_PROTO_IDENT_PREFIX + superClass.name;
	    if (!utils.identWithinLexicalScope(superProtoIdentStr, state)) {
	      utils.append(
	        'var ' + superProtoIdentStr + '=' + superClass.name + '===null?' +
	        'null:' + superClass.name + '.prototype;',
	        state
	      );
	      declareIdentInLocalScope(superProtoIdentStr, initScopeMetadata(node), state);
	    }

	    utils.append(
	      className + '.prototype=Object.create(' + superProtoIdentStr + ');',
	      state
	    );
	    utils.append(
	      className + '.prototype.constructor=' + className + ';',
	      state
	    );
	    utils.append(
	      className + '.__superConstructor__=' + superClass.name + ';',
	      state
	    );
	  }

	  // If there's no constructor method specified in the class body, create an
	  // empty constructor function at the top (same line as the class keyword)
	  if (!node.body.body.filter(_isConstructorMethod).pop()) {
	    utils.append('function ' + className + '(){', state);
	    if (!state.scopeIsStrict) {
	      utils.append('"use strict";', state);
	    }
	    if (superClass.name) {
	      utils.append(
	        'if(' + superClass.name + '!==null){' +
	        superClass.name + '.apply(this,arguments);}',
	        state
	      );
	    }
	    utils.append('}', state);
	  }

	  utils.move(node.body.range[0] + '{'.length, state);
	  traverse(node.body, path, state);
	  utils.catchupWhiteSpace(node.range[1], state);
	}

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassDeclaration(traverse, node, path, state) {
	  var className = node.id.name;
	  var superClass = _getSuperClassInfo(node, state);

	  state = utils.updateState(state, {
	    mungeNamespace: className,
	    className: className,
	    superClass: superClass
	  });

	  _renderClassBody(traverse, node, path, state);

	  return false;
	}
	visitClassDeclaration.test = function(node, path, state) {
	  return node.type === Syntax.ClassDeclaration;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitClassExpression(traverse, node, path, state) {
	  var className = node.id && node.id.name || _generateAnonymousClassName(state);
	  var superClass = _getSuperClassInfo(node, state);

	  utils.append('(function(){', state);

	  state = utils.updateState(state, {
	    mungeNamespace: className,
	    className: className,
	    superClass: superClass
	  });

	  _renderClassBody(traverse, node, path, state);

	  utils.append('return ' + className + ';})()', state);
	  return false;
	}
	visitClassExpression.test = function(node, path, state) {
	  return node.type === Syntax.ClassExpression;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitPrivateIdentifier(traverse, node, path, state) {
	  utils.append(_getMungedName(node.name, state), state);
	  utils.move(node.range[1], state);
	}
	visitPrivateIdentifier.test = function(node, path, state) {
	  if (node.type === Syntax.Identifier && _shouldMungeIdentifier(node, state)) {
	    // Always munge non-computed properties of MemberExpressions
	    // (a la preventing access of properties of unowned objects)
	    if (path[0].type === Syntax.MemberExpression && path[0].object !== node
	        && path[0].computed === false) {
	      return true;
	    }

	    // Always munge identifiers that were declared within the method function
	    // scope
	    if (utils.identWithinLexicalScope(node.name, state, state.methodFuncNode)) {
	      return true;
	    }

	    // Always munge private keys on object literals defined within a method's
	    // scope.
	    if (path[0].type === Syntax.Property
	        && path[1].type === Syntax.ObjectExpression) {
	      return true;
	    }

	    // Always munge function parameters
	    if (path[0].type === Syntax.FunctionExpression
	        || path[0].type === Syntax.FunctionDeclaration
	        || path[0].type === Syntax.ArrowFunctionExpression) {
	      for (var i = 0; i < path[0].params.length; i++) {
	        if (path[0].params[i] === node) {
	          return true;
	        }
	      }
	    }
	  }
	  return false;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitSuperCallExpression(traverse, node, path, state) {
	  var superClassName = state.superClass.name;

	  if (node.callee.type === Syntax.Identifier) {
	    if (_isConstructorMethod(state.methodNode)) {
	      utils.append(superClassName + '.call(', state);
	    } else {
	      var protoProp = SUPER_PROTO_IDENT_PREFIX + superClassName;
	      if (state.methodNode.key.type === Syntax.Identifier) {
	        protoProp += '.' + state.methodNode.key.name;
	      } else if (state.methodNode.key.type === Syntax.Literal) {
	        protoProp += '[' + JSON.stringify(state.methodNode.key.value) + ']';
	      }
	      utils.append(protoProp + ".call(", state);
	    }
	    utils.move(node.callee.range[1], state);
	  } else if (node.callee.type === Syntax.MemberExpression) {
	    utils.append(SUPER_PROTO_IDENT_PREFIX + superClassName, state);
	    utils.move(node.callee.object.range[1], state);

	    if (node.callee.computed) {
	      // ["a" + "b"]
	      utils.catchup(node.callee.property.range[1] + ']'.length, state);
	    } else {
	      // .ab
	      utils.append('.' + node.callee.property.name, state);
	    }

	    utils.append('.call(', state);
	    utils.move(node.callee.range[1], state);
	  }

	  utils.append('this', state);
	  if (node.arguments.length > 0) {
	    utils.append(',', state);
	    utils.catchupWhiteSpace(node.arguments[0].range[0], state);
	    traverse(node.arguments, path, state);
	  }

	  utils.catchupWhiteSpace(node.range[1], state);
	  utils.append(')', state);
	  return false;
	}
	visitSuperCallExpression.test = function(node, path, state) {
	  if (state.superClass && node.type === Syntax.CallExpression) {
	    var callee = node.callee;
	    if (callee.type === Syntax.Identifier && callee.name === 'super'
	        || callee.type == Syntax.MemberExpression
	           && callee.object.name === 'super') {
	      return true;
	    }
	  }
	  return false;
	};

	/**
	 * @param {function} traverse
	 * @param {object} node
	 * @param {array} path
	 * @param {object} state
	 */
	function visitSuperMemberExpression(traverse, node, path, state) {
	  var superClassName = state.superClass.name;

	  utils.append(SUPER_PROTO_IDENT_PREFIX + superClassName, state);
	  utils.move(node.object.range[1], state);
	}
	visitSuperMemberExpression.test = function(node, path, state) {
	  return state.superClass
	         && node.type === Syntax.MemberExpression
	         && node.object.type === Syntax.Identifier
	         && node.object.name === 'super';
	};

	exports.resetSymbols = resetSymbols;

	exports.visitorList = [
	  visitClassDeclaration,
	  visitClassExpression,
	  visitClassFunctionExpression,
	  visitClassMethod,
	  visitClassMethodParam,
	  visitPrivateIdentifier,
	  visitSuperCallExpression,
	  visitSuperMemberExpression
	];


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * Desugars concise methods of objects to function expressions.
	 *
	 * var foo = {
	 *   method(x, y) { ... }
	 * };
	 *
	 * var foo = {
	 *   method: function(x, y) { ... }
	 * };
	 *
	 */

	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);
	var reservedWordsHelper = __webpack_require__(18);

	function visitObjectConciseMethod(traverse, node, path, state) {
	  var isGenerator = node.value.generator;
	  if (isGenerator) {
	    utils.catchupWhiteSpace(node.range[0] + 1, state);
	  }
	  if (node.computed) { // [<expr>]() { ...}
	    utils.catchup(node.key.range[1] + 1, state);
	  } else if (reservedWordsHelper.isReservedWord(node.key.name)) {
	    utils.catchup(node.key.range[0], state);
	    utils.append('"', state);
	    utils.catchup(node.key.range[1], state);
	    utils.append('"', state);
	  }

	  utils.catchup(node.key.range[1], state);
	  utils.append(
	    ':function' + (isGenerator ? '*' : ''),
	    state
	  );
	  path.unshift(node);
	  traverse(node.value, path, state);
	  path.shift();
	  return false;
	}

	visitObjectConciseMethod.test = function(node, path, state) {
	  return node.type === Syntax.Property &&
	    node.value.type === Syntax.FunctionExpression &&
	    node.method === true;
	};

	exports.visitorList = [
	  visitObjectConciseMethod
	];


/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node: true*/

	/**
	 * Desugars ES6 Object Literal short notations into ES3 full notation.
	 *
	 * // Easier return values.
	 * function foo(x, y) {
	 *   return {x, y}; // {x: x, y: y}
	 * };
	 *
	 * // Destructuring.
	 * function init({port, ip, coords: {x, y}}) { ... }
	 *
	 */
	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);

	/**
	 * @public
	 */
	function visitObjectLiteralShortNotation(traverse, node, path, state) {
	  utils.catchup(node.key.range[1], state);
	  utils.append(':' + node.key.name, state);
	  return false;
	}

	visitObjectLiteralShortNotation.test = function(node, path, state) {
	  return node.type === Syntax.Property &&
	    node.kind === 'init' &&
	    node.shorthand === true &&
	    path[0].type !== Syntax.ObjectPattern;
	};

	exports.visitorList = [
	  visitObjectLiteralShortNotation
	];



/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * @typechecks
	 */
	'use strict';

	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);

	/**
	 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-12.1.9
	 */
	function visitTemplateLiteral(traverse, node, path, state) {
	  var templateElements = node.quasis;

	  utils.append('(', state);
	  for (var ii = 0; ii < templateElements.length; ii++) {
	    var templateElement = templateElements[ii];
	    if (templateElement.value.raw !== '') {
	      utils.append(getCookedValue(templateElement), state);
	      if (!templateElement.tail) {
	        // + between element and substitution
	        utils.append(' + ', state);
	      }
	      // maintain line numbers
	      utils.move(templateElement.range[0], state);
	      utils.catchupNewlines(templateElement.range[1], state);
	    } else {  // templateElement.value.raw === ''
	      // Concatenat adjacent substitutions, e.g. `${x}${y}`. Empty templates
	      // appear before the first and after the last element - nothing to add in
	      // those cases.
	      if (ii > 0 && !templateElement.tail) {
	        // + between substitution and substitution
	        utils.append(' + ', state);
	      }
	    }

	    utils.move(templateElement.range[1], state);
	    if (!templateElement.tail) {
	      var substitution = node.expressions[ii];
	      if (substitution.type === Syntax.Identifier ||
	          substitution.type === Syntax.MemberExpression ||
	          substitution.type === Syntax.CallExpression) {
	        utils.catchup(substitution.range[1], state);
	      } else {
	        utils.append('(', state);
	        traverse(substitution, path, state);
	        utils.catchup(substitution.range[1], state);
	        utils.append(')', state);
	      }
	      // if next templateElement isn't empty...
	      if (templateElements[ii + 1].value.cooked !== '') {
	        utils.append(' + ', state);
	      }
	    }
	  }
	  utils.move(node.range[1], state);
	  utils.append(')', state);
	  return false;
	}

	visitTemplateLiteral.test = function(node, path, state) {
	  return node.type === Syntax.TemplateLiteral;
	};

	/**
	 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-12.2.6
	 */
	function visitTaggedTemplateExpression(traverse, node, path, state) {
	  var template = node.quasi;
	  var numQuasis = template.quasis.length;

	  // print the tag
	  utils.move(node.tag.range[0], state);
	  traverse(node.tag, path, state);
	  utils.catchup(node.tag.range[1], state);

	  // print array of template elements
	  utils.append('(function() { var siteObj = [', state);
	  for (var ii = 0; ii < numQuasis; ii++) {
	    utils.append(getCookedValue(template.quasis[ii]), state);
	    if (ii !== numQuasis - 1) {
	      utils.append(', ', state);
	    }
	  }
	  utils.append(']; siteObj.raw = [', state);
	  for (ii = 0; ii < numQuasis; ii++) {
	    utils.append(getRawValue(template.quasis[ii]), state);
	    if (ii !== numQuasis - 1) {
	      utils.append(', ', state);
	    }
	  }
	  utils.append(
	    ']; Object.freeze(siteObj.raw); Object.freeze(siteObj); return siteObj; }()',
	    state
	  );

	  // print substitutions
	  if (numQuasis > 1) {
	    for (ii = 0; ii < template.expressions.length; ii++) {
	      var expression = template.expressions[ii];
	      utils.append(', ', state);

	      // maintain line numbers by calling catchupWhiteSpace over the whole
	      // previous TemplateElement
	      utils.move(template.quasis[ii].range[0], state);
	      utils.catchupNewlines(template.quasis[ii].range[1], state);

	      utils.move(expression.range[0], state);
	      traverse(expression, path, state);
	      utils.catchup(expression.range[1], state);
	    }
	  }

	  // print blank lines to push the closing ) down to account for the final
	  // TemplateElement.
	  utils.catchupNewlines(node.range[1], state);

	  utils.append(')', state);

	  return false;
	}

	visitTaggedTemplateExpression.test = function(node, path, state) {
	  return node.type === Syntax.TaggedTemplateExpression;
	};

	function getCookedValue(templateElement) {
	  return JSON.stringify(templateElement.value.cooked);
	}

	function getRawValue(templateElement) {
	  return JSON.stringify(templateElement.value.raw);
	}

	exports.visitorList = [
	  visitTemplateLiteral,
	  visitTaggedTemplateExpression
	];


/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/*jslint node:true*/

	/**
	 * Desugars ES7 rest properties into ES5 object iteration.
	 */

	var Syntax = __webpack_require__(3).Syntax;

	// TODO: This is a pretty massive helper, it should only be defined once, in the
	// transform's runtime environment. We don't currently have a runtime though.
	var restFunction =
	  '(function(source, exclusion) {' +
	    'var rest = {};' +
	    'var hasOwn = Object.prototype.hasOwnProperty;' +
	    'if (source == null) {' +
	      'throw new TypeError();' +
	    '}' +
	    'for (var key in source) {' +
	      'if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {' +
	        'rest[key] = source[key];' +
	      '}' +
	    '}' +
	    'return rest;' +
	  '})';

	function getPropertyNames(properties) {
	  var names = [];
	  for (var i = 0; i < properties.length; i++) {
	    var property = properties[i];
	    if (property.type === Syntax.SpreadProperty) {
	      continue;
	    }
	    if (property.type === Syntax.Identifier) {
	      names.push(property.name);
	    } else {
	      names.push(property.key.name);
	    }
	  }
	  return names;
	}

	function getRestFunctionCall(source, exclusion) {
	  return restFunction + '(' + source + ',' + exclusion + ')';
	}

	function getSimpleShallowCopy(accessorExpression) {
	  // This could be faster with 'Object.assign({}, ' + accessorExpression + ')'
	  // but to unify code paths and avoid a ES6 dependency we use the same
	  // helper as for the exclusion case.
	  return getRestFunctionCall(accessorExpression, '{}');
	}

	function renderRestExpression(accessorExpression, excludedProperties) {
	  var excludedNames = getPropertyNames(excludedProperties);
	  if (!excludedNames.length) {
	    return getSimpleShallowCopy(accessorExpression);
	  }
	  return getRestFunctionCall(
	    accessorExpression,
	    '{' + excludedNames.join(':1,') + ':1}'
	  );
	}

	exports.renderRestExpression = renderRestExpression;


/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2004-present Facebook. All Rights Reserved.
	 */
	/*global exports:true*/

	/**
	 * Implements ES7 object spread property.
	 * https://gist.github.com/sebmarkbage/aa849c7973cb4452c547
	 *
	 * { ...a, x: 1 }
	 *
	 * Object.assign({}, a, {x: 1 })
	 *
	 */

	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);

	function visitObjectLiteralSpread(traverse, node, path, state) {
	  utils.catchup(node.range[0], state);

	  utils.append('Object.assign({', state);

	  // Skip the original {
	  utils.move(node.range[0] + 1, state);

	  var previousWasSpread = false;

	  for (var i = 0; i < node.properties.length; i++) {
	    var property = node.properties[i];
	    if (property.type === Syntax.SpreadProperty) {

	      // Close the previous object or initial object
	      if (!previousWasSpread) {
	        utils.append('}', state);
	      }

	      if (i === 0) {
	        // Normally there will be a comma when we catch up, but not before
	        // the first property.
	        utils.append(',', state);
	      }

	      utils.catchup(property.range[0], state);

	      // skip ...
	      utils.move(property.range[0] + 3, state);

	      traverse(property.argument, path, state);

	      utils.catchup(property.range[1], state);

	      previousWasSpread = true;

	    } else {

	      utils.catchup(property.range[0], state);

	      if (previousWasSpread) {
	        utils.append('{', state);
	      }

	      traverse(property, path, state);

	      utils.catchup(property.range[1], state);

	      previousWasSpread = false;

	    }
	  }

	  // Strip any non-whitespace between the last item and the end.
	  // We only catch up on whitespace so that we ignore any trailing commas which
	  // are stripped out for IE8 support. Unfortunately, this also strips out any
	  // trailing comments.
	  utils.catchupWhiteSpace(node.range[1] - 1, state);

	  // Skip the trailing }
	  utils.move(node.range[1], state);

	  if (!previousWasSpread) {
	    utils.append('}', state);
	  }

	  utils.append(')', state);
	  return false;
	}

	visitObjectLiteralSpread.test = function(node, path, state) {
	  if (node.type !== Syntax.ObjectExpression) {
	    return false;
	  }
	  // Tight loop optimization
	  var hasAtLeastOneSpreadProperty = false;
	  for (var i = 0; i < node.properties.length; i++) {
	    var property = node.properties[i];
	    if (property.type === Syntax.SpreadProperty) {
	      hasAtLeastOneSpreadProperty = true;
	    } else if (property.kind !== 'init') {
	      return false;
	    }
	  }
	  return hasAtLeastOneSpreadProperty;
	};

	exports.visitorList = [
	  visitObjectLiteralSpread
	];


/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */
	/*global exports:true*/

	var Syntax = __webpack_require__(3).Syntax;
	var utils = __webpack_require__(2);
	var reserverdWordsHelper = __webpack_require__(18);

	/**
	 * Code adapted from https://github.com/spicyj/es3ify
	 * The MIT License (MIT)
	 * Copyright (c) 2014 Ben Alpert
	 */

	function visitProperty(traverse, node, path, state) {
	  utils.catchup(node.key.range[0], state);
	  utils.append('"', state);
	  utils.catchup(node.key.range[1], state);
	  utils.append('"', state);
	  utils.catchup(node.value.range[0], state);
	  traverse(node.value, path, state);
	  return false;
	}

	visitProperty.test = function(node) {
	  return node.type === Syntax.Property &&
	    node.key.type === Syntax.Identifier &&
	    !node.method &&
	    !node.shorthand &&
	    !node.computed &&
	    reserverdWordsHelper.isES3ReservedWord(node.key.name);
	};

	function visitMemberExpression(traverse, node, path, state) {
	  traverse(node.object, path, state);
	  utils.catchup(node.property.range[0] - 1, state);
	  utils.append('[', state);
	  utils.catchupWhiteSpace(node.property.range[0], state);
	  utils.append('"', state);
	  utils.catchup(node.property.range[1], state);
	  utils.append('"]', state);
	  return false;
	}

	visitMemberExpression.test = function(node) {
	  return node.type === Syntax.MemberExpression &&
	    node.property.type === Syntax.Identifier &&
	    reserverdWordsHelper.isES3ReservedWord(node.property.name);
	};

	exports.visitorList = [
	  visitProperty,
	  visitMemberExpression
	];


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	var esprima = __webpack_require__(3);
	var utils = __webpack_require__(2);

	var Syntax = esprima.Syntax;

	function _isFunctionNode(node) {
	  return node.type === Syntax.FunctionDeclaration
	         || node.type === Syntax.FunctionExpression
	         || node.type === Syntax.ArrowFunctionExpression;
	}

	function visitClassProperty(traverse, node, path, state) {
	  utils.catchup(node.range[0], state);
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitClassProperty.test = function(node, path, state) {
	  return node.type === Syntax.ClassProperty;
	};

	function visitTypeAlias(traverse, node, path, state) {
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitTypeAlias.test = function(node, path, state) {
	  return node.type === Syntax.TypeAlias;
	};

	function visitTypeCast(traverse, node, path, state) {
	  path.unshift(node);
	  traverse(node.expression, path, state);
	  path.shift();

	  utils.catchup(node.typeAnnotation.range[0], state);
	  utils.catchupWhiteOut(node.typeAnnotation.range[1], state);
	  return false;
	}
	visitTypeCast.test = function(node, path, state) {
	  return node.type === Syntax.TypeCastExpression;
	};

	function visitInterfaceDeclaration(traverse, node, path, state) {
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitInterfaceDeclaration.test = function(node, path, state) {
	  return node.type === Syntax.InterfaceDeclaration;
	};

	function visitDeclare(traverse, node, path, state) {
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitDeclare.test = function(node, path, state) {
	  switch (node.type) {
	    case Syntax.DeclareVariable:
	    case Syntax.DeclareFunction:
	    case Syntax.DeclareClass:
	    case Syntax.DeclareModule:
	      return true;
	  }
	  return false;
	};

	function visitFunctionParametricAnnotation(traverse, node, path, state) {
	  utils.catchup(node.range[0], state);
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitFunctionParametricAnnotation.test = function(node, path, state) {
	  return node.type === Syntax.TypeParameterDeclaration
	         && path[0]
	         && _isFunctionNode(path[0])
	         && node === path[0].typeParameters;
	};

	function visitFunctionReturnAnnotation(traverse, node, path, state) {
	  utils.catchup(node.range[0], state);
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitFunctionReturnAnnotation.test = function(node, path, state) {
	  return path[0] && _isFunctionNode(path[0]) && node === path[0].returnType;
	};

	function visitOptionalFunctionParameterAnnotation(traverse, node, path, state) {
	  utils.catchup(node.range[0] + node.name.length, state);
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitOptionalFunctionParameterAnnotation.test = function(node, path, state) {
	  return node.type === Syntax.Identifier
	         && node.optional
	         && path[0]
	         && _isFunctionNode(path[0]);
	};

	function visitTypeAnnotatedIdentifier(traverse, node, path, state) {
	  utils.catchup(node.typeAnnotation.range[0], state);
	  utils.catchupWhiteOut(node.typeAnnotation.range[1], state);
	  return false;
	}
	visitTypeAnnotatedIdentifier.test = function(node, path, state) {
	  return node.type === Syntax.Identifier && node.typeAnnotation;
	};

	function visitTypeAnnotatedObjectOrArrayPattern(traverse, node, path, state) {
	  utils.catchup(node.typeAnnotation.range[0], state);
	  utils.catchupWhiteOut(node.typeAnnotation.range[1], state);
	  return false;
	}
	visitTypeAnnotatedObjectOrArrayPattern.test = function(node, path, state) {
	  var rightType = node.type === Syntax.ObjectPattern
	                || node.type === Syntax.ArrayPattern;
	  return rightType && node.typeAnnotation;
	};

	/**
	 * Methods cause trouble, since esprima parses them as a key/value pair, where
	 * the location of the value starts at the method body. For example
	 * { bar(x:number,...y:Array<number>):number {} }
	 * is parsed as
	 * { bar: function(x: number, ...y:Array<number>): number {} }
	 * except that the location of the FunctionExpression value is 40-something,
	 * which is the location of the function body. This means that by the time we
	 * visit the params, rest param, and return type organically, we've already
	 * catchup()'d passed them.
	 */
	function visitMethod(traverse, node, path, state) {
	  path.unshift(node);
	  traverse(node.key, path, state);

	  path.unshift(node.value);
	  traverse(node.value.params, path, state);
	  node.value.rest && traverse(node.value.rest, path, state);
	  node.value.returnType && traverse(node.value.returnType, path, state);
	  traverse(node.value.body, path, state);

	  path.shift();

	  path.shift();
	  return false;
	}

	visitMethod.test = function(node, path, state) {
	  return (node.type === "Property" && (node.method || node.kind === "set" || node.kind === "get"))
	      || (node.type === "MethodDefinition");
	};

	function visitImportType(traverse, node, path, state) {
	  utils.catchupWhiteOut(node.range[1], state);
	  return false;
	}
	visitImportType.test = function(node, path, state) {
	  return node.type === 'ImportDeclaration'
	         && node.isType;
	};

	exports.visitorList = [
	  visitClassProperty,
	  visitDeclare,
	  visitImportType,
	  visitInterfaceDeclaration,
	  visitFunctionParametricAnnotation,
	  visitFunctionReturnAnnotation,
	  visitMethod,
	  visitOptionalFunctionParameterAnnotation,
	  visitTypeAlias,
	  visitTypeCast,
	  visitTypeAnnotatedIdentifier,
	  visitTypeAnnotatedObjectOrArrayPattern
	];


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	/*global exports:true*/
	'use strict';

	var Syntax = __webpack_require__(17).Syntax;
	var utils = __webpack_require__(2);

	var renderJSXExpressionContainer =
	  __webpack_require__(19).renderJSXExpressionContainer;
	var renderJSXLiteral = __webpack_require__(19).renderJSXLiteral;
	var quoteAttrName = __webpack_require__(19).quoteAttrName;

	var trimLeft = __webpack_require__(19).trimLeft;

	/**
	 * Customized desugar processor for React JSX. Currently:
	 *
	 * <X> </X> => React.createElement(X, null)
	 * <X prop="1" /> => React.createElement(X, {prop: '1'}, null)
	 * <X prop="2"><Y /></X> => React.createElement(X, {prop:'2'},
	 *   React.createElement(Y, null)
	 * )
	 * <div /> => React.createElement("div", null)
	 */

	/**
	 * Removes all non-whitespace/parenthesis characters
	 */
	var reNonWhiteParen = /([^\s\(\)])/g;
	function stripNonWhiteParen(value) {
	  return value.replace(reNonWhiteParen, '');
	}

	var tagConvention = /^[a-z]|\-/;
	function isTagName(name) {
	  return tagConvention.test(name);
	}

	function visitReactTag(traverse, object, path, state) {
	  var openingElement = object.openingElement;
	  var nameObject = openingElement.name;
	  var attributesObject = openingElement.attributes;

	  utils.catchup(openingElement.range[0], state, trimLeft);

	  if (nameObject.type === Syntax.JSXNamespacedName && nameObject.namespace) {
	    throw new Error('Namespace tags are not supported. ReactJSX is not XML.');
	  }

	  // We assume that the React runtime is already in scope
	  utils.append('React.createElement(', state);

	  if (nameObject.type === Syntax.JSXIdentifier && isTagName(nameObject.name)) {
	    utils.append('"' + nameObject.name + '"', state);
	    utils.move(nameObject.range[1], state);
	  } else {
	    // Use utils.catchup in this case so we can easily handle
	    // JSXMemberExpressions which look like Foo.Bar.Baz. This also handles
	    // JSXIdentifiers that aren't fallback tags.
	    utils.move(nameObject.range[0], state);
	    utils.catchup(nameObject.range[1], state);
	  }

	  utils.append(', ', state);

	  var hasAttributes = attributesObject.length;

	  var hasAtLeastOneSpreadProperty = attributesObject.some(function(attr) {
	    return attr.type === Syntax.JSXSpreadAttribute;
	  });

	  // if we don't have any attributes, pass in null
	  if (hasAtLeastOneSpreadProperty) {
	    utils.append('React.__spread({', state);
	  } else if (hasAttributes) {
	    utils.append('{', state);
	  } else {
	    utils.append('null', state);
	  }

	  // keep track of if the previous attribute was a spread attribute
	  var previousWasSpread = false;

	  // write attributes
	  attributesObject.forEach(function(attr, index) {
	    var isLast = index === attributesObject.length - 1;

	    if (attr.type === Syntax.JSXSpreadAttribute) {
	      // Close the previous object or initial object
	      if (!previousWasSpread) {
	        utils.append('}, ', state);
	      }

	      // Move to the expression start, ignoring everything except parenthesis
	      // and whitespace.
	      utils.catchup(attr.range[0], state, stripNonWhiteParen);
	      // Plus 1 to skip `{`.
	      utils.move(attr.range[0] + 1, state);
	      utils.catchup(attr.argument.range[0], state, stripNonWhiteParen);

	      traverse(attr.argument, path, state);

	      utils.catchup(attr.argument.range[1], state);

	      // Move to the end, ignoring parenthesis and the closing `}`
	      utils.catchup(attr.range[1] - 1, state, stripNonWhiteParen);

	      if (!isLast) {
	        utils.append(', ', state);
	      }

	      utils.move(attr.range[1], state);

	      previousWasSpread = true;

	      return;
	    }

	    // If the next attribute is a spread, we're effective last in this object
	    if (!isLast) {
	      isLast = attributesObject[index + 1].type === Syntax.JSXSpreadAttribute;
	    }

	    if (attr.name.namespace) {
	      throw new Error(
	         'Namespace attributes are not supported. ReactJSX is not XML.');
	    }
	    var name = attr.name.name;

	    utils.catchup(attr.range[0], state, trimLeft);

	    if (previousWasSpread) {
	      utils.append('{', state);
	    }

	    utils.append(quoteAttrName(name), state);
	    utils.append(': ', state);

	    if (!attr.value) {
	      state.g.buffer += 'true';
	      state.g.position = attr.name.range[1];
	      if (!isLast) {
	        utils.append(', ', state);
	      }
	    } else {
	      utils.move(attr.name.range[1], state);
	      // Use catchupNewlines to skip over the '=' in the attribute
	      utils.catchupNewlines(attr.value.range[0], state);
	      if (attr.value.type === Syntax.Literal) {
	        renderJSXLiteral(attr.value, isLast, state);
	      } else {
	        renderJSXExpressionContainer(traverse, attr.value, isLast, path, state);
	      }
	    }

	    utils.catchup(attr.range[1], state, trimLeft);

	    previousWasSpread = false;

	  });

	  if (!openingElement.selfClosing) {
	    utils.catchup(openingElement.range[1] - 1, state, trimLeft);
	    utils.move(openingElement.range[1], state);
	  }

	  if (hasAttributes && !previousWasSpread) {
	    utils.append('}', state);
	  }

	  if (hasAtLeastOneSpreadProperty) {
	    utils.append(')', state);
	  }

	  // filter out whitespace
	  var childrenToRender = object.children.filter(function(child) {
	    return !(child.type === Syntax.Literal
	             && typeof child.value === 'string'
	             && child.value.match(/^[ \t]*[\r\n][ \t\r\n]*$/));
	  });
	  if (childrenToRender.length > 0) {
	    var lastRenderableIndex;

	    childrenToRender.forEach(function(child, index) {
	      if (child.type !== Syntax.JSXExpressionContainer ||
	          child.expression.type !== Syntax.JSXEmptyExpression) {
	        lastRenderableIndex = index;
	      }
	    });

	    if (lastRenderableIndex !== undefined) {
	      utils.append(', ', state);
	    }

	    childrenToRender.forEach(function(child, index) {
	      utils.catchup(child.range[0], state, trimLeft);

	      var isLast = index >= lastRenderableIndex;

	      if (child.type === Syntax.Literal) {
	        renderJSXLiteral(child, isLast, state);
	      } else if (child.type === Syntax.JSXExpressionContainer) {
	        renderJSXExpressionContainer(traverse, child, isLast, path, state);
	      } else {
	        traverse(child, path, state);
	        if (!isLast) {
	          utils.append(', ', state);
	        }
	      }

	      utils.catchup(child.range[1], state, trimLeft);
	    });
	  }

	  if (openingElement.selfClosing) {
	    // everything up to />
	    utils.catchup(openingElement.range[1] - 2, state, trimLeft);
	    utils.move(openingElement.range[1], state);
	  } else {
	    // everything up to </ sdflksjfd>
	    utils.catchup(object.closingElement.range[0], state, trimLeft);
	    utils.move(object.closingElement.range[1], state);
	  }

	  utils.append(')', state);
	  return false;
	}

	visitReactTag.test = function(object, path, state) {
	  return object.type === Syntax.JSXElement;
	};

	exports.visitorList = [
	  visitReactTag
	];


/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	/*global exports:true*/
	'use strict';

	var Syntax = __webpack_require__(17).Syntax;
	var utils = __webpack_require__(2);

	function addDisplayName(displayName, object, state) {
	  if (object &&
	      object.type === Syntax.CallExpression &&
	      object.callee.type === Syntax.MemberExpression &&
	      object.callee.object.type === Syntax.Identifier &&
	      object.callee.object.name === 'React' &&
	      object.callee.property.type === Syntax.Identifier &&
	      object.callee.property.name === 'createClass' &&
	      object.arguments.length === 1 &&
	      object.arguments[0].type === Syntax.ObjectExpression) {
	    // Verify that the displayName property isn't already set
	    var properties = object.arguments[0].properties;
	    var safe = properties.every(function(property) {
	      var value = property.key.type === Syntax.Identifier ?
	        property.key.name :
	        property.key.value;
	      return value !== 'displayName';
	    });

	    if (safe) {
	      utils.catchup(object.arguments[0].range[0] + 1, state);
	      utils.append('displayName: "' + displayName + '",', state);
	    }
	  }
	}

	/**
	 * Transforms the following:
	 *
	 * var MyComponent = React.createClass({
	 *    render: ...
	 * });
	 *
	 * into:
	 *
	 * var MyComponent = React.createClass({
	 *    displayName: 'MyComponent',
	 *    render: ...
	 * });
	 *
	 * Also catches:
	 *
	 * MyComponent = React.createClass(...);
	 * exports.MyComponent = React.createClass(...);
	 * module.exports = {MyComponent: React.createClass(...)};
	 */
	function visitReactDisplayName(traverse, object, path, state) {
	  var left, right;

	  if (object.type === Syntax.AssignmentExpression) {
	    left = object.left;
	    right = object.right;
	  } else if (object.type === Syntax.Property) {
	    left = object.key;
	    right = object.value;
	  } else if (object.type === Syntax.VariableDeclarator) {
	    left = object.id;
	    right = object.init;
	  }

	  if (left && left.type === Syntax.MemberExpression) {
	    left = left.property;
	  }
	  if (left && left.type === Syntax.Identifier) {
	    addDisplayName(left.name, right, state);
	  }
	}

	visitReactDisplayName.test = function(object, path, state) {
	  return (
	    object.type === Syntax.AssignmentExpression ||
	    object.type === Syntax.Property ||
	    object.type === Syntax.VariableDeclarator
	  );
	};

	exports.visitorList = [
	  visitReactDisplayName
	];


/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	/*global exports:true*/

	'use strict';

	var es6ArrowFunctions =
	  __webpack_require__(184);
	var es6Classes = __webpack_require__(186);
	var es6Destructuring =
	  __webpack_require__(53);
	var es6ObjectConciseMethod =
	  __webpack_require__(187);
	var es6ObjectShortNotation =
	  __webpack_require__(188);
	var es6RestParameters = __webpack_require__(26);
	var es6Templates = __webpack_require__(189);
	var es6CallSpread =
	  __webpack_require__(185);
	var es7SpreadProperty =
	  __webpack_require__(191);
	var react = __webpack_require__(194);
	var reactDisplayName = __webpack_require__(195);
	var reservedWords = __webpack_require__(192);

	/**
	 * Map from transformName => orderedListOfVisitors.
	 */
	var transformVisitors = {
	  'es6-arrow-functions': es6ArrowFunctions.visitorList,
	  'es6-classes': es6Classes.visitorList,
	  'es6-destructuring': es6Destructuring.visitorList,
	  'es6-object-concise-method': es6ObjectConciseMethod.visitorList,
	  'es6-object-short-notation': es6ObjectShortNotation.visitorList,
	  'es6-rest-params': es6RestParameters.visitorList,
	  'es6-templates': es6Templates.visitorList,
	  'es6-call-spread': es6CallSpread.visitorList,
	  'es7-spread-property': es7SpreadProperty.visitorList,
	  'react': react.visitorList.concat(reactDisplayName.visitorList),
	  'reserved-words': reservedWords.visitorList
	};

	var transformSets = {
	  'harmony': [
	    'es6-arrow-functions',
	    'es6-object-concise-method',
	    'es6-object-short-notation',
	    'es6-classes',
	    'es6-rest-params',
	    'es6-templates',
	    'es6-destructuring',
	    'es6-call-spread',
	    'es7-spread-property'
	  ],
	  'es3': [
	    'reserved-words'
	  ],
	  'react': [
	    'react'
	  ]
	};

	/**
	 * Specifies the order in which each transform should run.
	 */
	var transformRunOrder = [
	  'reserved-words',
	  'es6-arrow-functions',
	  'es6-object-concise-method',
	  'es6-object-short-notation',
	  'es6-classes',
	  'es6-rest-params',
	  'es6-templates',
	  'es6-destructuring',
	  'es6-call-spread',
	  'es7-spread-property',
	  'react'
	];

	/**
	 * Given a list of transform names, return the ordered list of visitors to be
	 * passed to the transform() function.
	 *
	 * @param {array?} excludes
	 * @return {array}
	 */
	function getAllVisitors(excludes) {
	  var ret = [];
	  for (var i = 0, il = transformRunOrder.length; i < il; i++) {
	    if (!excludes || excludes.indexOf(transformRunOrder[i]) === -1) {
	      ret = ret.concat(transformVisitors[transformRunOrder[i]]);
	    }
	  }
	  return ret;
	}

	/**
	 * Given a list of visitor set names, return the ordered list of visitors to be
	 * passed to jstransform.
	 *
	 * @param {array}
	 * @return {array}
	 */
	function getVisitorsBySet(sets) {
	  var visitorsToInclude = sets.reduce(function(visitors, set) {
	    if (!transformSets.hasOwnProperty(set)) {
	      throw new Error('Unknown visitor set: ' + set);
	    }
	    transformSets[set].forEach(function(visitor) {
	      visitors[visitor] = true;
	    });
	    return visitors;
	  }, {});

	  var visitorList = [];
	  for (var i = 0; i < transformRunOrder.length; i++) {
	    if (visitorsToInclude.hasOwnProperty(transformRunOrder[i])) {
	      visitorList = visitorList.concat(transformVisitors[transformRunOrder[i]]);
	    }
	  }

	  return visitorList;
	}

	exports.getVisitorsBySet = getVisitorsBySet;
	exports.getAllVisitors = getAllVisitors;
	exports.transformVisitors = transformVisitors;


/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';
	/*eslint-disable no-undef*/
	var Buffer = __webpack_require__(49).Buffer;

	function inlineSourceMap(sourceMap, sourceCode, sourceFilename) {
	  // This can be used with a sourcemap that has already has toJSON called on it.
	  // Check first.
	  var json = sourceMap;
	  if (typeof sourceMap.toJSON === 'function') {
	    json = sourceMap.toJSON();
	  }
	  json.sources = [sourceFilename];
	  json.sourcesContent = [sourceCode];
	  var base64 = Buffer(JSON.stringify(json)).toString('base64');
	  return '//# sourceMappingURL=data:application/json;base64,' + base64;
	}

	module.exports = inlineSourceMap;


/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = babel;

/***/ }
/******/ ]);