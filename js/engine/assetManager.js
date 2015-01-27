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
                if (downloadQueue.length === 0) {
                    downloadCallback();
                }
                
                var successCallback = function() {
                    console.log(this.src + ' is loaded');
                    successCount += 1;

                    if (that.isDone()) {
                        downloadCallback();
                    }
                };
                
                var errorCallback = function() {
                    errorCount += 1;

                    if (that.isDone()) {
                        downloadCallback();
                    }
                };

                for (var i = 0; i < downloadQueue.length; i++) {

                    var path = downloadQueue[i];
                    var img = new Image();

                    img.addEventListener("load", successCallback, false);
                    img.addEventListener("error", errorCallback, false);

                    img.src = path;

                    cache[path] = img;
                }


            },

            getAsset: function (path) {
                return cache[path];
            },


            isDone: function () {
                return (downloadQueue.length) === (successCount + errorCount);
            }



        };

        //

    }


};
