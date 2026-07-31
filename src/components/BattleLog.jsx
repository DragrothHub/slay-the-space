import { useGameState } from "../state/GameStateProvider";

export default function BattleLog() {

    const { gameState } = useGameState();

    if(!gameState.run?.battle?.log) return null;

    return (
        <div style={{ marginTop: 20 }}>
            <h3>Log</h3>
            {gameState.run.battle.log.slice(-5).map((entry, i) => (
                <div key={i}>{entry}</div>
            ))}
        </div>
    );
}