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
            yOffset = 0;

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

            render: function (ctx) {
                var row, col, val;

                for (row = 0; row < mapHeight; row += 1) {
                    for (col = 0; col < mapWidth; col += 1) {
                        val = tiles[row][col];

                        if (typeof renderMap[val] !== "undefined" && renderMap[val] instanceof Image) {
                            ctx.drawImage(renderMap[val], xOffset + col * tileWidth, yOffset + row * tileHeight, tileWidth, tileHeight);
                        }
                    }
                }
            },

            generateCollisionFunction: function (blockedList) {
                var that = this,
                    i;

                if (typeof blockedList === "undefined") {
                    blockedList = [];

                    for (i in renderMap) {
                        if (renderMap.hasOwnProperty(i)) {
                            blockedList.push(i);
                        }
                    }
                }

                return function (x, y) {
                    x = Math.floor(x / tileWidth);
                    y = Math.floor(y / tileHeight);

                    return blockedList.indexOf(tiles[y][x]) >= 0;
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
