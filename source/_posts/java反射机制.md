---
title: java反射机制
date: 2017-11-26 19:35:36
tags: ['java']
---
JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为java语言的反射机制。
通过Java的反射机制可以获取以下内容：
####  Class对象
可以直接通过```类.class```获取。
例如获取String的class对象
```
Class cls = String.class;
```
也可以通过类名进行获取
```
Class cls = Class.forName("java.lang.String");
```
#### 类名
可以通过class对象的```getName()```方法获取类名，```getSimpleName()```获取不带包名的类名
```
//带包类名
String name = cls.getName();

//不带包名的类名
String simpleName = cls.getSimpleName();
```
#### 方法
```
Method[] methods = cls.getMethods();
```
```getMethods()```可以获取到该类中所有的public方法
也可以获取到单个方法
```
Method method = cls.getMethod("method",new Class[]{String.class});
```
第一个参数是方法的名字，第二个参数是方法的参数，这里是以只有一个string类型的参数为例。如果没有参数传入```null```即可
如果已经知道方法，也可以获取到方法的参数
```
Class[] parameterTypes = method.getParameterTypes();
```
当然也可以返回方法的返回类型
```
Class returnType = method.getReturnType();
```

可以通过```invoke()```方法来调用方法需要传2个参数，第一个参数是调用方法的对象，如果是静态方法可以传入```null```第二个参数是方法需要的参数列表
```
Object returnValue = method.invoke(null, "parameter");
```
#### 构造方法
构造方法和普通方法类似
```
Constructor[] constructors = cls.getConstructors();
Constructor constructor = cls.getConstructor(new Class[]{String.class});
Class[] parameterTypes = constructor.getParameterTypes();
```
可以使用```constructor```的```newInstance()```方法实例一个对象
```
String str = (String) constructor.newInstance("test");
```
#### 属性
```
Field[] fields = cls.getFields();
Field field = cls.getField("name");
```
可以通过```getFields()```方法获取所有的```public```属性，```getField()```获取指定的方法，当然也只能获取```public```的属性。
在反射中也可以获取```private```的属性和方法以下分别进行演示
#### 包
```
Package pack = cls.getPackage();
```
#### 父类
java是单继承最多一个父类
```
Class supercls = cls.getSuperclass();
```
#### 实现的接口
一个类可以实现多个接口
```
Class[] interfaces = cls.getInterfaces();
```
这里只会返回该类实现的接口，而不会返回父类实现的接口

文章参考
https://baike.baidu.com/item/JAVA%E5%8F%8D%E5%B0%84%E6%9C%BA%E5%88%B6/6015990?fr=aladdin
http://www.jianshu.com/p/2315dda64ad2
