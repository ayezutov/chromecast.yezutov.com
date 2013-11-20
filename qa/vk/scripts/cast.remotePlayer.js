(function () {
    window.vkCast = window.vkCast || {};

    var example = function () {
        var cast_api, cv_activity;

        var firstList;

       
        doLaunch = function (receiver) {
            var request = new window.cast.LaunchRequest("a52262d5-42d0-4ca0-8ce0-b3dda0e630f3", receiver);
            request.parameters = "v=abcdefg";
            //...
            request.description = new window.cast.LaunchDescription();
            request.description.text = "My Cat Video";
            request.description.url = "url?";
            cast_api.launch(request, onLaunch);
        };

        onLaunch = function (activity) {
            if (activity.status == "running") {
                cv_activity = activity;
                // update UI to reflect that the receiver has received the
                // launch command and should start video playback.
            } else if (activity.status == "error") {
                cv_activity = null;
            }
        };

        stopPlayback = function () {
            if (cv_activity) {
                cast_api.stopActivity(cv_activity.activityId);
            }
        };
    }
    
    window.vkCast.RemotePlayer = function (applicationId) {
        return {

            cast: {
                applicationId: applicationId,
                receiverList : [],
                api: null,
                selectedReceiver: null,
                currentSession: {},
                forActiveSession: function (method) {
                    var self = this;
                    this.forSelectedReceiver(function (receiver) {
                        var request = new window.cast.LaunchRequest(self.applicationId, receiver);
                        //...
                        //request.description = new window.cast.LaunchDescription();
                        //request.description.text = "My Cat Video";
                        //request.description.url = "url?";
                        self.api.launch(request, function (activity)
                        {
                            if (activity.status == "running") {
                                var cv_activity = activity;
                                // update UI to reflect that the receiver has received the
                                // launch command and should start video playback.
                                self.api.sendMessage(cv_activity.activityId, 'player', { command: "ensureUrl", parameters: {url:"http://192.168.1.4/qa/vk/receiver.html"} });

                            } else if (activity.status == "error") {
                                //cv_activity = null;
                            }
                        });
                    });
                },
                forSelectedReceiver: function (method) {
                    var self = this;
                    var temp;
                    if (this.selectedReceiver != null
                        && (temp = $.grep(this.receiverList, function (e, i) { return e.id == self.selectedReceiver.id; }).length >= 0)) {
                        method(this.selectedReceiver = temp[0]);
                        return;
                    }
                    this.chooseReceiverAndExecute(method);
                },
                chooseReceiverAndExecute: function (method) {
                    var self = this;

                    if (!this.receiverList || this.receiverList.length == 0)
                    {
                        $("<div>Sorry, but no receivers are available for playback</div>").dialog({ modal: true, resizable: false, dialogClass: "receiverSelectorDialog", buttons: [{ text: "Ok", click: function () { $(this).dialog("close");}}] });
                        return;
                    }

                    var $dialogDiv = $("<div><span>Please choose a receiver:</span></div>");
                    var receiverClick = function (ev, receiver) {
                        self.selectedReceiver = receiver;
                        ev.preventDefault();
                        $dialogDiv.dialog("close");
                        method(receiver);
                    };
                    $dialogDiv.append($("<div />").append($.map(this.receiverList, function (e, i) { return $("<a href='#'></a>").text(e.name).click(function (ev) { receiverClick(ev, e); }); }))).dialog({ modal: true, resizable: false, dialogClass: "receiverSelectorDialog", minHeight: 0, width: "auto" });
                }
            },
            init: function () {
                var self = this;
                if (window.cast && window.cast.isAvailable) {
                    // Cast is known to be available
                    self.cast.initializeApi();
                } else {
                    // Wait for API to post a message to us
                    window.addEventListener("message", function (event) {
                        if (event.source == window && event.data &&
                            event.data.source == "CastApi" && event.data.event == "Hello")
                            self.initializeApi();
                    });
                };
            },

            initializeApi: function () {
                var self = this;
                this.cast.api = new cast.Api();
                this.cast.api.addReceiverListener(this.cast.applicationId, function (list) { self.onReceiverListUpdated(list) });
            },

            onReceiverListUpdated: function (list) {
                this.cast.receiverList = list;
            },

            // Properties

            getDuration: function () {
                //return this.html.player.duration;
            },

            getCurrent: function () {
                //return this.html.player.currentTime;
            },

            setCurrent: function (value) {
                //this.html.player.currentTime = value;
            },

            getPreloaded: function () {
                return;
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
                //return this.html.player.volume;
            },
            setVolume: function (volume) {
                //this.html.player.volume = volume;
            },
            getMuted: function () {
                //return this.html.player.muted;
            },
            toggleMuted: function () {
                //this.html.player.muted = !this.html.player.muted;
            },

            setSource: function (url) {
                //this.html.player.src = url;
                //this.html.player.load();
            },

            getIsPaused: function () {
                //return this.html.player.paused;
            },

            setCover: function (url) {
                //this.html.player.poster = url;
            },

            // Actions

            play: function () {
                this.cast.forActiveSession(function (receiver) {
                    // play
                });
                //this.html.player.play();
            },
            pause: function () {
                //this.html.player.pause();
            },

            // Events

            onpause: function (handler) {
                //this.html.$player.on("pause", handler);
            },
            onplay: function (handler) {
                //this.html.$player.on("play", handler);
            },
            onloadstart: function (handler) {
                //this.html.$player.on("loadstart", handler);
            },
            ondurationchanged: function (handler) {
                //this.html.$player.on("durationchange", handler);
            },
            onpreloadedchanged: function (handler) {
                //this.html.$player.on("progress", handler);
            },
            onplayingtimechanged: function (handler) {
                //this.html.$player.on("timeupdate", handler);
            },
            onvolumechanged: function (handler) {
                //this.html.$player.on("volumechange loadedmetadata", handler);
            }
        };
    };
})();