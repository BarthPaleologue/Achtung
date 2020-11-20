import { Cell } from "./cell";
import { Player } from "./player";
import { Path } from "./path";
import { Achtung } from "./achtung";

export class CanvasManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cells: Array<Array<Cell>> = [];
    nbCells = 0;
    game: Achtung;

    constructor(canvas: HTMLCanvasElement, game:Achtung) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;

        this.game = game;
    }

    width() {
        return this.canvas.width;
    }
    height() {
        return this.canvas.height;
    }
    initCells(nb: number) {
        this.nbCells = nb;
        for (let i = 0; i < nb; i++) {
            this.cells[i] = [];
            for (let j = 0; j < nb; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }
    }
    drawPlayerPath(player: Player) {
        this.ctx.beginPath();
        this.ctx.fillStyle = player.color;
        this.ctx.arc(player.x, player.y, player.width, 0, 6/*.28318*/);
        this.ctx.fill();

        player.currentCell.path.push(new Path(player.x, player.y, player.width, player.name, this.game.I));
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width(), this.height());
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                this.cells[i][j].path = [];
            }
        }
        this.canvas.classList.remove("pulseWalls");
    }
}