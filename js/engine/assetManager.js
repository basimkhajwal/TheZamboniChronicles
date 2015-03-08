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

        //The sound/music request queue
        soundQueue = [],

        //The stored assets
        cache = {},

        //How many assets were successfully loaded
        successCount = 0,

        //How many assets had an error whilst loading
        errorCount = 0;

    //Add the public methods
    return {

        // -------------- The Request Utility Functions ---------------------------

        //Add a new image to be downloaded
        queueDownload: function (path) {
            console.log("Queued: " + path);
            downloadQueue.push(path);
        },

        //Add a new AJAX request
        queueRequest: function (path) {
            console.log("Requested: " + path);
            ajaxQueue.push(path);
        },

        //Add a new sound load effect
        queueSound: function (path) {
            console.log("Requested: " + path);
            soundQueue.push(path);
        },


        // ------------------ The Downloading Functions -----------------------------

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

                // ----------- Callbacks -------

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

                    //If the request if valid
                    if (req !== null) {
                        console.log(url + " successfully loaded");

                        successCount += 1;
                        cache[url] = req.responseText;
                    }


                    //Check if we have finished
                    if (that.isDone()) {
                        downloadCallback();
                    }

                },

                //The callback for sounds when done
                soundCallback = function () {

                    //Notify of the sound load
                    console.log(this.src + " is loaded");

                    //Add another count to success
                    successCount += 1;

                    //Check if we have finished
                    if (that.isDone()) {
                        downloadCallback();
                    }
                },

                // ------------- End Callbacks -----------

                //The original paths and images
                path = null,
                img = null,
                snd = null,
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

            //Request all the sounds
            for (i = 0; i < soundQueue.length; i += 1) {

                //Get the paths and make a new sound
                path = soundQueue[i];
                snd = new Audio();

                //Set the callbacks and settings
                snd.addEventListener("canplaythrough", soundCallback, false);
                snd.src = path;

                //Add it to the cache
                cache[path] = snd;
            }

            //Request all the ajax requests
            for (i = 0; i < ajaxQueue.length; i += 1) {
                //Get the request
                url = ajaxQueue[i];

                //Set the callback and request it
                this.getAjax(url, requestCallback);
            }

        },

        //An AJAX request function
        getAjax: function (url, onchange) {
            var request = new XMLHttpRequest();

            //The request handler
            request.onreadystatechange = function () {
                if ((request.readyState === 4) && (request.status === 200)) {
                    onchange(request, url);
                } else {
                    onchange(null, url);
                }
            };

            //Send the request
            request.open("GET", url, true);
            request.send();
        },

        // -------------- External Util Functions --------------------------

        //Get an asset from the cache
        getAsset: function (path) {
            return cache[path];
        },

        //If all the items have been downloaded
        isDone: function () {
            return (downloadQueue.length + ajaxQueue.length + soundQueue.length) === (successCount + errorCount);
        },

        //Return the percentage of items that have been loaded (between  0 and 1)
        getProgress: function () {
            return (successCount + errorCount) / (downloadQueue.length + ajaxQueue.length + soundQueue.length);
        }

    };

}());
