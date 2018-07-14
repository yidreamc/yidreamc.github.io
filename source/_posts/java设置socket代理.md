---
title: java设置socket代理
date: 2017-12-22 23:35:05
tags: ['java']
---
因为一个服务的请求地址被限制死了在服务器上，本地开发非常不方便，本来打算用转发解决的，但是想到服务器上有之前搭建的ss服务，于是查了一下可以直接设置socket代理解决这个问题。
```
String proxyHost = "127.0.0.1";
String proxyPort = "1080";

System.setProperty("http.proxyHost", proxyHost);
System.setProperty("http.proxyPort", proxyPort);

System.setProperty("https.proxyHost", proxyHost);
System.setProperty("https.proxyPort", proxyPort);

```
其他代理设置方法 https://docs.oracle.com/javase/8/docs/technotes/guides/net/proxies.html
