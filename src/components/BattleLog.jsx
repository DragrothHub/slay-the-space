import { useGameState } from "../state/GameStateProvider";

export default function BattleLog() {

    const { gameState } = useGameState();

    if (!gameState.run?.battle?.log) return null;

    return (
        <div
            style={{
                marginTop: 20,
                marginBottom: 100,
                minWidth: 0,
            }}
        >
            <h3 style={{ color: "rgb(158, 203, 255)" }}>Log</h3>

            {gameState.run.battle.log.slice(-20).reverse().map((entry, i) => (
                <div
                    key={i}
                    style={{
                        fontSize: "0.8em",
                        overflowWrap: "anywhere",
                    }}
                >
                    {parseLog(entry)}
                </div>
            ))}
        </div>
    );
}

const colors = {
    player: "#9ecbff",
    enemy: "#ef4444",
    damage: "#ef4444",
    armor: "#f59e0b",
    shield: "#3b82f6",
};

// parse e.g. <enemy>${target.name}</enemy> for ...
function parseLog(text) {
    const regex = /<([a-z]+)>(.*?)<\/\1>/g;

    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text))) {
        if (match.index > lastIndex) {
            result.push(text.slice(lastIndex, match.index));
        }

        result.push(
            <span
                key={match.index}
                style={{ color: colors[match[1]] }}
            >
                {match[2]}
            </span>
        );

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        result.push(text.slice(lastIndex));
    }

    return result;
}