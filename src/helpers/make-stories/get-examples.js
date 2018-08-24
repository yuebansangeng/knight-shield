
import path from 'path'
import fs, { readdirSync, lstatSync } from 'fs'

export default (contextRoot) => {
  const epath = path.join(contextRoot, 'examples')
  if (!fs.existsSync(epath)) return []

  return readdirSync(epath)
    .map(name => path.join(epath, name))
    .filter(source => lstatSync(epath).isDirectory())
    .map(name => ({ 'name': name.split('\/')[name.split('\/').length - 1] }))
    .filter(file => !file.name.match(/^\./))
}
