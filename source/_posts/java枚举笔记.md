---
title: java枚举笔记
date: 2018-01-07 18:55:27
tags: ['java']
---
### 定义枚举
枚举使用关键字`enum`定义，枚举值一般使用大写字母，值之间用逗号隔开。例如定义一个颜色的枚举。
```
public enum  Color {
    YELLOW,RED,GREEN,BLACK
}
```
### 枚举使用
枚举可以像常量一样直接使用
```
Color color = Color.RED;
```
### Enum的常用方法
枚举是继承自抽象类Enum的，类Enum中有如下几个常用方法     
 
| 方法名  | 返回类型  | 说明 |
| :--:         | :--:           | :--:|
|ordinal()|int|返回枚举常量的序数,第一个为0，第二个为1，以此类推|
|   compareTo(E o)  |  int     | 返回该枚举的序数 - o的序数  |
|   getDeclaringClass() | Class<?>     |返回该枚举的Class类型| 
|   name()  | String     |返回该枚举的名字| 
|    static valueOf(Class<T> enumType, String name)  | static<T extends Enum<T>> T    | 返回带指定名称的指定枚举类型的枚举常量|
### 定制枚举
可以给枚举定制一些功能，比如可以给上述的颜色枚举增加一个颜色属性（当然也可以增加两个或多个）
```
public enum  Color {
    YELLOW("黄色"),RED("红色"),GREEN("绿色"),BLACK("黑色");
    private String desc;
    Color(String desc){
        this.desc = desc;
    }
}
```
这种属性是类似于类的构造函数，其中构造函数Color()必须是private。
### 和普通类的区别
大部分类的功能枚举都可以实现，比如定义属性和方法，实现接口，重写方法等。但枚举不能继承，因为编译器自动将我们定义的枚举类继承自Enum抽象类，而java是单继承，所以我们不能在使用自定义的枚举去继承。


