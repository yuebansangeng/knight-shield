#!/usr/bin/env node

var Server = require('../lib/http-mocker/server');
(new Server ({
  'workspace': '/Users/zhangyue/Github/bscpm-packages-manager/packages/storybook-lib/src/http-mocker/server/', // process.cwd()
})).start()
