
<p align="center">
  <img alt="Shield" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/baf8019f3a541823d42a.png" height="400px" with="700px" />
</p>

<p align="center">
  A tool for debug and publish UI components.
</p>

* [About](#about)
* [Getting Started](#getting-started)
* Commands
  - [`storybook`](./src/commands/storybook#readme)
  - [`publish`](./src/commands/publish#readme)
  - [`build`](./src/commands/build#readme)
* [Monorepo Project](#monorepo-project)
* [Dependencies](#dependencies)
* [Developers](#developers)
* [License](#license)

## About

在前端开发领域，业务开发普遍组件化。这种模式下，对源码的维护就有很大的挑战。目前有两种维护方式 [MONO](https://zhuanlan.zhihu.com/p/31289463) 与 [MULTI](https://zhuanlan.zhihu.com/p/31289463)。在维护大量组件时，使用MONO既可以保证组件的独立性，又可以减少维护成本。

目前针对于MONO已经有了不少的管理工具，[Lerna](https://github.com/lerna/lerna) 是一个不错的管理工具。但，对于前端组件开发领域，Lerna的配置和使用有些繁琐，也不利于集成进自己 [CI](https://github.com/knight-org/knight-shield/blob/master/demo/jenkins-pipeline) 任务中，为了在 **开发** 和 **集成** 时中更方便的管理组件 `knight-shield` 便由此产生

## Getting Started

### Installing
```sh
$ npm install @beisen/storybook-lib --save-dev
```
### Usage
```sh
$ npx sbl storybook start # 组件调试
```
```sh
$ npx sbl publish npm # 发布组件
```
```sh
$ npx sbl buil lib # 编译lib
```

## Monorepo Project

使用 `sbl storybook` 功能可以很方便的调试组件。但，在某些场景下往往需要和项目中其他的代码进行联合调试。在这种场景下可以结合 `yarn`，使用其提供的 [workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/) 功能

### Project Structure

<img alt="monorepo" src="./demo/monorepo.png"  />

在 components/ 中的组件都是MONO的维护方式，是独立的模块。在复杂项目中可能会存在MONO中模块互相依赖的情况，使用yarn的 `link:` 协议创建依赖
```json
{
  "dependencies": {
    "button": "link:../button"
  }
}
```
项目中的非MONO模块代码如需引用MONO中的模块，可直接使用 `./src/**/js` 方式引用即可，如上图所示 pages 对 button-group 的引用

**注意**：整个项目是一个大版本，项目的维护者完全不要关心子模块的版本。因屏蔽子模块的版本号，减少了开始者在维护子模块互相依赖时更新版本号带来的成本

### CI

对于项目开发来说，无论是MONO模块还是非MONO模块，只需要修改源代码即可。执行 git push 之后，在执行jenkins任务时，添加 `npx sbl publish npm --independent --only-updated` 实现增量发布MONO中的模块，子模块的版本使用的是项目的版本号

## Dependencies
[Storybook](https://github.com/storybooks/storybook) 和 [Learn](https://github.com/lerna/lerna) 已助实现了部分功能。基于Storybook之上封装了一系列配件和功能实现了**调试功能**。基于了Lerna的内部模块(*@lerna/package, @lerna/package-graph, @lerna/output*)实现了**组件发布功能**

<p align="left">
  <img alt="Lerna" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/e6180c4dca55ac0e6d24.png" height="120px" with="150px" />
  <img alt="Storybook" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/6dd894cd5e025fdbff2d.png" height="110px" with="130px" />
</p>

## Developers
<p align="left">
  <a href="https://github.com/zygeilit">
    <img alt="zhangyue" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/d791c661693edc1ace6a.png" height="60px" with="60px" />
  </a>
  <a href="https://github.com/holly-juan">
    <img alt="liuhuijuan" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/d591ed1070d5baa859a1.png" height="60px" with="60px" />
  </a>
  <a href="https://github.com/yuebansangeng">
    <img alt="liumingyuan" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/37172c625246d48d2b3e.png" height="60px" with="60px" />
  </a>
</p>

## License

[MIT](https://github.com/storybooks/storybook/blob/master/LICENSE)

