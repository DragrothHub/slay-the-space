import { detonate } from "./detonations";
import { applyDamage } from "./damage";
import { applyDebuff, processTurnStartDebuffs, tickDebuffs, hasDebuff } from "./debuffs";
import { startCooldown, reduceCooldowns, isAbilityOnCooldown } from "./cooldowns";
import { getAllUnits, getActiveUnit, getEnemyUnits } from "./helpers";
import { abilityCollection } from "../data/abilities";
import { processTurnEndModules, processTurnStartModules } from "./processModules";

// ========================================
// INIT
// ========================================

export function createBattleState(teamA, teamB) {
    return {
        teams: {
            A: teamA,
            B: teamB,
        },

        turnOrder: [],
        turnIndex: 0,
        round: 1,

        activeUnitId: null,

        phase: "idle", // idle | select-ability | select-target | ready

        selectedAbilityId: null,
        selectedTargetId: null,

        winner: null,

        damageEvents: [],

        log: [],
    };
}

// ========================================
// INIT BATTLE
// ========================================

export function initBattle(state) {
    state.turnOrder = calculateTurnOrder(state);
    state.turnIndex = 0;

    return setNextActor(state);
}

// ========================================
// TURN ENTRY POINT
// ========================================

export function setNextActor(state) {
    if (state.winner) return state;

    const actor = state.turnOrder[state.turnIndex];

    if (!actor) {
        advanceTurn(state);
    }

    // skip dead
    if (actor.stats.currentHull <= 0) {
        advanceTurn(state);
        return setNextActor(state);
    }

    // ===============================
    // TURN START DEBUFF PROCESSING
    // ===============================
    processTurnStartDebuffs(actor, state);

    // check death after DOT
    if (actor.stats.currentHull <= 0) {
        state.log.push(`${actor.name} was destroyed by effects.`);
        advanceTurn(state);
        return setNextActor(state);
    }

    processTurnStartModules(actor, state);

    // Reduce cooldowns
    reduceCooldowns(actor);

    // stunned
    if (hasDebuff(actor, "stunned")) {
        state.log.push(`${actor.name} is stunned and skips turn.`);

        tickDebuffs(actor);

        advanceTurn(state);
        return setNextActor(state);
    }

    // normal debuff tick
    tickDebuffs(actor);

    state.activeUnitId = actor.id;

    if(state.teams.B.some(u => u.id === actor.id)){
        return aiTurn(state, actor);
    }
    else{
        state.phase = "select-ability";
        state.selectedAbilityId = null;
        state.selectedTargetId = getDefaultTarget(state);
    }

    return state;
}

function aiTurn(state, actor){

    const enemies = getEnemyUnits(state, actor).filter(enemy => enemy.stats.currentHull > 0);

    state.selectedTargetId = enemies[Math.floor(Math.random() * enemies.length)].id;

    const usableAbilities = actor.abilities.filter(
        a => !isAbilityOnCooldown(actor, a)
    );

    state.selectedAbilityId = usableAbilities[Math.floor(Math.random() * usableAbilities.length)];

    // hier wird im battle screen ein timeout ausgelöst
    state.phase = "enemy-confirm";

    return state;
}

// ========================================
// PLAYER INPUT FLOW
// ========================================

function getDefaultTarget(state) {

    // zuletzt gewähltes Ziel noch lebendig?
    const lastTarget = state.teams.B.find(
        u =>
            u.id === lastSelectedTarget &&
            u.stats.currentHull > 0
    );

    if (lastTarget) {
        return lastTarget.id;
    }

    // sonst erstes lebendes Ziel
    const firstAliveEnemy = state.teams.B.find(
        u => u.stats.currentHull > 0
    );

    return firstAliveEnemy?.id ?? null;
}

let lastSelectedTarget = null;

export function selectTarget(state, targetId) {
    state.selectedTargetId = targetId;
    state.phase = "select-ability";

    lastSelectedTarget = targetId;

    return state;
}

export function selectAbility(state, ability) {
    state.selectedAbilityId = ability;

    return state;
}

// ========================================
// CONFIRM ACTION
// ========================================

export function confirmAction(state) {

    const actor = getActiveUnit(state);

    const abilityId = state.selectedAbilityId;

    const target = getAllUnits(state).find(
        u => u.id === state.selectedTargetId
    );

    if (!actor || !abilityId || !target) {
        return state;
    }

    state.phase = "ability-animation";

    return state;
}

export function resolveAction(state) {

    const actor = getActiveUnit(state);

    const abilityId = state.selectedAbilityId;

    const target = getAllUnits(state).find(
        u => u.id === state.selectedTargetId
    );

    if (!actor || !abilityId || !target) {
        return state;
    }

    if (hasDebuff(target, "marked")) {
        reduceCooldowns(actor);
    }

    resolveAbility(actor, abilityId, target, state);

    processTurnEndModules(actor, state);

    state.selectedAbilityId = null;
    state.selectedTargetId = null;

    state.phase = "select-ability";

    resolveDeaths(state);

    checkVictory(state);

    if (!state.winner) {
        advanceTurn(state);
        setNextActor(state);
    }

    return state;
}

// export function confirmAction(state) {
//     const actor = getActiveUnit(state);

//     state.phase = "ready";

//     const abilityId = state.selectedAbilityId;

//     const target = getAllUnits(state).find(
//         u => u.id === state.selectedTargetId
//     );

//     if (!actor || !abilityId || !target) return state;


//     // trennung


//     if (hasDebuff(target, "marked")) {
//         reduceCooldowns(actor);
//     }

//     resolveAbility(actor, abilityId, target, state);

//     state.selectedAbilityId = null;
//     state.phase = "select-ability";

//     resolveDeaths(state);

//     checkVictory(state);

//     if (!state.winner) {
//         advanceTurn(state);
//         setNextActor(state);
//     }

//     return state;
// }

// ========================================
// ABILITY RESOLUTION
// ========================================

function resolveAbility(actor, abilityId, target, state) {
    let ability = abilityCollection[abilityId];
    applyDamage(target, actor, ability, state);

    if (ability.appliesDebuff) {
        applyDebuff(target, ability.appliesDebuff);
    }

    if (
        ability.detonator &&
        ability.detonatesDebuff &&
        hasDebuff(target, ability.detonatesDebuff)
    ) {
        detonate(target, actor, ability, state);
    }

    startCooldown(actor, abilityId);

    state.log.push(
        `${actor.name} used ${ability.displayName} on ${target.name}`
    );
}

// ========================================
// TURN PROGRESSION
// ========================================

function advanceTurn(state) {
    state.turnIndex++;

    if (state.turnIndex >= state.turnOrder.length) {
        state.round++;

        state.turnOrder = calculateTurnOrder(state);
        state.turnIndex = 0;
    }
}

// ========================================
// HELPERS
// ========================================

function calculateTurnOrder(state) {
    return getAllUnits(state)
        .filter(u => u.stats.currentHull > 0)
        .sort((a, b) => (b.stats.initiative ?? 0) - (a.stats.initiative ?? 0));
}

// ========================================
// VICTORY CHECK
// ========================================

function checkVictory(state) {
    const aliveA = state.teams.A.some(
        u => u.stats.currentHull > 0
    );

    const aliveB = state.teams.B.some(
        u => u.stats.currentHull > 0
    );

    if (!aliveA) state.winner = "B";
    if (!aliveB) state.winner = "A";
}

// ========================================
// RESOLVE DEATHS
// ========================================

function resolveDeaths(state) {

    getAllUnits(state).forEach(unit => {

        if (unit.stats.currentHull > 0) return;
        if (unit.destroyed) return;

        unit.destroyed = true;

        unit.stats.debuffs = [];

        state.log.push(`${unit.name} was destroyed.`);
    });

    checkVictory(state);
}