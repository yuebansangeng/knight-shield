#!/usr/bin/env node

const yeomanEnv = require('yeoman-environment')

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/commands/storybook'), 'storybook')

env.run(`storybook build`, { })
