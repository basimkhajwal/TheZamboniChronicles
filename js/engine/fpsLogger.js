Engine.FPSLogger = {

    create: function () {

        var currentDelta = 0;
        var frames = 0;

        //Return a closure
        return {

            log: function (delta) {
                currentDelta += delta;
                frames++;

                if (currentDelta > 1){
                    console.log("FPS Logger: " + frames + "fps");

                    currentDelta = 0;
                    frames = 0;
                }
            }

        };

    }

};
