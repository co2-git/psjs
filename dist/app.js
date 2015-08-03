'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsApp = require('./components/app');

var _componentsApp2 = _interopRequireDefault(_componentsApp);

window.React = _react2['default'];

_react2['default'].render(_react2['default'].createElement(_componentsApp2['default'], null), window.document.getElementById('main'));

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

  _react2['default'].render(_react2['default'].createElement(_componentsApp2['default'], { processes: ps }), window.document.getElementById('main'));
});

window.socket.on('self', function (ps) {
  window.pid = ps;
});

window.socket.on('total mem', function (mem) {
  window.totalMem = mem;
});