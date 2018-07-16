
import fs from 'fs'

let screenshot = (storyhandler) => storyhandler
let initscreenshot = () => {}
let storybookChromeScreenshot = {}

// 检测是否安装了全局是否安装了屏幕截图的
// 客户端不安装该模块，Jenkins构建端会在全局安装此模块，意图是减少客户端安装无用的大体积的模块
if (fs.existsSync(`${process.cwd()}/node_modules/storybook-chrome-screenshot`)){
  storybookChromeScreenshot = require('storybook-chrome-screenshot')
  screenshot = require('storybook-chrome-screenshot').withScreenshot
  initScreenshot = require('storybook-chrome-screenshot').initScreenshot
}

export default storybookChromeScreenshot
export const withScreenshot = screenshot
export const initScreenshot = initscreenshot
