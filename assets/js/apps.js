require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// Router.run!

exports.performRouteHandlerStaticMethod = performRouteHandlerStaticMethod;

var React = _interopRequire(require("react"));

var _reactRouter = require("react-router");

var Router = _interopRequire(_reactRouter);

var Route = _reactRouter.Route;
var RouteHandler = _reactRouter.RouteHandler;
var DefaultRoute = _reactRouter.DefaultRoute;
var HistoryLocation = _reactRouter.HistoryLocation;
var State = _reactRouter.State;

var _flummox = require("flummox");

var Flummox = _flummox.Flummox;
var Actions = _flummox.Actions;
var Store = _flummox.Store;

var debounce = require("./utils.js").debounce;

var request = _interopRequire(require("superagent"));

require("babel/polyfill");

// Actions

var AppActions = (function (Actions) {
  function AppActions() {
    _classCallCheck(this, AppActions);

    if (Actions != null) {
      Actions.apply(this, arguments);
    }
  }

  _inherits(AppActions, Actions);

  _prototypeProperties(AppActions, null, {
    searchItems: {
      value: function searchItems(query) {
        var items, response;
        return regeneratorRuntime.async(function searchItems$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              if (!(query === "")) {
                context$2$0.next = 4;
                break;
              }

              items = [];
              context$2$0.next = 8;
              break;

            case 4:
              context$2$0.next = 6;
              return request.get("https://api.github.com/search/repositories?q=" + query).query({
                per_page: 50 }).exec();

            case 6:
              response = context$2$0.sent;

              items = response.body.items;

            case 8:
              return context$2$0.abrupt("return", { query: query, items: items });

            case 9:
            case "end":
              return context$2$0.stop();
          }
        }, null, this);
      },
      writable: true,
      configurable: true
    }
  });

  return AppActions;
})(Actions);

// Store

var AppStore = (function (Store) {
  function AppStore(flux) {
    _classCallCheck(this, AppStore);

    _get(Object.getPrototypeOf(AppStore.prototype), "constructor", this).call(this);

    var appActionIds = flux.getActionIds("appActions");
    this.register(appActionIds.searchItems, this.handleSearchItems);

    this.state = {
      query: "",
      items: []
    };
  }

  _inherits(AppStore, Store);

  _prototypeProperties(AppStore, null, {
    handleSearchItems: {
      value: function handleSearchItems(queryAndItems) {
        this.setState(queryAndItems);
      },
      writable: true,
      configurable: true
    },
    getItems: {
      value: function getItems() {
        return this.state.items;
      },
      writable: true,
      configurable: true
    },
    getQuery: {
      value: function getQuery() {
        return this.state.query;
      },
      writable: true,
      configurable: true
    }
  });

  return AppStore;
})(Store);

// AppHandler

var AppHandler = React.createClass({
  displayName: "AppHandler",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "header" },
        "GitHub Search"
      ),
      React.createElement(RouteHandler, null)
    );
  } });

// HomeHandler

var SearchHandler = React.createClass({
  displayName: "SearchHandler",

  mixins: [State],

  statics: {
    routerWillRun: function routerWillRun(state, flux) {
      var query, appActions;
      return regeneratorRuntime.async(function routerWillRun$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
          case 0:
            query = "javascript";

            if (state.path.indexOf("/search/") === 0) {
              query = state.path.substring(8);
            }

            appActions = flux.getActions("appActions");
            context$1$0.next = 5;
            return appActions.searchItems(query);

          case 5:
            return context$1$0.abrupt("return", context$1$0.sent);

          case 6:
          case "end":
            return context$1$0.stop();
        }
      }, null, this);
    }
  },

  contextTypes: {
    flux: React.PropTypes.object.isRequired },

  getInitialState: function getInitialState() {
    this.AppStore = this.context.flux.getStore("appStore");

    return {
      query: this.AppStore.getQuery(),
      items: this.AppStore.getItems()
    };
  },

  componentWillMount: function componentWillMount() {
    this.handleSearchDebounced = debounce(function () {
      this.handleSearch.apply(this, [this.state.query]);
    }, 500);
  },

  componentDidMount: function componentDidMount() {
    this.AppStore.addListener("change", this.onAppStoreChange);
  },

  componentWillUnmount: function componentWillUnmount() {
    this.AppStore.removeListener("change", this.onAppStoreChange);
  },

  onAppStoreChange: function onAppStoreChange() {
    this.setState({ items: this.AppStore.getItems() });
  },

  handleChange: function handleChange(event) {
    var query = event.target.value;
    this.setState({ query: query });
    this.handleSearchDebounced();
  },

  handleSearch: function handleSearch(query) {
    var url = query ? "#/search/" + encodeURIComponent(query) : "#/search/";
    history.replaceState({ query: query }, "Search", url);
    var appActions = this.context.flux.getActions("appActions");
    appActions.searchItems(query);
  },

  render: function render() {

    var items = this.state.items;
    var query = this.state.query;

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "searchpanel" },
        React.createElement(
          "div",
          { className: "search" },
          React.createElement("input", { type: "text", value: query, onChange: this.handleChange, placeholder: "Search in GitHub" })
        )
      ),
      items.length === 0 ? React.createElement(
        "div",
        { className: "nodata" },
        "No data"
      ) : React.createElement(
        "ul",
        { className: "itemlist" },
        items.map(function (item) {

          var itemNameClass = "item-name " + (item.language ? item.language.toLowerCase().replace("#", "sharp") : "");

          return React.createElement(
            "li",
            { key: item.id },
            React.createElement(
              "div",
              { className: "item-img" },
              React.createElement("img", { src: item.owner.avatar_url }),
              React.createElement(
                "div",
                { className: itemNameClass },
                React.createElement(
                  "a",
                  { href: item.html_url, target: "_blank" },
                  item.full_name,
                  " (",
                  item.language,
                  ")"
                )
              ),
              React.createElement(
                "div",
                { className: "item-button-panel" },
                React.createElement(
                  "div",
                  { className: "counter" },
                  React.createElement("i", { className: "fap fap-star" }),
                  item.stargazers_count
                ),
                React.createElement(
                  "div",
                  { className: "counter" },
                  React.createElement("i", { className: "fap fap-watch" }),
                  item.watchers_count
                ),
                React.createElement(
                  "div",
                  { className: "counter" },
                  React.createElement("i", { className: "fap fap-fork" }),
                  item.forks_count
                )
              )
            ),
            React.createElement(
              "div",
              { className: "item-description" },
              item.description
            )
          );
        })
      )
    );
  }
});

// routes

var routes = exports.routes = React.createElement(
  Route,
  { handler: AppHandler },
  React.createElement(DefaultRoute, { handler: SearchHandler }),
  React.createElement(Route, { name: "search", path: "/search/?:query?", handler: SearchHandler })
);

// Flux

var Flux = exports.Flux = (function (Flummox) {
  function Flux() {
    _classCallCheck(this, Flux);

    _get(Object.getPrototypeOf(Flux.prototype), "constructor", this).call(this);

    this.createActions("appActions", AppActions);
    this.createStore("appStore", AppStore, this);
  }

  _inherits(Flux, Flummox);

  return Flux;
})(Flummox);

function performRouteHandlerStaticMethod(routes, methodName) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return regeneratorRuntime.async(function performRouteHandlerStaticMethod$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt("return", Promise.all(routes.map(function (route) {
          return route.handler[methodName];
        }).filter(function (method) {
          return typeof method === "function";
        }).map(function (method) {
          return method.apply(undefined, args);
        })));

      case 1:
      case "end":
        return context$1$0.stop();
    }
  }, null, this);
}
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"./utils.js":3,"babel/polyfill":"babel/polyfill","flummox":"flummox","react":"react","react-router":"react-router","superagent":"superagent"}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var Router = _interopRequire(require("react-router"));

var _componentsJsx = require("./components.jsx");

var routes = _componentsJsx.routes;
var Flux = _componentsJsx.Flux;
var performRouteHandlerStaticMethod = _componentsJsx.performRouteHandlerStaticMethod;

module.exports = function (divid) {

  var flux = new Flux();

  Router.run(routes, function (Handler, state) {

    function run() {
      return regeneratorRuntime.async(function run$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return performRouteHandlerStaticMethod(state.routes, "routerWillRun", state, flux);

          case 2:

            React.withContext({ flux: flux }, function () {
              return React.render(React.createElement(Handler, null), document.getElementById(divid));
            });

          case 3:
          case "end":
            return context$3$0.stop();
        }
      }, null, this);
    }

    run()["catch"](function (error) {
      throw error;
    });
  });
};

},{"./components.jsx":1,"react":"react","react-router":"react-router"}],3:[function(require,module,exports){
"use strict";

exports.debounce = debounce;
/*
 * Superagent promisification
 */

var Request = require("superagent").Request;

Request.prototype.exec = function () {
  var req = this;

  return new Promise(function (resolve, reject) {
    req.end(function (error, res) {
      if (error) return reject(error);
      resolve(res);
    });
  });
};

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var delay = exports.delay = function (time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
};
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"superagent":"superagent"}],"apps":[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/*jslint browser: true, unused: false */

var firstapp = _interopRequire(require("./firstapp/index.jsx"));

exports.firstapp = firstapp;
Object.defineProperty(exports, "__esModule", {
    value: true
});

},{"./firstapp/index.jsx":2}]},{},[])


//# sourceMappingURL=apps.js.map