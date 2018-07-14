---
title: 使用Spring Cloud搭建服务注册中心（一）
date: 2017-12-22 20:14:56
tags: ['spring cloud']
---
### 什么是Spring Cloud
Spring Cloud是一系列框架的有序集合。它利用Spring Boot的开发便利性巧妙地简化了分布式系统基础设施的开发，如服务发现注册、配置中心、消息总线、负载均衡、断路器、数据监控等，都可以用Spring Boot的开发风格做到一键启动和部署。Spring并没有重复制造轮子，它只是将目前各家公司开发的比较成熟、经得起实际考验的服务框架组合起来，通过Spring Boot风格进行再封装屏蔽掉了复杂的配置和实现原理，最终给开发者留出了一套简单易懂、易部署和易维护的分布式系统开发工具包。
### Spring Cloud优势
Spring Cloud对于中小型互联网公司来说是一种福音，因为这类公司往往没有实力或者没有足够的资金投入去开发自己的分布式系统基础设施，使用Spring Cloud一站式解决方案能在从容应对业务发展的同时大大减少开发成本。同时，随着近几年微服务架构和Docker容器概念的火爆，也会让Spring Cloud在未来越来越“云”化的软件开发风格中立有一席之地，尤其是在目前五花八门的分布式解决方案中提供了标准化的、全站式的技术方案，意义可能会堪比当前Servlet规范的诞生，有效推进服务端软件系统技术水平的进步。
以上摘自百度，下面开始正题。
### 服务中心
什么是服务中心？
假如一个项目A去调用项目B，没有注册中心的情况下，可以直接调用，如下图
![image.png](/img/8297579-c31876329da35727.png)
如果存在一个服务中心的话，就要A调用服务中心，服务中心调用B，如下图
![image.png](/img/8297579-2233fb488e43a611.png)
这样看起来好像变得麻烦了，但是并不是。假如不是拥有两个项目，是有两百个项目，他们之间相互调用，那么就需要去管理每个项目的服务器所在的ip地址，和端口号。一个项目的宕机或重启，影响的可能是好多的项目。
假如使用服务种中心，让每一个项目都到服务中心来注册，那么我们如果想调用其中一个项目的服务，我们只要到服务中心来调用就行。我们并不需要关心这个服务到底是谁提供的。如果想重启某个服务，只需把他从服务中心移除，并不会对其他项目造成影响。
好处不仅仅是这些，因为我们把所有的服务都放到了服务中心，我们就可以直接对服务中心订制一些高级功能，比如做监控或负载均衡等。
### 搭建服务中心Eureka Server
在Spring Boot项目的基础上，添加如下依赖。
```
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
		<spring-cloud.version>Edgware.RELEASE</spring-cloud.version>
	</properties>
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
		<spring-cloud.version>Edgware.RELEASE</spring-cloud.version>
	</properties>



		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-eureka-server</artifactId>
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
配置
```
spring.application.name=spring-cloud-eureka
server.port=8080
eureka.client.serviceUrl.defaultZone=http://localhost:8080/eureka/
```
`eureka.client.serviceUrl.defaultZone`设置与Eureka Server交互的地址，查询服务和注册服务都需要依赖这个地址。

使用的话只需要在Boot的启动程序类加`@EnableEurekaServer`注解即可
```
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurekaApplication.class, args);
	}
}
```


