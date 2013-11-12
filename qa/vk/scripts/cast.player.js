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
                    progressPlaying: $("#progressbar-playing"),
                    progressNewPosition: $("#progressbar-new-position-bar"),
                    volumeIcon: $("#volume #volume-icon"),
                    volumeSlider: $("#volume #volume-slider")
                }

                /*
                    INITIALIZE CONTROLS
                */

                $("#video-area").tooltip({
                    position: {
                        my: "center bottom",
                        at: "center top-10",
                        within: "#video-area"
                    }
                });

                self.html.progressNewPosition.tooltip({
                    position: {
                        my: "center bottom",
                        at: "center bottom-20",
                        within: "#video-area"
                    }
                });

                self.html.volumeSlider.slider({range: "min"});

                self.setPreloadedProgress(0,1);
                self.setPlayingProgress(0, 1);

                self.html.progressNewPosition.on("mousemove", function (e) {
                    var duration = self.player.getDuration();
                    if (isNaN(duration)) {
                        self.html.progressNewPosition.tooltip("close");
                        return;
                    }
                    self.html.progressNewPosition.css("background-position-x", e.offsetX - 2);
                    self.html.progressNewPosition.tooltip("open");
                    self.html.progressNewPosition.tooltip("option", "content", self.getPlayerDisplayTime(e.offsetX / self.html.progressNewPosition.width() * duration));
                });
                self.html.progressNewPosition.on("mouseout", function (e) {
                    self.html.progressNewPosition.css("background-position-x", "-10px");
                });
                self.html.progressNewPosition.on("click", function (e) {
                    var duration = self.player.getDuration();
                    if (isNaN(duration)) {
                        return;
                    }
                    var value = e.offsetX / self.html.progressNewPosition.width() * duration;
                    self.player.setCurrent(value);
                });

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

                self.html.volumeIcon.on("click", function (e) {
                    self.player.toggleMuted();
                });

                self.html.volumeSlider.on( "slide", function( event, ui ) {
                    self.player.setVolume(ui.value / 100);
                } );

                $(document).on("keypress", function (e) {
                    if (e.which == 32 || e.which == 13) {
                        if (self.html.play.is(":visible")) {
                            self.html.play.click();
                        }
                        else {
                            self.html.pause.click();
                        }
                    }
                });

                $(document).on("keydown", function (e) {
                    var handler = {
                        "35": function end() { },
                        "36": function home() { },
                        "37": function right() { },
                        "38": function up() { },
                        "39": function left() { },
                        "40": function down() { },
                    };

                    var key = e.which;
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
                self.player.onpreloadedchanged(updateTimeControls);

                self.player.onvolumechanged(function (e) {
                    var volume = self.player.getVolume() * 100;
                    var muted = self.player.getMuted();
                    self.setVolume(volume, muted);
                });


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
            },
            setVolume: function (value, muted) {
                var volume = muted ? 0 : value;
                
                var cssClass = "icon-" + Math.ceil(volume / 25);

                this.html.volumeSlider.slider("value", volume);
                this.html.volumeIcon.prop("className", cssClass);

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
                this.html.$player.on("progress",handler);
            },
            onplayingtimechanged: function (handler) {
                this.html.$player.on("timeupdate", handler);
            },
            onvolumechanged: function (handler) {
                this.html.$player.on("volumechange loadedmetadata", handler);
            }
        };

        window.playerControls = new PlayerControls(player);
        playerControls.init();

    });
    

})();