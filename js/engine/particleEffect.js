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

        //The default colour settings
        params.startColour = params.startColour || params.colour || Engine.Colour.BLACK || Engine.Colour.create(0, 0, 0);

        //The default variance values
        params.xVariance = params.xVariance || 0;
        params.yVariance = params.yVariance || 0;
        params.axVariance = params.axVariance || 0;
        params.ayVariance = params.ayVariance || 0;

        params.angleVariance = params.angleVariance || 0;
        params.speedVariance = params.speedVariance || 0;
        params.timeVariance = params.timeVariance || 0;

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
                    currentColour: params.startColour,

                    //Whether or not to remove the particle
                    dead: false,

                    //The time settings
                    currentTime: 0,
                    lifeSpan: ranRange(params.lifeSpan - params.lifeSpanVariance, params.lifeSpan + params.lifeSpanVariance)
                };
            },

            //Update a particular particles settings and the delta time
            updateParticle = function (particle, delta) {

                //Move it by the time
                particle.currentTime += delta;

                //Update the velocity by the acceleration
                particle.vx += particle.ax * delta;
                particle.vy += particle.ay * delta;

                //Move by the particle by the velocity
                particle.x += particle.vx * delta;
                particle.y += particle.vy * delta;

                //Set the colour
                particle.currentColour = particle.startColour.linearInterpolation(particle.endColour, (particle.currentTime / particle.lifeSpan));

                //Check if the life span of the particle is over and set the dead variable
                particle.dead = particle.currentTime > particle.lifeSpan;
            },

            //Render the given particle to the canvas context provided
            renderParticle = function (particle, ctx) {

                //Set the colour
                ctx.fillStyle = particle.currentColour.getCanvasColour();

                //Draw a rect for the particle ---- TEMPORARY
                ctx.fillRect(particle.x, particle.y, 5, 5);
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
