# publish

提供本地调试等命令，支持一个子命令：**npm**。 npm子命令将模块发布到NPM

## Usage

```sh
$ sbl publish npm
```

### Options

### --independent

获取 [.bscpmrc](https://github.com/knight-org/knight-shield/blob/master/demo/.bscpmrc) 配置中的 `components` 和 `libs` 字段, 发布多个模块

```sh
$ sbl publish npm --independent
```

注意: `components`, `libs` 字段中的所有模块会一并发布到NPM，如果又私有模块不想发到NPM，可以使用 `privates` 字段

### --source

指定 `storybook start` 命令执行的组件路径

```sh
$ sbl publish npm --source ./src/components/button/
```

注意: --source命令一般配置全局安装使用，knight-shield安装在全局，指定--source参数即可发布指定目录下的组件

### --only-updated

增量发布组件

```sh
$ sbl publish npm --only-updated --independent
```

注意：--only-updated 参数一般结合 --independent 参数使用，用于实现组件的批量发布
