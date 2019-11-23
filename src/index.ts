/**
 * Procedural Grid
 */
export class ProceduralGrid {
  grid: Uint8Array;
  width: number;
  height: number;

  constructor(public realWidth: number, public realHeight: number) {
    this.height = realWidth * 2 - 1;
    this.width = realHeight * 2 - 1;

    this.grid = new Uint8Array(this.width * this.height);
  }

  random(max: number) {
    return Math.floor(Math.random() * max);
  }

  getWalls(x: number, y: number) {
    const walls: number[] = [];

    let px, py;

    px = x * 2 - 1;
    py = y * 2;
    walls[0] = (px >= 0 && px < this.width && py >= 0 && py < this.height) ? this.grid[py * this.width + px] : 1;

    px = x * 2 + 1;
    py = y * 2;
    walls[1] = (px >= 0 && px < this.width && py >= 0 && py < this.height) ? this.grid[py * this.width + px] : 1;

    px = x * 2;
    py = y * 2 - 1;
    walls[2] = (px >= 0 && px < this.width && py >= 0 && py < this.height) ? this.grid[py * this.width + px] : 1;

    px = x * 2;
    py = y * 2 + 1;
    walls[3] = (px >= 0 && px < this.width && py >= 0 && py < this.height) ? this.grid[py * this.width + px] : 1;

    return walls.map(wall => wall - 1);
  }

  drawBlock(x: number, y: number) {
    for (let dy = 3; --dy >= 0;) {
      for (let dx = 3; --dx >= 0;) {
        const px = x * 2 + dx - 1;
        const py = y * 2 + dy - 1;
        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          this.grid[py * this.width + px] = 1;
        }
      }
    }
  }

  makeBlocks(total: number) {
    for (let i = total; --i >= 0;) {
      this.drawBlock(this.random(this.realWidth), this.random(this.realHeight));
    }
  }

  makeWalls() {
    const {width, height} = this;
    for (let index = width * height / 2; --index >= 0;) {
      this.grid[index * 2] = this.random(10) > 5 ? 1 : 0;
    }
  }

  fill(pos_x: number, pos_y: number, color: number) {
    const {grid} = this;

    if (pos_x < 0 || pos_y < 0 || pos_x >= this.width || pos_y >= this.height) {
      return 0;
    }

    const index = pos_y * this.width + pos_x;

    if (grid[index] === color || grid[index]) {
      return 0;
    }

    grid[index] = color;

    let result = 1;

    result += this.fill(pos_x + 1, pos_y, color);
    result += this.fill(pos_x - 1, pos_y, color);
    result += this.fill(pos_x, pos_y + 1, color);
    result += this.fill(pos_x, pos_y - 1, color);

    return result;
  }

  wallsBetweenSectors() {
    const {width, height} = this;
    for (let index = width * height / 2; --index >= 0;) {
      if (this.grid[index * 2] !== 1) {
        this.grid[index * 2] = 2 + this.random(2);
      }
    }
  }

  fillSectors() {
    const {realHeight, realWidth} = this;

    let startIndex = 2;
    const main = {
      sector: 0,
      total: 0
    };

    for (let y = realHeight; --y >= 0;) {
      for (let x = realWidth; --x >= 0;) {

        if (!this.grid[(y * 2) * this.width + (x * 2)]) {

          const count = this.fill(x * 2, y * 2, startIndex);
          if (count > main.total) {
            main.total = count;
            main.sector = startIndex;
          }
          startIndex++;
        }
      }
    }
    return main.sector;
  }

  extract(sector: number) {
    const {realHeight, realWidth} = this;

    const result = [];

    for (let y = realHeight; --y >= 0;) {
      for (let x = realWidth; --x >= 0;) {
        if (this.grid[y * 2 * this.width + x * 2] === sector) {
          result.push({
            x, y,
            walls: this.getWalls(x, y)
          });
        }
      }
    }
    return result.reverse();
  }

  dump() {
    const {width, height} = this;

    for (let y = 0; y < height; y++) {
      const line = [];
      for (let x = 0; x < width; x++) {
        line.push(this.grid[y * this.width + x]);
      }
      console.log(line);
    }
  }
}

export function proceduralGrid(width: number, height: number) {
  const world = new ProceduralGrid(width, height);
  world.makeWalls();
  world.makeBlocks(2);
  const main = world.fillSectors();
  world.wallsBetweenSectors();
  return world.extract(main);
}
