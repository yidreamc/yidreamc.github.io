---
title: 自己实现一个简单的ioc容器
date: 2017-11-26 21:54:14
tags: ['java']
---
某节实验课的任务是练习使用spring的ioc，因为之前用过，感觉也没啥意思，就想了以下他的实现原理，然后自己使用java反射机制实现了一个简单的ioc容器。以下对原理进行简单的说明，完整的代码及用法详见[xmfaly/simpleioc](https://github.com/xmfaly/simpleioc)

首先定义@Autowired注解用于自动注入
```
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Autowired {

    Class<?> value() default Class.class;

    String name() default "";
}
```
建立一个`Container`容器类
建立两个`map`分别保存类名和bean、对象名和类名的关系
```
    // 保存所有bean 格式为 类名 : bean
    private Map<String, Object> beans;

    // 存储对象和类名的关系 对象名 ：bean
    private Map<String, Object> beanKeys;
```
这里为了安全起见，使用`ConcurrentHashMap()`实例化这两个`map`
```
    public Container(){
        beans = new ConcurrentHashMap<String, Object>();
        beanKeys = new ConcurrentHashMap<String, String>();
    }
```
向容器内注册bean，这里我重载了三种形式，当然也可以更多，关键看使用的场景了。
```
  /**
     * 以class的形式注册
     */
    public Object registerBean(Class<?> cls) {
        String className = cls.getName();
        Object bean = null;

        try {
            bean = cls.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        beans.put(className, bean);

        //不指定对象名的情况下类名和对象名相同
        beanKeys.put(className, bean);
        return bean;
    }

    /**
     * 以bean的形式注册
     */
    public Object registerBean(Object bean) {
        String className = bean.getClass().getName();
        beans.put(className, bean);
        beanKeys.put(className, bean);
        return bean;
    }


    /**
     * 以带对象名的class形式注册
     */
    public Object registerBean(String name, Class<?> cls) {
        String className = cls.getName();
        Object bean = null;

        try {
            bean = cls.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        beans.put(className, bean);
        beanKeys.put(name, bean);
        return bean;
    }

    /**
     * 注册一个带名称的Bean到容器中
     */
    public Object registerBean(String name, Object bean) {
        String className = bean.getClass().getName();
        beans.put(className, bean);
        beanKeys.put(name, bean);
        return bean;
    }

```
从容器中取出bean
```
   /**
     * 通过 Class 对象获取bean
     */
    public <T> T getBean(Class<?> cls) {
        String className = cls.getName();
        Object object = beans.get(className);
        if (null != object) {
            return (T) object;
        }
        return null;
    }

    /**
     * 通过对象名获取 bean
     */
    public <T> T getBeanByName(String name) {
        Object object = beanKeys.get(name);;
        if (null != object) {
            return (T) object;
        }
        return null;
    }

```

在容器启动的时候遍历容器内的所有bean对bean进行注入
```
  /**
     * 初始化
     */
    public void init() {
        Iterator<Map.Entry<String, Object>> it = beans.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, Object> entry = it.next();
            Object object = entry.getValue();
            injection(object);
        }
    }
```

其中使用到的方法的实现
```
     /**
     * 注入
     */
    public void injection(Object object) {
        Field[] fields = object.getClass().getDeclaredFields();
        try {

            //遍历所有属性寻找@Autowired注解
            for (Field field : fields) {
                Autowired autowired = field.getAnnotation(Autowired.class);
                if (null != autowired) {

                    // 要注入的字段
                    Object autoWritedField = null;
                    String name = autowired.name();

                    if (!name.equals("")) {
                        Object bean = beanKeys.get(name);
                        if (null != bean ) {
                            autoWritedField = bean;
                        }


                        if (null == autoWritedField) {
                            throw new RuntimeException("Unable to autoWrited " + name);
                        }
                    } else {
                        if (autowired.value() == Class.class) {
                            //该属性的Type
                            autoWritedField = recursiveAssembly(field.getType());
                        } else {
                            // 指定装配的类
                            autoWritedField = this.getBean(autowired.value());
                            if (null == autoWritedField) {
                                autoWritedField = recursiveAssembly(autowired.value());
                            }
                        }
                    }

                    if (null == autoWritedField) {
                        throw new RuntimeException("Unable to autoWrited " + field.getType().getCanonicalName());
                    }

                    boolean accessible = field.isAccessible();
                    field.setAccessible(true);
                    field.set(object, autoWritedField);
                    field.setAccessible(accessible);
                }
            }
        } catch (SecurityException e) {
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    /**
     * 修复没有指定注解及默认注入的情况
     */
    private Object recursiveAssembly(Class<?> cls) {
        if (null != cls) {
            return this.registerBean(cls);
        }
        return null;
    }

```

写个测试测试3中注入类型
```
public class TestIoc {

    class A{

        @Autowired(name = "myvalue")
        private Integer value;

        @Autowired(name = "str")
        private String myStr;

        @Autowired(value = String.class)
        private String myStr2;

        @Autowired
        public String myStr3;

        public void show(){
            System.out.println("value: " + value);
            System.out.println("str: " + myStr);
            System.out.println(myStr2 == null);
            System.out.println(myStr3 == null);
        }
    }

    @Test
    public void test(){
        Container c = new Container();
        c.registerBean("a",new A());
        c.registerBean("str","注入成功");
        c.registerBean("myvalue",2333);
        c.initWired();
        A a = c.getBeanByName("a");
        a.show();
    }
}
```
测试成功
```
value: 2333
str: 注入成功
false
false
```
