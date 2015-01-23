Game.Timer = function () {
    this.callback = null;
    this.updateCallBack = null;
    this.renderCallBack = null;
    this.lastTime = null;

    this.requestAnimFrame = (function(){
        return window.requestAnimationFrame        ||
            window.webkitRequestAnimationFrame     ||
            window.mozRequestAnimationFrame        ||
            window.oRequestAnimationFrame          ||
            window.msRequestAnimationFrame         ||

            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
};

Game.Timer.prototype = {

    Initialise: function (updateCallBack, renderCallBack) {

        this.updateCallBack = updateCallBack;
        this.renderCallBack = renderCallBack;

        var that = this;

        this.callback = function(){
            var now = Date.now();
            var delta = now - that.lastTime;



            that.lastTime = Date.now();
            that.requestAnimFrame(that.callback);
        };
    },

    Start: function () {

    }

}
