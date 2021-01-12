import { randomBool } from "./external/tools";
export class PlayerManager {
    constructor(game) {
        this.players = [];
        this.aliveCounter = 0;
        this.maxScore = 0;
        this.game = game;
        this.modifiers = {
            speed: game.modifiers.speed,
            maniability: game.modifiers.maniability,
            fatness: game.modifiers.fatness,
            holeLength: game.modifiers.holeLength
        };
        this.maniability = (360 / 8500) * this.modifiers.maniability * this.modifiers.speed;
        this.canvasManager = this.game.canvasManager;
    }
    addPlayer(player) {
        this.players.push(player);
        this.aliveCounter += 1;
        this.maxScore = (this.getPlayersNumber() - 1) * 10;
        document.getElementById("highscore").innerHTML = this.maxScore + " points";
    }
    getPlayersNumber() {
        return this.players.length;
    }
    getPlayerList() {
        return this.players;
    }
    sortPlayersByScore() {
        this.players.sort((p1, p2) => {
            return p2.score - p1.score;
        });
    }
    refreshScore() {
        var _a;
        document.getElementById("score").innerHTML = "";
        this.sortPlayersByScore();
        for (let player of this.players) {
            let scoreElement = document.createElement("p");
            scoreElement.setAttribute("id", player.name + "Score");
            scoreElement.innerText = `${player.name} : ${player.score}`;
            (_a = document.getElementById("score")) === null || _a === void 0 ? void 0 : _a.appendChild(scoreElement);
        }
        if (this.players[0].score >= this.maxScore && this.players[0].score - this.players[1].score >= 2 && this.aliveCounter <= 1) {
            document.getElementById("victoryScreen").style.backgroundColor = this.players[0].defaultColor;
            document.getElementById("victor").style.lineHeight = window.innerHeight + "px";
            document.getElementById("victoryScreen").style.display = "block";
            document.getElementById("victor").innerText = `${this.players[0].name} konec hry !`;
            this.game.gameOver = true;
        }
    }
    addOneToSurvivors() {
        for (let player of this.players) {
            if (player.alive)
                player.score += 1;
        }
        this.refreshScore();
    }
    updatePlayers() {
        for (let player of this.players) {
            if (player.alive) {
                this.aliveCounter += 1;
                // apparition d'un trou
                if (randomBool(.5 * player.lastTrou / (70 / this.modifiers.speed)) && player.lastTrou > 70 / this.modifiers.speed) {
                    player.trou += Math.round(16 * this.modifiers.holeLength * (player.width / 3) / player.speed);
                    player.invincible = true;
                    player.lastTrou = 0;
                }
                ;
                if (player.trou > 0)
                    player.trou -= 1;
                else
                    player.invincible = false;
                // changement de direction avec les touches
                player.listenToKeyboard();
                // déplacement du serpent
                player.move();
                // Gestion des murs
                if (player.x < player.width || player.x > this.game.width - player.width / 2 || player.y < player.width || player.y > this.canvasManager.height() - player.width / 2) {
                    if (player.wallBreaker) {
                        if (player.x <= 0)
                            player.x = this.game.width - player.width / 2;
                        if (player.x >= this.game.width)
                            player.x = player.width / 2;
                        if (player.y <= 0)
                            player.y = this.canvasManager.height() - player.width / 2;
                        if (player.y >= this.game.height)
                            player.y = player.width / 2;
                    }
                    else if (!player.invincible) {
                        player.die();
                        continue;
                    }
                }
                // gestion des bonus
                for (let bonus of this.game.bonusManager.bonuses) {
                    if (bonus.activated)
                        continue;
                    if (player.intersectBonus(bonus))
                        bonus.activate(player);
                }
                if (player.invincible)
                    continue; // pas de collision ni de traces en invincibilité
                let currentCellX = Math.floor((player.x / this.game.width) * this.canvasManager.nbCells);
                let currentCellY = Math.floor((player.y / this.game.height) * this.canvasManager.nbCells);
                let currentCell = this.canvasManager.cells[currentCellX][currentCellY];
                player.currentCell = currentCell;
                if (player.trou == 0) { // comportement normal (pas de trou)
                    this.canvasManager.drawPlayerPath(player);
                    player.lastTrou += 1;
                }
                // gestion des collisions entre joueurs
                if (player.collides())
                    player.die();
            }
        }
    }
    reset() {
        for (let player of this.players) {
            player.ressurect();
            player.head.classList.remove("permuted", "pulseHead", "squared");
        }
        this.aliveCounter = this.players.length;
    }
}
