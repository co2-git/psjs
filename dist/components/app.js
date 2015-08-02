'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _processRow = require('./process-row');

var _processRow2 = _interopRequireDefault(_processRow);

var _memory = require('./memory');

var _memory2 = _interopRequireDefault(_memory);

var App = (function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);

    this.state = {
      processes: props.processes || [],
      filters: {
        cmd: null
      }
    };
  }

  _createClass(App, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps && 'processes' in nextProps) {
        this.state.processes = nextProps.processes;
      }
    }
  }, {
    key: 'filterByCmd',
    value: function filterByCmd(e) {
      var _state = this.state;
      var processes = _state.processes;
      var filters = _state.filters;

      filters.cmd = this.refs.cmdFilter.getDOMNode().value;

      this.setState({ filters: filters });
    }
  }, {
    key: 'applyFilters',
    value: function applyFilters() {
      var _state2 = this.state;
      var processes = _state2.processes;
      var filters = _state2.filters;

      if (filters.cmd) {
        processes = processes.filter(function (ps) {
          var regex = new RegExp(filters.cmd);
          return regex.test(ps.cmd);
        });
      }

      return processes;
    }
  }, {
    key: 'render',
    value: function render() {

      var processes = this.applyFilters();

      return _react2['default'].createElement(
        'html',
        null,
        _react2['default'].createElement('meta', { charSet: 'utf-8' }),
        _react2['default'].createElement(
          'title',
          null,
          'ps|js'
        ),
        _react2['default'].createElement('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/css/index.css' }),
        _react2['default'].createElement('link', { rel: 'stylesheet', type: 'text/css', href: '/assets/bower_components/font-awesome/css/font-awesome.min.css' }),
        _react2['default'].createElement(
          'section',
          { role: 'main' },
          _react2['default'].createElement(
            'header',
            null,
            _react2['default'].createElement(
              'h1',
              null,
              _react2['default'].createElement(
                'small',
                null,
                processes.length
              ),
              _react2['default'].createElement(
                'span',
                null,
                ' Processes'
              )
            ),
            _react2['default'].createElement(_memory2['default'], null),
            _react2['default'].createElement(
              'form',
              null,
              _react2['default'].createElement('input', {
                ref: 'cmdFilter',
                type: 'text',
                placeholder: 'Search command',
                onKeyUp: this.filterByCmd.bind(this)
              }),
              _react2['default'].createElement(
                'button',
                null,
                _react2['default'].createElement('i', { className: 'fa fa-search' })
              )
            )
          ),
          _react2['default'].createElement(
            'section',
            null,
            _react2['default'].createElement(_processRow2['default'], { pid: 'PID', cmd: 'Command', mem: 'Memory' }),
            processes.filter(function (ps) {
              return ps.pid === window.pid;
            }).map(function (ps) {
              return _react2['default'].createElement(_processRow2['default'], _extends({ key: ps.pid }, ps));
            }),
            processes.filter(function (ps) {
              return ps.pid !== window.pid;
            }).filter(function (ps) {
              return ps.state === 'R' || ps.state === 'S';
            }).map(function (ps) {
              return _react2['default'].createElement(_processRow2['default'], _extends({ key: ps.pid }, ps));
            })
          )
        ),
        _react2['default'].createElement('script', { src: '/socket.io/socket.io.js' }),
        _react2['default'].createElement('script', { src: '/bundle.js' })
      );
    }
  }]);

  return App;
})(_react2['default'].Component);

exports['default'] = App;

if (typeof window !== 'undefined') {
  window.React = _react2['default'];

  _react2['default'].render(_react2['default'].createElement(App, null), window.document);

  window.socket = io.connect();

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

    _react2['default'].render(_react2['default'].createElement(App, { processes: ps }), window.document);
  });

  window.socket.on('self', function (ps) {
    window.pid = ps;
  });

  window.socket.on('total mem', function (mem) {
    window.totalMem = mem;
  });
}
module.exports = exports['default'];