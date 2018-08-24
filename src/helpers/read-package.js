
import fs from 'fs'

export default (pckPath) => fs.existsSync(pckPath) ? require(pckPath) : {}
