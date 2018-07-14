---
title: Spring Boot 读取配置文件中的List数据
date: 2017-12-22 21:02:26
tags: ['java','Spring Boot']
---
在一个项目中需要配置一个允许请求的服务器列表，不想把这个列表直接写在代码里，希望写到配置文件里，于是查了一下Spring Boot 如何读取配置文件中的List数据。记录在这里，以后可能还会用到。
配置如下。
```
front:
  servers:
    - name: server1
      url: http://server1.com
    - name: server2
      url: http://server2.com

```
建立Dto
```
public class Server {
    private String name;
    private String url;
    // setter and getter
}
```
配置相关读取类
```
@Component
@ConfigurationProperties(prefix = "front")
public class ServersConfig {

    List<Server> servers = new ArrayList<>();

    public List<Server> getServers() {
        return servers;
    }

    public void setServers(List<Server> servers) {
        this.servers = servers;
    }
}
```
这里的servers 对应配置文件里的servers
