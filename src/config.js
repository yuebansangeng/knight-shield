
import { storiesOf, configure } from '@storybook/react'

import { withKnobs } from '@storybook/addon-knobs/react';
import { withDocs }  from 'storybook-readme'
import { stories, readme, name } from './stories.js'

import handleType from './util'

import React from 'react'
window.React = React

configure(
  () => {
    let storiesInstence = storiesOf(name, module)
    storiesInstence.addDecorator(withKnobs);
    stories.forEach(({ name, story }) => {
      const { content: Component, editableProps } = story
      storiesInstence.add(name, withDocs(readme, () => {
        const params = handleType(editableProps)
    	 	return <Component {...params} />
    	}))
    })
  },
  module
)
