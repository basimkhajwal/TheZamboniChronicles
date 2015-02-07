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
        var x = 0, y = 0;
        var state = Engine.GameState.create();
        var game = null;

        map.putRenderable(1, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.CLOUD_FUZZY));

        state.onCreate = function (g) {
            game = g;
        };

        state.render = function (ctx) {
            ctx.fillStyle = Zamboni.Utils.ColourScheme.BACKGROUND_COLOUR;
            ctx.fillRect(0, 0, 1000, 600);

            map.render(ctx);
        };

        state.update = function (delta) {

        };

        return state;
    }

};
