---
title: '自己实现call,apply,bind'
cover: /img/cover/cover-13
date: 2018-09-16 23:54:51
tags:
- js
---
js的`call`和`apply`都可以改变this指向,调用函数，两者的作用相同，只是传参的方式不同。`bind`可以改变this指向，创建函数。也就是说`call`和`apply`改变指向之后会执行`bind`不会。
- `call(obj, arg1, arg2, ...)`
- `apply(obj,[arg1, arg2, ...])`
- `bind(obj, arg1, arg2, ...)`
### 实现原理
改变`this`的指向，就是在新的对象加要执行的函数，调用结束之后删除。

### `call` 实现
```js
Function.prototype.myCall = function (context) {
    context = context || window;
    // 给context添加一个新属性 值为调用者
    context.fn = this;
    // 取出其他参数
    const args = [...arguments].slice(1);
    // 调用函数
    const result = context.fn(...args);
    delete context.fn;
    return result;
}

```
### `apply`实现
```js
Function.prototype.myApply = function (context) {
    context = context || window;
    // 给context添加一个新属性 值为调用者
    context.fn = this;
    // 取出其他参数
    const args = arguments[1];
    // 调用函数
    const result = context.fn(...args);
    delete context.fn;
    return result;
}
```
### `bind` 实现
```js
Function.prototype.myBind = function (context) {
    let _this = this;
    let args = [...arguments].slice(1);

    return function F() {
        if (this instanceof F) {
            return new _this(...args);
        }
        return _this.call(context,...args);
    }
}
```