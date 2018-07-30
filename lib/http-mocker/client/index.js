'use strict';

var _adapterFetch = require('./adapter-fetch');

var _adapterFetch2 = _interopRequireDefault(_adapterFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import adapterXHR from './adapter-xhr'

const adapterFetch = new _adapterFetch2.default();
adapterFetch.onConnect();