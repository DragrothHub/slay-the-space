import { applyDamage } from "./damage";
import { getEnemyUnits } from "./helpers";

// ========================================
// DEBUFF SYSTEM
// ========================================

const mechanicColor = "#facc15";

export const debuffs = {
    weakened: {
        id: "weakened",
        displayName: "Weakened",
        description: "Takes increased damage from all sources.",
        color: "#ef4444",
        category: "debuff",
        icon: null,
        baseDuration: 3,
    },

    exhausted: {
        id: "exhausted",
        displayName: "Exhausted",
        description: "Deals reduced damage.",
        color: "#f59e0b",
        category: "debuff",
        icon: null,
        baseDuration: 3,
    },

    marked: {
        id: "marked",
        displayName: "Marked",
        description: "Attacking marked targets reduces all cooldowns.",
        color: "#22c55e",
        category: "debuff",
        icon: null,
        baseDuration: 3,
    },

    stunned: {
        id: "stunned",
        displayName: "Stunned",
        description: "Target skips its next turn.",
        color: "#a855f7",
        category: "debuff",
        icon: null,
        baseDuration: 1,
    },

    shocked: {
        id: "shocked",
        displayName: "Shocked",
        description: "Takes damage over time.",
        color: "#3b82f6",
        category: "debuff",
        icon: null,
        baseDuration: 3,
    },

    shieldExplosion: {
        id: "shieldExplosion",
        displayName: "Shield Explosion",
        description: "Triggers an explosion dealing damage equal to current shield value.",
        color: mechanicColor,
        category: "mechanic",
        icon: null,
        baseDuration: 10,
    },

    shieldRegeneration: {
        id: "shieldRegeneration",
        displayName: "Shield Regeneration",
        description: "When timer reaches zero the shields will be restored if not destroyed.",
        color: mechanicColor,
        category: "mechanic",
        icon: null,
        baseDuration: 10,
    },

    summonClone: {
        id: "summonCopy",
        displayName: "Summon Copy",
        description: "When timer reaches zero the ship will summon a copy of itself.",
        color: mechanicColor,
        category: "mechanic",
        icon: null,
        baseDuration: 10,
    },

    cleanseDebuffs: {
        id: "cleanseDebuffs",
        displayName: "Cleanse Debuffs",
        description: "Removes all debuffs from all ships.",
        color: mechanicColor,
        category: "mechanic",
        icon: null, //"✦",
        baseDuration: 3,
    },
};

function restartMechanic(effects){
    for (let effect of effects){
        effect.duration += debuffs[effect.id].baseDuration;
    }
}

export function applyDebuff(target, debuffId, duration) {
    if (!target.stats.debuffs) {
        target.stats.debuffs = [];
    }

    const debuff = debuffs[debuffId];

    const actualDuration =
        duration ?? debuff?.baseDuration ?? 3;

    target.stats.debuffs.push({
        id: debuffId,
        duration: actualDuration,
    });
}

/**
 * Turn-start effects (DOT, triggers, etc.)
 */
export function processTurnStartDebuffs(unit, state) {

    if (hasDebuff(unit, "shocked")) {

        const shockDebuffCount = unit.stats.debuffs.filter(
            d => d.id === "shocked"
        ).length;

        const damage = (2 * shockDebuffCount);

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

        state.log.push(`${unit.name} takes ${damage} shock damage.`);
    }

    if (hasDebuff(unit, "shieldExplosion")) {

        const shieldExplosionDebuffsExplodingThisTurn = unit.stats.debuffs.filter(
            d => d.id === "shieldExplosion" && d.duration === 1
        );

        if(shieldExplosionDebuffsExplodingThisTurn.length > 0) {
            const damage = unit.stats.currentShield;

            const enemies = getEnemyUnits(state, unit).filter(enemy => enemy.stats.currentHull > 0);

            for (const enemy of enemies) {
                applyDamage(enemy, unit, {
                    id: "shieldExplosion",
                    type: "none",
                    value: damage,
                }, state);
            }

            if (enemies.length > 0) {
                state.log.push(
                    `Shield Explosion deals ${damage} damage to ${enemies.length} targets`
                );
            }

            unit.stats.currentShield = 0;
        }

        // Restart mechanic
        restartMechanic(shieldExplosionDebuffsExplodingThisTurn);
    }

    if (hasDebuff(unit, "shieldRegeneration")) {

        const shieldRegenerations = unit.stats.debuffs.filter(
            d => d.id === "shieldRegeneration" && d.duration === 1
        );

        if (shieldRegenerations.length > 0 && unit.stats.currentShield) {
            unit.stats.currentShield = unit.stats.maxShield;
            state.log.push(
                `${unit.name}'s shields are fully regenerated.`
            );
        }

        // Restart mechanic
        restartMechanic(shieldRegenerations);
    }

    if (hasDebuff(unit, "summonCopy")) {

        const copyEffects = unit.stats.debuffs.filter(
            d => d.id === "summonCopy" && d.duration === 1
        );

        if (copyEffects.length > 0) {

            // Team des aktuellen Schiffs finden
            let team = null;

            if (state.teams.A.some(u => u.id === unit.id)) {
                team = "A";
            } else if (state.teams.B.some(u => u.id === unit.id)) {
                team = "B";
            }

            if (team) {

                const teamUnits = state.teams[team];

                if (teamUnits.length < 4) {

                    const copiedUnit = structuredClone(unit);

                    copiedUnit.id = `${unit.id}_copy_${Date.now()}`;
                    copiedUnit.name = copiedUnit.name + "_Clone";

                    copiedUnit.stats.debuffs = copiedUnit.stats.debuffs.filter(
                        d => d.id !== "summonCopy"
                    );

                    state.teams[team].push(copiedUnit);

                    state.log.push(
                        `${unit.name} summons a copy of itself.`
                    );

                } else {

                    state.log.push(
                        `${unit.name} cannot summon a copy. The team is full.`
                    );
                }
            }
        }

        // Restart mechanic
        restartMechanic(copyEffects);
    }

    if (hasDebuff(unit, "cleanseDebuffs")) {

        const cleanseEffects = unit.stats.debuffs.filter(
            d => d.id === "cleanseDebuffs" && d.duration === 1
        );

        if (cleanseEffects.length > 0) {

            for (const team of Object.values(state.teams)) {
                for (const ship of team) {

                    ship.stats.debuffs = ship.stats.debuffs.filter(
                        d => debuffs[d.id]?.category === "mechanic"
                    );
                }
            }

            state.log.push(
                `${unit.name} cleanses all debuffs from all ships.`
            );
        }

        // Restart mechanic
        restartMechanic(cleanseEffects);
    }
}

/**
 * Duration ticking (after effects resolved)
 */
export function tickDebuffs(unit) {
    unit.stats.debuffs = unit.stats.debuffs
        .map(d => ({ ...d, duration: d.duration - 1 }))
        .filter(d => d.duration > 0);
}

export function hasDebuff(unit, id) {
    if(unit == null)
        return false;

    return unit.stats.debuffs.some(d => d.id === id);
}

export function removeDebuff(unit, id) {
    unit.stats.debuffs = unit.stats.debuffs.filter(
        d => d.id !== id
    );
}