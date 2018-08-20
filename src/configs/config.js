
import React from 'react'
import { storiesOf, configure } from '@storybook/react'
import { withReadme }  from 'storybook-readme'
import storieConfigs from './stories.js'
import { adapterFeth, adapterXHR } from '../helpers/http-mock'

adapterFeth()
adapterXHR()

configure(
  () => {
    storieConfigs.forEach(storieConfig => {
      // 获取配置项
      let { stories, name, readme } = storieConfig
      let storiesInstence = storiesOf(name, module)

      storiesInstence.addDecorator(withReadme([ readme ]))

      stories.forEach(({ name, story }) => {
        storiesInstence.add(name, () => <story.component />)
      })
    })
  },
  module
)
