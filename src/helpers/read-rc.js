
import fs from 'fs'
import Hjson from 'hjson'

const fileNames = [ '.bscpmrc', '.bscpmrc.json' ]

export const getPackageInfo = (workspace) => {
  const cpath = workspace || process.cwd()
  return fs.existsSync(`${cpath}/package.json`) && require(`${cpath}/package.json`) || {}
}

export const extractRCFromPakcage = (workspace) => {
  const cpath = workspace || process.cwd()
  const { maintainers = [], name, description } = getPackageInfo(workspace)

  const developers = maintainers.map(developer => developer.name)

  return {
    'name': name,
    'description': description,
    'developers': developers,
    'version': '',
    'team': 'Unknown',
    'components': [],
    'workspaces': [],
    'category': '',
    'device': '',
    'mock': {
      'https': ''
    }
  }
}

export default (workspace) => {
  let cpath = workspace || process.cwd()
  let packInfo = extractRCFromPakcage(workspace)
  let rc = {}
  for (let filename of fileNames) {
    if (fs.existsSync(`${cpath}/${filename}`)) {
      rc = Hjson.parse(fs.readFileSync(`${cpath}/${filename}`, 'utf-8'))
    }
  }
  return Object.assign(
    {},
    extractRCFromPakcage(workspace),
    rc
  )
}
