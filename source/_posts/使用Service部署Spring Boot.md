---
title: 使用Service部署Spring Boot
date: 2017-10-06 17:04:41
tags: ['spring']
---
####  手动部署
Spring Boot 的部署很简单，无论使用maven还是gradle构建成jar包之后，上传到服务器上，运行 ` java -jar *.jar ` 即可完成简单的部署。如果想使用外部的配置文件直接在后面加参数就行了  ` --spring.config.location=application-production.yml `  如果想关闭终端还在后台启动的话加上 nohup 就可以了 
` nohup java -jar *.jar  --spring.config.location=application-production.yml `
#### 杀掉进程
普通情况只要关闭终端或ctrl+c即可结束应用，如果使用nohup部署的话先要找到进程号，然后杀掉进程。
```
lsof -i:8080
COMMAND  PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
java    2417 root   26u  IPv6 1672621      0t0  TCP *:webcache (LISTEN)
kill -9 2417
```
#### 使用service
如果每一次部署和杀死都要手动的话，频率多了其实也挺麻烦的，可以使用脚本来解决这个问题。
在 `etc/init.d` 先建一个脚本，把这个项目作为service来运行
例如 新建` etc/init.d/test `
内容如下
```
#!/bin/sh
SERVICE_NAME=test
HOME=/root/webserver/test
PATH_TO_JAR=$HOME/*.jar
PID_PATH_NAME=/tmp/test.pid

LOG=$HOME/production.log
ERROR_LOG=$HOME/production.err
CONFIG=$HOME/application-production.yml
case $1 in
    start)
        echo "Starting $SERVICE_NAME ..."
        if [ ! -f $PID_PATH_NAME ]; then
            cd $HOME
            nohup java -jar $PATH_TO_JAR --spring.config.location=application-production.yml > $LOG 2> $ERROR_LOG &
                        echo $! > $PID_PATH_NAME
            echo "$SERVICE_NAME started ..."
        else
            echo "$SERVICE_NAME is already running ..."
        fi
    ;;
    stop)
        if [ -f $PID_PATH_NAME ]; then
            PID=$(cat $PID_PATH_NAME);
            echo "$SERVICE_NAME stoping ..."
            kill $PID;
            echo "$SERVICE_NAME stopped ..."
            rm $PID_PATH_NAME
        else
            echo "$SERVICE_NAME is not running ..."
        fi
    ;;
    restart)
        if [ -f $PID_PATH_NAME ]; then
            PID=$(cat $PID_PATH_NAME);
            echo "$SERVICE_NAME stopping ...";
            kill $PID;
            echo "$SERVICE_NAME stopped ...";
            rm $PID_PATH_NAME
            echo "$SERVICE_NAME starting ..."
            cd $HOME/current
            nohup java -jar $PATH_TO_JAR --spring.config.location=application-production.yml > $LOG 2> $ERROR_LOG &
                        echo $! > $PID_PATH_NAME
            echo "$SERVICE_NAME started ..."
        else
            echo "$SERVICE_NAME is not running ..."
        fi
    ;;
esac
```
保存脚本
赋予脚本可执行权限 `sudo chmod +x  etc/init.d/test`
把需要部署的jar包放到脚本中`HOME`的目录下，然后就可以使用service的方式部署或杀死项目了。
```
sudo service test start
sudo service test stop
sudo service test restart
```