export function getAllUnits(state) {
    return [...state.teams.A, ...state.teams.B];
}

export function getActiveUnit(state) {
    return getAllUnits(state).find(
        u => u.id === state.activeUnitId
    );
}

export function getEnemyUnits(state, actor) {
    const isInTeamA = state.teams.A.some(
        u => u.id === actor.id
    );

    return isInTeamA ? state.teams.B : state.teams.A;
}

export function getTargetUnit(state) {
    return getAllUnits(state).find(
        u => u.id === state.selectedTargetId
    );
}

export function getFriendlyUnits(state, actor) {
    const isInTeamA = state.teams.A.some(
        u => u.id === actor.id
    );

    return isInTeamA ? state.teams.A : state.teams.B;
}

export function repairShip({ship, shield = 0, armor = 0, hull = 0, full = false}) {
    if (!ship) return;

    if (full) {
        shield = 100000;
        armor = 100000;
        hull = 100000;
    }

    const maxShield = ship.stats.maxShield * 2;
    const shieldRestored = Math.min(
        shield,
        Math.max(0, maxShield - ship.stats.currentShield)
    );
    ship.stats.currentShield += shieldRestored;

    const maxArmor = ship.stats.maxArmor * 2;
    const armorRestored = Math.min(
        armor,
        Math.max(0, maxArmor - ship.stats.currentArmor)
    );
    ship.stats.currentArmor += armorRestored;

    const maxHull = ship.stats.maxHull * 2;
    const hullRestored = Math.min(
        hull,
        Math.max(0, maxHull - ship.stats.currentHull)
    );
    ship.stats.currentHull += hullRestored;

    return {
        shieldRestored,
        armorRestored,
        hullRestored,
    };
}