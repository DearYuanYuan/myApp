> # react-native 开发ios应用

### 前言 

react-native跨平台开发app，对于一些不熟悉设置不会苹果app开发语言的开发者是一个很大的帮助。毕竟，你只需要懂javascript和react就满足了开发react-native跨平台app的基本条件。RN的使用语法和react有很多类型设置是相同的地方，假如你做过react开发，或许一天就做一个具有基本功能的app demo。

### 创建一个RN项目

* 下载RN开发必须的插件

##### node 安装

> node.js目前需要5.0以上版本

##### 安装完node后需要设置npm镜像

> npm config set registry https://registry.npm.taobao.org --global

> npm config set disturl https://npm.taobao.org/dist --global

##### Yarn、React Native的命令行工具（react-native-cli）

Yarn是Facebook提供的替代npm的工具，可以加速node模块的下载。React Native的命令行工具用于执行创建、初始化、更新项目、运行打包服务（packager）等任务。
> npm install -g yarn react-native-cli

安装完yarn后同理也要设置镜像源：

> yarn config set registry https://registry.npm.taobao.org --global

> yarn config set disturl https://npm.taobao.org/dist --global

#### Xcode

React Native目前需要Xcode 8.0 或更高版本。你可以通过App Store或是到Apple开发者官网上下载。这一步骤会同时安装Xcode IDE和Xcode的命令行工具和ios模拟器。
>虽然一般来说命令行工具都是默认安装了，但你最好还是启动Xcode，并在Xcode | Preferences | Locations菜单中检查一下是否装有某个版本的Command Line Tools。Xcode的命令行工具中也包含一些必须的工具，比如git等。

* 环境搭建

> npm install react-native -----全局安装react-native

> react-native init AwesomeProject -------初始化一个react-native项目

> cd AwesomeProject --------进入创建的项目

> react-native run-ios --------启动项目

* 开发测试

> 使用你喜欢的编辑器打开App.js并随便改上几行。
> 在iOS Emulator中按下⌘-R就可以刷新APP并看到你的最新修改！

一个简单的RN项目已经搭建好了!








            







