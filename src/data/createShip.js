import ship_1 from "../images/ship_1.png";
import ship_2 from "../images/ship_2.png";
import ship_3 from "../images/ship_3.png";
import ship_4 from "../images/ship_4.png";
import ship_5 from "../images/ship_5.png";
import ship_6 from "../images/ship_6.png";
import ship_7 from "../images/ship_7.png";
import ship_8 from "../images/ship_8.png";
import ship_9 from "../images/ship_9.png";

import { getRandomModule, moduleCollection } from "./modules";
import { getRandomShipClass, shipClasses } from "./shipClasses";
import { getRandomNeutralAbility, getRandomPrimerAbility, getRandomDetonatorAbility } from "./abilities";
import { baseValue } from "./constants";

// ========================================
// SHIP FACTORY
// ========================================

export function createShip() {
    const shipClass = getRandomShipClass();

    const attributes = distributePoints(shipClassAttributeDistributions[shipClass]);

    const ship = {
        id: crypto.randomUUID(),
        typeId: "",
        name: "",
        class: shipClass,
        color: "",
        image: randomItem(shipImages),

        modules: [
            getRandomModule(),
            getRandomModule(),
        ],

        abilities: [
            getRandomNeutralAbility(),
            getRandomPrimerAbility(),
            getRandomDetonatorAbility(),
        ],

        attributes: attributes,

        manufacturer: determineManufacturer(attributes),
    };

    ship.stats = calculateShipStats(ship);

    return ship;
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ========================================
// STATS
// ========================================

export function calculateShipStats(ship) {
    let maxShield = 0;
    let maxArmor = 0;
    let maxHull = baseValue;

    for (const module of ship.modules) {
        if (moduleCollection[module].type === "shield") maxShield += moduleCollection[module].value;
        if (moduleCollection[module].type === "armor") maxArmor += moduleCollection[module].value;
    }

    maxHull += shipClasses[ship.class].hullBonus;

    // Attribute influence
    maxShield += Math.round(maxShield * (0.2 * ship.attributes.shieldDef / 100));
    maxArmor  += Math.round(maxArmor  * (0.2 * ship.attributes.armorDef  / 100));
    maxHull   += Math.round(maxHull   * (0.2 * ship.attributes.hull      / 100));
    let initiative = shipClasses[ship.class].speed + Math.round(shipClasses[ship.class].speed * (0.2 * ship.attributes.initiative / 100));

    return {
        maxShield,
        currentShield: maxShield,

        maxArmor,
        currentArmor: maxArmor,

        maxHull,
        currentHull: maxHull,

        initiative,

        debuffs: [], // [{ id, turnsRemaining }]
        cooldowns: [], // [{ id, turnsRemaining }]
        position: 0,
    };
}

// ========================================
// SHIP IMAGES
// ========================================

const shipImages = [
    ship_1,
    ship_2,
    ship_3,
    ship_4,
    ship_5,
    ship_6,
    ship_7,
    ship_8,
    ship_9,
];

// Attributes

const shipClassAttributeDistributions = {
    interceptor: [
        { min: 75, max: 100 }, // Initiative
        { min: 20, max: 100 }, // Kinetic
        { min: 20, max: 100 }, // Laser
        { min: 0, max: 25 },  // Hull
        { min: 20, max: 60 },  // Shield
        { min: 20, max: 60 },  // Armor
    ],
    corvette: [
        { min: 45, max: 75 },
        { min: 30, max: 95 },
        { min: 30, max: 95 },
        { min: 20, max: 45 },
        { min: 20, max: 75 },
        { min: 20, max: 75 },
    ],
    frigate: [
        { min: 20, max: 55 },
        { min: 20, max: 85 },
        { min: 20, max: 85 },
        { min: 45, max: 75 },
        { min: 45, max: 95 },
        { min: 30, max: 85 },
    ],
    dreadnaught: [
        { min: 0, max: 30 },
        { min: 20, max: 70 },
        { min: 20, max: 70 },
        { min: 75, max: 100 },
        { min: 45, max: 100 },
        { min: 60, max: 100 },
    ],
};

function distributePoints(ranges, totalPoints = 360) {
    const n = ranges.length;

    // 1. Min/Max prüfen
    let minSum = 0;
    let maxSum = 0;

    for (const r of ranges) {
        if (r.min < 0 || r.max > 100 || r.min > r.max) {
            throw new Error("Ungültiger Bereich");
        }
        minSum += r.min;
        maxSum += r.max;
    }

    if (totalPoints < minSum || totalPoints > maxSum) {
        throw new Error("Total nicht im möglichen Bereich");
    }

    // 2. Startwerte = Min
    const result = ranges.map(r => r.min);
    let remaining = totalPoints - minSum;

    const capacity = ranges.map(r => r.max - r.min);

    // 3. Zufällige Reihenfolge (WICHTIG!)
    const order = Array.from({ length: n }, (_, i) => i)
        .sort(() => Math.random() - 0.5);

    // 4. Erste Phase: random greedy fill
    for (const i of order) {
        if (remaining <= 0) break;

        const take = Math.floor(Math.random() * (capacity[i] + 1));

        const actual = Math.min(take, remaining, capacity[i]);

        result[i] += actual;
        remaining -= actual;
    }

    // 5. Zweite Phase: Rest zufällig verteilen (ohne Reihenfolge-Bias)
    while (remaining > 0) {
        const candidates = [];

        for (let i = 0; i < n; i++) {
            if (result[i] < ranges[i].max) {
                candidates.push(i);
            }
        }

        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        result[pick]++;
        remaining--;
    }

    return {
        initiative: result[0],
        kineticAtk: result[1],
        laserAtk: result[2],
        hull: result[3],
        shieldDef: result[4],
        armorDef: result[5],
    };
}

export function determineManufacturer(attributes) {

    const {
        initiative,
        kineticAtk,
        laserAtk,
        hull,
        shieldDef,
        armorDef
    } = attributes;

    const avg =
        (kineticAtk +
            laserAtk +
            armorDef +
            shieldDef +
            initiative +
            hull) / 6;

    const scores = {
        "Nova Systems":
            laserAtk * 1.4 +
            shieldDef * 1.4 +
            initiative * 0.4,

        "Helios Forge":
            kineticAtk * 1.4 +
            armorDef * 1.4 +
            hull * 0.5,

        "Orion Labs":
            initiative * 2 +
            laserAtk * 0.4,

        "Aegis Dynamics":
            armorDef +
            shieldDef +
            hull,
    };

    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])[0][0];
}