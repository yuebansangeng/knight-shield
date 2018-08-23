#!/usr/bin/env node

// 向前兼容，不推荐使用该方式
// 推荐的使用方式 sbl storybook start --prot [?] --source [?]

const yeomanEnv = require('yeoman-environment')

const env = yeomanEnv.createEnv()
  .register(require.resolve('../lib/commands/storybook'), 'storybook')

env.run(`storybook build`, { })
