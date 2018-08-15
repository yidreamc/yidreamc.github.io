---
title: js加载的顺序和时间问题
date: 2018-08-15 23:24:02
tags:
---
想写一个Chrome插件，但是在js加载时间上掌握不好，或者说以前从来没有考虑过这方面的问题，特意查了一下记录一下。

### 多个js文件加载顺序
三个js文件，依次引入
```
<script>alert("A");</script>
<script>alert("B");</script>
<script>alert("C");</script>
```
三个文件的大小是第二个远远大于一三，最后的输出结果是ABC
这说明使用script标签默认是阻塞顺序执行的。
可以使用async去打破这种阻塞
```
<script>alert("A");</script>
<script async="true">alert("B");</script>
<script>alert("C");</script>
```
这样的话就回输出ACB
使用了async之后，就不会组织后续文档的下载和执行，而本身使用async属性的js会在这个文件下载之后再执行。
使用以下的方式创建script标签等同于使用async属性
```
var script = document.createElement("script");
script.src = "file.js";
document.body.appendChild(script);
```
于async类似的还有一个defer属性，但是他们的实现原理完全不同。defer会确保脚本在文档解析之后执行，也就是DOMContentLoaded事件触发之前执行，如果有多个defer，那么这些defer会在文档解析之后顺序执行。其实平时所做的把script放到body之前写就是和defer实现一样的效果。

### 文档加载时间
- DOM ready是发生在dom的结构加载完成之后发生的，不包括图片等媒体信息的加载。
- DOMContentLoaded触发时机：文档加载并解析完毕，所有deferred脚本执行完毕。但此时图片和async脚本可能依旧在加载。
- DOM load实在dom加载之后发生的,也就是说整个文档图片媒体都加载完了再执行
