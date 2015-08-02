'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _events = require('events');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsApp = require('../components/app');

var _componentsApp2 = _interopRequireDefault(_componentsApp);

var Server = (function (_EventEmitter) {
  _inherits(Server, _EventEmitter);

  function Server() {
    _classCallCheck(this, Server);

    _get(Object.getPrototypeOf(Server.prototype), 'constructor', this).call(this);

    this.app = (0, _express2['default'])();
    this.port = process.env.PORT || 2007;

    this.Factory = _react2['default'].createFactory(_componentsApp2['default']);

    this.router();
  }

  _createClass(Server, [{
    key: 'router',
    value: function router() {
      this.homePage();
      this.assets();
    }
  }, {
    key: 'homePage',
    value: function homePage() {
      var _this = this;

      this.app.get('/', function (req, res, next) {
        var app = _this.Factory({ path: req.path });
        res.send('<!doctype html>\n' + _react2['default'].renderToString(app));
      });
    }
  }, {
    key: 'assets',
    value: function assets() {
      this.app.use('/bundle.js', _express2['default']['static']('dist/js/bundle.js'));
      this.app.use('/assets', _express2['default']['static']('assets'));
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      this.server = _http2['default'].createServer(this.app);

      this.server.listen(this.port, function () {
        _this2.emit('message', 'You are listening to port ' + _this2.port);

        new _api2['default'](_this2).on('error', function (error) {
          return _this2.emit('error', error);
        }).on('message', function (message) {
          return _this2.emit('message', message);
        });
      });
    }
  }]);

  return Server;
})(_events.EventEmitter);

exports['default'] = Server;
module.exports = exports['default'];