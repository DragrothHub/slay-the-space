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