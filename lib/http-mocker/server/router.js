'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mockHttp = require('./mock-http');

var _mockHttp2 = _interopRequireDefault(_mockHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', (req, res, next) => {
  res.json({ 'code': 200, 'message': 'Mock Server Started' });
});

router.get('/mock', (req, res) => {
  (0, _mockHttp2.default)(req, res);
});

router.post('/mock', (req, res) => {
  (0, _mockHttp2.default)(req, res);
});

exports.default = router;
module.exports = exports['default'];