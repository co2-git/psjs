'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var PS = (function () {
  function PS() {
    _classCallCheck(this, PS);
  }

  _createClass(PS, null, [{
    key: 'parseStatus',
    value: function parseStatus(status) {
      var lines = status.split(/\n/);

      var parsed = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          line.replace(/^([\w_]+):(.+)$/i, function (matches, key, value) {
            value = value.trim();
            parsed[key] = value;
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return parsed;
    }
  }, {
    key: 'readStream',
    value: function readStream(file) {
      return new Promise(function (ok, ko) {
        _fs2['default'].createReadStream(file).on('data', function (data) {
          if (!this.data) {
            this.data = '';
          }
          this.data += data.toString();
        }).on('error', ko).on('end', function () {
          ok(this.data);
        });
      });
    }
  }, {
    key: 'parse',
    value: function parse(pid) {
      return new Promise(function (ok, ko) {
        try {
          Promise.all([
          // Status
          new Promise(function (ok, ko) {
            PS.readStream('/proc/' + pid + '/status').then(function (data) {
              return ok(PS.parseStatus(data));
            }, function (error) {
              if (error.code === 'ENOENT') {
                ok(false);
              } else {
                ko();
              }
            });
          }),

          // cmdline
          new Promise(function (ok, ko) {
            PS.readStream('/proc/' + pid + '/cmdline').then(function (data) {
              return ok(data);
            }, function (error) {
              if (error.code === 'ENOENT') {
                ok(false);
              } else {
                ko();
              }
            });
          }),

          // Stat
          new Promise(function (ok, ko) {
            PS.readStream('/proc/' + pid + '/stat').then(function (data) {
              return ok(data);
            }, function (error) {
              if (error.code === 'ENOENT') {
                ok(false);
              } else {
                ko();
              }
            });
          })]).then(function (results) {
            var _results = _slicedToArray(results, 3);

            var status = _results[0];
            var cmd = _results[1];
            var stat = _results[2];

            if (results.some(function (result) {
              return result === false;
            })) {
              return ok(false);
            }

            cmd = cmd || status.Name;

            var mem = status.VmSize;

            var state = status.State.split(/ \(/)[0];

            ok({ pid: +pid, status: status, cmd: cmd, stat: stat, mem: mem, state: state });
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'get',
    value: function get() {

      return new Promise(function (ok, ko) {
        _fs2['default'].readdir('/proc', function (error, files) {
          if (error) {
            return ko(error);
          }

          var processes = files.filter(function (file) {
            return (/^\d+$/.test(file)
            );
          });

          var promises = processes.map(function (pid) {
            return PS.parse(pid);
          });

          Promise.all(promises).then(function (ps) {
            ps = ps.filter(function (ps) {
              return ps;
            }).map(function (ps) {
              ps.cmd = ps.cmdline || ps.status.Name;
              return ps;
            });
            ok(ps);
          }, ko);
        });
      });
    }
  }, {
    key: 'getCPUTime',
    value: function getCPUTime() {
      return new Promise(function (ok, ko) {
        PS.readStream('/proc/stat').then(function (data) {
          try {
            var lines = data.split(/\n/);

            var summary = lines.shift();
            var summaryBits = summary.split(/\s+/);
            summaryBits.shift();

            var _summaryBits$map = summaryBits.map(function (bit) {
              return +bit;
            });

            var _summaryBits$map2 = _slicedToArray(_summaryBits$map, 10);

            var user = _summaryBits$map2[0];
            var nice = _summaryBits$map2[1];
            var system = _summaryBits$map2[2];
            var idle = _summaryBits$map2[3];
            var iowait = _summaryBits$map2[4];
            var irq = _summaryBits$map2[5];
            var softirq = _summaryBits$map2[6];
            var steal = _summaryBits$map2[7];
            var guest = _summaryBits$map2[8];
            var guest_nice = _summaryBits$map2[9];

            var idleTime = idle + iowait,
                nonIdleTime = user + nice + system + irq + softirq + steal,
                totalTime = idleTime + nonIdleTime;

            ok({ idleTime: idleTime, nonIdleTime: nonIdleTime, totalTime: totalTime });
          } catch (error) {
            ko(error);
          }
        }, ko);
      });
    }
  }]);

  return PS;
})();

exports['default'] = PS;
module.exports = exports['default'];