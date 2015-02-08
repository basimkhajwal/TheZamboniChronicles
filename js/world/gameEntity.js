//The needed modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Any sub-modules
Engine.UI = Engine.UI || {};

Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Zamboni.World = Zamboni.World || {};



//The base entity class that will hold the needed variables for a movable entity
Zamboni.World.GameEntity = {


    createEmpty: function () {
        "use strict";

        return {

            x: 0,
            y: 0,

            width: 20,
            height: 20,

            vx: 0,
            vy: 0


        };

    }


};
