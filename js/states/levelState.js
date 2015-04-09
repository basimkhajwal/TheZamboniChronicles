//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

/*
*   A state which allows the user to select from a choice of levels
*   and then creates the appropriate game state
*/
Zamboni.States.LevelState = {

    create: function () {
        "use strict";

        //Create an empty state object
        var state = Engine.GameState.create(),

            //The global game object
            game;

        //When the state is created with a new game
        state.onCreate = function (g) {
            game = g;
        };

        state.render = function (ctx) {

        };

        state.update = function (delta) {

        };

        //Return the state with all the changed methods
        return state;
    }

};
