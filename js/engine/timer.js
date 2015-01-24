Game.Timer = {

    create: function (updateCallBack, renderCallBack) {

        //Store the arguments as variables so that the closure can access them
        var updateCallBack = updateCallBack;
        var renderCallBack = renderCallBack;

        //Return a closure
        return {
            start: function () {

                //Try and get the animation frame from the window, any possible way, otherwise default to the inefficient timer interval method with a callback
                var requestAnimFrame = (function(){
                    return window.requestAnimationFrame        ||
                        window.webkitRequestAnimationFrame     ||
                        window.mozRequestAnimationFrame        ||
                        window.oRequestAnimationFrame          ||
                        window.msRequestAnimationFrame         ||

                        function(callback){
                            window.setTimeout(callback, 1000 / 60);
                        };
                })();

                var lastTime = 0;

                function main() {
                    var now = Date.now();
                    var delta = (now - lastTime) / 1000.0;

                    updateCallBack(delta);
                    renderCallBack();

                    lastTime = now;
                    requestAnimFrame(main);

                };

                //Start the timer
                main();
            }

        };

    }

};


/** Old object literal format
Game.Timer = function () {
    this.updateCallBack = null;
    this.renderCallBack = null;
};

Game.Timer.prototype = {

    Initialise: function (updateCallBack, renderCallBack) {

        this.updateCallBack = updateCallBack;
        this.renderCallBack = renderCallBack;

        this.renderCallBack();
    },

    Start: function () {
        var requestAnimFrame = (function(){
            return window.requestAnimationFrame        ||
                window.webkitRequestAnimationFrame     ||
                window.mozRequestAnimationFrame        ||
                window.oRequestAnimationFrame          ||
                window.msRequestAnimationFrame         ||

                function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        var lastTime = 0;
        var that = this;

        function main() {
            var now = Date.now();
            var delta = (now - lastTime) / 1000.0;

            that.updateCallBack(delta);
            that.renderCallBack();

            lastTime = now;
            requestAnimFrame(main);

        };

        main();
    }

} */
