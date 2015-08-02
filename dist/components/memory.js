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

var Memory = (function (_React$Component) {
  _inherits(Memory, _React$Component);

  function Memory(props) {
    _classCallCheck(this, Memory);

    _get(Object.getPrototypeOf(Memory.prototype), 'constructor', this).call(this, props);

    this.state = {
      totalMem: 0,
      freeMem: 0
    };

    this.setComponent();
  }

  _createClass(Memory, [{
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
    key: 'memUsed',
    value: function memUsed() {
      var width = this.state.freeMem / this.state.totalMem * 100;

      var background = 'transparent';

      if (width > 0 && width < 40) {
        background = 'green';
      } else if (width >= 40 && width < 80) {
        background = 'orange';
      } else if (width >= 80) {
        background = 'red';
      }

      return { width: width + '%', background: background };
    }
  }, {
    key: 'render',
    value: function render() {
      var memUsed = this.memUsed();
      var width = parseInt(memUsed.width);
      var percent = undefined;

      if (!isNaN(width)) {
        percent = width.toFixed(2) + '%';
      }

      return _react2['default'].createElement(
        'section',
        null,
        _react2['default'].createElement(
          'h2',
          null,
          'Memory ',
          this.state.totalMem
        ),
        _react2['default'].createElement(
          'div',
          { className: 'memory-bar' },
          _react2['default'].createElement('div', { className: 'memory-used', style: memUsed }),
          _react2['default'].createElement(
            'div',
            { className: 'memory-percent' },
            percent
          )
        )
      );
    }
  }]);

  return Memory;
})(_react2['default'].Component);

exports['default'] = Memory;
module.exports = exports['default'];