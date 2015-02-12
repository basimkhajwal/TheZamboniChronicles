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
        "use strict";

        var gameStateManager = null;

        //Return the closure
        return {

            start: function () {

                //Create the 'private' variables, needed in the closure
                var canvas = Engine.Canvas.create(gameOptions.width, gameOptions.height);
                var fpsLogger = Engine.FPSLogger.create();
                var timer = Engine.Timer.create();
                var pause = false;
                var timeout = false;
                
                window.addEventListener('focus', function() {
                    pause = false;
                });

                window.addEventListener('blur', function() {
                    pause = true;
                });

                gameStateManager = Engine.GameStateManager.create(this);
                gameStateManager.setState(gameOptions.state);

                var update = function (delta) {
                    if (gameOptions.devmode) {
                        fpsLogger.log(delta);
                    }
                    
                    if (1000 / delta < 40) {
                        pause = true;
                    } else if (!timeout){
                        window.setTimeout(function() {
                            pause = false;
                        }, 1000);
                        
                        timeout = true;
                    }
                    
                    if (!pause) {
                        gameStateManager.update(delta);
                    }
                };

                var render =  function () {
                    canvas.begin();
                    gameStateManager.render(canvas.getContext());
                    
                    if (pause) {
                        var ctx = canvas.getContext();
                        
                        ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
                        ctx.fillRect(0, 0, gameOptions.width, gameOptions.height);
                        
                        ctx.fillStyle = "rgb(255, 255, 255)";
                        ctx.fillText("Frame rate too low", 500, 100);
                        
                        if (timeout) {
                            ctx.fillText("Game restarting....", 500, 300);
                        }
                    }
                    
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
