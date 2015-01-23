Game.Timer = function () {
    this.callback = null;
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

    },

    Start: function () {

    }

}
