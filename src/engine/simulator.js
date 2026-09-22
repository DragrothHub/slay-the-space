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