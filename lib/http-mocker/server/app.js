'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mockHttp = require('./mock-http');

var _mockHttp2 = _interopRequireDefault(_mockHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((0, _morgan2.default)('dev'));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());

app.all('/test', (req, res) => {
  res.json({ 'code': 200, 'message': 'Mock Server Started' });
});

app.all('/mock', (req, res) => {
  (0, _mockHttp2.default)(req, res, {
    'workspace': app.get('workspace'),
    'httpHARFile': app.get('httpHARFile')
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next((0, _httpErrors2.default)(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

exports.default = app;
module.exports = exports['default'];