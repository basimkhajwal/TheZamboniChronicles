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

    //The levels
    levels: {
        TEST: "test.json"
    }


};
