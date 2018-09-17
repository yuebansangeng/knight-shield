
import Generator from 'yeoman-generator'
import rsyncStroybookStatics from './rsync-stroybook-statics'

export default class extends Generator {
  writing () {
    const { contextRoot } = this.options
    rsyncStroybookStatics({ contextRoot })
      .catch(err => console.log(err))
  }
}
