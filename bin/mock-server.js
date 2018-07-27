#!/usr/bin/env node

var Server = require('../lib/http-mocker/server');
(new Server ({
  'workspace': process.cwd()
})).start()
