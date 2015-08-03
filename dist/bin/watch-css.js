'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var file = _path2['default'].resolve(__dirname, '../../assets/css/index.js');

_fs2['default'].watch(file, function (event, filename) {
  (0, _child_process.exec)('npm run css', function (error, stdout, stderr) {
    if (error) {
      error.stack.split(/\n/).forEach(function (line) {
        return console.log(line.red);
      });
    }
    if (stdout) {
      console.log(stdout.blue);
    }
    if (stderr) {
      console.log(stderr.yellow);
    }
  });
});