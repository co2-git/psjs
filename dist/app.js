'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsApp = require('./components/app');

var _componentsApp2 = _interopRequireDefault(_componentsApp);

var _props = require('./props');

var _props2 = _interopRequireDefault(_props);

window.React = _react2['default'];

function render() {
  _react2['default'].render(_react2['default'].createElement(_componentsApp2['default'], _props2['default']), window.document.getElementById('main'));
}

render();

window.socket = io.connect('http://localhost:2007');

window.socket.on('ps', function (ps) {

  ps.sort(function (a, b) {
    if (+a.pid > +b.pid) {
      return 1;
    }
    if (+a.pid < +b.pid) {
      return -1;
    }
    return 0;
  });

  _props2['default'].processes = ps;

  render();
});

window.socket.on('self', function (ps) {
  window.pid = ps;
});

window.socket.on('total mem', function (mem) {
  _props2['default'].memory.total = mem;
  render();
});

window.socket.on('free mem', function (mem) {
  _props2['default'].memory.free = mem;
  render();
});

window.socket.on('cpu load', function (load) {
  _props2['default'].cpu.load = load;
  render();
});