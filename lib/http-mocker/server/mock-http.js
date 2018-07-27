'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _harReader = require('./har-reader');

var _harReader2 = _interopRequireDefault(_harReader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (req, res, options = {}) => {
  const recording = req.query.recording;
  const { workspace = __dirname, httpHARFile = 'recording.har' } = options;

  const harContent = _fs2.default.readFileSync(`${workspace}/${httpHARFile}`, 'utf-8');
  const har = new _harReader2.default({ 'har': harContent });

  const http = har.read(recording);

  if (!http) {
    return res.json({ code: 400, message: `can not find '${recording}'` });
  }

  let {
    'response': {
      status,
      headers = [],
      cookies = [],
      'content': {
        mimeType,
        'text': body
      }
    }
  } = http;

  res.status(status);

  headers.forEach(head => res.set(head.name, head.value));

  cookies.forEach(cookie => {
    let { name, value, expires, httpOnly, secure } = cookie;
    res.cookie(name, value, { expires, httpOnly, secure });
  });

  if (status === 200) {
    try {
      if (mimeType === 'application/json') {
        body = JSON.parse(body);
      }
    } catch (e) {}
    res.json(body);
  } else {
    res.end();
  }
};

module.exports = exports['default'];