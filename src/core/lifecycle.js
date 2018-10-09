
import execa from 'execa'
import ReadRC from './read-rc'
import stringTemplate from 'es6-template-strings'
import logger from '../helpers/logger'

export default class Lifecycle {

  constructor(props) {
    this.contextRoot = props.contextRoot
    this.lifecycle = this.getLifecycleScripts(this.contextRoot)
    this.env = {
      'PACKAGE_LOCATION': this.contextRoot
    }
  }

  getLifecycleScripts(contextRoot) {
    const rc = new ReadRC({ contextRoot })
    const lifecycle = rc.get('lifecycle')
    const res = {}
    Object.keys(lifecycle).forEach(lc => {
      res[lc] = lifecycle[lc]
    })
    return res
  }

  run(script, opts = {}) {
    if (!this.lifecycle[script]) return

    // replace str-temp, if have
    // use default env first
    const command = stringTemplate(this.lifecycle[script], Object.assign({}, this.env, opts.env))

    execa.shellSync(command, Object.assign({
      'cwd': this.contextRoot,
      'env': this.env,
      'stdout': 'inherit'
    }, opts))
  }
}
