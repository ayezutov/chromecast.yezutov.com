(function () {
    window.vkCast = window.vkCast || {};
    window.vkCast.LocalPlayer = function () {
        return {
            html: {
                player: $("#html5player")[0],
                $player: $("#html5player")
            },

            init: function(){ },

            // Properties

            getDuration: function () {
                return this.html.player.duration;
            },

            getCurrent: function () {
                return this.html.player.currentTime;
            },

            setCurrent: function (value) {
                this.html.player.currentTime = value;
            },

            getPreloaded: function () {
                var current = this.html.player.currentTime;
                var buffered = this.html.player.buffered;
                for (var i = 0; i < buffered.length; i++) {
                    if (current >= buffered.start(i) && current <= buffered.end(i)) {
                        return buffered.end(i);
                    }
                }
                return 0;
            },
            getVolume: function () {
                return this.html.player.volume;
            },
            setVolume: function (volume) {
                this.html.player.volume = volume;
            },
            getMuted: function () {
                return this.html.player.muted;
            },
            toggleMuted: function () {
                this.html.player.muted = !this.html.player.muted;
            },

            setSource: function (url) {
                this.html.player.src = url;
                this.html.player.load();
            },

            getIsPaused: function () {
                return this.html.player.paused;
            },

            setCover: function (url) {
                this.html.player.poster = url;
            },

            // Actions

            play: function () {
                this.html.player.play();
            },
            pause: function () {
                this.html.player.pause();
            },

            // Events

            onpause: function (handler) {
                this.html.$player.on("pause", handler);
            },
            onplay: function (handler) {
                this.html.$player.on("play", handler);
            },
            onloadstart: function (handler) {
                this.html.$player.on("loadstart", handler);
            },
            ondurationchanged: function (handler) {
                this.html.$player.on("durationchange", handler);
            },
            onpreloadedchanged: function (handler) {
                this.html.$player.on("progress", handler);
            },
            onplayingtimechanged: function (handler) {
                this.html.$player.on("timeupdate", handler);
            },
            onvolumechanged: function (handler) {
                this.html.$player.on("volumechange loadedmetadata", handler);
            }
        };
    };
})();