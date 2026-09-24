import { baseValue } from "./constants";

export const shipClasses = {
    interceptor: {
        id: "interceptor",
        displayName: "Interceptor",
        description: "Small agile ship.",
        hullBonus: 0,
        speed: 20,
    },
    corvette: {
        id: "corvette",
        displayName: "Corvette",
        description: "Medium size ship.",
        hullBonus: Math.floor(0.0 * baseValue),
        speed: 20,
    },
    frigate: {
        id: "frigate",
        displayName: "Frigate",
        description: "Medium size ship.",
        hullBonus: Math.floor(0.0 * baseValue),
        speed: 20,
    },
    dreadnought: {
        id: "dreadnought",
        displayName: "Dreadnought",
        description: "Big slow ship.",
        hullBonus: Math.floor(0.0 * baseValue),
        speed: 20,
    },
};

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomShipClass(){
    return randomItem(Object.keys(shipClasses));
}