import { getRandom, squaredDistance } from "./external/tools";
import { Cell } from "./cell";
import { Bonus } from "./bonus";
import { PlayerManager } from "./playerManager";

export class Player {
    name: string;

    x: number;
    y: number;
    angular: number;

    color: string;
    defaultColor: string;

    keyLeft: number;
    keyRight: number;
    iniKeyLeft: number;
    iniKeyRight: number;
    fired = false;

    width: number;

    speed: number;

    alive = true;
    invincible = false;
    snakeMode = false;
    wallBreaker = false;

    score = 0;
    killCount = 0;
    suicideCount = 0;

    trou = 0;
    lastTrou = 0;

    currentCell: Cell;

    playerManager: PlayerManager;

    head: HTMLElement;

    constructor(name: string, x: number, y: number, initialVector: number, color: string, keyLeft: number, keyRight: number, playerManager: PlayerManager) {
        this.playerManager = playerManager;
        
        this.name = name;
        
        this.x = x;
        this.y = y;
        this.angular = initialVector;
        
        this.color = color;
        this.defaultColor = color;
        
        this.keyLeft = keyLeft;
        this.keyRight = keyRight;
        this.iniKeyLeft = keyLeft;
        this.iniKeyRight = keyRight;
        
        this.width = 3.6 * this.playerManager.modifiers.fatness;
        
        this.speed = 1.8 * this.playerManager.modifiers.speed;
        
        this.currentCell = new Cell(0, 0); // placeholder

        this.head = document.createElement("div");
        this.head.setAttribute("class", "head");
        this.head.setAttribute("id", name + "Head");

        document.getElementById("canvas-container")!.appendChild(this.head);
    }
    die() {
        this.alive = false;
        this.playerManager.addOneToSurvivors();
        console.log(`${this.name} died inside cell [${this.currentCell.x}][${this.currentCell.y}]`);
    }
    ressurect() {
        this.alive = true;

        this.x = getRandom(this.playerManager.game.width / 7, this.playerManager.game.width * (6 / 7));
        this.y = getRandom(this.playerManager.game.height / 7, this.playerManager.game.height * (6 / 7));

        this.color = this.defaultColor;
        this.keyLeft = this.iniKeyLeft;
        this.keyRight = this.iniKeyRight;
        this.width = 3.6 * this.playerManager.modifiers.fatness;
        this.speed = 1.5 * this.playerManager.modifiers.speed;
        this.alive = true;
        this.invincible = false;
        this.snakeMode = false;
        this.fired = false;
        this.wallBreaker = false;
        this.trou = 0;
        this.lastTrou = 0;
    }
    listenToKeyboard() {
        if (!this.snakeMode) {
            if (this.playerManager.game.keyboard[this.keyLeft]) this.angular -= this.playerManager.maniability;
            if (this.playerManager.game.keyboard[this.keyRight]) this.angular += this.playerManager.maniability;
        } else {
            if (this.playerManager.game.keyboard[this.keyLeft] && !this.fired) {
                this.angular -= Math.PI / 2;
                this.fired = true;
            }
            if (this.playerManager.game.keyboard[this.keyRight] && !this.fired) {
                this.angular += Math.PI / 2;
                this.fired = true;
            }
            if (!this.playerManager.game.keyboard[this.keyRight] && !this.playerManager.game.keyboard[this.keyLeft] && this.fired) {
                this.fired = false;
            }
        }
    }
    move() {
        this.x += this.speed * Math.cos(this.angular);
        this.y += this.speed * Math.sin(this.angular);

        this.head.style.left = this.x + 3 - this.head.clientWidth / 2 + "px"; // le +3 c'est pour la bordure
        this.head.style.top = this.y + 3 - this.head.clientHeight / 2 + "px";
        this.head.style.transform = `scale(${this.width * 2 / 10})`;
    }

    intersectBonus(bonus: Bonus): boolean {
        let limit = this.width + bonus.element.clientHeight / 2;
        return squaredDistance(this.x, bonus.x, this.y, bonus.y) < limit ** 2;
    }

    collides(): boolean {
        for (let j in this.currentCell.path) {
            let path = this.currentCell.path[j];
            if (this.name == path.playerName && this.playerManager.game.I - path.date <= (3 * this.playerManager.modifiers.fatness * (this.width + 1)) / (this.playerManager.modifiers.speed * this.speed)) continue;

            let limit = this.width + path.width;
            if (squaredDistance(this.x, path.x, this.y, path.y) < limit ** 2) {
                return true;
            }
        }
        return false;
    }
}