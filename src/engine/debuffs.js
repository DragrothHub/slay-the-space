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
    },

    exhausted: {
        id: "exhausted",
        displayName: "Exhausted",
        description: "Deals reduced damage.",
        color: "#f59e0b",
        category: "debuff",
    },

    marked: {
        id: "marked",
        displayName: "Marked",
        description: "Attacking marked targets reduces all cooldowns.",
        color: "#22c55e",
        category: "debuff",
    },

    stunned: {
        id: "stunned",
        displayName: "Stunned",
        description: "Target skips its next turn.",
        color: "#a855f7",
        category: "debuff",
    },

    shocked: {
        id: "shocked",
        displayName: "Shocked",
        description: "Takes damage over time.",
        color: "#3b82f6",
        category: "debuff",
    },

    shieldExplosion: {
        id: "shieldExplosion",
        displayName: "Shield Explosion",
        description: "Triggers an explosion dealing damage equal to current shield value.",
        color: mechanicColor,
        category: "mechanic",
        icon: "*",
        baseDuration: 10,
    },

    shieldRegeneration: {
        id: "shieldRegeneration",
        displayName: "Shield Regeneration",
        description: "When timer reaches zero the shields will be restored if not destroyed.",
        color: mechanicColor,
        category: "mechanic",
        icon: "O",
        baseDuration: 10,
    },
};

export function applyDebuff(target, debuffId, duration = 3) {
    if (!target.stats.debuffs) {
        target.stats.debuffs = [];
    }

    target.stats.debuffs.push({
        id: debuffId,
        duration: duration,
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