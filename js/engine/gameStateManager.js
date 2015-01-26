Game.GameStateManager = {

    create: function () {

        //Private variables
        var currentActivity = null;

        //The closure
        return {

            setState: function (activity) {
                if(currentActivity != null){
                    currentActivity.onDestroy();
                }

                currentActivity = activity;
                currentActivity.onCreate();
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

    }

}
