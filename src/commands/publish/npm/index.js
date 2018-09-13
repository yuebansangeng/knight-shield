
import path from 'path'
import Generator from 'yeoman-generator'
import lernaPublish from '@lerna/publish'

export default class extends Generator {
  async writing () {
    const { independent, rc, contextRoot, onlyUpdated } = this.options

    // logger.enableProgress()

    // tracker = logger.newItem('publishing', 1)

    let p = lernaPublish({
      '_': [ 'publish' ],
		  'progress': true,
		  'ci': false,
		  'loglevel': 'info',
		  'composed': 'publish',
		  'lernaVersion': '3.1.2',
		  '$0': 'lerna'
		})

		p.execute()

    // tracker.finish()
  }
}
