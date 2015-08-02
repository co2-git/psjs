'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _domain = require('domain');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _ps = require('./ps');

var _ps2 = _interopRequireDefault(_ps);

var SocketAPI = (function (_EventEmitter) {
  _inherits(SocketAPI, _EventEmitter);

  function SocketAPI(server) {
    var _this = this;

    _classCallCheck(this, SocketAPI);

    try {
      process.nextTick(function () {
        _get(Object.getPrototypeOf(SocketAPI.prototype), 'constructor', _this).call(_this);

        _this.server = server;
        _this.processes = [];
        _this.sockets = [];

        _this.io = _socketIo2['default'].listen(_this.server.server).on('connection', _this.connected.bind(_this));

        _this.totalMem = _os2['default'].totalmem();

        _this.fetch().then(function (processes) {
          _this.processes = processes;
          _this.broadcast('ps', processes);
          _this.poll();
        }, function (error) {
          return _this.emit('error', error);
        });
      });
    } catch (error) {
      this.emit('error', error);
    }
  }

  // Broadcast to clients

  _createClass(SocketAPI, [{
    key: 'broadcast',
    value: function broadcast(event) {
      for (var _len = arguments.length, messages = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        messages[_key - 1] = arguments[_key];
      }

      this.sockets.forEach(function (socket) {
        return socket.emit.apply(socket, [event].concat(messages));
      });
    }

    // Fetch complete list of processes

  }, {
    key: 'fetch',
    value: function fetch() {
      return _ps2['default'].get();
    }

    // Check if /proc has changed

  }, {
    key: 'poll',
    value: function poll() {
      var _this2 = this;

      this.poller = setInterval(function () {
        // free mem
        _this2.sockets.forEach(function (socket) {
          return socket.emit('free mem', _os2['default'].freemem());
        });

        _this2.fetch().then(function (processes) {
          // let newProcesses = processes.filter(ps => ! this.processes
          //   .some(_ps => _ps.pid === ps.pid));
          //
          // console.log('new processes', newProcesses);
          _this2.broadcast('ps', processes);
        }, function (error) {
          return _this2.emit('error', error);
        });
      }, 2500);
    }
  }, {
    key: 'connected',
    value: function connected(socket) {
      var _this3 = this;

      this.sockets.push(socket);

      this.emit('message', 'new socket client');

      socket.on('disconnected', function () {
        _this3.sockets = _this3.sockets.filter(function (_socket) {
          return _socket.id !== socket.id;
        });
      });

      socket.emit('self', process.pid);

      socket.emit('total mem', this.totalMem);
    }
  }]);

  return SocketAPI;
})(_events.EventEmitter);

exports['default'] = SocketAPI;
module.exports = exports['default'];