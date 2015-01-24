Game.Game = {

    create: function () {

        //Create the 'private' variables, needed in the closure
        var canvas = Game.Canvas.create(1000, 600);
        var fpsLogger = Game.FPSLogger.create();
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

                timer = Game.Timer.create(update, render);

                //Begin the game loop
                timer.start();
            }

        };

    }


}

