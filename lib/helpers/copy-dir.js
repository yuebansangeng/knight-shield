'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const copydir = (srcDir, dstDir) => {
  var results = [];
  var list = _fs2.default.readdirSync(srcDir);
  var src, dst;

  list.forEach(file => {
    src = srcDir + '/' + file;
    dst = dstDir + '/' + file;
    var stat = _fs2.default.statSync(src);
    if (stat && stat.isDirectory()) {
      try {
        _fs2.default.mkdirSync(dst);
      } catch (e) {
        console.log('directory already exists: ' + dst);
      }
      results = results.concat(copydir(src, dst));
    } else {
      try {
        _fs2.default.writeFileSync(dst, _fs2.default.readFileSync(src));
      } catch (e) {
        console.log('could\'t copy file: ' + dst);
      }
      results.push(src);
    }
  });
  return results;
};

exports.default = copydir;
module.exports = exports['default'];