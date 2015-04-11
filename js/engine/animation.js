//Use the engine module
var Engine = Engine || {};



/*
*   An animation class for holding a set of key frames and a time limit
*   which will be used for sprites, tiles etc.
*/
Engine.Animation = {

    /*
    *   Create a new animation with the frames given and a time
    *   per frame and whether to restart or not
    */
    create: function (frames, frameDuration, onLoop) {
        "use strict";

        //The total number of frames
        var numFrames = frames.length,

            //The index of the frame that we are at
            frameIndex = 0,

            //Whether or not this animation is running
            stopped = false,

            //The current time (in seconds) of the animation that we are in
            currentTime = 0;


        //Return a closure with all the public fields
        return {

            // ------------------ Updating Method(s) -------------------

            //Update the animation by the specified amount
            update: function (delta) {

                //If the animation is stopped then quit early
                if (stopped) {
                    return;
                }

                //Advance the time
                currentTime += delta;

                //If we have finished the current frame (repeat for large deltas if running slow)
                while (currentTime > frameDuration) {

                    //Set back the current time and advance the frame
                    currentTime -= frameDuration;
                    frameIndex += 1;

                    //Check if frame has gone off
                    if (frameIndex >= numFrames) {

                        //If we are looping then reset
                        if (onLoop) {
                            this.restart();
                        } else {
                            //Otherwise animation has ended
                            frameIndex = numFrames - 1;
                            stopped = true;

                            //Break function execution
                            return;
                        }

                    }
                }
            },

            //Reset the animation but don't start it again
            reset: function () {
                frameIndex = 0;
                currentTime = 0;
            },

            //Start the animation from the frame it left at
            start: function () {
                stopped = false;
            },

            //Pause the animation at the current frame
            pause: function () {
                stopped = true;
            },

            //Restart the animation
            restart: function () {
                this.reset();
                this.start();
            },

            // ------------------ Getters & Setters -------------------
            getCurrentFrame: function () {
                return frames[frameIndex];
            },

            setFrameIndex: function (newIndex) {
                frameIndex = newIndex;
            },

            getFrameIndex: function () {
                return frameIndex;
            },

            getCurrentTime: function () {
                return currentTime;
            },

            setOnLoop: function (setLoop) {
                onLoop = setLoop;
            },

            isOnLoop: function () {
                return onLoop;
            },

            isFinished: function () {
                return stopped;
            }

        };
    }


};
