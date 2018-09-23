---
title: js防抖实现
date: 2018-9-21 16:04:12   
tags:   
cover: /img/cover/cover-2
---
思路还是比较简单的，在进行一次操作之后，只有过了一定的时间才能进行下次操作，然后换一下this的作用域就实现了。
```
const debounce = (func, wait, immediate = true) => {
    let timeout, args, context, timestamp, result;
    const later = function () {
        const last = Date.parse(new Date()) - timestamp;
        console.log('last',last);
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, arguments);
                if (!timeout) {
                    context = null;
                }
            }
        }
    }
    return function () {
        context = this;
        timestamp = Date.parse(new Date());
        const callNow = immediate && !timeout;
        // 如果定时器不存在就创建一个
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, arguments);
            context = null;
        }
        return result;
    }
}
```
