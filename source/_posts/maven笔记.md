---
title: maven笔记
date: 2018-01-11 23:24:21
tags: ['java']
---
以前也没有系统的看过maven的资料，一般就是用它来添加依赖，但最近惨遭maven的折磨，经常性的编译通过，但运行的时候出现`ClassNotFoundException`或者`NoClassDefFoundError`之类的错误，终于痛下决心，想系统的了解一下Maven的用法。
### 安装maven
maven的安装很简单，去官网下载压缩包之后解压，然后配置环境变量`M2_HOME` 和把`%M2_HOME%/bin`添加到`path`即可。 `MAVEN_OPTS`是用来调整jvm内存和持久代的不是必须要配置的。
### 创建maven项目
配置好maven的环境变量之后就可以使用命令行来创建maven项目，但个人感觉这样的方式还是比较麻烦的，还是使用`ide`直接生成比较简单。
### 项目结构
建好的项目目录结构如下
![image.png](/img/8297579-eb60ad2523fb18c7.png)
* `main`目录存放项目的主要代码
* `java`目录存放java代码
* `resources`目录存放配置文件
* `webapp`目录存放Web应用相关的代码
* `pom.xml`是项目的配置文件
### POM结构
刚建好的maven项目的的`pom.xml`文件是类似于这样的
```
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>tk.xmfaly</groupId>
  <artifactId>xmfdemo</artifactId>
  <packaging>war</packaging>
  <version>1.0-SNAPSHOT</version>
  <name>xmfdemo Maven Webapp</name>
  <url>http://maven.apache.org</url>
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <finalName>xmfdemo</finalName>
  </build>
</project>
```
从上到下
* `modelVersion`是`pom`的版本号，这个必须有，不需要修改
* `groupId`、`artifactId`、`version` 是maven项目的三坐标，可以在仓库中对应唯一的一个maven项目
* `packaging`是打包方式，默认不写是`jar`包方式
* `name`、`url`表示该项目的名称和url地址，可以省略
* `dependencies`是该项目的依赖关系，每一个`dependency`都代表着一个maven依赖
* `build`是与构建相关的配置，这里的`finalName`是用来配置构建之后的文件名字
### 生命周期
![image.png](/img/8297579-5b443d5904207367.png)
一个maven项目有9个生命周期，如果你使用ide应该可以很方便的看到这九个周期，并且可以快速的执行某个周期。
其实本质上每个周期都是一个或多个的`maven`插件在起作用，比如`compile`是由`maven-compile-plugin`这个插件在起作用。
每个周期的功能如下
* `clean` 清理自动生成的`target`目录
* `validate` 验证`pom.xml`文件是否有效
* `compile` 编译java代码
* `test` 运行测试代码
* `package` 项目打包
* `verify` 验证`package`打的包是否有效
* `site`生成项目的静态站点
* `deploy` 将打包的文件部署到远程仓库
### 依赖的作用域
一直以来我一直被这个作用域所困惑，很多时候就是作用于搞混了，导致一系列的问题。其实maven依赖的作用域也不是那么复杂，只是一直没有仔细的去看，去思考罢了。

|作用域|编译时有效|测试时有效|运行时有效|
|:--:|:--:|:--:|:--:|
|compile|&radic;|&radic;|&radic;|
|test||&radic;||
|runtime||&radic;|&radic;|
|provided|&radic;|&radic;||
|system|&radic;|&radic;||
作用域最好应用于他应该出现的地方，不应该出现的地方最好不要放上，否则会导致项目过大。
### 保存到本地仓库
可以将jar包保存到本地仓库，方便其他项目调用
```
    <distributionManagement>
        <repository>
            <id>localRepository</id>
            <url>file:C:\Users\xmfaly\.m2\repository</url>
        </repository>
    </distributionManagement>
```
运行`mvn deploy`即可部署

