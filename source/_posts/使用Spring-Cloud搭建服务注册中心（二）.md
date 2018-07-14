---
title: 使用Spring Cloud搭建服务注册中心（二）
date: 2017-12-23 21:58:36
tags: ['Spring Cloud']
---
接上篇
### 服务提供
现在我们搭建一个简单的服务，访问 /hello 并传入参数 返回 “hello  xxx” 字符串。
先建一个boot工程添加如下依赖
```
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
		<spring-cloud.version>Edgware.RELEASE</spring-cloud.version>
	</properties>

		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-eureka</artifactId>
		</dependency>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>${spring-cloud.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>
```

配置文件
```
spring.application.name=spring-cloud-producer
server.port=8085
eureka.client.serviceUrl.defaultZone=http://localhost:8080/eureka/
```
`spring.application.name` 服务名
`server.port` 该应用端口号
`eureka.client.serviceUrl.defaultZone` 服务中心地址
在启动类前加上`@EnableDiscoveryClient`注解
```
@SpringBootApplication
@EnableDiscoveryClient
public class ProducerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProducerApplication.class, args);
	}
}
```
现在我们实现服务。
```
@RestController
public class HelloController {

    @GetMapping("/hello")
    public Object hello(@RequestParam String name){
        return "hello " + name;
    }
}
```
### 服务调用
先建一个Boot项目，依赖和服务提供者相同。
配置文件
```
spring.application.name=spring-cloud-consumer
server.port=8085
eureka.client.serviceUrl.defaultZone=http://localhost:8000/eureka/
```
在启动类前加上 `@EnableDiscoveryClient
和@EnableFeignClients`注解
```
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class ConsumerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConsumerApplication.class, args);
	}
}
```
调用hello的接口
```
@FeignClient(name = "spring-cloud-producer")
public interface HelloRemote {

    @GetMapping("/hello")
    String hello(@RequestParam(name = "name") String name);
}

```
控制器
```
@RestController
public class HelloController {

    @Autowired
    HelloRemote helloRemote;

    @GetMapping("/hello/{name}")
    public Object hello(@PathVariable(name = "name") String name){
        return helloRemote.hello(name);
    }
}

```
