
import readme from '../README.md'
import os from 'object-assign'


import Component0 from '../demos/default'

import Component1 from '../demos/popupform'


let defaultConfig = {
  'editableProps': []
}

export default {
  name: "MainRightLayout",
  'stories': [

    {
      name: 'default',
      story: os({
        'content': Component0
      }, os({}, defaultConfig))
    },

    {
      name: 'popupform',
      story: os({
        'content': Component1
      }, os({}, defaultConfig))
    },

  ],
  readme
}
