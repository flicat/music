简易音频插件
===========

>**调用方法**：

> - new Music(src [, loop] [, auto] [, icon])             //  新建一个音频对象

>**音频对象方法：**

> - Music.play(),                     // 播放音频
> - Music.pause(),                    // 暂停音频
> - Music.stop(),                     // 停止音频
> - Music.volume([volume]),           // 获取/设置音量
> - Music.addPlayEvent(handler),           // 添加播放音频（play）事件回调
> - Music.addStopEvent(handler),           // 添加音频停止（pause）事件回调
> - Music.addLoadEvent(handler),           // 添加音频加载完毕（canplay）事件回调


            
>**参数详解：**

> - @src  {String}       // 音频文件链接
> - @loop {Boolean}       // 是否循环播放
> - @auto {Boolean}       // 是否自动播放
> - @icon {Boolean}       // 是否显示音乐图标
> - @volume {Number}       // 音量大小 0至1
> - @handler {Function}       // 事件触发回调函数
