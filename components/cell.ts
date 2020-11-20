import { Path } from "./path";

export class Cell {
    x: number;
    y: number;
    path: Array<Path>;
    constructor(x: number, y: number) {
        this.path = [];
        this.x = x;
        this.y = y;
    }
}