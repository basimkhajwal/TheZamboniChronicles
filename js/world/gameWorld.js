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

        //Return all the public methods and variables
        return {

            //Render the world on the context ctx
            render: function (ctx) {

            },

            //Update the world with time delta
            update: function (delta) {

            }


        };
    }

};
