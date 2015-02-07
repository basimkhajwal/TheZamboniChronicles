//The namespace design pattern
var Engine = Engine || {};

//The timer module that will run an update and a render call back 60 times a second using the best browser capabilities
Engine.Timer = {

    create: function () {
        "use strict";

        //Try and get the animation frame from the window, any possible way, otherwise default to the inefficient timer interval method with a callback
        var requestAnimFrame = (function () {

            return window.requestAnimationFrame        ||
                window.webkitRequestAnimationFrame     ||
                window.mozRequestAnimationFrame        ||
                window.oRequestAnimationFrame          ||
                window.msRequestAnimationFrame         ||

                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }());

        //The last time since it was called
        var lastTime = 0;

        //Return a closure
        return {
            start: function (updateCallBack, renderCallBack) {

                //Set the initial value
                lastTime = Date.now();

                function main() {
                    //Get the new time and work out how much has elapsed since the last tick in milliseconds
                    var now = Date.now();
                    var delta = (now - lastTime) / 1000.0;

                    //Call the callbacks
                    updateCallBack(delta);
                    renderCallBack();

                    //Request the next frame
                    lastTime = now;
                    requestAnimFrame(main);

                }

                //Start the timer
                main();
            }

        };

    }

};
