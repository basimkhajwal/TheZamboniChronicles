//Modules needed
var Engine = Engine || {};


/*
*   A set of modules with mathematical expressions needed for keeping models for physics or rendering in the game
*/
Engine.MathsUtils = {

    // ------------------------- Interpolation Methods -----------------------------

    Interpolation: {

        linear: function (y1, y2, d) {
            "use strict";

            return y1 + (y2 - y1) * d;
        },

        cosine: function (y1, y2, d) {
            "use strict";

            var mid = (1 - Math.cos(d * Math.PI)) / 2;

            return (y1 * (1 - mid) + y2 * mid);
        },

        cubic: function (y0, y1, y2, y3, d) {
            "use strict";

            var mid = d * d,

                a0 = y3 - y2 - y0 + y1,
                a1 = y0 - y1 - a0,
                a2 = y2 - y0,
                a3 = y1;

            return (a0 * d * mid + a1 * mid +  a2 * d + a3);
        }
    },

    // --------------------------------- Tweening Methods ---------------------------------------------

    Tweening: {

        quadratic: function (a, b, delta) {
            "use strict";

            return a + (b - a) * delta * delta;
        },

        inverseQuadratic: function (a, b, delta) {
            "use strict";

            return this.quadratic(a, b, 1 - delta);
        }


    },


    // ------------------------- Spline / Curve Methods (one dimensional) -----------------------------

    Spline: {

        /*
        *   Create an array approximation between evenly spaces y-values with a difference specified
        *
        *   The curve is linearly estimated using the number of points given (default 16)
        */
        cubicToPoints: function (yValues, startX, xChange, numPoints) {
            "use strict";

            //Set the default value to be sixteen if not set
            numPoints = numPoints || 16;

            //Repeat the first and last values so cubic can work better (no tailing ends)
            yValues.unshift(yValues[0]);
            yValues.push(yValues[yValues.length - 1]);

            var curvePoints = [],

                //The difference between each linear interpolation
                pointDiff = xChange / numPoints,

                //Iteration variables
                i = 0,
                j = 0;

            //Iterate over all but first and last (repeated)
            for (i = 1; i < yValues.length - 2; i += 1) {

                //Iterate over the curve estimation
                for (j = 0; j < numPoints; j += 1) {
                    curvePoints.push([
                        startX + (xChange * (i - 1)) + (pointDiff * j),
                        Engine.MathsUtils.Interpolation.cubic(yValues[i - 1], yValues[i], yValues[i + 1], yValues[i + 2], j / numPoints)
                    ]);
                }

            }

            //Return the points generated
            return curvePoints;
        },


        /**
         * Draws a cardinal spline through given point array. Points must be arranged
         * as: [x1, y1, x2, y2, ..., xn, yn]. It adds the points to the current path.
         *
         * The method continues previous path of the context. If you don't want that
         * then you need to use moveTo() with the first point from the input array.
         *
         * The points for the cardinal spline are returned as a new array.
         *
         * @param {CanvasRenderingContext2D} ctx - context to use
         * @param {Array} points - point array
         * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
         * @param {Number} [numOfSeg=20] - number of segments between two points (line resolution)
         * @param {Boolean} [close=false] - Close the ends making the line continuous
         * @returns {Float32Array} New array with the calculated points that was added to the path
         */
        curve: function (ctx, points, tension, numOfSeg, close) {

            'use strict';

            // options or defaults
            tension = (typeof tension === 'number') ? tension : 0.5;
            numOfSeg = numOfSeg || 25;

            var pts,									// for cloning point array
                i = 1,

                l = points.length,
                rPos = 0,
                rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),

                res = new Float32Array(rLen),

                cache = new Float32Array((numOfSeg + 2) * 4),
                cachePtr = 4,

                parse,

                st,
                st2,
                st3,
                st23,
                st32;

            //Clone the point array
            pts = points.slice(0);

            if (close) {
                pts.unshift(points[l - 1]);				// insert end point as first point
                pts.unshift(points[l - 2]);

                // first point as last point
                pts.push(points[0], points[1]);
            } else {
                // copy 1. point and insert at beginning
                pts.unshift(points[1]);
                pts.unshift(points[0]);
                pts.push(points[l - 2], points[l - 1]);	// duplicate end-points
            }

            // cache inner-loop calculations as they are based on t alone
            cache[0] = 1;								// 1,0,0,0

            while (i < numOfSeg) {

                st = i / numOfSeg;
                st2 = st * st;
                st3 = st2 * st;
                st23 = st3 * 2;
                st32 = st2 * 3;

                cache[cachePtr] =	st23 - st32 + 1;	// c1
                cachePtr += 1;

                cache[cachePtr] =	st32 - st23;		// c2
                cachePtr += 1;

                cache[cachePtr] =	st3 - 2 * st2 + st;	// c3
                cachePtr += 1;

                cache[cachePtr] =	st3 - st2;			// c4
                cachePtr += 1;

                i += 1;
            }

            cachePtr += 1;
            cache[cachePtr] = 1;						// 0,1,0,0

            parse = function (pts, cache, l) {

                var i,
                    t,

                    pt1,
                    pt2,
                    pt3,
                    pt4,

                    t1x,
                    t1y,
                    t2x,
                    t2y,

                    c,
                    c1,
                    c2,
                    c3,
                    c4;

                for (i = 2; i < l; i += 2) {

                    pt1 = pts[i];
                    pt2 = pts[i + 1];
                    pt3 = pts[i + 2];
                    pt4 = pts[i + 3];

                    t1x = (pt3 - pts[i - 2]) * tension;
                    t1y = (pt4 - pts[i - 1]) * tension;
                    t2x = (pts[i + 4] - pt1) * tension;
                    t2y = (pts[i + 5] - pt2) * tension;

                    for (t = 0; t < numOfSeg; t += 1) {

                        c = t * 4; // t << 2

                        c1 = cache[c];
                        c2 = cache[c + 1];
                        c3 = cache[c + 2];
                        c4 = cache[c + 3];

                        res[rPos] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                        rPos += 1;

                        res[rPos] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
                        rPos += 1;
                    }
                }
            };

            // calc. points
            parse(pts, cache, l);

            if (close) {
                //l = points.length;
                pts = [];
                pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]); // second last and last
                pts.push(points[0], points[1], points[2], points[3]); // first and second
                parse(pts, cache, 4);
            }

            // add last point
            l = close ? 0 : points.length - 2;
            res[rPos] = points[l];
            rPos += 1;
            res[rPos] = points[l + 1];

            // add lines to path
            for (i = 0, l = res.length; i < l; i += 2) {
                ctx.lineTo(res[i], res[i + 1]);
            }

            return res;
        }
    }
};
