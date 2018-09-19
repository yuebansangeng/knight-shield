'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adapterXHR = exports.adapterFeth = undefined;

var _harReader = require('./har-reader');

var _harReader2 = _interopRequireDefault(_harReader);

var _https = require('./https.json');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const adapterFeth = exports.adapterFeth = () => {
  let native = window.fetch;

  window.fetch = function (url, options) {

    return new Promise((resolve, reject) => {

      const har = new _harReader2.default({ 'har': _https2.default, 'filters': [] });
      const http = har.get(url);

      if (http) {
        let { status, content, headers } = http.response;
        let { mimeType, text } = content;

        let resHeaders = {};
        headers.forEach(head => resHeaders[head.name] = head.value);
        let response = new Response(text, {
          'headers': resHeaders
        });

        return resolve(response);
      }

      return native.apply(this, [].slice.call(arguments));
    });
  };
};

// TODO:
const adapterXHR = exports.adapterXHR = () => {
  // let native = window.XMLHttpRequest.prototype.open

  // window.XMLHttpRequest.prototype.open = function () {

  //   const har = new HARReader({ 'har': httpsHarJson, 'filters': [] })
  //   const http = har.get(url)

  //   if (http) {

  //   }

  //   return native.apply(this, [].slice.call(arguments))
  // }
};