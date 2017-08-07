this["Frint"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _rxjs = __webpack_require__(3);

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _travixDi = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeInstanceKey() {
  var region = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var regionKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var multi = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!multi || !region && !regionKey) {
    return 'default';
  }

  var key = '';

  if (region) {
    key = region;
  }

  if (regionKey) {
    key = region + '_' + regionKey;
  }

  return key;
}

function App() {
  var _this = this;

  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.options = _extends({
    name: null,
    parentApp: null,
    providers: [],

    providerNames: {
      component: 'component',
      container: 'container',
      store: 'store',
      app: 'app',
      parentApp: 'parentApp',
      rootApp: 'rootApp',
      region: 'region'
    },

    // lifecycle callbacks
    initialize: function initialize() {},
    beforeDestroy: function beforeDestroy() {}

  }, opts);

  // errors
  if (!this.options.name) {
    throw new Error('Must provide `name` in options');
  }

  // container
  var Container = (0, _travixDi.createContainer)([{ name: this.options.providerNames.app, useDefinedValue: this }, { name: this.options.providerNames.parentApp, useDefinedValue: this.getParentApp() }, { name: this.options.providerNames.rootApp, useDefinedValue: this.getRootApp() }], {
    containerKey: this.options.providerNames.container
  });
  this.container = (0, _travixDi.resolveContainer)(Container);

  // root app's providers
  this._registerRootProviders();

  // self providers
  this.options.providers.forEach(function (provider) {
    _this.container.register(provider);
  });

  // children - create Observable if root
  this._appsCollection = [];
  this._apps$ = new _rxjs.BehaviorSubject(this._appsCollection);

  this.options.initialize.bind(this)();
}

App.prototype._registerRootProviders = function _registerRootProviders() {
  var _this2 = this;

  var parentApps = this.getParentApps();

  if (parentApps.length === 0) {
    return;
  }

  parentApps.reverse().forEach(function (parentApp) {
    parentApp.getProviders().forEach(function (parentProvider) {
      // do not cascade
      if (!parentProvider.cascade) {
        return;
      }

      var definedProvider = Object.assign({}, _lodash2.default.omit(parentProvider, ['useClass', 'useValue', 'useFactory']));

      // non-scoped
      if (!parentProvider.scoped) {
        _this2.container.register(_extends({}, definedProvider, {
          useValue: parentApp.get(parentProvider.name)
        }));

        return;
      }

      // scoped
      if ('useValue' in parentProvider) {
        // `useValue` providers have no impact with scoping
        _this2.container.register(_extends({}, definedProvider, {
          useValue: parentApp.get(parentProvider.name)
        }));

        return;
      }

      if ('useClass' in parentProvider) {
        _this2.container.register(_extends({}, definedProvider, {
          useClass: parentProvider.useClass
        }));

        return;
      }

      if ('useFactory' in parentProvider) {
        _this2.container.register(_extends({}, definedProvider, {
          useFactory: parentProvider.useFactory
        }));
      }
    });
  });
};

App.prototype.getContainer = function getContainer() {
  return this.container;
};

App.prototype.getRootApp = function getRootApp() {
  var parents = this.getParentApps();

  if (parents.length === 0) {
    return this;
  }

  return parents.pop();
};

App.prototype.getParentApp = function getParentApp() {
  return this.options[this.options.providerNames.parentApp] || null;
};

App.prototype.getParentApps = function getParentApps() {
  function findParents(app) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var parentApp = app.getParentApp();

    if (!parentApp) {
      return parents;
    }

    parents.push(parentApp);
    return findParents(parentApp, parents);
  }

  return findParents(this);
};

App.prototype.getOption = function getOption(key) {
  return _lodash2.default.get(this.options, key);
};

App.prototype.getName = function getName() {
  return this.getOption('name');
};

App.prototype.getProviders = function getProviders() {
  return this.options.providers;
};

App.prototype.getProvider = function getProvider(name) {
  return _lodash2.default.find(this.options.providers, function (p) {
    return p.name === name;
  });
};

App.prototype.get = function get(providerName) {
  var value = this.container.get(providerName);

  if (typeof value !== 'undefined') {
    return value;
  }

  return null;
};

App.prototype.getApps$ = function getApps$() {
  var regionName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (!regionName) {
    return this._apps$;
  }

  return this._apps$.map(function (collection) {
    return collection.filter(function (w) {
      return w.regions.indexOf(regionName) > -1;
    });
  });
};

App.prototype.registerApp = function registerApp(AppClass) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var options = _extends({
    multi: false
  }, opts);

  if (typeof options.name !== 'undefined') {
    Object.defineProperty(AppClass, 'frintAppName', {
      value: options.name,
      configurable: true
    });
  }

  var existingIndex = _lodash2.default.findIndex(this._appsCollection, function (w) {
    return w.name === AppClass.frintAppName;
  });

  if (existingIndex !== -1) {
    throw new Error('App \'' + AppClass.frintAppName + '\' has been already registered before.');
  }

  this._appsCollection.push(_extends({}, options, {
    name: AppClass.frintAppName,
    App: AppClass,
    regions: options.regions || [],
    instances: {}
  }));

  if (options.multi === false) {
    this.instantiateApp(AppClass.frintAppName);
  }

  this._apps$.next(this._appsCollection);
};

App.prototype.hasAppInstance = function hasAppInstance(name) {
  var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var regionKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var instance = this.getAppInstance(name, region, regionKey);

  if (instance && typeof instance !== 'undefined') {
    return true;
  }

  return false;
};

App.prototype.getAppInstance = function getAppInstance(name) {
  var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var regionKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var index = _lodash2.default.findIndex(this._appsCollection, function (w) {
    return w.name === name;
  });

  if (index === -1) {
    return null;
  }

  var w = this._appsCollection[index];
  var instanceKey = makeInstanceKey(region, regionKey, w.multi);
  var instance = w.instances[instanceKey];

  if (!instance || typeof instance === 'undefined') {
    return null;
  }

  return instance;
};

App.prototype.getAppOnceAvailable$ = function getAppOnceAvailable$(name) {
  var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var regionKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var rootApp = this.getRootApp();

  var w = rootApp.getAppInstance(name, region, regionKey);

  if (w) {
    return _rxjs.Observable.of(w);
  }

  return rootApp._apps$.concatMap(function (y) {
    return y;
  }).find(function (app) {
    return app.name === name;
  }).map(function (x) {
    var instanceKey = makeInstanceKey(region, regionKey, x.multi);
    return x.instances[instanceKey];
  }).first(function (y) {
    return y;
  });
};

App.prototype.instantiateApp = function instantiateApp(name) {
  var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var regionKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var index = _lodash2.default.findIndex(this._appsCollection, function (w) {
    return w.App.frintAppName === name;
  });

  if (index === -1) {
    throw new Error('No app found with name \'' + name + '\'.');
  }

  var w = this._appsCollection[index];
  var key = makeInstanceKey(region, regionKey, w.multi);

  this._appsCollection[index].instances[key] = new w.App(_extends({}, _lodash2.default.omit(w, ['App', 'instances']), {
    name: w.App.frintAppName,
    parentApp: this
  }));

  return this._appsCollection[index].instances[key];
};

App.prototype.destroyApp = function destroyApp(name) {
  var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var regionKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var index = _lodash2.default.findIndex(this._appsCollection, function (w) {
    if (!w || !w.App) {
      return false;
    }

    return w.App.frintAppName === name;
  });

  if (index === -1) {
    throw new Error('No app found with name \'' + name + '\'.');
  }

  var w = this._appsCollection[index];
  var key = makeInstanceKey(region, regionKey, w.multi);

  if (typeof this._appsCollection[index].instances[key] === 'undefined') {
    throw new Error('No instance with key \'' + key + '\' found for app with name \'' + name + '\'.');
  }

  this._appsCollection[index].instances[key].beforeDestroy();
  delete this._appsCollection[index].instances[key];
};

App.prototype.beforeDestroy = function beforeDestroy() {
  return this.options.beforeDestroy.bind(this)();
};

// @TODO: Get rid of *Widget* aliases
[{ alias: 'getWidgets$', fn: 'getApps$' }, { alias: 'registerWidget', fn: 'registerApp' }, { alias: 'hasWidgetInstance', fn: 'hasWidgetInstance' }, { alias: 'getWidgetInstance', fn: 'getAppInstance' }, { alias: 'getWidgetOnceAvailable$', fn: 'getAppOnceAvailable$' }, { alias: 'destroyWidget', fn: 'destroyApp' }].forEach(function (_ref) {
  var alias = _ref.alias,
      fn = _ref.fn;

  App.prototype[alias] = function deprecatedAlias() {
    // eslint-disable-next-line no-console, prefer-template
    console.warn('[DEPRECATED] `' + alias + '` has been deprecated. Use `' + fn + '` instead');
    this[fn].apply(this, arguments);
  };
});

// unregisterApp(name, region = null, regionKey = null) {
//   // @TODO
// }

exports.default = App;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function() { module.exports = this["_"]; }());

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _App = __webpack_require__(0);

var _App2 = _interopRequireDefault(_App);

var _createApp = __webpack_require__(9);

var _createApp2 = _interopRequireDefault(_createApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Frint = {
  App: _App2.default,
  createApp: _createApp2.default
};

exports.default = Frint;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

(function() { module.exports = this["Rx"]; }());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var lib = __webpack_require__(5);

module.exports = lib;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createContainer = __webpack_require__(6);

var _createContainer2 = _interopRequireDefault(_createContainer);

var _resolveContainer = __webpack_require__(7);

var _resolveContainer2 = _interopRequireDefault(_resolveContainer);

var _createClass = __webpack_require__(8);

var _createClass2 = _interopRequireDefault(_createClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  createContainer: _createContainer2.default,
  resolveContainer: _resolveContainer2.default,
  createClass: _createClass2.default
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createContainer;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createContainer() {
  var providers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var options = _extends({
    containerName: 'container'
  }, opts);

  var Container = function () {
    function Container() {
      var _this = this;

      _classCallCheck(this, Container);

      // name ==> instance
      this.registry = {};
      Object.defineProperty(this.registry, options.containerName, {
        get: function get() {
          return _this;
        }
      });

      providers.forEach(function (provider) {
        _this.register(provider);
      });
    }

    _createClass(Container, [{
      key: 'getDeps',
      value: function getDeps(provider) {
        var _this2 = this;

        var name = provider.name;

        var depsInstances = {};

        if (Array.isArray(provider.deps)) {
          provider.deps.forEach(function (depName) {
            if (!(depName in _this2.registry)) {
              throw new Error('For provider \'' + name + '\', dependency \'' + depName + '\' is not available yet.');
            }

            depsInstances[depName] = _this2.registry[depName];
          });
        } else if (_typeof(provider.deps) === 'object') {
          Object.keys(provider.deps).forEach(function (containerDepName) {
            if (!(containerDepName in _this2.registry)) {
              throw new Error('For provider \'' + name + '\', dependency \'' + containerDepName + '\' is not available yet.');
            }

            var targetDepName = provider.deps[containerDepName];
            depsInstances[targetDepName] = _this2.registry[containerDepName];
          });
        }

        return depsInstances;
      }
    }, {
      key: 'register',
      value: function register(provider) {
        if (typeof provider.name !== 'string') {
          throw new Error('Provider has no \'name\' key.');
        }

        var name = provider.name;


        if ('useValue' in provider) {
          this.registry[name] = provider.useValue;
        } else if ('useFactory' in provider) {
          this.registry[name] = provider.useFactory(this.getDeps(provider));
        } else if ('useClass' in provider) {
          this.registry[name] = new provider.useClass(this.getDeps(provider));
        } else if ('useDefinedValue' in provider) {
          Object.defineProperty(this.registry, name, {
            get: function get() {
              return provider.useDefinedValue;
            }
          });
        } else {
          throw new Error('No value given for \'' + name + '\' provider.');
        }
      }
    }, {
      key: 'get',
      value: function get(name) {
        return this.registry[name];
      }
    }]);

    return Container;
  }();

  return Container;
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveContainer;
function resolveContainer(Container) {
  return new Container();
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createClass;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createClass() {
  var extend = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var GeneratedClass = function GeneratedClass() {
    var _this = this;

    _classCallCheck(this, GeneratedClass);

    Object.keys(extend).forEach(function (key) {
      if (typeof extend[key] === 'function') {
        _this[key] = extend[key].bind(_this);
      } else {
        _this[key] = extend[key];
      }
    });

    if (typeof this.initialize === 'function') {
      this.initialize.apply(this, arguments);
    }
  };

  return GeneratedClass;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createApp;

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _App = __webpack_require__(0);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createApp() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var App = function (_BaseApp) {
    _inherits(App, _BaseApp);

    function App() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, App);

      return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, _lodash2.default.merge(options, opts)));
    }

    return App;
  }(_App2.default);

  if (typeof options.name !== 'undefined') {
    Object.defineProperty(App, 'frintAppName', {
      value: options.name,
      configurable: true
    });
  }

  return App;
}
module.exports = exports['default'];

/***/ })
/******/ ]);