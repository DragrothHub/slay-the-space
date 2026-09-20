import { detonate } from "./detonations";
import { applyDamage } from "./damage";
import { applyDebuff, processTurnStartDebuffs, tickDebuffs, hasDebuff, hasDebuffOfList } from "./debuffs";
import { startCooldown, reduceCooldowns } from "./cooldowns";
import { getAllUnits, getActiveUnit, getEnemyUnits, isPlayerShip } from "./helpers";
import { abilityCollection } from "../data/abilities";
import { processTurnEndModules, processTurnStartModules } from "./processModules";
import { calculateNextAIIntent } from "./ai";

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
        animationEvents: [],

        log: [],
    };
}

// ========================================
// INIT BATTLE
// ========================================

export function initBattle(state) {
    state.turnOrder = calculateTurnOrder(state);
    state.turnIndex = 0;

    state.teams.B.forEach(enemy => {
        enemy.aiIntent = calculateNextAIIntent(state, enemy);
    });

    return setNextActor(state);
}

// ========================================
// TURN ENTRY POINT
// ========================================

export function setNextActor(state) {

    resolveDeaths(state);

    if (state.winner) return state;

    const actor = state.turnOrder[state.turnIndex];

    // skip dead or not existent
    if (!actor || actor.destroyed) {
        advanceTurn(state);
        return setNextActor(state);
    }

    // ===============================
    // TURN START DEBUFF PROCESSING
    // ===============================
    processTurnStartDebuffs(actor, state);

    resolveDeaths(state);

    // check death after DOT
    if (actor.destroyed) {
        advanceTurn(state);
        return setNextActor(state);
    }

    processTurnStartModules(actor, state);

    // Reduce cooldowns
    reduceCooldowns(actor);

    // stunned
    if (hasDebuff(actor, "stunned")) {
        state.log.push(`<${isPlayerShip(state, actor) ? "player" : "enemy"}>${actor.name}</${isPlayerShip(state, actor) ? "player" : "enemy"}> is stunned and skips turn.`);

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

function aiTurn(state, actor) {

    const intent = actor.aiIntent;

    const targetStillAlive = getEnemyUnits(state, actor).some(
        ship => ship.id === intent.targetId && !ship.destroyed
    );

    if (!intent || !targetStillAlive) {
        actor.aiIntent = calculateNextAIIntent(state, actor);
    }

    const currentIntent = actor.aiIntent;

    if (!currentIntent) {
        advanceTurn(state);
        return setNextActor(state);
    }

    state.selectedAbilityId = currentIntent.abilityId;

    state.selectedTargetId = currentIntent.targetId;

    // Intent wurde verbraucht. 
    // Nach dem Zug wird ein neuer berechnet. 
    actor.aiIntent = null;

    // hier wird im battle screen ein timeout ausgelöst 
    state.phase = "enemy-confirm"; return state;
}

// ========================================
// PLAYER INPUT FLOW
// ========================================

function getDefaultTarget(state) {

    // zuletzt gewähltes Ziel noch lebendig?
    const lastTarget = state.teams.B.find(
        u =>
            u.id === lastSelectedTarget &&
            !u.destroyed
    );

    if (lastTarget) {
        return lastTarget.id;
    }

    // sonst erstes lebendes Ziel
    const firstAliveEnemy = state.teams.B.find(
        u => !u.destroyed
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

    // Enemy plant seinen nächsten Zug
    if (state.teams.B.some(u => u.id === actor.id) && !actor.destroyed) { 
        actor.aiIntent = calculateNextAIIntent(state, actor); 

        console.log(actor.aiIntent);
    }

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

// ========================================
// ABILITY RESOLUTION
// ========================================

function resolveAbility(actor, abilityId, target, state) {
    let ability = abilityCollection[abilityId];

    state.log.push(
        `<${isPlayerShip(state, actor) ? "player" : "enemy"}>${actor.name}</${isPlayerShip(state, actor) ? "player" : "enemy"}> uses ${ability.displayName} on <${isPlayerShip(state, target) ? "player" : "enemy"}>${target.name}</${isPlayerShip(state, target) ? "player" : "enemy"}>`
    );

    applyDamage(target, actor, ability, state);

    if (ability.appliesDebuff?.length > 0) {
        ability.appliesDebuff.forEach(debuffId => {
            applyDebuff(target, debuffId);
        });
    }

    if (
        ability.detonator &&
        ability.detonatesDebuff &&
        hasDebuffOfList(target, ability.detonatesDebuff)
    ) {
        detonate(target, actor, ability, state);
    }

    startCooldown(actor, abilityId);
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
        .filter(u => !u.destroyed)
        .sort((a, b) => (b.stats.initiative ?? 0) - (a.stats.initiative ?? 0));
}

// ========================================
// VICTORY CHECK
// ========================================

function checkVictory(state) {
    const aliveA = state.teams.A.some(
        u => !u.destroyed
    );

    const aliveB = state.teams.B.some(
        u => !u.destroyed
    );

    if (!aliveA) state.winner = "B";
    if (!aliveB) state.winner = "A";
}

// ========================================
// RESOLVE DEATHS
// ========================================

function resolveDeaths(state) {
    getAllUnits(state).forEach(unit => {
        if (unit.destroyed) return;

        const isDead =
            unit.stats.currentHull <= 0 &&
            unit.stats.currentShield <= 0 &&
            unit.stats.currentArmor <= 0;

        if (!isDead) return;

        unit.destroyed = true;
        unit.stats.debuffs = [];

        state.log.push(`<${isPlayerShip(state, unit) ? "player" : "enemy"}>${unit.name}</${isPlayerShip(state, unit) ? "player" : "enemy"}> was destroyed.`);
    });

    checkVictory(state);
}