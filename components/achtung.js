import { Player } from "./player.js";
import { BonusManager } from "./bonusManager.js";
import { getRandom } from "./external/tools.js";
import { PlayerManager } from "./playerManager.js";
import { CanvasManager } from "./canvasManager.js";
import { bonusBaseIterationFrequency } from "./constants.js";
export class Achtung {
    constructor(modifiers, canvas) {
        this.fps = 60;
        this.I = 0;
        this.interval = 0;
        this.running = true;
        this.gameOver = false;
        this.defaultSnakeMode = false;
        document.querySelectorAll(".bonus, .head").forEach((elm) => elm.remove());
        document.getElementById("Startmenu").hidden = true;
        document.getElementById("pauseMenu").style.opacity = "0";
        document.getElementById("canvas-container").style.display = "block";
        let ctx = canvas.getContext("2d");
        ctx.canvas.width = Math.min(window.innerWidth, window.innerHeight);
        ctx.canvas.height = ctx.canvas.width - 2 * 3; // les bordures pour le -2*3
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // le fond du canvas
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.modifiers = modifiers;
        document.getElementById("bg_calc").style.width = this.width + "px";
        document.getElementById("bg_calc").style.height = this.height + "px";
        // initialisation des subdivisions du jeu
        this.canvasManager = new CanvasManager(canvas, this);
        this.canvasManager.initCells(20);
        // initialisation des joueurs
        this.playerManager = new PlayerManager(this);
        document.querySelectorAll(".player-container").forEach((element) => {
            if (element.getAttribute("data-selected") == "true") {
                let keyLeft = parseInt(element.querySelector(".keyLeft").getAttribute("alt"));
                let keyRight = parseInt(element.querySelector(".keyRight").getAttribute("alt"));
                let color = element.getAttribute("alt");
                let name = element.querySelector(".name").innerHTML;
                this.playerManager.addPlayer(new Player(name, getRandom(this.width / 7, this.width * (6 / 7)), getRandom(this.height / 7, this.height * (6 / 7)), Math.random() * 360, color, keyLeft, keyRight, this.playerManager));
                console.log(`${name} has been added to the game.`);
                document.getElementById("score").append(`<p id="${name}Score">${name} : 0</p>`);
            }
        });
        this.bonusManager = new BonusManager(this);
        document.querySelectorAll("#object-selector img").forEach((element) => {
            if (element.getAttribute("data-selected") == "true" && document.getElementById("objects").checked) {
                this.bonusManager.addEffect(element.getAttribute("id"));
            }
        });
        document.getElementById("score-container").style.width = window.innerWidth - this.canvasManager.width() - 30 + "px";
        // initialisation du clavier
        this.keyboard = {};
        window.addEventListener('keydown', e => this.keyboard[e.keyCode] = true);
        window.addEventListener('keyup', e => this.keyboard[e.keyCode] = false);
        document.onkeyup = e => {
            if (e.keyCode == 32 && this.running)
                this.pause(), document.getElementById("pauseMenu").style.opacity = "1";
            else if (e.keyCode == 32 && !this.running)
                this.resume(), document.getElementById("pauseMenu").style.opacity = "0";
        };
        this.nextPlay();
    }
    destroy() {
        this.pause();
        document.getElementById("victoryScreen").style.display = "none";
        document.querySelectorAll(".bonus, .head").forEach((elm) => elm.remove());
        this.canvasManager.clear();
        this.bonusManager.clear();
        document.getElementById("bg_calc").style.background = "black";
    }
    nextPlay() {
        this.I = 0;
        this.canvasManager.clear();
        this.bonusManager.clear();
        this.playerManager.reset();
        document.getElementById("bg_calc").style.background = "black";
        for (let i = 0; i < 10; i++)
            this.update();
        this.pause();
    }
    update() {
        this.I += 1;
        this.playerManager.refreshScore();
        this.playerManager.aliveCounter = 0;
        if (this.I % Math.round(bonusBaseIterationFrequency / this.modifiers.bonusFrequency) == 0 && document.getElementById("objects").checked)
            this.bonusManager.spawnBonus(1);
        this.playerManager.updatePlayers();
        if (this.playerManager.aliveCounter <= 1) { // fin de la manche
            this.playerManager.refreshScore();
            this.pause();
        }
    }
    pause() {
        this.running = false;
        clearInterval(this.interval);
    }
    resume() {
        if (!this.gameOver) {
            this.interval = setInterval(() => this.update(), 1000 / this.fps);
            this.running = true;
            if (this.playerManager.aliveCounter <= 1)
                this.nextPlay();
        }
    }
}
