//The modules
var Zamboni = Zamboni || {};

//Sub modules
Zamboni.Utils = Zamboni.Utils || {};


/*This is the main game settings file where preferences should be tweaked
*
* Put any new settings here
*/
Zamboni.Utils.GameSettings = {

    //Game width and height, shouldn't be changed otherwise other code might break
    canvasWidth: 1000,
    canvasHeight: 600,

    //Image width's and heights
    fuzzyCloudWidth: 360,
    fuzzyCloudHeight: 180,

    //The font for all the buttons, titles etc.
    gameFont: "Lato",

    //World settings

    //The collision resolution (how many to check per side)
    collisionResolution: 4,

    //The levels
    levels: {
        TEST: "levels/test.json"
        //LEVEL1: "levels/Level1.json"
    },

    tiles: {

        EMPTY: 0,
        GRASS_DARK: 1,
        GRASS: 2,
        CLOUDS: 3,
        CLOUDS_DARK: 4,
        BLACK: 5,
        BLACK_DARK: 6,
        SKY: 7,
        SKY_DARK: 8,
        RED: 9,
        RED_DARK: 10,
        TURQUOISE: 11,
        TURQUOISE_DARK: 12,
        ORANGE: 13,
        ORANGE_DARK: 14,
        PURPLE: 15,
        PURPLE_DARK: 16,
        YELLOW: 17,
        YELLOW_DARK: 18,
        GREY: 19,
        GREY_DARK: 20

    }
};
