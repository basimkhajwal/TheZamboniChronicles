Game.GameStateManager = {

    create: function () {

        //Private variables
        var activityStack = [];
        var currentActivity = null;

        //The closure
        return {

            pushActivity: function (activity) {

                if( currentActivity !== null){
                    activityStack.push(currentActivity);
                    currentActivity.onPause();
                }

                currentActivity = activity;
                currentActivity.onCreate();
            },

            popActivity: function () {

                currentActivity.onDestroy();
                var oldActivity = currentActivity;

                currentActivity = activityStack.pop();
                currentActivity.onResume();

                return oldActivity;
            },

            update: function (delta) {
                currentActivity.update(delta);
            },

            render: function (context) {
                currentActivity.render(context);
            }

        };

    }

}
