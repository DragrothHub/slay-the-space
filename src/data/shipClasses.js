import { baseValue } from "./constants";

export const shipClasses = {
    interceptor: {
        id: "interceptor",
        displayName: "Interceptor",
        description: "Small agile ship.",
        hullBonus: 0,
        speed: 24,
    },
    corvette: {
        id: "corvette",
        displayName: "Corvette",
        description: "Medium size ship.",
        hullBonus: Math.floor(0.4 * baseValue),
        speed: 22,
    },
    frigate: {
        id: "frigate",
        displayName: "Frigate",
        description: "Medium size ship.",
        hullBonus: Math.floor(0.5 * baseValue),
        speed: 20,
    },
    dreadnaught: {
        id: "dreadnaught",
        displayName: "Dreadnaught",
        description: "Big slow ship.",
        hullBonus: Math.floor(1.0 * baseValue),
        speed: 18,
    },
};

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomShipClass(){
    return randomItem(Object.keys(shipClasses));
}