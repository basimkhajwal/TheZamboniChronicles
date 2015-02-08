//The needed modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Any sub-modules
Engine.UI = Engine.UI || {};

Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Zamboni.World = Zamboni.World || {};

/*
*   The main world class that will contain the current level and any game object (players, enemies etc.)
*/
Zamboni.World.GameWorld = {

    /*
    *   Create a new empty world
    */
    create: function () {
        "use strict";

        //All the private methods and variables
        var tiledMap = Engine.TiledMap.create(50, 30, 20, 20);

        console.log(Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.levels.TEST));

        /*var level = Zamboni.World.LevelParser.parse(Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.levels.TEST));

        (function () {
            var i;

            for (i = 0; i < level.length; i += 1) {
                tiledMap.setTileAt(i / 50, i % 50, level[i]);
            }
        }());*/

        tiledMap.putRenderable(1, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS));
        tiledMap.putRenderable(2, Engine.AssetManager.getAsset(Zamboni.Utils.Assets.GRASS_DARK));

        //Return all the public methods and variables
        return {

            //Render the world on the context ctx
            render: function (ctx) {
                tiledMap.render(ctx);
            },

            //Update the world with time delta
            update: function (delta) {

            }


        };
    }

};
