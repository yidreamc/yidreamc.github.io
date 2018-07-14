---
title: spring boot 配置 https|ssl
date: 2017-11-08 17:52:00
tags: ['java']
---
ssl证书我选择了免费的[Let's Encrypt](https://letsencrypt.org/)
### 1.下载脚本并生成证书
```
# git clone https://github.com/letsencrypt/letsencrypt
# cd letsencrypt
# ./letsencrypt-auto certonly --standalone --email 邮箱 -d 域名
```
因为网络问题pip可能需要换源，请自行网上查找换源方法。
### 2.设置自动延期
```
# ./letsencrypt-auto --renew certonly --email 邮箱 -d 域名
```
### 3.查看证书
```
# cd /etc/letsencrypt/live/
# cd 域名
fullchain.pem 为证书  privatkey.pem 为密钥
```
### 4.生成.jks证书
```
# openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out fullchain_and_key.p12 -name tomcat
# keytool -importkeystore -deststorepass 'yourJKSpass' -destkeypass 'yourKeyPass' -destkeystore MyDSKeyStore.jks -srckeystore fullchain_and_key.p12 -srcstoretype PKCS12 -srcstorepass 'yourPKCS12pass' -alias tomcat
```
第一步会让你输入密码，对应第二步中的yourPKCS12pass 。第二步中的前两个密码自己设置一下并记好，下面的会用到。
### 5.配置spring-boot
将.jsk文件放到```resources```文件夹下然后在配置文件中加上
```
server.port = 8443
server.ssl.key-store = classpath:MyDSKeyStore.jks
server.ssl.key-store-password = yourJKSpass
server.ssl.key-password = yourKeyPass
```
此时服务器支持https，但只支持https
可以配置同时支持htttp
```
@Bean
public Integer port() {
    return 8080;
    //return SocketUtils.findAvailableTcpPort();
}
@Bean
public EmbeddedServletContainerFactory servletContainer() {
    TomcatEmbeddedServletContainerFactory tomcat = new 					  TomcatEmbeddedServletContainerFactory();
    tomcat.addAdditionalTomcatConnectors(createStandardConnector());
    return tomcat;
}
private Connector createStandardConnector() {
    Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
    connector.setPort(port());
    return connector;
}
```
这样 8080端口是http 8443端口是https
也可以设置http自动重定向到https
```
@Value("${server.port}")
   private int port;
@Bean
   public EmbeddedServletContainerFactory servletContainer() {
       TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory() {
           @Override
           protected void postProcessContext(Context context) {
               SecurityConstraint securityConstraint = new SecurityConstraint();
               securityConstraint.setUserConstraint("CONFIDENTIAL");
               SecurityCollection collection = new SecurityCollection();
               collection.addPattern("/*");
               securityConstraint.addCollection(collection);
               context.addConstraint(securityConstraint);
           }
       };
       tomcat.addAdditionalTomcatConnectors(initiateHttpConnector());
       return tomcat;
   }
   private Connector initiateHttpConnector() {
       Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
       connector.setScheme("http");
       connector.setPort(8080);
       connector.setSecure(false);
       connector.setRedirectPort(port);
       return connector;
   }
```


