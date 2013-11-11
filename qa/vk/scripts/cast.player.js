(function () {

    
    
    var PlayerControls = function (player) {
        return {
            init: function () {
                var self = this;

                self.player = player;
                self.html = {
                    play: $("#play"),
                    pause: $("#pause"),
                    timeRemaining: $("#time-remaining"),
                    timeCurrent: $("#time-current"),
                    timeTotal: $("#time-total"),
                    progressPreloaded: $("#progressbar-preloaded"),
                    progressPlaying: $("#progressbar-playing")
                }

                /*
                    INITIALIZE CONTROLS
                */

                self.setPreloadedProgress(0);
                self.setPlayingProgress(0);
               

                /*
                    REGISTER EVENTS FROM CONTROLS
                */
                self.html.play.off("click");
                self.html.play.on("click", function (e) {
                    self.playClickHandler(e);
                });

                self.html.pause.off("click");
                self.html.pause.on("click", function (e) {
                    self.pauseClickHandler(e);
                });

                /*
                    REGISTER EVENTS FROM PLAYER
                */

                self.player.onplay(function (e) {
                    self.html.play.hide();
                    self.html.pause.show();
                });

                self.player.onpause(function (e) {
                    self.html.pause.hide();
                    self.html.play.show();
                });

                var updateTimeControls = function (e) {
                    var duration = self.player.getDuration();
                    var durationRounded = Math.floor(duration)
                    var current = self.player.getCurrent();
                    var currentRounded = Math.round(current);
                    var remaining = durationRounded - currentRounded;
                    var preloaded = self.player.getPreloaded();

                    self.html.timeTotal.text(self.getPlayerDisplayTime(durationRounded));
                    self.html.timeCurrent.text(self.getPlayerDisplayTime(currentRounded));
                    self.html.timeRemaining.text("-" + self.getPlayerDisplayTime(remaining));

                    self.setPlayingProgress(current, duration);
                    self.setPreloadedProgress(preloaded, duration);
                }

                self.player.ondurationchanged(updateTimeControls);
                self.player.onplayingtimechanged(updateTimeControls);
            },

            updateRemainingTime: function () {
                this.html.timeRemaining.text("-" + this.getPlayerDisplayTime(this.player.getDuration() - this.player.getCurrent()));
            },
            getPlayerDisplayTime: function (sec_num) {
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));
                var time = 
                    (hours > 0 ? this.formatToDigitsNumber(hours) + ':' : '') +
                    (this.formatToDigitsNumber(minutes) + ':') +
                    this.formatToDigitsNumber(seconds);
                return time;
            },

            formatToDigitsNumber: function (number, numberOfDigits) {
                if (!numberOfDigits) { numberOfDigits = 2; }
                var result = number.toString();
                while (result.length < numberOfDigits) {
                    result = "0" + result;
                }
                return result;
            },
            playClickHandler: function (e) {                
                this.player.play();
            },

            pauseClickHandler: function (e) {                
                this.player.pause();
            },
            setPlayingProgress: function (value, max) {
                this.html.progressPlaying.css("width", value / max * 100 + "%");
            },
            setPreloadedProgress: function (value, max) {
                this.html.progressPreloaded.css("width", value / max * 100 + "%");
            }
        };
    };

    $(document).ready(function () {
        var player = {
            html: {
                player: $("#html5player")[0],
                $player: $("#html5player")
            },

            // Properties

            getDuration: function () {
                return this.html.player.duration;
            },

            getCurrent: function () {
                return this.html.player.currentTime;
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
            }
        };

        window.playerControls = new PlayerControls(player);
        playerControls.init();

    });
    

})();