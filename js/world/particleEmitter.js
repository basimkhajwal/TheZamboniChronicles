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
    })

};
