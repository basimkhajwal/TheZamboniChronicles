//The engine module for use
var Engine = Engine || {};



/*
*   A particle effect class for use in game, there are the following sections:
*
*   1. Particle Effect - A base object to hold details about each particle
*   2. Manager - holds a group of particle effects and renders them
*
*/
Engine.Particle = {

    /*
    *   Make a new particle effect with the settings as given
    *   - x, y, vx, vy, ax, ay
    *
    */
    create: function (params) {
        "use strict";



        return {



        };
    }

};


/*
*   An emmitter that holds an array of particle effects and updates and renders them
*/
Engine.ParticleEmitter = {

    /*
    *   Create a new particle emitter with the 'params' argument defined with the following properties:
    *
    *   - Position (x,y)
    *   - Type of particle (square, circle or image)
    *   - More than one type of particle?
    *   - Particle dimensions
    *   - Angle
    *   - Angle Variance from given angle
    *   - The particle life span
    *   - The duration to emit for
    *   - Start and End colours / saturations
    *
    */
    create: function (params) {
        "use strict";

        //The private methods and stuff
        var particles = [],

            //Create a new random particle that fits the specification
            spawnParticle = function () {


                //Return the particle object
                return {

                };
            },

            updateParticle = function (particle) {

            },

            renderParticle = function (particle) {

            };




        //Return a closure with all the public methods
        return {

        };

    }

};
