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
    
    //Player settings
    playerScreenX: 500,
    playerScreenY: 300,
    
    //The number of clouds in the background
    backgroundCloudNumber: 5,

    //The levels
    levels: {
        TEST: "levels/test.json",
        TEST2: "levels/test2.json"
        //LEVEL1: "levels/Level1.json"
    },

    //The assets to load
    assets: {

        CLOUD_FUZZY: "img/cloud-fuzzy.png",
        MENU_BG_FUZZY: "img/menu-bg-fuzzy.png",

        BACKGROUND_MOUNTAINS: "img/background-mountains.png",
        BACKGROUND_MOUNTAINS_LIGHT: "img/background-mountains-1.png",
        BACKGROUND_MOUNTAINS_LIGHTER: "img/background-mountains-2.png",

        //The tiles
        BLACK: "img/tiles/black.png",
        BLACK_DARK: "img/tiles/black_dark.png",
        CLOUDS: "img/tiles/clouds.png",
        CLOUDS_DARK: "img/tiles/clouds_dark.png",
        GRASS: "img/tiles/grass.png",
        GRASS_DARK: "img/tiles/grass_dark.png",
        GREY: "img/tiles/grey.png",
        GREY_DARK: "img/tiles/grey_dark.png",
        ORANGE: "img/tiles/orange.png",
        ORANGE_DARK: "img/tiles/orange_dark.png",
        PURPLE: "img/tiles/purple.png",
        PURPLE_DARK: "img/tiles/purple_dark.png",
        RED: "img/tiles/red.png",
        RED_DARK: "img/tiles/red_dark.png",
        SKY: "img/tiles/sky.png",
        SKY_DARK: "img/tiles/sky_dark.png",
        TURQUOISE: "img/tiles/turquoise.png",
        TURQUOISE_DARK: "img/tiles/turquoise_dark.png",
        YELLOW: "img/tiles/yellow.png",
        YELLOW_DARK: "img/tiles/yellow_dark.png",

        //The sprites
        PLAYER: "img/sprites/player.png",
        JAGO: "img/sprites/jago.png"

    },

    //The numbers for all the tiles (for use with tiled maps)
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
