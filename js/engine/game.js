//The namespace design pattern
var Engine = Engine || {};

Engine.Game = {

    create: function (gameState) {

        //Create the 'private' variables, needed in the closure
        var canvas = Engine.Canvas.create(1000, 600);
        var fpsLogger = Engine.FPSLogger.create();
        var gameStateManager = Engine.GameStateManager.create(this);
        var timer = Engine.Timer.create();

        gameStateManager.setState(gameState);

        //Return the closure
        return {

            start: function () {

                Engine.AssetManager.queueDownload("img/test.png");
                Engine.AssetManager.downloadAll(function () {});

                var update = function (delta) {
                    fpsLogger.log(delta);

                    gameStateManager.update(delta);
                };

                var render =  function () {
                    canvas.begin();

                    gameStateManager.render(canvas.getContext());

                    canvas.getContext().fillRect(10, 10, 20, 20);

                    if (Engine.KeyboardInput.isKeyDown(Engine.Keys.SPACE)) {
                        canvas.getContext().drawImage(Engine.AssetManager.getAsset("img/test.png"), 50, 50);

                    }

                    if (Engine.MouseInput.isMouseDown()) {
                        var mousePos = Engine.MouseInput.getMousePos();

                        console.log("Mouse clicked: " + mousePos.x + ", " + mousePos.y);
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
