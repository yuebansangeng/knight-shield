#!/usr/bin/env node

const yeomanEnv = require('yeoman-environment')
const argv = require('minimist')(process.argv.slice(2))

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/commands/storybook'), 'storybook')

const { source, port } = argv

env.run(`storybook start`, { source, port })
