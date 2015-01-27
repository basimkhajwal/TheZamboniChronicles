Engine.AssetManager = {

    create: function () {

        //The closure
        var that = {};

        //Private closure variables
        var downloadQueue = [];
        var soundsQueue = [];
        var cache = {};
        var successCount = 0;
        var errorCount = 0;

        //Add the methods
        that.prototype = {
            
            queueDownlaod: function (path) {
                downloadQueue.push(path);
            },

            queueSound: function (id, path) {
                soundsQueue.push({id: id, path: path})
            },

            downloadAll: function(downloadCallback) {
                if (downloadQueue.length === 0 && soundsQueue.length === 0) {
                    downloadCallback();
                }

                that.downloadSounds(downloadCallback);
                
                var successCallback = function() {
                    console.log(this.src + ' is loaded');
                    that.successCount += 1;

                    if (that.isDone()) {
                        downloadCallback();
                    }
                };
                
                var errorCallback = function() {
                    that.errorCount += 1;

                    if (that.isDone()) {
                        downloadCallback();
                    }
                };

                for (var i = 0; i < this.downloadQueue.length; i++) {

                    var path = this.downloadQueue[i];
                    var img = new Image();

                    img.addEventListener("load", successCallback, false);
                    img.addEventListener("error", errorCallback, false);

                    img.src = path;

                    this.cache[path] = img;
                }


            },

            downloadSound: function(id, path, soundsCallback) {
                cache[path] = soundManager.createSound({
                    id: id,
                    autoLoad: true,
                    url: path,
                    onload: function() {
                        console.log(this.url + ' is loaded');
                        that.successCount += 1;

                        if (that.isDone()) {
                            soundsCallback();
                        }
                    }
                });
            },

            getSound: function (path) {
                return cache[path];
            },

            getAsset: function (path) {
                return cache[path];
            },


            isDone: function () {
                return (downloadQueue.length + soundsQueue.length) === (successCount + errorCount);
            }



        };

        //

    }


};
