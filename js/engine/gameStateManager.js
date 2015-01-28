Engine.GameStateManager = {

    create: function () {

        //Private variables
        var currentActivity = null;

        //Make an empty closure
        var that = {};

        //Add all functions
        that.prototype = {

            setState: function (activity) {
                if(currentActivity != null){
                    currentActivity.onDestroy();
                }

                currentActivity = activity;
                currentActivity.onCreate(that);
            },

            getState: function () {
                return currentActivity;
            },

            update: function (delta) {
                if (currentActivity != null) {
                    currentActivity.update(delta);
                }
            },

            render: function (context) {
                if (currentActivity != null) {
                    currentActivity.render(context);
                }
            }

        };

        return that;
    }

}