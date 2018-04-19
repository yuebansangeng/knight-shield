
import readme from '../README.md'


import Component0 from '../demos/default'
import config0 from '../demos/default/config'
config0.story.content = Component0

import Component1 from '../demos/popupform'
import config1 from '../demos/popupform/config'
config1.story.content = Component1


export default () => {
  return {
    name: 'MainRightLayout',
    'stories': [

      config0,

      config1,

    ],
    readme
  }
}
