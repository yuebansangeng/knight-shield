
import React from 'react'
import { storiesOf, configure } from '@storybook/react'
import { withReadme }  from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/react'
import storieConfig from './stories.js'

configure(
  () => {
    // 获取配置项
    let { stories, name, readme } = storieConfig

    let storiesInstence = storiesOf(name, module)
    storiesInstence.addDecorator(withKnobs);
    storiesInstence.addDecorator(withReadme([ readme ]))

    stories.forEach(({ name, story }) => {
      const { content: Component, editableProps, doc = '' } = story
      storiesInstence.add(name, () => {
        return <Component />
      })
    })
  },
  module
)
