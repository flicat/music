/*!
 * @author liyuelong1020@gmail.com
 * @date 2016-03-23
 * @version 2.0.0
 * @description 音频插件
 */

(function (global, undefined) {
    // 绑定一次事件
    var oneBind = function(element, event, handler) {
        var one = function(e) {
            element.removeEventListener(event, one, false);
            handler.call(this, e);
        };
        element.addEventListener(event, one, false);
    };

    var isIOS = /i(Phone|P(o|a)d)/.test(navigator.userAgent);                     // 是否是爱疯

    // 新建图标
    var initMusicIcon = function() {
        var icon = document.createElement('i');
        icon.className = 'icon-music';
        return icon;
    };

    // 音乐播放对象
    var Music = function(src, loop, autoPlay, icon) {
        this.isPlay = false;
        this.autoPlay = !!autoPlay;

        // 页面背景音乐
        this.audio = new Audio(src);
        this.audio.loop = !!loop;
        this.audio.autoplay = false;

        // 音乐播放图标
        this.icon = initMusicIcon();
        !!icon && document.body.appendChild(this.icon);

        this.timeStamp = 'music_current_time' + src;
        this.stateStamp = 'music_play_state' + src;
        this.currentTime = Number(sessionStorage[this.timeStamp]) || 0;          // 上一次播放时间
        this.play_state = sessionStorage[this.stateStamp];                          // 上一次播放状态

        this.init();
    };
    Music.prototype = {
        constructor: Music,
        onPlay: function() {},
        onStop: function() {},
        // 播放
        play: function() {
            this.isPlay = true;
            this.audio.play();
        },
        // 暂停
        pause: function() {
            this.isPlay = false;
            this.audio.pause();
        },
        // 停止
        stop: function() {
            this.isPlay = false;
            this.audio.pause();
            try {
                this.audio.previousTime = 0;
                this.audio.currentTime  = 0;
            } catch(e) {}
        },
        // 修改播放图标
        setPlayState: function() {
            this.icon.className = 'icon-music icon-music-animation';
            this.onPlay();
        },
        // 修改播放图标
        setStopState: function() {
            this.icon.className = 'icon-music';
            this.onStop();
        },
        // 断点续播
        continuePlay: function() {
            if(this.currentTime){
                try {
                    this.audio.previousTime = this.currentTime;
                    this.audio.currentTime  = this.currentTime;
                } catch(e) {}
            }
        },
        // 设置/获取音量大小
        volume: function() {
            if(arguments.length) {
                var volume = Number(arguments[0]);
                if(!isNaN(volume) && volume >= 0){
                    this.audio.volume = volume;
                }
            }
            return this.audio.volume;
        },
        // 初始化事件
        init: function() {
            var that = this;

            that.audio.addEventListener('playing', function() {
                that.setPlayState();
            }, false);      // 开始播放事件
            that.audio.addEventListener('ended', function() {
                that.setStopState();
            }, false);        // 结束播放事件
            that.audio.addEventListener('pause', function() {
                that.setStopState();
            }, false);        // 暂停事件
            that.audio.addEventListener('loadeddata', function() {
                that.continuePlay();
            }, false);        // 断点续播

            if((!that.play_state || that.play_state === 'play') && that.autoPlay){
                that.play();
                // 解决某些手机不支持自动播放音乐的 bug
                if(isIOS) {
                    oneBind(document, 'touchstart', function() {
                        that.play();
                    });
                }
            }

            // 点击播放/暂停音乐
            that.icon.addEventListener('touchend', function(e) {
                e.stopPropagation();
                e.preventDefault();

                sessionStorage[that.stateStamp] = !that.isPlay ? 'play' : 'stop';
                if(that.isPlay){
                    that.stop();
                } else {
                    that.play();
                }
            }, false);

            // 页面关闭时记录当前播放进度
            window.addEventListener('beforeunload', function() {
                try {
                    sessionStorage[that.timeStamp] = that.audio.previousTime || that.audio.currentTime;
                } catch(e) {}
                that.audio.pause();
            });
        }
    };



    global.Music = Music;

    return Music;
})(this);