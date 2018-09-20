'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExamples = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _readRc = require('../read-rc');

var _readRc2 = _interopRequireDefault(_readRc);

var _copyDir = require('../../helpers/copy-dir');

var _copyDir2 = _interopRequireDefault(_copyDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// where config-* is
const configRoot = _path2.default.join(__dirname, '..', '..', '..', 'caches');
const oriConfigPath = _path2.default.join(__dirname, 'storybook');

class ConfigConsumer {

  constructor(props = {}) {
    this.contextRoot = props.contextRoot;
    this.storybookConfigPath = `${configRoot}/config-${props.name}`;
    // copy configs
    this.cloneConfigs();
  }

  getConfigPath() {
    return this.storybookConfigPath;
  }

  cloneConfigs() {

    // create caches/ if none
    if (!_fs2.default.existsSync(configRoot)) {
      _execa2.default.sync('mkdir', [configRoot]);
    }

    // create config dir
    if (_fs2.default.existsSync(this.storybookConfigPath)) {
      _execa2.default.sync('rm', ['-rf', this.storybookConfigPath]);
    }

    _execa2.default.sync('mkdir', [this.storybookConfigPath]);

    // copy config
    (0, _copyDir2.default)(oriConfigPath, this.storybookConfigPath);

    // override storybook config
    this.override(`${this.contextRoot}/.storybook`, this.storybookConfigPath, ['manager-head.html', 'preview-head.html', 'addons.js', 'config.js', {
      'ori': 'webpack.config.js',
      'dest': 'webpack.extend.config.js'
    }]);
    // override default dev config
    this.override(this.contextRoot, this.storybookConfigPath, ['tsconfig.json', {
      'ori': '.babelrc',
      'dest': 'babelrc.json'
    }]);
  }

  generateHttpHAREntry(httpHARPath) {
    if (!httpHARPath) {
      return false;
    }

    if (httpHARPath) {
      httpHARPath = _path2.default.join(this.contextRoot, httpHARPath);
    } else {
      httpHARPath = this.contextRoot;
    }

    if (!_fs2.default.existsSync(httpHARPath)) {
      return false;
    }

    let entries = [];
    _fs2.default.readdirSync(httpHARPath).filter(filename => !filename.match(/^\./)).forEach(filename => {
      const harHttpJson = require(_path2.default.join(httpHARPath, filename));
      entries.push(harHttpJson);
    });

    _fs2.default.writeFileSync(`${this.storybookConfigPath}/http-mock/https.json`, JSON.stringify({
      'log': {
        'version': '0.0.1',
        'creator': {
          'name': '@beisen/http-mocker',
          'version': '0.0.1'
        },
        'pages': {},
        'entries': entries
      }
    }, null, 2), 'utf8');
  }

  generateStoriesJs(cmpPaths) {
    return _ejs2.default.renderFile(_path2.default.join(__dirname, 'stories.ejs'), {
      'storyMetas': this.makeStoriesJson(cmpPaths)
    }, {}, (err, storiesjs) => {
      if (err) throw err;
      _fs2.default.writeFile(_path2.default.join(this.storybookConfigPath, 'stories.js'), storiesjs, err => {
        if (err) return console.log(err);
      });
    });
  }

  makeStoriesJson(cmpPaths) {
    return cmpPaths.map(contextRoot => {

      const packinfo = require(`${contextRoot}/package.json`);
      const examples = getExamples(contextRoot);
      const rc = new _readRc2.default({ contextRoot });

      let readme = '';
      if (_fs2.default.existsSync(`${contextRoot}/README.md`)) {
        readme = `require('${contextRoot}/README.md')`;
      }

      let stories = [];
      if (!examples.length) {
        stories.push({
          'name': 'default',
          'story': {
            'component': `require('${contextRoot}/src')`
          }
        });
      } else {
        stories = examples.map(exp => ({
          'name': exp.name,
          'story': {
            'component': `require('${contextRoot}/examples/${exp.name}')`
          }
        }));
      }

      return {
        'name': rc.get('name'),
        'stories': stories,
        'readme': readme
      };
    });
  }

  override(configPath, destinationPath, configs) {
    let retFilesPath = [];

    configs.forEach(config => {
      const { ori = config, dest } = config;
      const configFilePath = `${configPath}/${ori}`;

      if (_fs2.default.existsSync(configFilePath)) {
        _fs2.default.writeFileSync(_path2.default.join(destinationPath, dest || ori), _fs2.default.readFileSync(configFilePath, 'utf8'), 'utf8');
        retFilesPath.push(configFilePath);
      }
    });

    return retFilesPath;
  }

  clean() {
    _execa2.default.sync('rm', ['-rf', this.storybookConfigPath]);
  }
}

exports.default = ConfigConsumer;
const getExamples = exports.getExamples = contextRoot => {
  const epath = _path2.default.join(contextRoot, 'examples');

  if (!_fs2.default.existsSync(epath)) return [];

  return (0, _fs.readdirSync)(epath).map(name => _path2.default.join(epath, name)).filter(source => (0, _fs.lstatSync)(epath).isDirectory()).map(name => ({ 'name': name.split('\/')[name.split('\/').length - 1] })).filter(file => !file.name.match(/^\./));
};