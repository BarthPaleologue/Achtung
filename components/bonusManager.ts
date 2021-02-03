import { Bonus } from "./bonus";
import { Achtung } from "./achtung";
import { Player } from "./player";
import { getRandomInt, randomBool } from "./external/tools";

export class BonusManager {
    bonuses: Array<Bonus> = [];
    effects: Array<string> = [];
    timeouts: Array<number> = [];

    game: Achtung;

    constructor(game: Achtung) {
        this.game = game;
    }

    addEffect(effect: string) {
        this.effects.push(effect);
    }

    /// Gestion des bonus
    affectSpeed(factor: number, target: string, playerEffector: Player, permanent: boolean) {
        if (target == "self") playerEffector.speed *= factor; // effet que sur le lanceur
        else { // effet sur tout le monde sauf le lanceur
            for (let player of this.game.playerManager.players) {
                if (player.name != playerEffector.name) player.speed *= factor;
            }
        }
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.affectSpeed(1 / factor, target, playerEffector, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    affectSize(factor: number, target: string, playerEffector: Player, permanent: boolean) {
        if (target == "self") playerEffector.width *= factor; // effet que sur le lanceur
        else { // effet sur tout le monde sauf le lanceur
            for (let player of this.game.playerManager.players) {
                if (player.name != playerEffector.name) player.width *= factor;
            }
        }
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.affectSize(1 / factor, target, playerEffector, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    permuteKeys(playerEffector: Player, permanent: boolean) {
        for (let player of this.game.playerManager.players) {
            if (player.name == playerEffector.name) continue;
            let c = player.keyLeft;
            player.keyLeft = player.keyRight;
            player.keyRight = c;
            document.getElementById(`${player.name}Head`)!.classList.toggle("permuted");
        }
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.permuteKeys(playerEffector, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    affectColor(color: string, playerEffector: Player, permanent: boolean) {
        for (let player of this.game.playerManager.players) {
            if (player.name == playerEffector.name) continue;
            if (color == "origin") player.color = player.defaultColor;
            else if (color = "random") player.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            else player.color = "grey";
        }
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.affectColor("origin", playerEffector, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    snakeMode(enable: boolean, target: string, playerEffector: Player, permanent: boolean) {
        if (target == "self") { // effet que sur le lanceur
            playerEffector.snakeMode = enable;
            document.getElementById(`${playerEffector.name}Head`)!.classList.toggle("squared", enable);
        } else { // effet sur tout le monde sauf le lanceur
            for (let player of this.game.playerManager.players) {
                if (player.name != playerEffector.name) {
                    player.snakeMode = enable;
                    document.getElementById(`${player.name}Head`)!.classList.toggle("squared", enable);
                }
            }
        }
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.snakeMode(!enable, target, playerEffector, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    toggleInvincibility(playerEffector: Player, enable: boolean, permanent: boolean) {
        playerEffector.invincible = enable;
        if (enable) playerEffector.trou += 60 * 7 * this.game.modifiers.bonusDuration;
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.toggleInvincibility(playerEffector, !enable, true), 7000 * this.game.modifiers.bonusDuration));
        }
    }

    toggleWalls(breaking: boolean, permanent: boolean) {
        this.game.canvasManager.ctx.canvas.classList.toggle("pulseWalls", breaking);
        for (let player of this.game.playerManager.players) {
            player.wallBreaker = breaking;
        }
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.toggleWalls(!breaking, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    breakWall(playerEffector: Player, breaking: boolean, permanent: boolean) {
        document.getElementById(`${playerEffector.name}Head`)?.classList.toggle("pulseHead", breaking);
        playerEffector.wallBreaker = breaking;
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.breakWall(playerEffector, !breaking, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    affectBgColor(color: string, playerEffector: Player, permanent: boolean) {
        if (color == "random") document.getElementById("bg_calc")!.style.background = playerEffector.color;
        if (color == "original") document.getElementById("bg_calc")!.style.display = "black";
        if (!permanent) {
            this.timeouts.push(setTimeout(() => this.affectBgColor("original", playerEffector, true), 10000 * this.game.modifiers.bonusDuration));
        }
    }

    randomEffect(playerEffector: Player, permanent: boolean) {
        let effect = this.effects[getRandomInt(0, this.effects.length - 1)];
        if (effect == "fasterSelf") this.affectSpeed(2 * this.game.modifiers.bonusEffects, "self", playerEffector, permanent);
        else if (effect == "fasterElse") this.affectSpeed(2 / this.game.modifiers.bonusEffects, "everyoneElse", playerEffector, permanent);
        else if (effect == "slowerSelf") this.affectSpeed(0.5 / this.game.modifiers.bonusEffects, "self", playerEffector, permanent);
        else if (effect == "slowerElse") this.affectSpeed(0.5 / this.game.modifiers.bonusEffects, "everyoneElse", playerEffector, permanent);
        else if (effect == "fatter") this.affectSize(2 * this.game.modifiers.bonusEffects, "everyoneElse", playerEffector, permanent);
        else if (effect == "slimmer") this.affectSize(0.5 / this.game.modifiers.bonusEffects, "self", playerEffector, permanent);
        else if (effect == "invert") this.permuteKeys(playerEffector, permanent);
        else if (effect == "colorBlind" && randomBool(.5)) this.affectColor("random", playerEffector, permanent);
        else if (effect == "colorBlind") this.affectColor("grey", playerEffector, permanent);
        else if (effect == "snakeSelf") this.snakeMode(true, "self", playerEffector, permanent);
        else if (effect == "snakeElse") this.snakeMode(true, "everyoneElse", playerEffector, permanent);
        else if (effect == "invincible") this.toggleInvincibility(playerEffector, true, permanent);
        else if (effect == "walls") this.toggleWalls(true, permanent);
        else if (effect == "wallSelf") this.breakWall(playerEffector, true, permanent);
        else if (effect == "changeBg") this.affectBgColor("random", playerEffector, permanent);
        else if (effect == "addBonus") this.spawnBonus(3);
        else if (effect == "random") this.randomEffect(playerEffector, permanent);
    }

    spawnBonus(n: number) {
        for (let i = 0; i < n; i++) {
            let effect = this.effects[getRandomInt(0, this.effects.length - 1)];
            if (effect == "fasterSelf") new Bonus(effect, this, 2 * this.game.modifiers.bonusEffects);
            else if (effect == "fasterElse") new Bonus(effect, this, 2 * this.game.modifiers.bonusEffects);
            else if (effect == "slowerSelf") new Bonus(effect, this, .5 / this.game.modifiers.bonusEffects);
            else if (effect == "slowerElse") new Bonus(effect, this, .5 / this.game.modifiers.bonusEffects);
            else if (effect == "fatter") new Bonus(effect, this, 2 * this.game.modifiers.bonusEffects);
            else if (effect == "slimmer") new Bonus(effect, this, .5 / this.game.modifiers.bonusEffects);
            else if (effect == "invert") new Bonus(effect, this);
            else if (effect == "colorBlind" && randomBool(.5)) new Bonus(effect, this, "random");
            else if (effect == "colorBlind") new Bonus(effect, this, "grey");
            else if (effect == "snakeSelf") new Bonus(effect, this);
            else if (effect == "snakeElse") new Bonus(effect, this);
            else if (effect == "invincible") new Bonus(effect, this);
            else if (effect == "walls") new Bonus(effect, this);
            else if (effect == "wallSelf") new Bonus(effect, this);
            else if (effect == "changeBg") new Bonus(effect, this);
            else if (effect == "addBonus") new Bonus(effect, this);
            else if (effect == "random") new Bonus(effect, this);
        }
    }

    clear() {
        for (let bonus of this.bonuses) {
            bonus.remove();
        }
        this.bonuses = [];
        for (let timeout of this.timeouts) {
            clearTimeout(timeout);
        }
        this.timeouts = [];
    }
}