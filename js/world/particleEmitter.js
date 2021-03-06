//The modules needed for this file
var Zamboni = Zamboni || {};
var Engine = Engine || {};


/*
*   A top level class to hold the various particle emitters that are used through the world
*/
Zamboni.World.ParticleEmitters = {

    //A particle emitter for ground particles when an entity moves
    groundEmitter: Engine.ParticleEmitter.create({

        //The default position (will be changed as rendered / updated)
        x: 0,
        y: 0,

        //The gravity is high but no side accel
        ax: 0,
        ay: 30,

        //An angle between 0 and 180
        angle: 90,
        angleVariance: 150,

        //How fast different particles will go
        speed: 40,
        speedVariance: 10,

        //Small particles
        particleWidth: 4,
        particleHeight: 4,

        //A short life span (in seconds)
        lifeSpan: 0.3,

        startColour: Engine.Colour.create(160, 120, 0, 255),
        endColour: Engine.Colour.create(110, 80, 0, 125),

        maxParticles: 60,
        particlesPerSecond: 0
    }),

    //A particle emitter for brick breaks
    brickEmitter: Engine.ParticleEmitter.create({

        //The default position (will be changed as rendered / updated)
        x: 0,
        y: 0,

        //The gravity is high but no side accel
        ax: 0,
        ay: 800,

        xVariance: 10,
        yVariance: 10,

        //An angle between 0 and 360
        angle: 0,
        angleVariance: 180,

        //How fast different particles will go
        speed: 40,
        speedVariance: 20,

        particleWidth: 8,
        particleHeight: 8,

        //A short life span (in seconds)
        lifeSpan: 0.5,

        startColour: Engine.Colour.create(149, 165, 166, 255),
        endColour: Engine.Colour.create(149, 165, 166, 150),

        maxParticles: 60,
        particlesPerSecond: 0
    }),

    //A particle emitter for lava areas
    lavaEmitter: Engine.ParticleEmitter.create({

        //The default position (will be changed as rendered / updated)
        x: 0,
        y: 0,

        //The gravity is high but no side accel
        ax: 0,
        ay: 30,

        //An angle between 0 and 180 (negate it)
        angle: -90,
        angleVariance: 70,

        //How fast different particles will go
        speed: 60,
        speedVariance: 10,

        particleWidth: 6,
        particleHeight: 6,

        //A short life span (in seconds)
        lifeSpan: 1,

        startColour: Engine.Colour.create(211, 84, 0, 255),
        endColour: Engine.Colour.create(243, 156, 18, 255),

        maxParticles: 60,
        particlesPerSecond: 0
    }),

    //Function to update all the particle emitters in this object
    update: function (delta) {

        "use strict";

        //Iteration var for the emitter
        var emitter;

        //Loop through any possible emitters
        for (emitter in this) {

            //Check to see if it is a valid emitter
            if (this.hasOwnProperty(emitter) && this[emitter].hasOwnProperty("update")) {

                //If so, then update it
                this[emitter].update(delta);
            }
        }

    }

};
