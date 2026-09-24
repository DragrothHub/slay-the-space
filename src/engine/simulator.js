import {
    createBattleState,
    initBattle,
    resolveAction
} from "./turnEngine";

import {
    getActiveUnit,
    getAllUnits,
    isPlayerShip
} from "./helpers";

import { calculateNextAIIntent } from "./ai";
import { createEnemyTest, createShip } from "../data/createShip";


// ========================================
// SIMULATE ONE BATTLE
// ========================================

/*
Testdurchlauf:

const teamA = [createShip(),createShip(),];
const teamB = [createShip(),createShip(),];
const result = simulateBattle(teamA, teamB);
console.log(result);

Anlegen von Testschiffen:

createShip(2, 360, {
    class: "frigate",
    abilities: [
        "neutral_offensive_laser",
        "primer_x",
        "detonator_y"
    ]
});


Oder so:

const teamA = [
    createShip(2, 360, {
        abilities: [
            "neutral_offensive_laser"
        ],
    }),
]

const teamB = [
    createStandardEnemy(),
]

const result = simulateBattle(teamA, teamB);
console.log(result);
*/

export function createStandardEnemy() {
    return createEnemyTest({
        typeId: "standardEnemy",
        name: "Training Dummy",

        shield: 100,
        armor: 100,
        hull: 100,

        attributes: {
            initiative: 1,
            kineticAtk: 0,
            laserAtk: 0,
            hull: 0,
            shieldDef: 0,
            armorDef: 0,
        },

        abilities: []
    });
}

export function simulateBattle(teamA, teamB, options = {}) {

    const maxActions = options.maxActions ?? 1000;

    const state = createBattleState(teamA, teamB);

    initBattle(state);

    let actions = 0;

    while (!state.winner && actions < maxActions) {

        const actor = getActiveUnit(state);

        if (!actor) {
            break;
        }

        // ========================================
        // PLAYER / TEAM A
        // ========================================

        if (isPlayerShip(state, actor)) {

            const intent = calculateNextAIIntent(state, actor);

            if (!intent) {
                break;
            }

            state.selectedAbilityId = intent.abilityId;
            state.selectedTargetId = intent.targetId;
        }

        // ========================================
        // ENEMY / TEAM B
        // ========================================
        
        // Bei einem Enemy wurden selectedAbilityId
        // und selectedTargetId bereits von aiTurn()
        // gesetzt.
        
        if (!state.selectedAbilityId || !state.selectedTargetId) {
            break;
        }

        // ========================================
        // RESOLVE
        // ========================================

        resolveAction(state);

        actions++;
    }

    return {
        winner: state.winner,
        rounds: state.round,
        actions,
        aborted: !state.winner && actions >= maxActions,
        state,
        aggregatedDamageEvents: aggregateDamageEvents(state),
    };
}

export function aggregateDamageEvents(state) {

    const result = {};

    state.damageEvents.forEach(event => {

        const actor = getAllUnits(state).find(
            unit => unit.id === event.actorId
        );

        if (!actor) return;

        // Nicht nach zufälliger ID gruppieren,
        // sondern nach der ID des konkreten Schiffs.
        if (!result[actor.id]) {

            result[actor.id] = {
                id: actor.id,
                name: actor.name,
                typeId: actor.typeId,
                class: actor.class,

                abilities: actor.abilities,
                modules: actor.modules,

                totalDamage: 0,
                attacks: 0,
                averageDamagePerAttack: 0,

                abilityStats: {}
            };
        }

        const ship = result[actor.id];

        // ========================================
        // SHIP TOTALS
        // ========================================

        ship.totalDamage += event.amount;
        ship.attacks++;

        // ========================================
        // ABILITY
        // ========================================

        if (!ship.abilityStats[event.abilityId]) {

            ship.abilityStats[event.abilityId] = {
                attacks: 0,

                totalDamage: 0,
                shieldDamage: 0,
                armorDamage: 0,
                hullDamage: 0,

                averageDamagePerAttack: 0
            };
        }

        const ability =
            ship.abilityStats[event.abilityId];

        ability.attacks++;

        ability.totalDamage += event.amount;
        ability.shieldDamage += event.shieldDmg;
        ability.armorDamage += event.armorDmg;
        ability.hullDamage += event.hullDmg;
    });

    // ========================================
    // AVERAGES
    // ========================================

    Object.values(result).forEach(ship => {

        if (ship.attacks > 0) {
            ship.averageDamagePerAttack =
                ship.totalDamage / ship.attacks;
        }

        Object.values(ship.abilityStats).forEach(ability => {

            if (ability.attacks > 0) {
                ability.averageDamagePerAttack =
                    ability.totalDamage / ability.attacks;
            }
        });
    });

    return result;
}

export function simulateBattles(createTeams, count = 10000, options = {}) {

    const results = [];

    for (let i = 0; i < count; i++) {

        const { teamA, teamB } = createTeams();

        const result = simulateBattle(
            teamA,
            teamB,
            options
        );

        results.push(result);
    }

    return {
        count,
        results,
        aggregate: aggregateSimulationResults(results)
    };
}

export function aggregateSimulationResults(results) {

    const result = {
        battles: results.length,

        wins: {},
        losses: {},
        draws: 0,
        aborted: 0,

        ships: {}
    };

    results.forEach(battle => {

        // ========================================
        // BATTLE RESULT
        // ========================================

        if (battle.aborted) {
            result.aborted++;
        }

        if (!battle.winner) {
            result.draws++;
        } else {

            const winnerId = battle.winner;

            if (winnerId) {
                result.wins[winnerId] =
                    (result.wins[winnerId] ?? 0) + 1;
            }
        }

        // ========================================
        // DAMAGE
        // ========================================

        Object.values(battle.aggregatedDamageEvents)
            .forEach(ship => {

                const key = ship.name;

                if (!result.ships[key]) {

                    result.ships[key] = {
                        name: ship.name,
                        typeId: ship.typeId,
                        class: ship.class,

                        battles: 0,

                        totalDamage: 0,
                        attacks: 0,
                        averageDamagePerAttack: 0,

                        abilityStats: {}
                    };
                }

                const aggregate = result.ships[key];

                aggregate.battles++;

                aggregate.totalDamage += ship.totalDamage;
                aggregate.attacks += ship.attacks;

                // ========================================
                // ABILITIES
                // ========================================

                Object.entries(ship.abilityStats)
                    .forEach(([abilityId, ability]) => {

                        if (!aggregate.abilityStats[abilityId]) {

                            aggregate.abilityStats[abilityId] = {
                                attacks: 0,
                                totalDamage: 0,

                                shieldDamage: 0,
                                armorDamage: 0,
                                hullDamage: 0,

                                averageDamagePerAttack: 0
                            };
                        }

                        const target =
                            aggregate.abilityStats[abilityId];

                        target.attacks += ability.attacks;

                        target.totalDamage +=
                            ability.totalDamage;

                        target.shieldDamage +=
                            ability.shieldDamage;

                        target.armorDamage +=
                            ability.armorDamage;

                        target.hullDamage +=
                            ability.hullDamage;
                    });
            });
    });

    // ========================================
    // AVERAGES
    // ========================================

    Object.values(result.ships).forEach(ship => {

        if (ship.attacks > 0) {
            ship.averageDamagePerAttack =
                ship.totalDamage / ship.attacks;
        }

        Object.values(ship.abilityStats)
            .forEach(ability => {

                if (ability.attacks > 0) {
                    ability.averageDamagePerAttack =
                        ability.totalDamage /
                        ability.attacks;
                }
            });
    });

    // ========================================
    // WIN RATES
    // ========================================

    Object.keys(result.wins).forEach(id => {

        result.wins[id] = {
            wins: result.wins[id],
            winRate:
                result.wins[id] /
                result.battles
        };
    });

    return result;
}


//====================================================================

const TEST_CLASSES = [
    "dreadnought",
    "corvette",
    "frigate",
    "interceptor"
];

export function createClassTestShip(className) {

    const ship = createShip(2, 360, {
        class: className
    });

    ship.name = className;

    return ship;
}

export function simulateClassMatchup(
    classA,
    classB,
    count = 10000,
    options = {}
) {

    return simulateBattles(
        () => {

            const shipA =
                createClassTestShip(classA);

            const shipB =
                createClassTestShip(classB);

            return {
                teamA: [shipA],
                teamB: [shipB]
            };
        },
        count,
        options
    );
}

export function simulateAllClassMatchups(
    classes,
    count = 10000,
    options = {}
) {

    const results = {};

    for (const classA of classes) {

        results[classA] = {};

        for (const classB of classes) {

            const result =
                simulateClassMatchup(
                    classA,
                    classB,
                    count,
                    options
                );

            results[classA][classB] =
                result.aggregate;
        }
    }

    return results;
}

export function getMatchupSummary(
    result,
    classA,
    classB
) {

    const aggregate = result.aggregate;

    const winsA =
        aggregate.wins[
            classA
        ]?.wins ?? 0;

    const winsB =
        aggregate.wins[
            classB
        ]?.wins ?? 0;

    const battles = aggregate.battles;

    return {
        classA,
        classB,

        battles,

        winsA,
        winsB,

        draws: aggregate.draws,
        aborted: aggregate.aborted,

        winRateA: winsA / battles,
        winRateB: winsB / battles
    };
}