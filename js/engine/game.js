Engine.Game = {

    create: function () {

        //Create the 'private' variables, needed in the closure
        var canvas = Engine.Canvas.create(1000, 600);
        var fpsLogger = Engine.FPSLogger.create();
        var gameStateManager = Engine.GameStateManager.create();
        var timer = null;

        //Return the closure
        return {

            start: function () {

                var update = function (delta) {
                    fpsLogger.log(delta);
                };

                var render =  function () {
                    canvas.begin();

                    canvas.getContext().fillRect(10,10,20,20);

                    canvas.end();
                };

                timer = Engine.Timer.create(update, render);

                //Begin the game loop
                timer.start();
            }

        };

    }


}

