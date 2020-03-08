## 第二个pool的写法

第一个是在里面内置了promise.all的功能的，通过return 出来的value拿到结果。

这个是使用者调用promis.all功能，思路很明确。单个做完resolve，然后读取队列就行。