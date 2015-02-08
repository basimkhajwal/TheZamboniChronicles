/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

//^ Some JS Lint stuff

//The modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//The sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};

Engine.UI = Engine.UI || {};

var testState = (function () {
    "use strict";

    var state = Engine.GameState.create();

    var currentX = 10;
    var currentY = 100;
    var myText = Engine.UI.TextArea.create(200, 200, "SOME RANDOM TEST", 20, "#FF0000", "cursive", "bold");
    var velocity = 100;

    state.update = function (delta) {
        currentX += velocity * delta;
        currentY += velocity * delta;

        if (currentX > 300 || currentX < 0) {
            currentX = 150;
            velocity *= -1;
            currentY = 250;
        }

    };

    state.render = function (ctx) {
        ctx.fillRect(50, 50, 100, 100);
        ctx.fillRect(currentX, currentY, 10, 10);
        myText.render(ctx);
    };


    return state;

}());



var startGame = function () {
    "use strict";

    var game = Engine.Game.create({
        state: Zamboni.States.LoadingState.create(),
        width: Zamboni.Utils.GameSettings.canvasWidth,
        height: Zamboni.Utils.GameSettings.canvasHeight,
        devmode: true
    });

    game.start();

};

window.addEventListener("load", startGame, false);
