//The namespace design pattern
var Engine = Engine || {};

Engine.Game = {

    /*
    *   Create a new game with a gameOptions containing:
    *       state - The initial game state
    *       width, height - The screen dimensions
    *       devmode - Whether to run in development mode or not
    */
    create: function (gameOptions) {

        //Create the 'private' variables, needed in the closure
        var canvas = Engine.Canvas.create(gameOptions.width, gameOptions.height);
        var fpsLogger = Engine.FPSLogger.create();
        var gameStateManager = Engine.GameStateManager.create(this);
        var timer = Engine.Timer.create();

        gameStateManager.setState(gameOptions.state);

        //Return the closure
        return {

            start: function () {

                var update = function (delta) {
                    if(gameOptions.devmode){
                        fpsLogger.log(delta);
                    }

                    gameStateManager.update(delta);
                };

                var render =  function () {
                    canvas.begin();
                    gameStateManager.render(canvas.getContext());
                    canvas.end();
                };

                //Begin the game loop
                timer.start(update, render);
            },

            getGameStateManager: function () {
                return gameStateManager;
            }

        };

    }


};
