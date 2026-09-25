import {
    createEnemy,
    createExhaustionSpreaderEnemy,
    createFragmenterEnemy,
    createShieldExplosionEnemy,
} from "./createEnemy";

import { applyDebuff, debuffs } from "../engine/debuffs";

const MAX_ENEMIES_PER_ENCOUNTER = 4;

/*
 * --------------------------------------------------------------------------
 * Enemy factories
 * --------------------------------------------------------------------------
 */

const enemyFactories = {
    basic: () => createEnemy(0, 1),

    fragmenter: () => createFragmenterEnemy(),

    shieldExplosion: () => createShieldExplosionEnemy(),

    laserResistant: () => {
        const enemy = createEnemy(0, 1);
        applyDebuff(enemy, debuffs.laserResistance.id);
        return enemy;
    },

    kineticResistant: () => {
        const enemy = createEnemy(0, 1);
        applyDebuff(enemy, debuffs.kineticResistance.id);
        return enemy;
    },

    cleanser: () => {
        const enemy = createEnemy(0, 1);
        applyDebuff(enemy, debuffs.cleanseDebuffs.id);
        return enemy;
    },

    summoner: () => {
        const enemy = createEnemy(0, 1);
        applyDebuff(enemy, debuffs.summonCopy.id, 8);
        return enemy;
    },

    exhaustionSpreader: () => createExhaustionSpreaderEnemy(),
};

/*
 * --------------------------------------------------------------------------
 * Encounter components
 * --------------------------------------------------------------------------
 *
 * Jeder Eintrag ist ein Baustein für einen Encounter.
 *
 * cost:
 *     Wie viel Budget der Baustein verbraucht.
 *
 * enemies:
 *     Welche Gegner dieser Baustein erzeugt.
 *
 * weight:
 *     Wie häufig dieser Baustein gegenüber anderen gleichwertigen
 *     Möglichkeiten ausgewählt wird.
 *
 * Wichtig:
 *     Ein Baustein kann mehrere Schiffe enthalten. Das ist bewusst so,
 *     damit synergistische Kombinationen als eine Einheit definiert werden
 *     können.
 */

const encounterComponents = [
    // ----------------------------------------------------------------------
    // Basic
    // ----------------------------------------------------------------------

    {
        cost: 1,
        enemies: ["basic"],
        weight: 5,
    },

    // ----------------------------------------------------------------------
    // Einzelne Spezialgegner
    // ----------------------------------------------------------------------

    {
        cost: 1,
        enemies: ["shieldExplosion"],
        weight: 1,
    },

    {
        cost: 3,
        enemies: ["fragmenter"],
        weight: 1,
    },

    {
        cost: 2,
        enemies: ["laserResistant"],
        weight: 1,
    },

    {
        cost: 2,
        enemies: ["kineticResistant"],
        weight: 1,
    },

    {
        cost: 2,
        enemies: ["cleanser"],
        weight: 1,
    },

    {
        cost: 3,
        enemies: ["summoner"],
        weight: 1,
    },

    {
        cost: 3,
        enemies: ["exhaustionSpreader"],
        weight: 1,
    },
];


/*
 * --------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------------
 */

function getShipCount(component) {
    return component.enemies.length;
}


function getWeightedRandomComponent(components) {
    const totalWeight = components.reduce(
        (sum, component) => sum + (component.weight ?? 1),
        0
    );

    let random = Math.random() * totalWeight;

    for (const component of components) {
        random -= component.weight ?? 1;

        if (random <= 0) {
            return component;
        }
    }

    return components[components.length - 1];
}


/*
 * --------------------------------------------------------------------------
 * Feasibility check
 * --------------------------------------------------------------------------
 *
 * Prüft, ob sich ein bestimmtes Restbudget mit der verbleibenden Anzahl
 * an Schiffsslots überhaupt noch exakt erfüllen lässt.
 *
 * Dadurch vermeiden wir Situationen wie:
 *
 * Budget: 5
 * freie Slots: 1
 *
 * wenn es zwar Komponenten für 1, 2, 3 ... gibt, aber keine einzelne
 * Komponente exakt 5 Budget mit nur einem Schiff verbraucht.
 */

const feasibilityCache = new Map();

function canFillBudget(budget, remainingSlots) {
    if (budget === 0) {
        return true;
    }

    if (remainingSlots <= 0) {
        return false;
    }

    const cacheKey = `${budget}:${remainingSlots}`;

    if (feasibilityCache.has(cacheKey)) {
        return feasibilityCache.get(cacheKey);
    }

    const possibleComponents = encounterComponents.filter((component) => {
        const shipCount = getShipCount(component);

        return (
            component.cost <= budget &&
            shipCount <= remainingSlots &&
            shipCount <= MAX_ENEMIES_PER_ENCOUNTER &&
            component.cost > 0
        );
    });

    for (const component of possibleComponents) {
        const nextBudget = budget - component.cost;
        const nextSlots = remainingSlots - getShipCount(component);

        if (canFillBudget(nextBudget, nextSlots)) {
            feasibilityCache.set(cacheKey, true);
            return true;
        }
    }

    feasibilityCache.set(cacheKey, false);
    return false;
}


/*
 * --------------------------------------------------------------------------
 * Encounter generation
 * --------------------------------------------------------------------------
 */

function selectComponents(budget, remainingSlots) {
    if (budget === 0) {
        return [];
    }

    const possibleComponents = encounterComponents.filter((component) => {
        const shipCount = getShipCount(component);

        if (component.cost > budget) {
            return false;
        }

        if (shipCount > remainingSlots) {
            return false;
        }

        if (shipCount > MAX_ENEMIES_PER_ENCOUNTER) {
            return false;
        }

        const nextBudget = budget - component.cost;
        const nextSlots = remainingSlots - shipCount;

        return canFillBudget(nextBudget, nextSlots);
    });

    if (possibleComponents.length === 0) {
        return null;
    }

    /*
     * Wir wählen nicht einfach irgendeinen gültigen Baustein.
     *
     * Stattdessen wird weiterhin nach weight gewichtet. Da wir vorher
     * geprüft haben, dass der jeweilige Baustein zu einer gültigen
     * Komplettlösung führen kann, können wir hier nicht mehr in einer
     * Sackgasse landen.
     */
    const selectedComponent = getWeightedRandomComponent(possibleComponents);

    const nextBudget = budget - selectedComponent.cost;
    const nextSlots =
        remainingSlots - getShipCount(selectedComponent);

    const remainingComponents = selectComponents(
        nextBudget,
        nextSlots
    );

    if (remainingComponents === null) {
        return null;
    }

    return [
        selectedComponent,
        ...remainingComponents,
    ];
}


/*
 * --------------------------------------------------------------------------
 * Public API
 * --------------------------------------------------------------------------
 */

export function createRandomCombatEncounter(budget) {
    if (budget <= 0) {
        return [];
    }

    /*
     * Cache für den neuen Encounter zurücksetzen.
     * Die möglichen Lösungen hängen nur von Budget und Slots ab,
     * aber so bleibt der Cache klein und sauber zwischen Encountern.
     */
    feasibilityCache.clear();

    if (!canFillBudget(budget, MAX_ENEMIES_PER_ENCOUNTER)) {
        console.warn(
            `No valid encounter found for budget ${budget} with a maximum of ${MAX_ENEMIES_PER_ENCOUNTER} ships.`
        );

        return [];
    }

    const components = selectComponents(
        budget,
        MAX_ENEMIES_PER_ENCOUNTER
    );

    if (!components) {
        console.warn(
            `Could not generate encounter for budget ${budget}.`
        );

        return [];
    }

    const enemies = components.flatMap((component) => {
        return component.enemies.map((enemyId) => {
            const factory = enemyFactories[enemyId];

            if (!factory) {
                throw new Error(
                    `Unknown enemy factory: "${enemyId}"`
                );
            }

            return factory();
        });
    });

    /*
     * Sicherheitsprüfung.
     *
     * Eigentlich kann diese Bedingung durch die Generierung nicht
     * verletzt werden, aber sie schützt uns zusätzlich davor, dass
     * später versehentlich ein ungültiger Baustein eingebaut wird.
     */
    if (enemies.length > MAX_ENEMIES_PER_ENCOUNTER) {
        throw new Error(
            `Generated encounter contains ${enemies.length} enemies. Maximum is ${MAX_ENEMIES_PER_ENCOUNTER}.`
        );
    }

    return enemies;
}


/*
 * --------------------------------------------------------------------------
 * Combat budget progression
 * --------------------------------------------------------------------------
 *
 * Vorläufige Skalierung. Kann später unabhängig von der Encounter-
 * Generierung angepasst werden.
 */

const combatBudgetByLayer = [
    1,
    2,
    2,
    3,
    3,
    4,
    5,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
];


export function getCombatEncounterBudget(layer) {
    if (layer <= 0) {
        return combatBudgetByLayer[0];
    }

    const index = Math.min(
        layer - 1,
        combatBudgetByLayer.length - 1
    );

    return combatBudgetByLayer[index];
}