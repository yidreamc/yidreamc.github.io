---
title: 解决axios post传递参数为空
date: 2017-12-23 10:08:16
tags: ['javascript']
---
以前都是用 vue resource，因为官方推荐使用axios，就尝试了一下。但发现使用post方法传递的数据后端接受不到，仔细阅读文档发现自己并没有用错。
最后网上找到了答案
```
import qs from 'qs';
...
axios.post('post.php', qs.stringify({
    a: '1'
}))
.then( ... )
.catch( ... );
```
原因是axios默认发送数据时，数据格式是Request Payload，而并非我们常用的Form Data格式，后端未必能正常获取到，所以在发送之前，需要使用qs模块对其进行处理。
