var _a;
//@ts-ignore
Math.seedrandom(Math.random().toString(36).substring(7)); // aléatoire procédural
import { Slider } from "./external/slider.js";
import { Achtung } from "./achtung.js";
import { randomBool, getRandomInt } from "./external/tools.js";
/// Selection des personnages et des touches
let achtung;
let settingState = 0;
let selectedContainer;
// actions de la souris sur la sélection des joueurs
for (let playerContainer of document.querySelectorAll(".player-container")) {
    playerContainer.addEventListener("click", () => {
        selectedContainer = playerContainer;
        settingState = 0;
    });
    playerContainer.addEventListener("contextmenu", e => {
        e.preventDefault();
        playerContainer.setAttribute("data-selected", "false");
        playerContainer.classList.remove("selected");
        playerContainer.querySelector(".keyRight").innerHTML = "Touche 2";
        playerContainer.querySelector(".keyLeft").innerHTML = "Touche 1";
    });
}
document.addEventListener("keydown", e => {
    if (selectedContainer != undefined) {
        if (settingState == 0) {
            selectedContainer.querySelector(".keyLeft").innerHTML = e.key;
            selectedContainer.querySelector(".keyLeft").setAttribute("alt", String(e.keyCode));
        }
        if (settingState == 1) {
            selectedContainer.querySelector(".keyRight").innerHTML = e.key;
            selectedContainer.querySelector(".keyRight").setAttribute("alt", String(e.keyCode));
            selectedContainer.setAttribute("data-selected", "true");
            selectedContainer.classList.add("selected");
        }
        if (settingState >= 1)
            settingState = 0;
        else
            settingState += 1;
    }
    if (e.keyCode == 27) { // esc
        document.getElementById("canvas-container").style.display = "none";
        document.getElementById("Startmenu").style.display = "block";
        achtung = null;
    }
});
// actions de la souris sur les bonus
for (let bonusElement of document.querySelectorAll("#object-selector img")) {
    bonusElement.addEventListener("click", () => {
        bonusElement.classList.toggle("disabled");
        if (bonusElement.getAttribute("class") == "disabled")
            bonusElement.setAttribute("data-selected", "false");
        else
            bonusElement.setAttribute("data-selected", "true");
    });
}
(_a = document.getElementById("objects")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", () => {
    if (document.getElementById("object-selector").style.height == "0px") {
        document.getElementById("object-selector").style.height = "200px";
    }
    else
        document.getElementById("object-selector").style.height = "0px";
});
let modifiers = {
    speed: 1,
    maniability: 1,
    fatness: 1,
    holeLength: 1,
    bonusEffects: 1,
    bonusFrequency: 1,
    bonusDuration: 1
};
let speedSlider = new Slider("speedSlider", document.getElementById("speedSlider"), 1, 50, 10, (val) => {
    modifiers.speed = val / 10;
});
let maniaSlider = new Slider("maniaSlider", document.getElementById("maniaSlider"), 1, 20, 10, (val) => {
    modifiers.maniability = val / 10;
});
let fatSlider = new Slider("fatSlider", document.getElementById("fatSlider"), 1, 50, 10, (val) => {
    modifiers.fatness = val / 10;
});
let trouSlider = new Slider("trouSlider", document.getElementById("trouSlider"), 0, 200, 10, (val) => {
    modifiers.holeLength = val / 10;
});
let bonusSlider = new Slider("bonusSlider", document.getElementById("bonusSlider"), 1, 20, 10, (val) => {
    modifiers.bonusEffects = val / 10;
});
let bonusFreqSlider = new Slider("bonusFreqSlider", document.getElementById("bonusFreqSlider"), 1, 60, 10, (val) => {
    modifiers.bonusFrequency = val / 10;
});
let bonusDurationSlider = new Slider("bonusDurationSlider", document.getElementById("bonusDurationSlider"), 1, 20, 10, (val) => {
    modifiers.bonusDuration = val / 10;
});
document.getElementById("randomize").addEventListener("click", () => {
    speedSlider.setValue(getRandomInt(5, 20));
    maniaSlider.setValue(getRandomInt(7, 15));
    fatSlider.setValue(getRandomInt(5, 15));
    trouSlider.setValue(getRandomInt(8, 30));
    bonusSlider.setValue(getRandomInt(5, 15));
    bonusFreqSlider.setValue(getRandomInt(7, 40));
    bonusDurationSlider.setValue(getRandomInt(5, 15));
    for (let bonusElement of document.querySelectorAll("#object-selector img")) {
        if (randomBool(20)) {
            bonusElement.classList.toggle("disabled");
            if (bonusElement.getAttribute("class") == "disabled")
                bonusElement.setAttribute("data-selected", "false");
            else
                bonusElement.setAttribute("data-selected", "true");
        }
    }
    let areBonusEnabled = document.getElementById("objects").checked;
    if (randomBool(5) && areBonusEnabled || (randomBool(80) && !areBonusEnabled))
        document.getElementById("objects").checked = !areBonusEnabled;
});
document.getElementById("Go").addEventListener("click", () => {
    if (document.querySelectorAll(".selected").length > 1) {
        try {
            document.getElementById("canvas-container").requestFullscreen().then(() => {
                achtung = new Achtung(modifiers, document.getElementById("canvas"));
                selectedContainer = undefined;
            });
        }
        catch (e) {
            alert("Votre navigateur ne supporte pas la fonction requestFullScreen. Mettez le à jour ou Goulag.\n" + e);
        }
    }
    else
        alert("Bah alors ? Tu joues tout seul ? T'as pas d'amis Jack !");
});
