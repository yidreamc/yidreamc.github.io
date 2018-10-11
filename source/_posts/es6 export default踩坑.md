---
title: es6 export default踩坑   
date: 2018-10-11 22:23:16   
tags:   
---
先说一下遇到的问题
```js
// a.js

let test = function() {
    
}

export default {
    test
}
```
```js
// b.js

import { test } from 'a.js'
console.log(test)  // undefined

import all from 'a.js'
console.log(all)  // {test: f}
```
潜意识上觉得这种写法应该不会出现问题，公司项目中也是这么用的，并且也没有出现问题。

其实问题出在babel上  
```js
export default {
    test
}
```
经过babel转码之后
```js
module.exports.default = {
  test
}
```
中间多了一个default所以获取不到，公司项目中之所有可以获取到是因为引入了别的依赖进行处理了。  
其实不引入依赖直接解决的办法有很多，以下任意一个都可以解决
```js
// b.js
import b from 'a.js';
const { test } = b;
```
```js
// a.js
export {
    test
}
```
```js
// a.js
const a = {
    test
};
export default a;
```