import { useGameState } from "../state/GameStateProvider";
import Ship from "./Ship";
import { selectTarget } from "../engine/turnEngine";

function TeamFleet({
    team,
    reverse = false,
}) {

    const {gameState, updateBattle } = useGameState();
    const topRow = team.slice(0, 2);
    const bottomRow = team.slice(2, 4);
    const battle = gameState.run.battle;

    function canSelectTarget(target){
        if(target.stats.currentHull <= 0)
                return false;

        const targetIsInTeamA = battle.teams.A.some(u => u.id === target.id);
        const sourceIsInTeamA = battle.teams.A.some(u => u.id === battle.activeUnitId);

        if(targetIsInTeamA == sourceIsInTeamA)
            return false;

        return true;
    }

    function handleSelectTarget(target)
    {
        if (canSelectTarget(target) && !battle.winner)
        {
            updateBattle(s => selectTarget(s, target.id));
        }
    }

    const renderImageRow = (row, rowIndex) => (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                gap: "0px",

                // ganze Reihe leicht verschieben
                transform:
                    rowIndex === 0
                        ? "translateX(-20px)"
                        : "translateX(20px)",
            }}
        >
            {row.map((unit, index) => (
                <div
                    key={unit.id}
                    style={{
                        // einzelne ships zusätzlich leicht versetzen
                        transform:
                            index % 2 === 0
                                ? "translateY(0px)"
                                : "translateY(-12px)",
                    }}
                >
                    <Ship
                        unit={unit}
                        damageEvents={battle.damageEvents}
                        isActive={battle.activeUnitId === unit.id}
                        isTargeted={battle.selectedTargetId === unit.id}
                        isDead={unit.stats.currentHull <= 0}
                        mode="image"
                        reverse={reverse}
                        onClick={() => handleSelectTarget(unit)}
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Gegner zuerst Stats, dann Ships */}
            {reverse && (
                <>
                    {renderImageRow(topRow, 0)}
                    {renderImageRow(bottomRow, 1)}
                </>
            )}

            {/* Spieler zuerst Ships, dann Stats */}
            {!reverse && (
                <>
                    {renderImageRow(topRow, 0)}
                    {renderImageRow(bottomRow, 1)}
                </>
            )}
        </div>
    );
}

export default function BattleField() {

    const { gameState } = useGameState();
    if(!gameState.run?.battle) return null;
    const playerFleet = gameState.run.battle.teams.A;
    const enemyFleet = gameState.run.battle.teams.B;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                paddingTop: 0,
                paddingBottom: 0,
            }}
        >
            {/* ENEMY FLEET */}
            <TeamFleet
                team={enemyFleet}
                reverse={true}
            />

            {/* PLAYER FLEET */}
            <TeamFleet
                team={playerFleet}
                reverse={false}
            />
        </div>
    );
}