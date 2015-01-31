var Engine = Engine || {};

var testState = (function () {
    "use strict";

    var state = Engine.GameState.create();

    var currentX = 10;
    var currentY = 100;

    var velocity = 100;

    state.update = function (delta) {
        currentX += velocity * delta;
        currentY += velocity * delta;

        if (currentX > 300 || currentX < 0) {
            if (currentX > 400) {
                console.log("WHOOPS, early error!: " + currentX) ;
            }
            currentX = 150;
            velocity *= -1;
            currentY = 250;
        }

    };

    state.render = function (ctx) {
        ctx.fillRect(50, 50, 100, 100);
        ctx.fillRect(currentX, currentY, 10, 10);
    };


    return state;

}());

var startGame = function () {

    var game = Engine.Game.create(testState);

    window.setTimeout(function () {

        game.start();
    }, 1000);


};

window.addEventListener("load", startGame, false);
