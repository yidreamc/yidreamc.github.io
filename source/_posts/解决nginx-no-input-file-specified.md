---
title: 解决nginx no input file specified
date: 2017-12-22 23:41:44
tags: ['nginx']
---
一次在搬家[metinfo](https://www.metinfo.cn/)站点的时候遇到的问题，网上提出这个问题的人很多，但是解决办法都是没用的。最后终于在[这篇文章](http://www.cnblogs.com/cosiray/p/5075655.html)下找到解决办法。
把`fastcgi.conf`的`fastcgi_param DOCUMENT_ROOT $document_root;`注释掉。

