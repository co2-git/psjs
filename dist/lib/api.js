'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

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

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _ps = require('./ps');

var _ps2 = _interopRequireDefault(_ps);

var SocketAPI = (function (_EventEmitter) {
  _inherits(SocketAPI, _EventEmitter);

  function SocketAPI(server) {
    var _this = this;

    _classCallCheck(this, SocketAPI);

    try {
      console.log('Welcome to PS|JS :)'.blue);

      process.nextTick(function () {
        _get(Object.getPrototypeOf(SocketAPI.prototype), 'constructor', _this).call(_this);

        _this.server = server;
        _this.processes = [];
        _this.sockets = [];
        _this.CPU = {};

        _this.io = _socketIo2['default'].listen(_this.server.server).on('connection', _this.connected.bind(_this));

        _this.totalMem = _os2['default'].totalmem();

        console.log('Getting processes, CPU'.grey);

        Promise.all([_ps2['default'].get(), _ps2['default'].getCPUTime()]).then(function (results) {
          try {
            var _results = _slicedToArray(results, 2);

            var processes = _results[0];
            var cpu = _results[1];

            console.log(('Got ' + processes.length + ' processes').green);

            _this.processes = processes;
            _this.broadcast('ps', processes);

            _this.cpu = cpu;

            setTimeout(_this.poll.bind(_this), 2500);
          } catch (error) {
            _this.emit('error', error);
          }
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

      console.log('Polling'.cyan);

      Promise.all([_ps2['default'].get(), _ps2['default'].getCPUTime()]).then(function (results) {
        try {
          // free mem
          _this2.sockets.forEach(function (socket) {
            return socket.emit('free mem', _os2['default'].freemem());
          });

          var _results2 = _slicedToArray(results, 2);

          var processes = _results2[0];
          var cpu = _results2[1];

          _this2.processes = processes;
          console.log(('Got ' + processes.length + ' processes').green);
          _this2.broadcast('ps', processes);

          var time = cpu.totalTime - _this2.cpu.totalTime;
          var idle = cpu.idleTime - _this2.cpu.idleTime;

          var load = (time - idle) / time;

          console.log('comparing', cpu, _this2.cpu, { load: load });

          _this2.cpu = cpu;

          _this2.cpu.load = load;

          console.log('load average', _os2['default'].loadavg()[0] / 8 * 100 + load);

          _this2.broadcast('cpu load', _os2['default'].loadavg()[0] / 8 * 100 + load);

          setTimeout(_this2.poll.bind(_this2), 2500);
        } catch (error) {
          _this2.emit('error', error);
        }
      }, function (error) {
        return _this2.emit('error', error);
      });
    }
  }, {
    key: 'connected',
    value: function connected(socket) {
      var _this3 = this;

      try {
        this.sockets.push(socket);

        this.emit('message', 'new socket client');

        socket.on('disconnected', function () {
          _this3.sockets = _this3.sockets.filter(function (_socket) {
            return _socket.id !== socket.id;
          });
        });

        socket.emit('self', process.pid);

        socket.emit('total mem', this.totalMem);
      } catch (error) {
        this.server.emit('error', error);
      }

      // socket.emit('')
    }
  }]);

  return SocketAPI;
})(_events.EventEmitter);

exports['default'] = SocketAPI;
module.exports = exports['default'];