//The namespace design pattern
var Engine = Engine || {};

Engine.GameStateManager = {

    create: function (game) {
        "use strict";

        //Private variables
        var currentActivity = null;
        var changed = false;

        return {
            setState: function (activity) {
                if (currentActivity !== null) {
                    currentActivity.onDestroy();
                }

                currentActivity = activity;
                currentActivity.onCreate(game);

                changed = true;
            },

            getState: function () {
                return currentActivity;
            },

            update: function (delta) {
                if (currentActivity !== null) {
                    currentActivity.update(delta);
                }
            },

            render: function (context) {
                if (currentActivity !== null && !changed) {
                    currentActivity.render(context);
                }

                changed = false;
            }

        };
    }

};
