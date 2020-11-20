export function randomBool(proba: number) {
    return Math.random() * 100 < proba;
}

export function getRandomInt(min: number, max: number) {
    let range = Math.round(Math.random() * (max - min));
    return min + range;
}

export function getRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function euclideanDistance(x1: number, x2: number, y1: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function squaredDistance(x1: number, x2: number, y1: number, y2: number) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}