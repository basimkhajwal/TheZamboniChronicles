//Use the Engine module and the sub UI module
var Engine = Engine || {};
Engine.UI = Engine.UI || {};


Engine.UI.LoadingBar = {


    create: function (barY, barWidth, barHeight, canvasWidth, barColour) {
        "use strict";

        var currentPercentage = 0;
        var barX = (canvasWidth - barWidth) / 2;

        return {

            render: function (ctx) {
                ctx.fillStyle = barColour;
                ctx.fillRect(barX, barY, barWidth * currentPercentage, barHeight);
            },

            setPercentage: function (p) {
                currentPercentage = p;
            },

            getPercentage: function () {
                return currentPercentage;
            }

        };

    }

};
