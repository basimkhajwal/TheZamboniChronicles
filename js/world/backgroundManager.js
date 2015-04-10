//The modules needed for this file
var Zamboni = Zamboni || {};
var Engine = Engine || {};

//Manage the background stuff (clouds and parallax scrolling etc)
Zamboni.World.BackgroundManager = (function () {

    "use strict";

    //Generate a random number between the two stated values
    var getRan = function (min, max) {
            return Math.random() * (max - min) + min;
        },

        //The iterating variable
        i,

        //The world descriptor to use
        worldDescriptor,

        //Variables for easy access
        cloudImg,
        cloudWidth = Zamboni.Utils.GameSettings.fuzzyCloudWidth,
        cloudHeight = Zamboni.Utils.GameSettings.fuzzyCloudHeight,

        //Generate a new random cloud
        genCloud = function (genAnywhere) {
            //The speed of the cloud in the x direction
            var vx,

                //A random size
                width = cloudWidth * getRan(0.2, 0.5),
                height = cloudHeight * getRan(0.2, 0.5),

                //The position (to be set)
                x,
                y;

            //Get a random velocity of a magnitude atleast 10
            do {
                vx = getRan(-40, 40);
            } while (Math.abs(vx) < 10);

            //If generating anywhere on screen then do so
            //otherwise generate clouds only off the screen so they move in
            if (genAnywhere) {
                x = getRan(0, worldDescriptor.worldWidth - width);
                y = getRan(50, (worldDescriptor.worldHeight - height) - 200);
            } else {
                x = (vx > 0) ? getRan(-400, -1 * (worldDescriptor.worldWidth + 10)) : getRan(worldDescriptor.worldWidth + 10, worldDescriptor.worldWidth + 200);
                y = getRan(50, 200 - worldDescriptor.worldHeight);
            }

            //Return the array of the cloud details
            return [x + worldDescriptor.camera.getX(), y + worldDescriptor.camera.getY(), width, height, vx];
        },

        //The clouds each have an x,y,width,height and vx
        clouds = [],

        //The position of the background mountains
        backgroundMountains = [],

        //The images to draw for the background
        mountainImg,

        //The amount to test whether a section is off the screen
        offscreenAmount = 100;

    return {

        //Reset the background manager
        create: function (worldDesc) {

            //Get the assets needed
            mountainImg = [
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.BACKGROUND_MOUNTAINS_LIGHTER),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.BACKGROUND_MOUNTAINS_LIGHT),
                Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.BACKGROUND_MOUNTAINS)
            ];

            cloudImg = Engine.AssetManager.getAsset(Zamboni.Utils.GameSettings.assets.CLOUD_FUZZY);

            //Set the world descriptor
            worldDescriptor = worldDesc;

            //Add the initial clouds
            for (i = 0; i < Zamboni.Utils.GameSettings.backgroundCloudNumber; i += 1) {
                clouds.push(genCloud(true));
            }

            //Set the initial background positions
            for (i = 0; i < 3; i += 1) {
                backgroundMountains.push({
                    x: worldDescriptor.camera.getX(),
                    y: worldDescriptor.worldHeight - 700 + i * 125
                });
            }
        },

        update: function (delta) {

            //Iterate over all the clouds
            for (i = 0; i < clouds.length; i += 1) {
                //Move them by their x velocity
                clouds[i][0] += (clouds[i][4] * delta) - (worldDescriptor.cameraChangeX * 0.1);

                //Check if they are off the screen, if so then reset it to a new cloud
                if ((clouds[i][4] < 0 && clouds[i][0] + clouds[i][2] < -offscreenAmount) || (clouds[i][4] > 0 && clouds[i][0] > worldDescriptor.worldWidth + offscreenAmount)) {
                    clouds[i] = genCloud(false);
                }
            }

            //Set the initial counter variable
            i = 0;

            //Iterate over each mountain that we are drawing
            backgroundMountains.forEach(function (mountain) {
                //Move mountains further away by less than the closer ones
                mountain.x += worldDescriptor.cameraChangeX * (1 - (i * 0.2));

                //Get the point on the screen of the mountain relative to the camera
                var point = mountain.x - worldDescriptor.camera.getX();

                //Check if the mountain goes off the screen and move it so that it doesn't
                if (point < 0) {
                    mountain.x += 1000;
                } else if (point > 1000) {
                    mountain.x -= 1000;
                }

                //Increment i for the next mountain
                i += 1;
            });
        },

        render: function (ctx) {

            //No image smoothing to keep pixelated effect
            ctx.imageSmoothingEnabled = false;

            //Draw 3 background images, one to its left, one at the position and one to the right
            i = 0;
            backgroundMountains.forEach(function (mountain) {
                ctx.drawImage(mountainImg[i], mountain.x, mountain.y, 1000, 600);
                ctx.drawImage(mountainImg[i], mountain.x - 1000, mountain.y, 1000, 600);
                ctx.drawImage(mountainImg[i], mountain.x + 1000, mountain.y, 1000, 600);

                i += 1;
            });

            //Draw the clouds with a bit of transparency and no image smoothing
            ctx.globalAlpha = 0.8;
            for (i = 0; i < clouds.length; i += 1) {
                ctx.drawImage(cloudImg, clouds[i][0], clouds[i][1], clouds[i][2], clouds[i][3]);
            }

            //Set back to default
            ctx.globalAlpha = 1.0;
            ctx.imageSmoothingEnabled = true;
        }

    };

}());
