//The namespace design pattern
var Engine = Engine || {};

//An FPS Logger to show the FPS of the game
Engine.FPSLogger = {

    //The create function to make a new FPS Logger
    create: function () {
        "use strict";

        //The private variables that won't be accessible from outside
        var currentDelta = 0,
            frames = 0;

        //Return a closure
        return {

            //Update the fps logger as well as check for log
            log: function (delta) {
                //Update the variables
                currentDelta += delta;
                frames += 1;

                //Log every second and reset the data to avoid over logging
                if (currentDelta > 1) {
                    console.log("FPS Logger: " + frames + "fps");

                    currentDelta = 0;
                    frames = 0;
                }
            }

        };

    }

};
