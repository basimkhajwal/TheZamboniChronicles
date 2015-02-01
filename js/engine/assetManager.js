//The namespace design pattern
var Engine = Engine || {};

//A module to support the loading and storing of any assets (images only for now, sounds may be added later)
Engine.AssetManager = (function () {
    "use strict";

    //Private closure variables
    var downloadQueue = []; //The downloads that need to be done
    var cache = {}; //The stored assets
    var successCount = 0; //How many assets were successfully loaded
    var errorCount = 0; //How many assets had an error whilst loading

    //Add the public methods
    return {

        //Add a new item to be downloaded
        queueDownload: function (path) {
            console.log("Queued: " + path);
            downloadQueue.push(path);
        },

        //Downlaod all the assets in the current download queue, calls the callback once done
        downloadAll: function (downloadCallback) {

            var that = this;
            
            //Make sure we have something to download
            if (downloadQueue.length === 0) {
                downloadCallback();
            }

            //The success callback for when the image has been loaded
            var successCallback = function() {
                console.log(this.src + ' is loaded');
                successCount += 1;

                if (that.isDone()) {
                    downloadCallback();
                }
            };

            //The error callback for each image
            var errorCallback = function() {
                errorCount += 1;

                if (that.isDone()) {
                    downloadCallback();
                }
            };

            //Load the asset using the Image class for every download in the queue
            for (var i = 0; i < downloadQueue.length; i++) {
                //Get the path and create a new image
                var path = downloadQueue[i];
                var img = new Image();

                //Set the callbacks
                img.addEventListener("load", successCallback, false);
                img.addEventListener("error", errorCallback, false);

                //Begin loading
                img.src = path;

                //Set the cache section
                cache[path] = img;
            }


        },

        //Get an asset from the cache
        getAsset: function (path) {
            return cache[path];
        },

        //If all the items have been downloaded
        isDone: function () {
            return (downloadQueue.length) === (successCount + errorCount);
        },

        //Return the percentage of items that have been loaded (between  0 and 1)
        getProgress: function () {
            return (successCount + errorCount) / downloadQueue.length;
        }

    };

}());
