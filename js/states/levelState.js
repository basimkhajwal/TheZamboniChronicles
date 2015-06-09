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

            //The global game object and the state manager
            game,
            gsm = game.getGameStateManager(),
            
            //The button to return to the menu
            backButton = Engine.UI.TextButton.create(10, 10, 100, 50, String.fromCharCode("0xf177")),

            //The buttons to go to the respective level
            levelButtons = [],
            
            //The top title
            titleText = Engine.UI.TextArea.create(500, 10, "Level Select"),
            
            //Settings for buttons
            buttonsOffset = 75,
            buttonsPerLine = 5,
            buttonPaddingX = 20,
            buttonPaddingY = 10,
            
            //Calculated settings
            buttonLines = Math.floor(gameDescriptor.levels.length / buttonsPerLine),
            buttonWidth = (1000 - buttonPaddingX * (buttonsPerLine + 1)) / buttonsPerLine,
            buttonHeight = ((600 - buttonsOffset) - buttonPaddingY * (buttonLines + 1)) / buttonLines;
        
        //Setup all the title settings
        titleText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        titleText.setBaseline("top");
        titleText.setSize(45);
        titleText.setColour(Zamboni.Utils.ColourScheme.WISTERIA);
        
        (function () {
            
            var buttonText = backButton.getText(),
                i,
                currentButton,
                currentText;
            
            //Setup the back button settings
            buttonText.setFamily("FontAwesome");
            buttonText.setSize(30);
            buttonText.setColour(Zamboni.Utils.ColourScheme.SILVER);
            backButton.setCornerRadius(10);
            backButton.setColour(Zamboni.Utils.ColourScheme.MIDNIGHT_BLUE);
            backButton.setHoverColour(Zamboni.Utils.ColourScheme.BELIZE_HOLE);
            backButton.setClickColour(Zamboni.Utils.ColourScheme.WET_ASPHALT);
            
            //Setup the level level buttons
            for (i = 0; i < gameDescriptor.levels.length; i += 1) {
                currentButton = Engine.UI.TextButton.create(buttonPaddingX * (i + 1) + buttonWidth * i, buttonPaddingY * (i + 1) + buttonHeight * i, "" + (i + 1));
                currentText = currentButton.getText();
                
                currentText.setFamily(Zamboni.Utils.GameSettings.gameFont);
                currentText.setSize(20);
                currentText.setColour(Zamboni.Utils.ColourScheme.MIDNIGHT_BLUE);
                currentButton.setCornerRadius(5);
                currentButton.setColour(Zamboni.Utils.ColourScheme.SUN_FLOWER);
                currentButton.setHoverColour(Zamboni.Utils.ColourScheme.ORANGE);
                currentButton.setClickColour(Zamboni.Utils.ColourScheme.SUN_FLOWER);
            }
            
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
            
            if (backButton.isClicked()) {
                gsm.setState(Zamboni.States.MenuState.create());
            }

        };

        //Return the state with all the changed methods
        return state;
    }

};
