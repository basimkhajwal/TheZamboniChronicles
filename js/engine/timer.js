Engine.Timer = {

    create: function () {

        //Return a closure
        return {
            start: function (updateCallBack, renderCallBack) {

                //Try and get the animation frame from the window, any possible way, otherwise default to the inefficient timer interval method with a callback
                var requestAnimFrame = (function () {
                    return window.requestAnimationFrame        ||
                        window.webkitRequestAnimationFrame     ||
                        window.mozRequestAnimationFrame        ||
                        window.oRequestAnimationFrame          ||
                        window.msRequestAnimationFrame         ||

                        function (callback) {
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

                }

                //Start the timer
                main();
            }

        };

    }

};
