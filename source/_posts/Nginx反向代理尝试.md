---
title: Nginx反向代理尝试
date: 2017-11-10 15:19:12
tags:
---
和我一起做一个项目的前端小伙伴需要一个https的接口，后端是java做的，因为某些原因不能直接在java项目上配置https，最后想到用反向代理来解决这个问题。
用户访问代理的服务器，然后由代理服务器转发给后台，并转发结构给用户。我在代理服务器上配置https就解决了接口https的需求。
Nginx配置反向代理很简单
```
location /api{
    proxy_pass http://127.0.0.1:8080/api ;
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```
只需要这样就可以把访问服务器的 ```/api```请求全部转发到 ```http://127.0.0.1:8080/api```

