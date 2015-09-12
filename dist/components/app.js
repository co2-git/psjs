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

var _topBar = require('./top-bar');

var _topBar2 = _interopRequireDefault(_topBar);

var App = (function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props);

    this.state = {
      processes: props.processes || [],
      filters: {
        cmd: null
      },
      memory: this.props
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
      var _this = this;

      console.info('Render App', this.props);

      var processes = this.applyFilters();

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(_topBar2['default'], this.props),
        _react2['default'].createElement(
          'header',
          null,
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
            return _react2['default'].createElement(_processRow2['default'], _extends({ key: ps.pid }, ps, { 'total-memory': _this.props.memory.total }));
          }),
          processes.filter(function (ps) {
            return ps.pid !== window.pid;
          }).filter(function (ps) {
            return ps.state === 'R' || ps.state === 'S';
          }).sort(function (a, b) {
            var aMem = parseInt(a.mem);
            var bMem = parseInt(b.mem);

            if (isNaN(aMem)) {
              return 1;
            }

            if (isNaN(bMem)) {
              return -1;
            }

            if (aMem > bMem) {
              return -1;
            }

            if (aMem < bMem) {
              return 1;
            }

            return 0;
          }).map(function (ps) {
            return _react2['default'].createElement(_processRow2['default'], _extends({ key: ps.pid }, ps, { 'total-memory': _this.props.memory.total }));
          })
        )
      );
    }
  }]);

  return App;
})(_react2['default'].Component);

exports['default'] = App;
module.exports = exports['default'];