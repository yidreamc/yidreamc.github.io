---
title: 关于docker部署spring-boot的尝试
date: 2018-04-01 07:41:02
tags:
---
最近搬家一个服务器，发现要安装好多好多的环境，相当麻烦。
以前我也经常重装电脑，后来觉得麻烦就把我的开发环境都弄到了虚拟机里面，一方面linux环境，另一方面也不用反复重装。想到这里我想到了被我遗忘很久的docker了。
可以在服务器上只安装docker，然后以后环境什么的不用我考虑了。

先用我最常用的spring-boot尝试一下，以后再部署其他的。在这里记录一下过程。

### 添加maven构建插件
```
	<properties>
		<docker.image.prefix>xmfaly</docker.image.prefix>
	</properties>
<plugin>
				<groupId>com.spotify</groupId>
				<artifactId>docker-maven-plugin</artifactId>
				<version>0.4.11</version>
				<configuration>
					<imageName>${docker.image.prefix}/${project.artifactId}</imageName>
					<dockerDirectory>src/main/docker</dockerDirectory>
					<resources>
						<resource>
							<targetPath>/</targetPath>
							<directory>${project.build.directory}</directory>
							<include>${project.build.finalName}.jar</include>
						</resource>
					</resources>
				</configuration>
			</plugin>
```

### 建立Dockerfile
```
FROM java:8
VOLUME /log
ADD *.jar app.jar
RUN sh -c 'touch /app.jar'
EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar >>/log/out" ]
```

### 部署脚本
因为我是本地虚拟机linux环境。所以我需要先从git拉最新的。
```
#!/bin/bash


#docker 用户名
USER_NAME=
# 项目名称
PROJ_NAME=
# 服务器用户名
SERVER_NAME=
# 服务器地址
SERVER_HOST=
# 部署端口
DEPLOY_PORT=

# 停止原来的容器
# docker stop $PROJ_NAME

# 删除原来的容器和镜像
docker rm $PROJ_NAME
docker rmi $USER_NAME/$PROJ_NAME

#拉取更新
git pull

# 本地构件镜像
./mvnw package -Dmaven.test.skip=true docker:build

# 上传镜像到远程仓库
docker push $USER_NAME/$PROJ_NAME

# 连接服务器
ssh $SERVER_NAME@$SERVER_HOST -tt << cmd

# 停止原来的容器
docker stop $PROJ_NAME

# 删除原来的容器
docker rm $PROJ_NAME

# 拉取最新的镜像
docker pull $USER_NAME/$PROJ_NAME

# 运行容器
docker run --name=$PROJ_NAME -p $DEPLOY_PORT:8080 -v /root/log/:/log/ -t $USER_NAME/$PROJ_NAME

cmd


```
