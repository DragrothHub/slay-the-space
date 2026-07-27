// ========================================
// BATTLE LOGIC
// ========================================

import * as ui from "./battleUI.js";

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

        selectedAbility: null,
        selectedTargetId: null,

        winner: null,

        damageEvents: [],

        log: [],
    };
}

// ========================================
// START BATTLE
// ========================================

export async function startBattle(state) {

    state.turnOrder = calculateTurnOrder(state);

    await ui.showBattleStart(state);

    await playNextTurn(state);
}

// ========================================
// MAIN TURN FLOW
// ========================================

export async function playNextTurn(state) {

    if (state.winner) {
        await ui.showBattleEnd(state);
        return;
    }

    let actor = state.turnOrder[state.turnIndex];

    // invalid actor safety
    if (!actor) {

        advanceTurn(state);

        actor = state.turnOrder[state.turnIndex];
    }

    // dead skip
    if (actor.stats.currentHull <= 0) {

        await ui.showDestroyedSkip(actor);

        advanceTurn(state);

        return playNextTurn(state);
    }

    state.activeUnitId = actor.id;

    // ====================================
    // TURN START
    // ====================================

    await ui.showTurnStart(actor);

    processTurnStartDebuffs(actor, state);

    await ui.showTurnStartEffects(actor, state);

    // died from DOT
    if (actor.stats.currentHull <= 0) {

        await ui.showDestroyed(actor);

        advanceTurn(state);

        return playNextTurn(state);
    }

    reduceCooldowns(actor);

    // stunned
    if (hasDebuff(actor, "stunned")) {

        await ui.showStunned(actor);

        tickDebuffs(actor);

        advanceTurn(state);

        return playNextTurn(state);
    }

    tickDebuffs(actor);

    // ====================================
    // AI TURN
    // ====================================

    if (isAIUnit(state, actor)) {

        await playAiTurn(state, actor);
    }

    // ====================================
    // PLAYER TURN
    // ====================================

    else {

        await playPlayerTurn(state, actor);
    }

    // ====================================
    // CHECK VICTORY
    // ====================================

    checkVictory(state);

    if (state.winner) {

        await ui.showBattleEnd(state);

        return;
    }

    // ====================================
    // TURN END
    // ====================================

    await ui.showTurnEnd(actor);

    advanceTurn(state);

    return playNextTurn(state);
}

// ========================================
// AI TURN
// ========================================

async function playAiTurn(state, actor) {

    await ui.showAiThinking(actor);

    const enemies = getEnemyUnits(state, actor);

    const target =
        enemies[Math.floor(Math.random() * enemies.length)];

    state.selectedTargetId = target.id;

    await ui.showTargetSelection(actor, target);

    const usableAbilities = actor.abilities.filter(
        a => !isAbilityOnCooldown(actor, a)
    );

    const ability =
        usableAbilities[
            Math.floor(Math.random() * usableAbilities.length)
        ];

    state.selectedAbility = ability;

    await ui.showAbilitySelection(actor, ability);

    await executeAction(state, actor, ability, target);
}

// ========================================
// PLAYER TURN
// ========================================

async function playPlayerTurn(state, actor) {

    const target = await ui.requestPlayerTarget(
        state,
        actor
    );

    state.selectedTargetId = target.id;

    const ability = await ui.requestPlayerAbility(
        state,
        actor
    );

    state.selectedAbility = ability;

    await executeAction(state, actor, ability, target);
}

// ========================================
// ACTION EXECUTION
// ========================================

async function executeAction(
    state,
    actor,
    ability,
    target
) {

    await ui.showAbilityCast(
        actor,
        ability,
        target
    );

    await ui.showProjectile(
        actor,
        target,
        ability
    );

    resolveAction(
        actor,
        ability,
        target,
        state
    );

    await ui.showDamageResult(
        target,
        state.damageEvents
    );

    if (target.stats.currentHull <= 0) {

        await ui.showDestroyed(target);
    }
}

// ========================================
// ACTION RESOLUTION
// ========================================

function resolveAction(actor, ability, target, state) {

    applyDamage(target, ability, state);

    if (ability.appliesDebuff) {

        applyDebuff(
            target,
            ability.appliesDebuff
        );
    }

    if (
        ability.detonator &&
        ability.detonatesDebuff &&
        hasDebuff(
            target,
            ability.detonatesDebuff
        )
    ) {

        detonate(
            target,
            ability,
            state
        );
    }

    startCooldown(ability);

    state.log.push(
        `${actor.name} used ${ability.displayName} on ${target.name}`
    );
}

// ========================================
// DETONATION
// ========================================

function detonate(target, ability, state) {

    const debuffId =
        ability.detonatesDebuff;

    const removedDebuffs =
        target.stats.debuffs.filter(
            d => d.id === debuffId
        );

    target.stats.debuffs =
        target.stats.debuffs.filter(
            d => d.id !== debuffId
        );

    const removedCount =
        removedDebuffs.length;

    if (removedCount === 0) return;

    const baseDamage =
        ability.value;

    const detonationMultiplier =
        1 + removedCount * 0.75;

    const explosionDamage =
        baseDamage * detonationMultiplier;

    applyDamage(
        target,
        {
            ...ability,
            value: explosionDamage,
        },
        state
    );

    const enemies =
        getFriendlyUnits(state, target);

    const splashTargets =
        enemies.filter(
            u => u.id !== target.id
        );

    const splashDamage =
        explosionDamage * 0.4;

    for (const enemy of splashTargets) {

        applyDamage(
            enemy,
            {
                ...ability,
                value: splashDamage,
            },
            state
        );
    }
}

// ========================================
// DAMAGE SYSTEM
// ========================================

const damageTable = {
    laser: {
        shield: 1.5,
        armor: 1,
        hull: 1,
    },

    kinetic: {
        shield: 1,
        armor: 1.5,
        hull: 1,
    },
};

function getDamageMultiplier(type, layer) {

    return damageTable[type]?.[layer] ?? 1;
}

function damageLayer(
    currentValue,
    incomingDamage,
    multiplier
) {

    const effectiveDamage =
        incomingDamage * multiplier;

    const absorbedDamage =
        Math.min(currentValue, effectiveDamage);

    const remainingLayer =
        currentValue - absorbedDamage;

    const rawDamageUsed =
        absorbedDamage / multiplier;

    const remainingDamage =
        incomingDamage - rawDamageUsed;

    return {
        remainingLayer,
        remainingDamage,
        absorbedDamage,
    };
}

function applyDamage(
    target,
    ability,
    state
) {

    let damage = ability.value;

    const before = {
        shield: target.stats.currentShield,
        armor: target.stats.currentArmor,
        hull: target.stats.currentHull,
    };

    if (hasDebuff(target, "weakened")) {
        damage *= 1.25;
    }

    const layers = [
        {
            key: "currentShield",
            type: "shield",
        },

        {
            key: "currentArmor",
            type: "armor",
        },

        {
            key: "currentHull",
            type: "hull",
        },
    ];

    for (const layer of layers) {

        if (damage <= 0) break;

        const currentValue =
            target.stats[layer.key];

        if (currentValue <= 0) continue;

        const multiplier =
            getDamageMultiplier(
                ability.type,
                layer.type
            );

        const result = damageLayer(
            currentValue,
            damage,
            multiplier
        );

        target.stats[layer.key] = Math.max(
            0,
            Math.floor(result.remainingLayer)
        );

        damage = result.remainingDamage;
    }

    const after = {
        shield: target.stats.currentShield,
        armor: target.stats.currentArmor,
        hull: target.stats.currentHull,
    };

    const totalDamage =
        (before.hull - after.hull) +
        (before.armor - after.armor) +
        (before.shield - after.shield);

    if (totalDamage > 0) {

        state.damageEvents.push({
            targetId: target.id,

            shieldDmg:
                before.shield - after.shield,

            armorDmg:
                before.armor - after.armor,

            hullDmg:
                before.hull - after.hull,

            amount: totalDamage,

            timestamp: Date.now(),
        });
    }
}

// ========================================
// TURN
// ========================================

function advanceTurn(state) {

    state.turnIndex++;

    if (
        state.turnIndex >=
        state.turnOrder.length
    ) {

        state.round++;

        state.turnOrder =
            calculateTurnOrder(state);

        state.turnIndex = 0;
    }
}

// ========================================
// DEBUFFS
// ========================================

function applyDebuff(target, debuffId) {

    if (!target.stats.debuffs) {

        target.stats.debuffs = [];
    }

    target.stats.debuffs.push({
        id: debuffId,
        duration: 2,
    });
}

function processTurnStartDebuffs(
    unit,
    state
) {

    if (hasDebuff(unit, "shocked")) {

        const shockDebuffCount =
            unit.stats.debuffs.filter(
                d => d.id === "shocked"
            ).length;

        const damage =
            2 * shockDebuffCount;

        unit.stats.currentHull = Math.max(
            0,
            unit.stats.currentHull - damage
        );

        state.damageEvents.push({
            targetId: unit.id,
            shieldDmg: 0,
            armorDmg: 0,
            hullDmg: damage,
            amount: damage,
            timestamp: Date.now(),
        });

        state.log.push(
            `${unit.name} takes ${damage} shock damage.`
        );
    }
}

function tickDebuffs(unit) {

    unit.stats.debuffs =
        unit.stats.debuffs
            .map(d => ({
                ...d,
                duration: d.duration - 1,
            }))
            .filter(d => d.duration > 0);
}

export function hasDebuff(unit, id) {

    if (!unit) return false;

    return unit.stats.debuffs.some(
        d => d.id === id
    );
}

// ========================================
// COOLDOWNS
// ========================================

function startCooldown(ability) {

    ability.remainingCooldown =
        ability.cooldown;
}

function reduceCooldowns(actor) {

    actor.abilities.forEach(ability => {

        if (ability.remainingCooldown > 0) {

            ability.remainingCooldown--;
        }
    });
}

function isAbilityOnCooldown(
    actor,
    ability
) {

    return ability.remainingCooldown > 0;
}

// ========================================
// HELPERS
// ========================================

function calculateTurnOrder(state) {

    return getAllUnits(state)
        .filter(
            u => u.stats.currentHull > 0
        )
        .sort(
            (a, b) =>
                (b.class.speed ?? 0) -
                (a.class.speed ?? 0)
        );
}

function isAIUnit(state, actor) {

    return state.teams.B.some(
        u => u.id === actor.id
    );
}

export function getAllUnits(state) {

    return [
        ...state.teams.A,
        ...state.teams.B,
    ];
}

export function getEnemyUnits(
    state,
    actor
) {

    const isInTeamA =
        state.teams.A.some(
            u => u.id === actor.id
        );

    return isInTeamA
        ? state.teams.B
        : state.teams.A;
}

function getFriendlyUnits(
    state,
    actor
) {

    const isInTeamA =
        state.teams.A.some(
            u => u.id === actor.id
        );

    return isInTeamA
        ? state.teams.A
        : state.teams.B;
}

// ========================================
// VICTORY
// ========================================

function checkVictory(state) {

    const aliveA =
        state.teams.A.some(
            u => u.stats.currentHull > 0
        );

    const aliveB =
        state.teams.B.some(
            u => u.stats.currentHull > 0
        );

    if (!aliveA) state.winner = "B";

    if (!aliveB) state.winner = "A";
}