//Use the following modules
var Engine = Engine || {};
var Zamboni = Zamboni || {};

//Sub-modules
Zamboni.States = Zamboni.States || {};
Zamboni.Utils = Zamboni.Utils || {};
Engine.UI = Engine.UI || {};

/*
*   A state which allows the user to select from a choice of levels
*   and then creates the appropriate game state
*/
Zamboni.States.LevelState = {

    /*
    *   Create a new level with a gameDescriptor object that has an array of all the levels
    *   E.g. { levels: [...] }
    */
    create: function (gameDescriptor) {
        "use strict";
        
        //Create an empty state object
        var state = Engine.GameState.create(),

            //The global game object
            game,
            
            //The button to return to the menu
            backButton = Engine.UI.TextButton.create(10, 10, 100, 50, String.fromCharCode("0xf177")),

            //The buttons to go to the respective level

            //The top title
            titleText = Engine.UI.TextArea.create(500, 10, "Level Select");
            
        
        //Setup all the title settings
        titleText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        titleText.setBaseline("top");
        titleText.setSize(45);
        titleText.setColour(Zamboni.Utils.ColourScheme.WISTERIA);
        
        //Setup the back button settings
        (function () {
            var buttonText = backButton.getText();
            
            buttonText.setFamily("FontAwesome");
            buttonText.setSize(30);
            buttonText.setColour(Zamboni.Utils.ColourScheme.SILVER);
            
            backButton.setCornerRadius(10);
            backButton.setColour(Zamboni.Utils.ColourScheme.MIDNIGHT_BLUE);
            backButton.setHoverColour(Zamboni.Utils.ColourScheme.BELIZE_HOLE);
            backButton.setClickColour(Zamboni.Utils.ColourScheme.WET_ASPHALT);
        }());
      
        //When the state is created with a new game
        state.onCreate = function (g) {
            game = g;
        };

        state.render = function (ctx) {
            
            //Clear the screen
            ctx.fillStyle = Zamboni.Utils.ColourScheme.TURQUOISE;
            ctx.fillRect(0, 0, 1000, 600);
            
            //Draw the title and back button
            titleText.render(ctx);
            backButton.render(ctx);
        };

        state.update = function (delta) {

            //Update the back button
            backButton.update();

        };

        //Return the state with all the changed methods
        return state;
    }

};
