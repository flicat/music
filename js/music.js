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
        this.isReady = false;
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

        this._playEventList = [];
        this._stopEventList = [];
        this._loadEventList = [];

        this.init();
    };
    Music.prototype = {
        constructor: Music,

        // 播放事件
        _firePlayEvent: function() {
            var that = this;
            that._playEventList.forEach(function(handler) {
                handler.call(that);
            });
        },
        // 停止事件
        _fireStopEvent: function() {
            var that = this;
            that._stopEventList.forEach(function(handler) {
                handler.call(that);
            });
        },
        // 加载事件
        _fireLoadEvent: function() {
            var that = this;
            that._loadEventList.forEach(function(handler) {
                handler.call(that);
            });
        },
        addPlayEvent: function(handler) {
            if(({}).toString.call(handler) === '[object Function]'){
                this._playEventList.push(handler);
            }
        },
        addStopEvent: function(handler) {
            if(({}).toString.call(handler) === '[object Function]'){
                this._stopEventList.push(handler);
            }
        },
        addLoadEvent: function(handler) {
            if(({}).toString.call(handler) === '[object Function]'){
                this._loadEventList.push(handler);
                if(this.isReady) {
                    handler.call(this);
                }
            }
        },
        // 播放
        play: function() {
            this.audio.play();
        },
        // 暂停
        pause: function() {
            this.audio.pause();
        },
        // 停止
        stop: function() {
            this.audio.pause();
            try {
                this.audio.previousTime = 0;
                this.audio.currentTime  = 0;
            } catch(e) {}
        },
        // 修改播放图标
        setPlayState: function() {
            if(!this.isPlay){
                this.isPlay = true;
                this.icon.className = 'icon-music icon-music-animation';
                this._firePlayEvent();
            }
        },
        // 修改播放图标
        setStopState: function() {
            if(this.isPlay){
                this.isPlay = false;
                this.icon.className = 'icon-music';
                this._fireStopEvent();
            }
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

            // 开始播放事件
            that.audio.addEventListener('play', function(e) {
                that.setPlayState();
            }, false);
            // 结束播放事件
            that.audio.addEventListener('ended', function(e) {
                that.setStopState();
            }, false);
            // 暂停事件
            that.audio.addEventListener('pause', function(e) {
                that.setStopState();
            }, false);
            // 加载完毕事件
            that.audio.addEventListener('canplay', function(e) {
                if(!that.isReady){
                    that.isReady = true;

                    // 断点续播
                    that.continuePlay();
                    that._fireLoadEvent();
                }
            }, false);

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