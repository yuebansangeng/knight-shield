
<p align="center">
  <img alt="Shield" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/baf8019f3a541823d42a.png" height="400px" with="700px" />
</p>

<p align="center">
  A tool for debug and publish UI components.
</p>

* [About](#about)
* [Getting Started](#getting-started)
* Commands
  - [`sbl storybook`](./src/commands/storybook#readme)
  - [`sbl build`](./src/commands/build#readme)
  - [`sbl publish`](./src/commands/publish#readme)
* [Concepts](#concepts)
* [Dependencies](#dependencies)
* [License](#license)


## About

* 在前端领域，业务开发逐渐的由项目与页面颗粒度的开发转变为组件化的方式，每个组件都独立使用。这种模式下，对源码的维护就有了比较大的挑战。目前项目源码维护有两种方式 MONO 与 MULTI，MONO在源码管理，版本维护，和开发成本上的优势大于 MULTI。在维护大量组件时，使用MONO的源码维护方案，既可以保证组件的独立性，又可以减少维护成本
* 批量编译（libs）
* 在项目统一管理多组件（批量调试，批量发布）

## Getting Started

```sh
$ npm install @beisen/storybook-lib --save-dev
$ npx sbl storybook start
```

## Concepts
* 组件调试
* 多组件管理模式
* 文档服务化

## Dependencies
<p align="left">
  <img alt="Lerna" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/e6180c4dca55ac0e6d24.png" height="160px" with="210px" />
  <img alt="Storybook" src="http://lc-cj3ctxdw.cn-n1.lcfile.com/6dd894cd5e025fdbff2d.png" height="120px" with="170px" />
</p>

## License

[MIT](https://github.com/storybooks/storybook/blob/master/LICENSE)

