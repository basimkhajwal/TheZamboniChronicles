//The namespace design pattern
var Engine = Engine || {};

//A module to support the loading and storing of any assets (images only for now, sounds may be added later)
Engine.AssetManager = (function () {
    "use strict";

    //Private closure variables
    //The downloads that need to be done
    var downloadQueue = [],

        //The ajax request queue
        ajaxQueue = [],

        //The stored assets
        cache = {},

        //How many assets were successfully loaded
        successCount = 0,

        //How many assets had an error whilst loading
        errorCount = 0;

    //Add the public methods
    return {

        //Add a new item to be downloaded
        queueDownload: function (path) {
            console.log("Queued: " + path);
            downloadQueue.push(path);
        },

        queueRequest: function (path) {
            console.log("Requested: " + path);
            ajaxQueue.push(path);
        },

        //Downlaod all the assets in the current download queue, calls the callback once done
        downloadAll: function (downloadCallback) {

            //Check if we have a valid download callback, otherwise a simple function
            downloadCallback = downloadCallback || function () {};
            
            //Make sure we have something to download
            if ((downloadQueue.length + ajaxQueue.length) === 0) {
                downloadCallback();
            }

            //Store the function state for closures
            var that = this,

                //The counter variable
                i,

                //The success callback for when the image has been loaded
                successCallback = function () {
                    console.log(this.src + ' is loaded');
                    successCount += 1;

                    if (that.isDone()) {
                        downloadCallback();
                    }
                },

                //The error callback for each image
                errorCallback = function () {
                    errorCount += 1;

                    if (that.isDone()) {
                        downloadCallback();
                    }
                },

                //The request callback
                requestCallback = function (req, url) {

                    if (req !== null) {
                        console.log(url + " successfully loaded");

                        successCount += 1;
                        cache[url] = req.responseText;
                    }

                    if (that.isDone()) {
                        downloadCallback();
                    }

                },

                //The original paths and images
                path = null,
                img = null,
                url = null;

            //Load the asset using the Image class for every download in the queue
            for (i = 0; i < downloadQueue.length; i += 1) {
                //Get the path and create a new image
                path = downloadQueue[i];
                img = new Image();

                //Set the callbacks
                img.addEventListener("load", successCallback, false);
                img.addEventListener("error", errorCallback, false);

                //Begin loading
                img.src = path;

                //Set the cache section
                cache[path] = img;
            }

            //Request all the ajax requests
            for (i = 0; i < ajaxQueue.length; i += 1) {
                //Get the request
                url = ajaxQueue[i];

                //Set the callback and request it
                Engine.Ajax.get(url, requestCallback);
            }

        },

        //Get an asset from the cache
        getAsset: function (path) {
            return cache[path];
        },

        //If all the items have been downloaded
        isDone: function () {
            return (downloadQueue.length + ajaxQueue.length) === (successCount + errorCount);
        },

        //Return the percentage of items that have been loaded (between  0 and 1)
        getProgress: function () {
            return (successCount + errorCount) / (downloadQueue.length + ajaxQueue.length);
        }

    };

}());
