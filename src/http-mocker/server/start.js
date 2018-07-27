#!/usr/bin/env node

import Server from './'

var server = new Server ({
  'workspace': process.cwd()
})

server.start()
