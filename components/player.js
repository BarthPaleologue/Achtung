import { getRandom, squaredDistance } from "./external/tools";
import { Cell } from "./cell";
import { playerBaseSpeed, playerBaseWidth, borderWidth } from "./constants";
export class Player {
    constructor(name, x, y, initialVector, color, keyLeft, keyRight, playerManager) {
        this.rightFired = false;
        this.leftFired = false;
        this.alive = true;
        this.invincible = false;
        this.snakeMode = false;
        this.wallBreaker = false;
        this.score = 0;
        this.killCount = 0;
        this.suicideCount = 0;
        this.trou = 0;
        this.lastTrou = 0;
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
        this.width = playerBaseWidth * this.playerManager.modifiers.fatness;
        this.speed = playerBaseSpeed * this.playerManager.modifiers.speed;
        this.currentCell = new Cell(0, 0); // placeholder
        this.head = document.createElement("div");
        this.head.setAttribute("class", "head");
        this.head.setAttribute("id", name + "Head");
        document.getElementById("canvas-container").appendChild(this.head);
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
        this.width = playerBaseWidth * this.playerManager.modifiers.fatness;
        this.speed = playerBaseSpeed * this.playerManager.modifiers.speed;
        this.alive = true;
        this.invincible = false;
        this.snakeMode = false;
        this.rightFired = false;
        this.leftFired = false;
        this.wallBreaker = false;
        this.trou = 0;
        this.lastTrou = 0;
    }
    listenToKeyboard() {
        if (!this.snakeMode) {
            if (this.playerManager.game.keyboard[this.keyLeft])
                this.angular -= this.playerManager.maniability;
            if (this.playerManager.game.keyboard[this.keyRight])
                this.angular += this.playerManager.maniability;
        }
        else {
            if (this.playerManager.game.keyboard[this.keyLeft] && !this.leftFired) {
                this.angular -= Math.PI / 2;
                this.leftFired = true;
                this.rightFired = false;
            }
            if (this.playerManager.game.keyboard[this.keyRight] && !this.rightFired) {
                this.angular += Math.PI / 2;
                this.rightFired = true;
                this.leftFired = false;
            }
            if (!this.playerManager.game.keyboard[this.keyRight])
                this.rightFired = false;
            if (!this.playerManager.game.keyboard[this.keyLeft])
                this.leftFired = false;
        }
    }
    move() {
        this.x += this.speed * Math.cos(this.angular);
        this.y += this.speed * Math.sin(this.angular);
        this.head.style.left = this.x + borderWidth - this.head.clientWidth / 2 + "px"; // le +3 c'est pour la bordure
        this.head.style.top = this.y + borderWidth - this.head.clientHeight / 2 + "px";
        this.head.style.transform = `scale(${this.width * 2 / 10})`;
    }
    intersectBonus(bonus) {
        let limit = this.width + bonus.element.clientHeight / 2;
        return squaredDistance(this.x, bonus.x, this.y, bonus.y) < Math.pow(limit, 2);
    }
    collides() {
        for (let j in this.currentCell.path) {
            let path = this.currentCell.path[j];
            if (this.name == path.playerName && this.playerManager.game.I - path.date <= (3 * (this.width + 2)) / this.speed)
                continue;
            let limit = this.width + path.width;
            if (squaredDistance(this.x, path.x, this.y, path.y) < Math.pow(limit, 2))
                return true;
        }
        return false;
    }
}
