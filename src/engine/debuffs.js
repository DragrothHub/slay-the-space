// ========================================
// DEBUFF SYSTEM
// ========================================

export const debuffs = {
    weakened_shields: {
        id: "weakened_shields",
        displayName: "Weakened: Shields",
        description: "Attacks deal increased damage to shields.",
        color: "#3b82f6",
    },

    weakened_armor: {
        id: "weakened_armor",
        displayName: "Weakened: Armor",
        description: "Attacks deal increased damage to armor.",
        color: "#f59e0b",
    },

    weakened: {
        id: "weakened",
        displayName: "Weakened",
        description: "Takes increased damage from all sources.",
        color: "#ef4444",
    },

    stunned: {
        id: "stunned",
        displayName: "Stunned",
        description: "Target skips its next turn.",
        color: "#a855f7",
    },

    shocked: {
        id: "shocked",
        displayName: "Shocked",
        description: "Takes damage over time. Detonating this target chains damage to another enemy.",
        color: "#22c55e",
    },
};

export function applyDebuff(target, debuffId) {
    if (!target.stats.debuffs) {
        target.stats.debuffs = [];
    }

    target.stats.debuffs.push({
        id: debuffId,
        duration: 3,
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