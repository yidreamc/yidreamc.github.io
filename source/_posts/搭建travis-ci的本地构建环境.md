---
title: 搭建travis-ci的本地构建环境
date: 2018-8-20 21:58:36
tags:
---
前端项目我一直是用travis-ci实现ci/cd的，平时出现的一些错误在日志上都可以直接看到，然后调整解决就行，但今天这个错误在web页的日志上无法看出来，而且我在本地环境构建没有任何问题，于是我想在本地搭建一个travis-ci的构建环境来看一下到底是哪里的错误。  
从官方那里可以找到docker镜像，但是感觉还不是很完善，需要手动的地方还有很多，而且坑也不少。  
这里我直接给出到今天为止可以使用的步骤，因为我觉得一方面他们的docker镜像应该还会进一步完善，还可以再方便一点，另一方面各依赖软件的支持成都很大程度上也会影响构件过程。 
我构建的是node的环境，在这里我只讨论主要步骤，类似于换源，网络,linux或者其他docker问题不在本文的讨论范围之内。 
```
# 运行容器
docker run -it --name=travis travisci/ci-garnet:packer-1512502276-986baf0 bash

su - travis

# 安装ruby
rvm install 2.3.0 
rvm use 2.3.0

# 构建travis构建工具
cd builds
git clone https://github.com/travis-ci/travis-build.git
cd travis-build
gem install travis
# 创建.travis
travis
ln -s `pwd` ~/.travis/travis-build
bundle install
bundler add travis       
sudo mkdir bin           
sudo chmod a+w bin/       
bundler binstubs travis  

# 克隆自己的项目生成构建脚本
cd ~/builds
git clone -b dev https://github.com/yidreamc/todo
cd todo
~/.travis/travis-build/bin/travis compile > ci.sh

# 运行构建脚本
bash ci.sh
```
这样就可以在本地搭建一个travis-ci的构建环境，方便调试和测试。

最后我找到了错误，几个语法不规范导致了构建失败，我本地可以构建成功，远程失败，我估计在构建的过程中travis-ci会调用类似与eslint之类的东西进行代码审查吧，不通过直接pass掉。

文章参考[How to reproduce a travis-ci build environment for debugging](https://stackoverflow.com/questions/29753560/how-to-reproduce-a-travis-ci-build-environment-for-debugging)
