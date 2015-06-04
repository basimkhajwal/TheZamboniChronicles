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

    create: function (gameDescriptor) {
        "use strict";
        
        //Create an empty state object
        var state = Engine.GameState.create(),

            //The global game object
            game,
            
            //The top title
            titleText = Engine.UI.TextArea.create(500, 10, "Level Select");
            
        
        //Setup all the title settings
        titleText.setFamily(Zamboni.Utils.GameSettings.gameFont);
        titleText.setBaseline("top");
        titleText.setSize(30);
        titleText.setColour(Zamboni.Utils.ColourScheme.POMEGRANATE);
        
        //Setup all the stuff for drawing all the levels
        (function () {
            
            
            
        }());
      
        //When the state is created with a new game
        state.onCreate = function (g) {
            game = g;
        };

        state.render = function (ctx) {
            
            //Clear the screen
            ctx.fillStyle = Engine.Utils.ColourScheme.PETER_RIVER;
            ctx.fillRect(0, 0, 1000, 600);
            
            //Draw the title
            titleText.render(ctx);
        };

        state.update = function (delta) {

        };

        //Return the state with all the changed methods
        return state;
    }

};
