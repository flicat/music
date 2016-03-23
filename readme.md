简易音频插件
===========

>**调用方法**：

> - new Music(src [, loop] [, auto] [, icon])             //  新建一个音频对象

>**音频对象方法：**

> - Music.play(),                     // 播放音频
> - Music.pause(),                    // 暂停音频
> - Music.stop(),                     // 停止音频
> - Music.volume([volume]),           // 获取/设置音量
  
>**音频事件：**

> - Music.onPlay,                     // 播放音频触发事件
> - Music.onStop,                     // 暂停/停止音频触发事件

            
>**参数详解：**

> - @src  {String}       // 音频文件链接
> - @loop {Boolean}       // 是否循环播放
> - @auto {Boolean}       // 是否自动播放
> - @icon {Boolean}       // 是否显示音乐图标
> - @volume {Number}       // 音量大小 0至1
