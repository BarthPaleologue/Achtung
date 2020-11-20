import { getRandom } from "./external/tools";
export class Bonus {
    constructor(effect, bonusManager, setting = 0) {
        this.effect = effect;
        this.setting = setting;
        this.element = document.createElement("div");
        this.element.setAttribute("class", effect + " bonus");
        this.bonusManager = bonusManager;
        this.bonusManager.bonuses.push(this);
        document.getElementById("canvas-container").appendChild(this.element);
        this.x = getRandom($(this.element).width() / 2, this.bonusManager.game.canvasManager.width() - $(this.element).width() / 2);
        this.y = getRandom($(this.element).width() / 2, this.bonusManager.game.canvasManager.height() - $(this.element).width() / 2);
        this.activated = false;
        $(this.element).css({
            "position": "absolute",
            "left": this.x + 3 - $(this.element).width() / 2 + "px",
            "top": this.y + 3 - $(this.element).width() / 2 + "px"
        });
    }
    activate(playerEffector) {
        this.activated = true;
        if (this.effect == "fasterSelf")
            this.bonusManager.affectSpeed(this.setting, "self", playerEffector, false);
        else if (this.effect == "fasterElse")
            this.bonusManager.affectSpeed(this.setting, "everyoneElse", playerEffector, false);
        else if (this.effect == "slowerSelf")
            this.bonusManager.affectSpeed(this.setting, "self", playerEffector, false);
        else if (this.effect == "slowerElse")
            this.bonusManager.affectSpeed(this.setting, "everyoneElse", playerEffector, false);
        else if (this.effect == "fatter")
            this.bonusManager.affectSize(this.setting, "everyoneElse", playerEffector, false);
        else if (this.effect == "slimmer")
            this.bonusManager.affectSize(this.setting, "self", playerEffector, false);
        else if (this.effect == "invert")
            this.bonusManager.permuteKeys(playerEffector, false);
        else if (this.effect == "colorBlind")
            this.bonusManager.affectColor(this.setting, playerEffector, false);
        else if (this.effect == "snakeSelf")
            this.bonusManager.snakeMode(true, "self", playerEffector, false);
        else if (this.effect == "snakeElse")
            this.bonusManager.snakeMode(true, "everyoneElse", playerEffector, false);
        else if (this.effect == "invincible")
            this.bonusManager.toggleInvincibility(playerEffector, true, false);
        else if (this.effect == "walls")
            this.bonusManager.toggleWalls(true, false);
        else if (this.effect == "wallSelf")
            this.bonusManager.breakWall(playerEffector, true, false);
        else if (this.effect == "changeBg")
            this.bonusManager.affectBgColor("random", playerEffector, false);
        else if (this.effect == "addBonus")
            this.bonusManager.spawnBonus(3);
        else if (this.effect == "random")
            this.bonusManager.randomEffect(playerEffector, false);
        this.remove();
    }
    remove() {
        this.element.remove();
    }
}
