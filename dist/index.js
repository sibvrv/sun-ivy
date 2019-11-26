"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Procedural Grid
 */
var ProceduralGrid = /** @class */ (function () {
    function ProceduralGrid(realWidth, realHeight, randomFunc) {
        if (randomFunc === void 0) { randomFunc = function () { return Math.random(); }; }
        this.realWidth = realWidth;
        this.realHeight = realHeight;
        this.randomFunc = randomFunc;
        this.height = realWidth * 2 - 1;
        this.width = realHeight * 2 - 1;
        this.grid = new Uint8Array(this.width * this.height);
    }
    ProceduralGrid.prototype.random = function (max) {
        return Math.floor(this.randomFunc() * max);
    };
    ProceduralGrid.prototype.getValue = function (x, y) {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height) ? this.grid[y * this.width + x] : 1;
    };
    ProceduralGrid.prototype.getWalls = function (x, y) {
        var walls = [];
        var px = x * 2;
        var py = y * 2;
        walls[0] = this.getValue(px - 1, py);
        walls[1] = this.getValue(px + 1, py);
        walls[2] = this.getValue(px, py - 1);
        walls[3] = this.getValue(px, py + 1);
        return walls.map(function (wall) { return wall - 1; });
    };
    ProceduralGrid.prototype.drawBlock = function (x, y) {
        for (var dy = 3; --dy >= 0;) {
            for (var dx = 3; --dx >= 0;) {
                var px = x * 2 + dx - 1;
                var py = y * 2 + dy - 1;
                if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                    this.grid[py * this.width + px] = 1;
                }
            }
        }
    };
    ProceduralGrid.prototype.makeBlocks = function (total) {
        for (var i = total; --i >= 0;) {
            this.drawBlock(this.random(this.realWidth), this.random(this.realHeight));
        }
    };
    ProceduralGrid.prototype.makeWalls = function () {
        var _a = this, width = _a.width, height = _a.height;
        for (var index = width * height / 2; --index >= 0;) {
            this.grid[index * 2] = this.random(10) > 5 ? 1 : 0;
        }
    };
    ProceduralGrid.prototype.fill = function (pos_x, pos_y, color) {
        var grid = this.grid;
        if (pos_x < 0 || pos_y < 0 || pos_x >= this.width || pos_y >= this.height) {
            return 0;
        }
        var index = pos_y * this.width + pos_x;
        if (grid[index]) {
            return 0;
        }
        grid[index] = color;
        var result = 1;
        result += this.fill(pos_x + 1, pos_y, color);
        result += this.fill(pos_x - 1, pos_y, color);
        result += this.fill(pos_x, pos_y + 1, color);
        result += this.fill(pos_x, pos_y - 1, color);
        return result;
    };
    ProceduralGrid.prototype.wallsBetweenSectors = function () {
        var _a = this, width = _a.width, height = _a.height;
        for (var index = width * height / 2; --index >= 0;) {
            if (this.grid[index * 2] !== 1) {
                this.grid[index * 2] = 2 + this.random(2);
            }
        }
    };
    ProceduralGrid.prototype.fillSectors = function () {
        var _a = this, realHeight = _a.realHeight, realWidth = _a.realWidth;
        var startIndex = 2;
        var main = {
            sector: 0,
            total: 0
        };
        for (var y = realHeight; --y >= 0;) {
            for (var x = realWidth; --x >= 0;) {
                if (!this.grid[(y * 2) * this.width + (x * 2)]) {
                    var count = this.fill(x * 2, y * 2, startIndex);
                    if (count > main.total) {
                        main.total = count;
                        main.sector = startIndex;
                    }
                    startIndex++;
                }
            }
        }
        return main.sector;
    };
    ProceduralGrid.prototype.extract = function (sector) {
        var _a = this, realHeight = _a.realHeight, realWidth = _a.realWidth;
        var result = [];
        for (var y = realHeight; --y >= 0;) {
            for (var x = realWidth; --x >= 0;) {
                if (this.grid[y * 2 * this.width + x * 2] === sector) {
                    result.push({
                        x: x, y: y,
                        walls: this.getWalls(x, y)
                    });
                }
            }
        }
        return result.reverse();
    };
    return ProceduralGrid;
}());
exports.ProceduralGrid = ProceduralGrid;
