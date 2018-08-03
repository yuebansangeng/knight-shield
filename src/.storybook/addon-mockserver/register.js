import React from 'react'
import addons from '@storybook/addons'

import Panel from './components/panel'

const ADDON_ID = 'storybook-addon-mockserver'
const PANEL_ID = `${ADDON_ID}/addon-panel`

const addChannel = api => {
  const channel = addons.getChannel()

  addons.addPanel(PANEL_ID, {
    title: 'MockServer',
    render() {
      return <Panel channel={channel} api={api} />
    },
  })
}

const init = () => {
  addons.register(ADDON_ID, addChannel)
}

export { init, addChannel }
