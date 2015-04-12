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
    *   - The minimum and maximum number of particles
    *   - The number of particles emmited per second

    Actual properties needed:
    x, y, startColour, endColour, speed, lifeSpan, particlesPerSecond, maxParticles


    */
    create: function (params) {
        "use strict";

        // ------------------------ The private methods and stuff ----------------------

        //The default colour settings
        params.startColour = params.startColour || params.colour || Engine.Colour.BLACK || Engine.Colour.create(0, 0, 0, 0);
        params.endColour = params.endColour || params.startColour;

        //The default variance values
        params.xVariance = params.xVariance || 0;
        params.yVariance = params.yVariance || 0;
        params.axVariance = params.axVariance || 0;
        params.ayVariance = params.ayVariance || 0;

        params.angleVariance = params.angleVariance || 0;
        params.speedVariance = params.speedVariance || 0;
        params.lifeSpanVariance = params.lifeSpanVariance || 0;
        params.timeVariance = params.timeVariance || 0;

        //The dimensions for rendering
        params.particleWidth = params.particleWidth || 10;
        params.particleHeight = params.particleHeight || 10;

        //Take angle and the variance in degrees but change them to radians for processing
        params.angle = params.angle * (Math.PI / 180);
        params.angleVariance = params.angleVariance * (Math.PI / 180);

        //Holds all the particle objects
        var particleObjects = [],

            //Keep track of how many particles need to be emitted
            particlesToEmit = 0,

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
            renderParticle = params.renderPaticle || function (particle, ctx) {

                //Set the colour
                ctx.fillStyle = particle.currentColour.getCanvasColour();

                //Draw a rect for the particle ---- TEMPORARY
                ctx.fillRect(particle.x, particle.y, params.particleWidth, params.particleHeight);
            };




        //----------------------- Closure with all the public methods ------------------------------
        return {

            //Allow manual particle emission
            emitParticle: function () {

                //Spawn a new particle and add it to the list, regardless of max values
                particleObjects.push(spawnParticle());

            },

            //Update this emitter with the delta time provided
            update: function (delta) {

                //Update how many particles are needed to be emmited
                particlesToEmit += delta * params.particlesPerSecond;

                //Counter variable and iterative variable
                var i, particle;

                //Iterate over all the particles
                for (i = 0; i < particleObjects.length; i += 1) {
                    particle = particleObjects[i];

                    //Call the update movement method
                    updateParticle(particle, delta);

                    //Check if it is dead
                    if (particle.dead) {
                        //Remove the particle, add decrement so we don't skip a particle
                        particleObjects.splice(i, 1);
                        i -= 1;
                    }

                }

                //While we have particles to emit we add a new particle, and no more than the maximum
                while (particlesToEmit > 1 && particleObjects.length < params.maxParticles) {

                    //Spawn and add a new particle
                    this.emitParticle();

                    //Decrement it because we have just emitted one
                    particlesToEmit -= 1;
                }

                //Make sure that we have no negative particles to spawn
                particlesToEmit = Math.max(0, particlesToEmit);
            },

            //Render the particles in this emitter onto the canvas context given
            render: function (ctx) {

                //Render all the particles one by one
                particleObjects.forEach(function (particle) {
                    renderParticle(particle, ctx);
                });

            },

            //Set the position to move emitter, doesn't affect already emitted particles
            setPosition: function (x, y) {
                params.x = x;
                params.y = y;
            },

            //Get the params so that they can be changed
            getParams: function () {
                return params;
            }
        };

    }

};
