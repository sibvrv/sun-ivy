/**
 * Procedural Grid
 */
export declare class ProceduralGrid {
    realWidth: number;
    realHeight: number;
    grid: Uint8Array;
    width: number;
    height: number;
    constructor(realWidth: number, realHeight: number);
    random(max: number): number;
    getWalls(x: number, y: number): number[];
    drawBlock(x: number, y: number): void;
    makeBlocks(total: number): void;
    makeWalls(): void;
    fill(pos_x: number, pos_y: number, color: number): number;
    wallsBetweenSectors(): void;
    fillSectors(): number;
    extract(sector: number): {
        x: number;
        y: number;
        walls: number[];
    }[];
    dump(): void;
}
export declare function proceduralGrid(width: number, height: number): {
    x: number;
    y: number;
    walls: number[];
}[];
