import { Player } from "./player";
import { getRandom } from "./external/tools";
import { BonusManager } from "./bonusManager";

export class Bonus {
    effect: string;
    setting: number | string;
    
    element: HTMLElement;
    x: number;
    y: number;
    
    activated: boolean;
    bonusManager: BonusManager;
    
    constructor(effect: string, bonusManager: BonusManager, setting: number | string = 0) {
        this.effect = effect;
        this.setting = setting;
        this.element = document.createElement("div");
        this.element.setAttribute("class", effect + " bonus");

        this.bonusManager = bonusManager;
        this.bonusManager.bonuses.push(this);

        document.getElementById("canvas-container")!.appendChild(this.element);

        this.x = getRandom($(this.element).width()! / 2, this.bonusManager.game.canvasManager.width() - $(this.element).width()! / 2);
        this.y = getRandom($(this.element).width()! / 2, this.bonusManager.game.canvasManager.height() - $(this.element).width()! / 2);
        this.activated = false;

        $(this.element).css({
            "position": "absolute",
            "left": this.x + 3 - $(this.element).width()! / 2 + "px", //on compte les 3px de barrière
            "top": this.y + 3 - $(this.element).width()! / 2 + "px"
        });
    }
    activate(playerEffector: Player) {
        this.activated = true;
        if (this.effect == "fasterSelf") this.bonusManager.affectSpeed(<number>this.setting, "self", playerEffector, false);
        else if (this.effect == "fasterElse") this.bonusManager.affectSpeed(<number>this.setting, "everyoneElse", playerEffector, false);
        else if (this.effect == "slowerSelf") this.bonusManager.affectSpeed(<number>this.setting, "self", playerEffector, false);
        else if (this.effect == "slowerElse") this.bonusManager.affectSpeed(<number>this.setting, "everyoneElse", playerEffector, false);
        else if (this.effect == "fatter") this.bonusManager.affectSize(<number>this.setting, "everyoneElse", playerEffector, false);
        else if (this.effect == "slimmer") this.bonusManager.affectSize(<number>this.setting, "self", playerEffector, false);
        else if (this.effect == "invert") this.bonusManager.permuteKeys(playerEffector, false);
        else if (this.effect == "colorBlind") this.bonusManager.affectColor(<string>this.setting, playerEffector, false);
        else if (this.effect == "snakeSelf") this.bonusManager.snakeMode(true, "self", playerEffector, false);
        else if (this.effect == "snakeElse") this.bonusManager.snakeMode(true, "everyoneElse", playerEffector, false);
        else if (this.effect == "invincible") this.bonusManager.toggleInvincibility(playerEffector, true, false);
        else if (this.effect == "walls") this.bonusManager.toggleWalls(true, false);
        else if (this.effect == "wallSelf") this.bonusManager.breakWall(playerEffector, true, false);
        else if (this.effect == "changeBg") this.bonusManager.affectBgColor("random", playerEffector, false);
        else if (this.effect == "addBonus") this.bonusManager.spawnBonus(3);
        else if (this.effect == "random") this.bonusManager.randomEffect(playerEffector, false);
        this.remove();
    }
    remove() {
        this.element.remove();
    }
}