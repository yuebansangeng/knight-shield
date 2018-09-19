# publish

提供本地调试等命令，支持一个子命令：**npm**。 npm子命令将组件发布到NPM

## Usage

```sh
$ sbl publish npm
```

### Options

### --independent

获取 [.bscpmrc](https://github.com/knight-org/knight-shield/blob/master/demo/.bscpmrc) 配置中的 `components` 字段, 调试多个组件示例

```sh
$ sbl publish npm --independent
```

注意: `components` 字段是数据，数据是字符串，使用glog规范获取组件路径

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
