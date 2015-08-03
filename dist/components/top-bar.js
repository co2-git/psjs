'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _progressBar = require('./progress-bar');

var _progressBar2 = _interopRequireDefault(_progressBar);

var TopBar = (function (_React$Component) {
  _inherits(TopBar, _React$Component);

  function TopBar(props) {
    _classCallCheck(this, TopBar);

    _get(Object.getPrototypeOf(TopBar.prototype), 'constructor', this).call(this, props);

    this.state = {
      totalMem: 0,
      freeMem: 0
    };

    this.setComponent();
  }

  _createClass(TopBar, [{
    key: 'setComponent',
    value: function setComponent() {
      var _this = this;

      if (typeof window !== 'undefined') {
        if (!window.socket) {
          return this.waitForSocket = window.setInterval(function () {
            if (window.socket) {
              window.clearInterval(_this.waitForSocket);
              _this.setComponent();
            }
          }, 1000);
        }

        if (window.totalMem) {
          this.setState({ totalMem: window.totalMem });
        } else {
          window.socket.on('total mem', function (totalMem) {
            _this.setState({ totalMem: totalMem });
          });
        }

        window.socket.on('free mem', function (freeMem) {
          _this.setState({ freeMem: freeMem });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state;
      var totalMem = _state.totalMem;
      var freeMem = _state.freeMem;

      var usedMem = totalMem - freeMem;

      return _react2['default'].createElement(
        'header',
        { className: 'top-bar' },
        _react2['default'].createElement(
          'div',
          { style: { width: '50%', float: 'left' } },
          _react2['default'].createElement(
            'h1',
            null,
            'PS|JS',
            _react2['default'].createElement(
              'small',
              null,
              this.props.processes.length,
              ' processes'
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { style: { width: '50%', float: 'right', 'text-align': 'right' } },
          _react2['default'].createElement(
            'h2',
            null,
            _react2['default'].createElement(_progressBar2['default'], { goal: totalMem, current: usedMem }),
            _react2['default'].createElement(_progressBar2['default'], { label: 'CPU (8)', goal: 2500, current: 700 }),
            _react2['default'].createElement('i', { className: 'fa fa-bar-chart' }),
            _react2['default'].createElement('i', { className: 'fa fa-search' })
          )
        )
      );
    }
  }]);

  return TopBar;
})(_react2['default'].Component);

exports['default'] = TopBar;
module.exports = exports['default'];