/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

//^ Some JS Lint stuff

//The modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//The sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};

//Call back to start a new game
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

//When the page loads, start the game
window.addEventListener("load", startGame, false);
