//The namespace design pattern
var Engine = Engine || {};

/*
*   Game state manager which holds the current state of the game and passes the rendering and update methods to it,
*   provides an abstraction to remove code from the main game class
*/
Engine.GameStateManager = {

    /*
    *   Make a new game state manager for a particular game and hold the current state which is null by default
    */
    create: function (game) {
        "use strict";

        //Private variables
        //The current state, initially null
        var currentActivity = null;

        //Whether or not a state was recently changed (to avoid jitter when changing)
        var changed = false;

        return {
            //Set the state and call the destroy of the current state if it isn't null
            setState: function (activity) {
                //Call the last states destroy if isn't null
                if (currentActivity !== null) {
                    currentActivity.onDestroy();
                }

                //Set the new state and call its create method
                currentActivity = activity;
                currentActivity.onCreate(game);

                //Set changed to true for smooth changes
                changed = true;
            },

            //Get the  current state of state manager
            getState: function () {
                return currentActivity;
            },


            //Update the current state
            update: function (delta) {
                if (currentActivity !== null) {
                    currentActivity.update(delta);
                }
            },

            //Render the current state
            render: function (context) {
                if (currentActivity !== null && !changed) {
                    currentActivity.render(context);
                }

                changed = false;
            }

        };
    }

};
