# storybook

> 提供本地调试等命令，支持两个子命令：start，build

## Usage

```sh
$ sbl storybook start
$ sbl storybook build
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
