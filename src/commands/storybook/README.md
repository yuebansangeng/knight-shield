# storybook

提供本地调试等命令，支持两个子命令：**start**，**build**。 start子命令用于调试组件的示例，build命令用于生成组件示例的 [静态资源站点](https://github.com/knight-org/knight-shield/blob/master/demo/build.png)

注意：build命令主要用于CI构建时使用发布组件示例时使用, 该功能主要用于 [文档服务化体系]() 中的组件示例发布，支持线上其他开发者预览

## Usage

```sh
$ sbl storybook [ start, build ]
```

### Options

### --independent

获取 [.bscpmrc](https://github.com/knight-org/knight-shield/blob/master/demo/.bscpmrc) 配置中的 `components` 字段, 调试多个组件示例

```sh
$ sbl storybook start --independent
```

注意: `components` 字段是数据，数据是字符串，使用glog规范获取组件路径

### --source

指定 `storybook start` 命令执行的组件路径

```sh
$ sbl storybook start --source ./src/components/button/
```

注意: --source命令一般配置全局安装使用，knight-shield安装在全局，指定--source参数即可调试指定目录下的组件

### --port

指定调试服务使用的端口，默认使用 9001 端口

```sh
$ sbl storybook start --port 9002
```

### --only-updated

增量构建的组件的静态资源站点

```sh
$ sbl storybook build --only-updated --independent
```

注意：--only-updated参数只在 `sbl storybook build` 命令下可用。一般结合 --independent 参数使用，用于实现组件的批量发布
