---
title: spring-boot注入静态变量
date: 2018-04-06 11:24:41
tags:
---
之前遇到过一次，当时刚开始玩spring-boot不知道该怎么搜索关键字没解决，今天又遇到了。
一个项目需要配置一个系统代理，需要在spring的启动文件里配置，因为代码是开源的，但代理的地址我不太想让别人看到，写到配置文件里注入的时候遇到了困难。
知道关键字之后解决起来其实蛮简单的。
```
public static String proxyHost;

public static String proxyPort;

@Value("${socket.host}")
private String host;

@Value("${socket.port}")
private String port;

@PostConstruct
public void initData(){
    proxyHost = host;
    proxyPort= port;
}
```
这种方法实验证明是可以的。但由于框架启动反射顺序的原因，这些变量必须放到别的java文件里，不能直接放到spring的启动文件里面。
网上还有一种思路

```
public static String proxyHost;

public static String proxyPort;

@Value("${socket.host}")
public static void setProxyHost(String proxyHost) {
    TestConfig.proxyHost = proxyHost;
}

@Value("${socket.port}")
public static void setProxyPort(String proxyPort) {
    TestConfig.proxyPort = proxyPort;
}
```
经过实验证明不可行。
