import { Player } from "./player";
import { BonusManager } from "./bonusManager";
import { getRandom } from "./external/tools";
import { Modifiers } from "./modifiers";
import { PlayerManager } from "./playerManager";
import { CanvasManager } from "./canvasManager";

export class Achtung {
    fps = 60;

    I = 0;

    width: number;
    height: number;

    modifiers: Modifiers;

    playerManager: PlayerManager;

    bonusManager: BonusManager;

    canvasManager: CanvasManager;

    interval = 0;

    running = true;
    gameOver = false;

    keyboard: { [key: number]: boolean };

    constructor(modifiers: Modifiers, canvas: HTMLElement) {
        $(".head").remove(); // on clear les joueurs précédents
        $("#Startmenu, #victoryScreen").fadeOut(100, () => $("#canvas-container").fadeIn()); // disparition du menu, apparition du jeu
        $("#pauseMenu").fadeOut(100); // disparition du menu de pause

        let ctx = (<HTMLCanvasElement>canvas).getContext("2d")!;
        ctx.canvas.width = Math.min($("#canvas-container").width()!, $("#canvas-container").height()!);
        ctx.canvas.height = ctx.canvas.width - 6; // les bordures pour le -6
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // le fond du canvas

        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;

        this.modifiers = modifiers;
        $("#bg_calc").css({
            width: this.width,
            height: this.height
        });

        // initialisation des subdivisions du jeu

        this.canvasManager = new CanvasManager(canvas as HTMLCanvasElement, this);
        this.canvasManager.initCells(30);

        // initialisation des joueurs

        this.playerManager = new PlayerManager(this);

        document.querySelectorAll(".player-container").forEach((element: Element) => {
            if (element.getAttribute("data-selected") == "true") {
                let keyLeft = parseInt(element.querySelector(".keyLeft")!.getAttribute("alt")!);
                let keyRight = parseInt(element.querySelector(".keyRight")!.getAttribute("alt")!);
                let color = element.getAttribute("alt")!;
                let name = $(element).children(".name").html();
                this.playerManager.addPlayer(
                    new Player(name,
                        getRandom(this.width / 7, this.width * (6 / 7)),
                        getRandom(this.height / 7, this.height * (6 / 7)),
                        Math.random() * 360,
                        color, keyLeft, keyRight, this.playerManager));
                console.log(`${name} has been added to the game.`);
                $("#score").append("<p id='" + name + "Score'>" + name + " : 0</p>");
            }
        });

        this.bonusManager = new BonusManager(this);

        document.querySelectorAll("#object-selector img").forEach((element: Element) => {
            if (element.getAttribute("data-selected") == "true" && $("#objects").is(":checked")) {
                this.bonusManager.addEffect(element.getAttribute("id")!);
            }
        });


        $("#score-container").width(window.innerWidth - this.canvasManager.width() - 30);

        // initialisation du clavier
        this.keyboard = {};
        window.addEventListener('keydown', e => this.keyboard[e.keyCode || e.which] = true, true);
        window.addEventListener('keyup', e => this.keyboard[e.keyCode || e.which] = false, true);

        document.onkeyup = e => { // gestion de la pause avec la barre espace
            if (e.keyCode == 32 && this.running) this.pause(), $("#pauseMenu").fadeIn();
            else if (e.keyCode == 32 && !this.running) this.resume(), $("#pauseMenu").fadeOut();

            if (e.keyCode == 27) {
                document.exitFullscreen();
                $("#canvas-container").fadeOut(100, () => $("#Startmenu").fadeIn());
            }
        }

        this.nextPlay();
    }

    nextPlay() {
        this.I = 0;

        this.canvasManager.clear();

        this.bonusManager.clear();

        this.playerManager.reset();

        document.getElementById("bg_calc")!.style.background = "black";

        for (let i = 0; i < 10; i++) {
            this.update();
        }

        this.pause();
    }

    update() {
        this.I += 1;
        this.playerManager.refreshScore();

        this.playerManager.aliveCounter = 0;

        if (this.I % Math.round(400 / this.modifiers.bonusFrequency) == 0 && $("#objects").is(":checked")) this.bonusManager.spawnBonus(1);

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
            if (this.playerManager.aliveCounter <= 1) this.nextPlay();
        }
    }
}