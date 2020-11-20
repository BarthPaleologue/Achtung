export function randomBool(proba) {
    return Math.random() * 100 < proba;
}
export function getRandomInt(min, max) {
    let range = Math.round(Math.random() * (max - min));
    return min + range;
}
export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
export function euclideanDistance(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
export function squaredDistance(x1, x2, y1, y2) {
    return Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
}
