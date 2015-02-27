var Engine = Engine || {};

Engine.Camera = {

    create: function (x, y, angle) {
        "use strict";

        x = (typeof x === "undefined") ? 0 : x;
        y = (typeof x === "undefined") ? 0 : y;
        angle = (typeof angle === "undefined") ? 0 : angle;

        var toDegrees = function (rad) {
            return rad * (180 / Math.PI);
        },

            toRadians = function (deg) {
                return deg * (Math.PI / 180);
            },

            angleInRad = toRadians(angle);

        return {

            projectContext: function (ctx) {
                ctx.translate(-x, -y);
                if (angleInRad !== 0) {
                    ctx.rotate(angleInRad);
                }
            },

            unProjectContext: function (ctx) {
                if (angleInRad !== 0) {
                    ctx.rotate(-angleInRad);
                }
                ctx.translate(x, y);
            },

            projectPoint: function (pX, pY) {
                pX -= x;
                pY -= y;

                if (angleInRad !== 0) {
                    pX = pX * Math.cos(angleInRad) - y * Math.sin(angleInRad);
                    pY = pX * Math.sin(angleInRad) + y * Math.cos(angleInRad);
                }

                return {
                    x: pX,
                    y: pY
                };
            },

            unProjectPoint: function (pX, pY) {
                if (angleInRad !== 0) {
                    pX = pX * Math.cos(-angleInRad) - y * Math.sin(-angleInRad);
                    pY = pX * Math.sin(-angleInRad) + y * Math.cos(-angleInRad);
                }

                pX += x;
                pY += y;

                return {
                    x: pX,
                    y: pY
                };
            },

            translate: function (vx, vy) {
                x += vx;
                y += vy;
            },

            rotate: function (amount) {
                angle += amount;
                angleInRad = toRadians(angle);
            },

            setX: function (newX) {
                x = newX;
            },

            getX: function () {
                return x;
            },

            setY: function (newY) {
                y = newY;
            },

            getY: function () {
                return y;
            },

            setAngle: function (newAngle) {
                angle = newAngle;
                angleInRad = toRadians(angle);
            },

            getAngle: function () {
                return angle;
            }

        };
    }

};
