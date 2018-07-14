---
title: spring boot使用多线程
date: 2018-04-24 09:20:48
tags:
---
最近遇到一个难题，我需要在boot项目中开一个监视器，监视器中需要用到dao接口，spring boot的dao是依赖注入进去的，并不能手动new出来，如果是常规的方法先建线程的话，dao注入不进去，查了很多网站，想了很多办法最后找到了解决办法。在这里记录一下。https://blog.csdn.net/u010454030/article/details/52317438
```
@Component
public class ApplicationContextProvider implements ApplicationContextAware {

    private static ApplicationContext context;

    private ApplicationContextProvider(){}

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }

    public  static <T> T getBean(String name,Class<T> aClass){
        return context.getBean(name,aClass);
    }

}
```

```
@Component("mTask")
@Scope("prototype")
public class MoniotrTask extends Thread {

    final static Logger logger= LoggerFactory.getLogger(MoniotrTask.class);
    //参数封装
    private Monitor monitor;

    public void setMonitor(Monitor monitor) {
        this.monitor = monitor;
    }

    @Resource(name = "greaterDaoImpl")
    private RuleDao greaterDaoImpl;

    @Override
    public void run() {
        logger.info("线程:"+Thread.currentThread().getName()+"运行中.....");
    }

}
```

```
@Component
public class StartTask   {

    final static Logger logger= LoggerFactory.getLogger(StartTask.class);

    //定义在构造方法完毕后，执行这个初始化方法
    @PostConstruct
    public  void init(){

        final List<Monitor> list = ParseRuleUtils.parseRules();
        logger.info("监控任务的总Task数：{}",list.size());
        for(int i=0;i<list.size();i++) {
            MoniotrTask moniotrTask=   ApplicationContextProvider.getBean("mTask", MoniotrTask.class);
            moniotrTask.setMonitor(list.get(i));
            moniotrTask.start();
            logger.info("第{}个监控task: {}启动 !",(i+1),list.get(i).getName());
        }

    }


}
```
