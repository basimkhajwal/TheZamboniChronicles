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
    *   - Type of particle e.g. square, circle or image
    *   - More than one type of particle?
    *   - Particle dimensions (particleWidth, particleHeight)
    *   - Angle (angle)
    *   - Angle Variance from given angle (angleVariance)
    *   - The speed of the particle and its variance
    *   - The particle life span (particleLife) and its variance
    *   - The duration to emit for (emitLife)
    *   - Start and End colours / saturations
    *
    */
    create: function (params) {
        "use strict";

        // ------------------------ The private methods and stuff ----------------------


        //The default variance values
        params.xVariance = params.xVariance || 0;
        params.yVariance = params.yVariance || 0;
        params.vxVariance = params.vxVariance || 0;
        params.vyVariance = params.vyVariance || 0;
        params.axVariance = params.axVariance || 0;
        params.ayVariance = params.ayVariance || 0;

        //Holds all the particle objects
        var particleObjects = [],

            //Utility function for generating random bounded values
            ranRange = function (min, max) {
                return min + (Math.random() * (max - min));
            },

            //Create a new random particle that fits the specification
            spawnParticle = function () {

                //Calculate the angle
                var angle = ranRange(params.angle - params.angleVariance, params.angle + params.angleVariance),

                    //Calculate the speed
                    speed = ranRange(params.speed - params.speedVariance, params.speed + params.speedVariance);

                //Return the particle object
                return {

                    //The initial positions
                    x: ranRange(params.x - params.xVariance, params.x + params.xVariance),
                    y: ranRange(params.y - params.yVariance, params.y + params.yVariance),

                    //Calculate the velocity from the angle using trig functions
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,

                    //Set the acceleration variables with their respective variances
                    ax: ranRange(params.ax - params.axVariance, params.ax + params.axVariance),
                    ay: ranRange(params.ay - params.ayVariance, params.ay + params.ayVariance),

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
