//The namespace design pattern
var Engine = Engine || {};

/*
*   Game state class to be extended but provides the basic function necessary for a state
*   to be used by the GameStateManager
*/
Engine.GameState = {

    /*
    *   Create a new game state, has no base functionality but offers all the default functions
    */
    create: function () {

        //Return a closure
        return {
            //Called when this game is added to the game, with the game passed as the parameter
            onCreate: function (game) {

            },

            //Called around 60 times per second with the delta since the last update
            update: function (delta) {

            },

            //Called around 60 times per second with the canvas context for rendering
            render: function (context) {

            },

            //Called when the state is removed from the game and is replaced by another
            onDestroy: function () {

            }

        };

    }


};
