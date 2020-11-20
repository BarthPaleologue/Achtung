//@ts-ignore
Math.seedrandom(Math.random().toString(36).substring(7)); // aléatoire procédural

import { Slider } from "./external/slider";
import { Achtung } from "./achtung";
import { Modifiers } from "./modifiers";
import { randomBool, getRandomInt } from "./external/tools";

/// Selection des personnages et des touches

let selectable = true;
let setting = 0;
let playerUI: JQuery;
$(".player-container").on("click", function () {
    playerUI = $(this);
    setting = 0;
});

document.onkeydown = e => {
    if (selectable && playerUI != undefined) {
        if (setting == 0) {
            playerUI.children(".keyLeft").html(e.key);
            playerUI.children(".keyLeft").attr("alt", e.keyCode);
        }
        if (setting == 1) {
            playerUI.children(".keyRight").html(e.key);
            playerUI.children(".keyRight").attr("alt", e.keyCode);
            playerUI.attr("data-selected", "true");
            playerUI.addClass("selected")
        }
        if (setting >= 1) setting = 0;
        else setting += 1;
    }
}

$(".player-container").on("contextmenu", function (e: Event) {
    e.preventDefault();
    $(this).attr("data-selected", "false");
    $(this).removeClass("selected");
    $(this).children(".keyRight").html("Touche 2");
    $(this).children(".keyLeft").html("Touche 1");
});

$("#object-selector img").on("click", function (e) {
    e.preventDefault();
    $(this).toggleClass("disabled");
    if ($(this).attr("class") == "disabled") $(this).attr("data-selected", "false");
    else $(this).attr("data-selected", "true");
});

//@ts-ignore
$("#objects").checkboxradio();
$("#objects").change(() => {
    $("#object-selector").slideToggle(200);
});

let modifiers: Modifiers = {
    speed: 1,
    maniability: 1,
    fatness: 1,
    holeLength: 1,
    bonusEffects: 1,
    bonusFrequency: 1,
    bonusDuration: 1
}

let speedSlider = new Slider("speedSlider", document.getElementById("speedSlider")!, 1, 50, 10, (val: number) => {
    modifiers.speed = val / 10;
    //maniability = (360 / (60 * 150)) * modifiers.maniability * modifiers.speed;
});

let maniaSlider = new Slider("maniaSlider", document.getElementById("maniaSlider")!, 1, 20, 10, (val: number) => {
    modifiers.maniability = val / 10;
    //maniability = (360 / (60 * 150)) * modifiers.maniability * modifiers.speed;
});

let fatSlider = new Slider("fatSlider", document.getElementById("fatSlider")!, 1, 50, 10, (val: number) => {
    modifiers.fatness = val / 10;
});

let trouSlider = new Slider("trouSlider", document.getElementById("trouSlider")!, 0, 200, 10, (val: number) => {
    modifiers.holeLength = val / 10;
});

let bonusSlider = new Slider("bonusSlider", document.getElementById("bonusSlider")!, 1, 20, 10, (val: number) => {
    modifiers.bonusEffects = val / 10;
});

let bonusFreqSlider = new Slider("bonusFreqSlider", document.getElementById("bonusFreqSlider")!, 1, 60, 10, (val: number) => {
    modifiers.bonusFrequency = val / 10;
});

let bonusDurationSlider = new Slider("bonusDurationSlider", document.getElementById("bonusDurationSlider")!, 1, 20, 10, (val: number) => {
    modifiers.bonusDuration = val / 10;
});

$("#randomize").click(e => {
    let rd1 = getRandomInt(5, 20);
    speedSlider.setValue(rd1);

    let rd2 = getRandomInt(7, 15);
    maniaSlider.setValue(rd2);

    let rd3 = getRandomInt(5, 15);
    fatSlider.setValue(rd3);

    let rd4 = getRandomInt(8, 30);
    trouSlider.setValue(rd4);

    let rd5 = getRandomInt(5, 15);
    bonusSlider.setValue(rd5);

    let rd6 = getRandomInt(7, 40);
    bonusFreqSlider.setValue(rd6);

    let rd7 = getRandomInt(5, 15);
    bonusDurationSlider.setValue(rd7);

    $("#object-selector img").each(function (e) {
        if (randomBool(20)) $(this).trigger("click");
    });
    if ((randomBool(5) && $("#objects").is(":checked")) || (randomBool(80) && !$("#objects").is(":checked"))) $("#objects").trigger("click");
});


document.addEventListener("fullscreenchange", () => {
    selectable = !selectable;
    if ($("h1").is(":visible")) new Achtung(modifiers, document.getElementById("canvas")!);
    else $("#canvas-container").fadeOut(100, () => $("#Startmenu").fadeIn());
});

$("#Go").on("click", () => {
    if (document.querySelectorAll(".selected").length > 1) {
        try {
            document.getElementById("canvas-container")!.requestFullscreen();
        } catch (e) {
            alert("Votre navigateur ne supporte pas la fonction requestFullScreen. Mettez le à jour ou Goulag.\n" + e);
        }
    } else {
        alert("Bah alors ? Tu joues tout seul ? T'as pas d'amis Jack !")
    }
});