//The Engine module
var Engine = Engine || {};


//The tiled map creator
Engine.TiledMap = {

    create: function (mapWidth, mapHeight, tileWidth, tileHeight) {
        "use strict";

        //The tiles themselves
        var tiles = [],

            //The render map, each number in it has an image to draw for that specific tile
            renderMap = [],

            //The offsets from the origin
            xOffset = 0,
            yOffset = 0,

            //Utility function to clamp within a certain range
            clamp = function (val, min, max) {
                return Math.min(max, Math.max(min, val));
            };

        (function () {
            var row, col;

            for (row = 0; row < mapHeight; row += 1) {
                tiles.push([]);

                for (col = 0; col < mapWidth; col += 1) {
                    tiles[row].push(-1);
                }
            }

        }());

        return {

            render: function (ctx, startX, endX, startY, endY) {
                var row, col, val,

                    startCol = clamp(Math.floor(startX / tileWidth) - 1, 0, mapWidth - 1),
                    endCol = clamp(Math.floor(endX / tileWidth) + 1, 0, mapWidth - 1),

                    startRow = clamp(Math.floor(startY / tileHeight) - 1, 0, mapHeight - 1),
                    endRow = clamp(Math.floor(endY / tileHeight) + 1, 0, mapHeight - 1);

                for (row = startRow; row <= endRow; row += 1) {
                    for (col = startCol; col <= endCol; col += 1) {
                        val = tiles[row][col];

                        if (typeof renderMap[val] !== "undefined" && renderMap[val] instanceof Image) {
                            ctx.drawImage(renderMap[val], xOffset + col * tileWidth, yOffset + row * tileHeight, tileWidth, tileHeight);
                        }
                    }
                }
            },
            
             //Check if a cell isn't zero at an x, y (not cell co-ordinates)
            isCellBlocked: function (x, y) {
                x = Math.floor(x / tileWidth);
                y = Math.floor(y / tileHeight);

                if (x >= mapWidth || x < 0 || y >= mapHeight || y < 0) {
                    return false;
                }

                return tiles[y][x] !== 0;
            },

            //Generate a collision function that can be used in an array
            generateCollisionFunction: function () {
                var that = this;

                return function (x, y) {
                    return that.isCellBlocked(x, y);
                };

            },

            getTileAt: function (row, col) {
                return tiles[row][col];
            },

            setTileAt: function (row, col, val) {
                tiles[row][col] = val;
            },

            getWidth: function () {
                return mapWidth;
            },

            getHeight: function () {
                return mapHeight;
            },

            getTileWidth: function () {
                return tileWidth;
            },

            getTileHeight: function () {
                return tileHeight;
            },

            setOffset: function (x, y) {
                xOffset = x;
                yOffset = y;
            },

            getOffset: function () {
                return {
                    x: xOffset,
                    y: yOffset
                };
            },

            setRenderMap: function (map) {
                renderMap = map;
            },

            getRenderMap: function () {
                return renderMap;
            },

            putRenderable: function (id, val) {
                renderMap[id] = val;
            }
        };
    }

};
