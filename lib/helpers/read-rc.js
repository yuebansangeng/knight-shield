'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fastGlob = require('fast-glob');

var _fastGlob2 = _interopRequireDefault(_fastGlob);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ReadRC {

  constructor(props = {}) {
    this.fileNames = ['.bscpmrc', '.bscpmrc.json'];
    this.contextRoot = props.contextRoot || process.cwd();
    this.fsGlobOps = { 'onlyDirectories': true };
  }

  toJSON() {
    let packInfo = this.extractRCFromPakcage();
    let rc = {};
    for (let filename of this.fileNames) {
      if (_fs2.default.existsSync(`${this.contextRoot}/${filename}`)) {
        rc = _hjson2.default.parse(_fs2.default.readFileSync(`${this.contextRoot}/${filename}`, 'utf-8'));
        break;
      }
    }
    return Object.assign({}, packInfo, rc);
  }

  get(key) {
    return this.toJSON()[key];
  }

  getComponentsPath() {
    return _fastGlob2.default.sync(this.toJSON().components, this.fsGlobOps);
  }

  getLibsPath() {
    const { components, libs } = this.toJSON();
    const libsPath = new Set(libs.concat(components));
    return _fastGlob2.default.sync([...libsPath], this.fsGlobOps);
  }

  getPackageInfo() {
    return _fs2.default.existsSync(`${this.contextRoot}/package.json`) && require(`${this.contextRoot}/package.json`) || {};
  }

  extractRCFromPakcage() {
    const { maintainers = [], name, description } = this.getPackageInfo();
    const developers = maintainers.map(developer => developer.name);

    return {
      'name': name,
      'description': description,
      'developers': developers, // TODO: remove
      'team': 'Unknown',
      'components': [], // fs-glob
      'libs': [], // fs-glob
      'privates': [], // fs-glob
      'category': '',
      'device': '',
      'mock': {
        'https': ''
      }
    };
  }
}
exports.default = ReadRC;
module.exports = exports['default'];