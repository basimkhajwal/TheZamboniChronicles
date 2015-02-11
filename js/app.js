/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

//^ Some JS Lint stuff

/*** Console modifications so that we can see that is happening***/
if (typeof console !== "undefined") {
    if (typeof console.log !== "undefined") {
        console.olog = console.log;
    } else {
        console.olog = function () {};
    }
}

console.log = function(message) {
    console.olog(message);
    document.getElementById("debugDiv").innerHTML += message + "<br>";
};

console.error = console.debug = console.info =  console.log

window.setInterval(function() {
  var elem = document.getElementById('debugDiv');
  elem.scrollTop = elem.scrollHeight;
}, 1000);

//End console stuff

//The modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//The sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};

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
