# storybook

提供本地调试等命令，支持两个子命令：**start**，**build**。 start子命令用于调试组件的示例，build命令用于生成组件示例的静态资源站点

注意：build命令主要用于CI构建时使用发布组件示例时使用

## Usage

```sh
$ sbl storybook [ start, build ]
```
开启本地调试

### --independent

获取 [.bscpmrc]() 配置中的 `components` 字段, 调试多个组件示例

```sh
$ sbl storybook start --independent
```

注意: `components` 字段是数据，数据是字符串，使用glog规范获取组件路径

### --source

指定 `storybook start` 命令执行的组件路径

注意: --source命令一般配置全局安装使用，knight-shield安装在全局，指定--source参数即可调试指定目录下的组件

### --prot

指定调试服务使用的端口

### --only-updated

增量构建的组件的静态资源站点

注意：--only-updated参数只在 `sbl storybook build` 命令下可用
