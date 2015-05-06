//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

Zamboni.States.GameState = {


    create: function () {
        "use strict";

        var state = Engine.GameState.create(),
            game = null,
            world = Zamboni.World.GameWorld.create();


        state.onCreate = function (g) {
            game = g;
        };

        state.render = function (ctx) {
            world.render(ctx);

            //Draw the HUD bar
            ctx.fillStyle = "rgb(0,0,0,0.3)";
            ctx.fillRect(0, 0, 1000, 50);
        };

        state.update = function (delta) {
            world.update(delta);
        };

        return state;
    }

};
