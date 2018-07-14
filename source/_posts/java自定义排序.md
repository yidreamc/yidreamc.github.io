---
title: java自定义排序
date: 2018-05-06 22:42:49
tags:
---
遇到过很多次了，种于狠下心总结一下，免得以后每次都要再找。
java自定义排序有两个Object对象，o1和o2（this相当于o1），如果返回负值则把o1插到o2前面，如果返回正值，把o1放到o2后面，如果返回0保持原来顺序不变。

排序有两种实现方式，第一种是要排序的类实现Comparable接口。
```
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class T implements Comparable {

    int x;
    int y;
    public T(int x,int y){
        this.x = x;
        this.y = y;
    }

    @Override
    public int compareTo(Object o) {
        if(this.x < ((T)o).x)
            return -1;
        return 1;
    }

    @Override
    public String toString() {
        return "x: " + x + " y: " + y;
    }

    public static void main(String[] args) {
        List<T> list = new ArrayList<>();
        list.add(new T(1,2));
        list.add(new T(3,5));
        list.add(new T(2,1));
        Collections.sort(list);

        for(int i = 0;i<list.size();i++){
            System.out.println(list.get(i));
        }
    }
}
```
第二种类似与c++定义比较函数的方式，不过是java的风格，覆盖Comparator中的compare方法。
```
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class T {

    int x;
    int y;
    public T(int x,int y){
        this.x = x;
        this.y = y;
    }

    @Override
    public String toString() {
        return "X: " + x + " y: " + y;
    }

    public static void main(String[] args) {
        List<T> list = new ArrayList<>();
        list.add(new T(1,2));
        list.add(new T(3,5));
        list.add(new T(2,1));
        Collections.sort(list, new Comparator<T>() {
            @Override
            public int compare(T o1, T o2) {
                if(o1.x < o2.x)
                    return -1;
                return 1;
            }
        });

        for(int i = 0;i<list.size();i++){
            System.out.println(list.get(i));
        }
    }
}
```
