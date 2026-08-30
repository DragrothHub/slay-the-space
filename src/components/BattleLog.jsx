import { useGameState } from "../state/GameStateProvider";

export default function BattleLog() {

    const { gameState } = useGameState();

    if(!gameState.run?.battle?.log) return null;

    return (
        <div style={{ marginTop: 20, marginBottom: 100, }}>
            <h3 style={{ color: "rgb(158, 203, 255)" }}>Log</h3>
            {gameState.run.battle.log.slice(-20).reverse().map((entry, i) => (
                <div key={i} style={{ fontSize: "0.8em" }}>{entry}</div>
            ))}
        </div>
    );
}