import {
    createBattleState,
    initBattle,
    resolveAction
} from "./turnEngine";

import {
    getActiveUnit,
    isPlayerShip
} from "./helpers";

import { calculateNextAIIntent } from "./ai";


// ========================================
// SIMULATE ONE BATTLE
// ========================================

/*
USAGE:
          const teamA = [
              createShip(),
              createShip(),
          ];

          const teamB = [
              createShip(),
              createShip(),
          ];

          const result = simulateBattle(teamA, teamB);

          console.log("Winner:", result.winner);
          console.log("Rounds:", result.rounds);
          console.log("Actions:", result.actions);
          console.log(result);
*/

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

        // DamageEvent enthält aktuell nur targetId.
        // Den Angreifer müssen wir daher aus den Events kennen.
        // Falls actorId noch nicht vorhanden ist, siehe Hinweis unten.
        const actorId = event.actorId;

        if (!actorId) return;

        // Schiff anlegen
        if (!result[actorId]) {
            result[actorId] = {
                totalDamage: 0,
                attacks: 0,
                averageDamagePerAttack: 0,

                abilities: {}
            };
        }

        const ship = result[actorId];

        // Schiffswerte
        ship.totalDamage += event.amount;
        ship.attacks++;

        // Ability anlegen
        if (!ship.abilities[event.abilityId]) {
            ship.abilities[event.abilityId] = {
                attacks: 0,

                totalDamage: 0,
                shieldDamage: 0,
                armorDamage: 0,
                hullDamage: 0,

                averageDamage: 0
            };
        }

        const ability = ship.abilities[event.abilityId];

        // Ability-Werte
        ability.attacks++;

        ability.totalDamage += event.amount;
        ability.shieldDamage += event.shieldDmg;
        ability.armorDamage += event.armorDmg;
        ability.hullDamage += event.hullDmg;

    });

    // Durchschnittswerte berechnen
    Object.values(result).forEach(ship => {

        if (ship.attacks > 0) {
            ship.averageDamagePerAttack =
                ship.totalDamage / ship.attacks;
        }

        Object.values(ship.abilities).forEach(ability => {

            if (ability.attacks > 0) {
                ability.averageDamage =
                    ability.totalDamage / ability.attacks;
            }

        });
    });

    return result;
}