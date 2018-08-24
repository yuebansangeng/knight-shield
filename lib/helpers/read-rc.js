'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractRCFromPakcage = exports.getPackageInfo = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fileNames = ['.bscpmrc', '.bscpmrc.json'];

const getPackageInfo = exports.getPackageInfo = workspace => {
  const cpath = workspace || process.cwd();
  return _fs2.default.existsSync(`${cpath}/package.json`) && require(`${cpath}/package.json`) || {};
};

const extractRCFromPakcage = exports.extractRCFromPakcage = workspace => {
  const cpath = workspace || process.cwd();
  const { maintainers = [], name, description } = getPackageInfo(workspace);

  const developers = maintainers.map(developer => developer.name);

  return {
    'name': name,
    'description': description,
    'developers': developers,
    'team': 'Unknown',
    'components': [],
    'workspaces': [],
    'category': '',
    'device': '',
    'mock': {
      'https': ''
    }
  };
};

exports.default = workspace => {
  let cpath = workspace || process.cwd();
  let rc = {};
  for (let filename of fileNames) {
    if (_fs2.default.existsSync(`${cpath}/${filename}`)) {
      rc = _hjson2.default.parse(_fs2.default.readFileSync(`${cpath}/${filename}`, 'utf-8'));
    }
  }
  return Object.assign({}, extractRCFromPakcage(workspace), rc);
};