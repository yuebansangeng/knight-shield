
import React from 'react'
import { storiesOf, configure } from '@storybook/react'
import { withReadme }  from 'storybook-readme'
import { mockServer } from '@beisen/addon-mock-server'
import storieConfig from './stories.js'

configure(
  () => {
    // 获取配置项
    let { stories, name, readme } = storieConfig

    let storiesInstence = storiesOf(name, module)
    storiesInstence.addDecorator(withReadme([ readme ]))
    storiesInstence.addDecorator(mockServer)

    stories.forEach(({ name, story }) => {
      storiesInstence.add(name, () => <story.component />)
    })
  },
  module
)
