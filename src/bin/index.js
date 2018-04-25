
const shelljs = require('shelljs')

// cpath 组件调用命令传入的路径
let [ a, b, cpath ] = process.argv

// 判断组件内部是否配置storybooks配置
// 配置了则不适用内部的 storybook-lib config
if (fs.existsSync(path.join(cpath, '.storybook'))) {
  shelljs.exec(`start-storybook -s . -p 9001 -c ${cpath}/.storybook`)
} else {
  shelljs.exec(`start-storybook -s . -p 9001 -c ../.config.js`)
}
