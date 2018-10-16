#!/usr/bin/env node

const yeomanEnv = require('yeoman-environment')
const argv = require('minimist')(process.argv.slice(2))

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/commands/build'), 'build')

env.run(`build lib`, { })
