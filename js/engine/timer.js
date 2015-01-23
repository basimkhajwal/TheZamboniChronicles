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

            console.log("Updating.." + delta.toString() );

            that.updateCallBack(delta);
            that.renderCallBack();

            lastTime = now;
            requestAnimFrame(main);

        };

        main();
    }

}
