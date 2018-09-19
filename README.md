
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
* [How It Works](#how-it-works)
* [Dependencies](#dependencies)
* [License](#license)


## About

在前端开发领域，业务开发普遍组件化。这种模式下，对源码的维护就有很大的挑战。目前有两种维护方式 [MONO](https://zhuanlan.zhihu.com/p/31289463) 与 [MULTI](https://zhuanlan.zhihu.com/p/31289463)。~MONO在源码管理，版本维护，和开发成本上的优势略大于MULTI~。在维护大量组件时，使用MONO既可以保证组件的独立性，又可以减少维护成本。

目前针对于MONO已经有了不少的管理工具，[Lerna](https://github.com/lerna/lerna) 是一个不错的管理工具，可以完全胜任MONO。但，对于前端组件开发领域，Lerna的配置和使用有些繁琐，也不利于集成进自己 [CI](https://github.com/knight-org/knight-shield/blob/master/demo/jenkins-pipeline) 任务中，为了在 **开发** 和 **集成** 时中更方便的管理组件 `knight-shield` 便由此产生

## Getting Started

### Installing
```sh
$ npm install @beisen/storybook-lib --save-dev
```
### Usage
```sh
$ npx sbl storybook start # 开发时对组件进行调试
$ npx sbl publish npm # 对组件进行批量发布
$ npx sbl buil lib # 编译组件生成lib
```

## How it Works
`knight-shield`提供了三大块功能：

### 调试
执行 `npx sbl storybook start` 命令即可开始调试，无需配置额外的配置文件 (*如: babelrc,webpack,tsconfig*)，项目配置文件已默认集成，如有自定义配置需求，可添加 [配置文件](https://github.com/knight-org/knight-shield/blob/master/demo/custom-configs) 到根目录下即可。详细见: [storybook](./src/commands/storybook#readme)

### 批量发布
执行 `npx sbl publish npm` 命令即可批量发布组件到NPM。详细见: [publish](./src/commands/publish#readme)

### 编译
执行 `npx sbl build lib` 命令可以批量编译组件，生成的 es5,css,images,.. 会放如组件的 lib/ 目录下。详细见: [build](./src/commands/build#readme)

## Dependencies
[Storybook](https://github.com/storybooks/storybook) 和 [Learn](https://github.com/lerna/lerna) 已助实现了部分功能。基于Storybook之上封装了一系列配件和功能实现了**调试功能**。基于了Lerna的内部模块(*@lerna/package, @lerna/package-graph, @lerna/output*)实现了**批量发布功能**

<p align="left">
  <img alt="Lerna" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/e6180c4dca55ac0e6d24.png" height="160px" with="210px" />
  <img alt="Storybook" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/6dd894cd5e025fdbff2d.png" height="120px" with="170px" />
</p>

## License

[MIT](https://github.com/storybooks/storybook/blob/master/LICENSE)

