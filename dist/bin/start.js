#!/usr/bin/env node


'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libServer = require('../lib/server');

var _libServer2 = _interopRequireDefault(_libServer);

process.title = 'psjs';

function onError(error) {
  console.log(error.stack.split(/\n/));
}

new _libServer2['default']().on('error', onError).on('message', console.log.bind(console, 'message')).start();