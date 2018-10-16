'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class HARReader {

  constructor(o) {
    this.filters = o.filters;
    this.indexCache = {};
    this.har = o.har;
  }

  total() {
    return this.har.log.entries;
  }

  getLastPath(url) {
    let urlParts = url.split('/');
    urlParts = urlParts[urlParts.length - 1].split('?');
    return urlParts[0];
  }

  get(key) {
    if (!this.har || !this.har.log || !this.har.log.entries.length) {
      return null;
    }

    const { 'log': { entries = [] } } = this.har;

    if (this.indexCache[key]) {
      return this.indexCache[key] && entries[this.indexCache[key] - 1];
    }

    for (let i = 0; i < entries.length; i++) {
      const { request, response } = entries[i];
      const { url = '' } = request;
      if (url.match(new RegExp(this.getLastPath(key), 'ig'))) {
        this.indexCache[key] = i + 1;
        return entries[i];
      }
    }
  }
}
exports.default = HARReader;
module.exports = exports.default;