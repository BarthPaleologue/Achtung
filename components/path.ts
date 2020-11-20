export class Path {
    x: number;
    y: number;
    width: number;
    playerName: string;
    date: number;

    constructor(x: number, y: number, width: number, playerName: string, date: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.playerName = playerName;
        this.date = date;
    }
}