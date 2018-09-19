# publish

提供本地调试等命令，支持一个子命令：**lib**。 lib子命令将编译组件源代码到lib/目录下

## Usage

```sh
$ sbl build lib
```

### Options

### --independent

获取 [.bscpmrc](https://github.com/knight-org/knight-shield/blob/master/demo/.bscpmrc) 配置中的 `components` 和 `libs` 字段, 编译多个模块

```sh
$ sbl build lib --independent
```

注意: `components`, `libs` 字段中的所有模块会一并编译

### --source

指定 `storybook start` 命令执行的组件路径

```sh
$ sbl publish npm --source ./src/components/button/
```

注意: --source命令一般配置全局安装使用，knight-shield安装在全局，指定--source参数即可发布指定目录下的组件

### --watch

监听源码变更的组件，变更后重新编译

```sh
$ sbl build lib --watch
```

### --only-updated

增量发布组件

```sh
$ sbl publish npm --only-updated --independent
```

注意：--only-updated 参数一般结合 --independent 参数使用，用于实现组件的批量编译
