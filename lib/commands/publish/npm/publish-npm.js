'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _npmPublish = require('@lerna/npm-publish');

var _npmPublish2 = _interopRequireDefault(_npmPublish);

var _runParallelBatches = require('@lerna/run-parallel-batches');

var _runParallelBatches2 = _interopRequireDefault(_runParallelBatches);

var _logger = require('../../../helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// lernarc npm config
const lernarc = {
  'npmConfig': {
    'npmClient': 'npm'
  }
};
const distTag = 'bscpm-tag';
const concurrency = 10;

exports.default = o => {
  let { packages } = o;

  const tracker = _logger2.default.newItem(`${lernarc.npmConfig.npmClient} publish`);
  tracker.addWork(packages.length);

  (0, _runParallelBatches2.default)(packages, concurrency, pkg => (0, _npmPublish2.default)(pkg, distTag, lernarc.npmConfig)
  // postpublish is _not_ run when publishing a tarball
  // .then(() => this.runPackageLifecycle(pkg, "postpublish"))
  .then(() => {
    tracker.info('published', pkg.name);
    tracker.completeWork(1);
  }));
};

module.exports = exports['default'];