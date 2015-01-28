//The namespace design pattern
var Engine = Engine || {};

Engine.GameState = {

    create: function () {

        //Return a closure
        return {
            onCreate: function (game) {

            },

            update: function (delta) {

            },

            render: function (context) {

            },

            onDestroy: function () {

            }

        };

    }


};
