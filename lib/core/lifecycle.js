'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _readRc = require('./read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _es6TemplateStrings = require('es6-template-strings');

var _es6TemplateStrings2 = _interopRequireDefault(_es6TemplateStrings);

var _logger = require('../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Lifecycle {

  constructor(props) {
    this.contextRoot = props.contextRoot;
    this.lifecycle = this.getLifecycleScripts(this.contextRoot);
    this.env = {
      'PACKAGE_LOCATION': this.contextRoot
    };
  }

  getLifecycleScripts(contextRoot) {
    const rc = new _readRc2.default({ contextRoot });
    const lifecycle = rc.get('lifecycle');
    const res = {};
    Object.keys(lifecycle).forEach(lc => {
      res[lc] = lifecycle[lc];
    });
    return res;
  }

  run(script, opts = {}) {
    if (!this.lifecycle[script]) return;

    // replace str-temp, if have
    const command = (0, _es6TemplateStrings2.default)(this.lifecycle[script], Object.assign({}, this.env, opts.env));

    _execa2.default.shellSync(command, Object.assign({
      'cwd': this.contextRoot,
      'env': this.env,
      'stdout': 'inherit'
    }, opts));
  }
}
exports.default = Lifecycle;
module.exports = exports['default'];