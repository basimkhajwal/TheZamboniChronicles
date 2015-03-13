//The engine module for use
var Engine = Engine || {};

/*
*   An emmitter that holds an array of particle effects and updates and renders them
*/
Engine.ParticleEmitter = {

    /*
    *   Create a new particle emitter with the 'params' argument defined with the following properties:
    *
    *   - Position (x,y)
    *   - Position variance (xVariance, yVariance)
    *   - Initial velocity (vx, vy) and the variance (vxVariance, vyVariance)
    *   - Type of particle e.g. square, circle or image
    *   - More than one type of particle?
    *   - Particle dimensions (particleWidth, particleHeight)
    *   - Angle (angle)
    *   - Angle Variance from given angle (angleVariance)
    *   - The particle life span (particleLife)
    *   - The duration to emit for (emitLife)
    *   - Start and End colours / saturations
    *
    */
    create: function (params) {
        "use strict";

        // ------------------------ The private methods and stuff ----------------------

        //Holds all the particle objects
        var particleObjects = [],

            //Utility function for generating random bounded values
            ranRange = function (min, max) {
                return min + (Math.random() * (max - min));
            },

            //Create a new random particle that fits the specification
            spawnParticle = function () {


                //Return the particle object
                return {

                    //The initial positions and angle (with the random variance)
                    x: ranRange(params.x - params.xVariance, params.x + params.xVariance),
                    y: ranRange(params.y - params.yVariance, params.y + params.yVariance),
                    angle: ranRange(params.angle - params.angleVariance, params.angle + params.angleVariance),

                    //The movement settings
                    vx: ranRange(params.vx - params.vxVariance, params.vx + params.vxVariance),
                    vy: ranRange(params.vy - params.vyVariance, params.vy + params.vyVariance),
                    ax: "THIS IS TEMP ILL FINISH THIS LATER :P",


                    //The colour settings
                    startColour: params.startColour,
                    endColour: params.endColour,
                    currentColour: params.startColour


                };
            },

            //Update a particular particles settings and the delta time
            updateParticle = function (particle, delta) {

            },

            //Render the given particle to the canvas context provided
            renderParticle = function (particle, ctx) {

            };




        //----------------------- Closure with all the public methods ------------------------------
        return {


            //Update this emitter with the delta time provided
            update: function (delta) {

            },

            //Render the particles in this emitter onto the canvas context given
            render: function (ctx) {

            }


        };

    }

};
