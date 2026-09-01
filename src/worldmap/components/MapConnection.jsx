import { useGameState } from "../../state/GameStateProvider";

export default function MapConnection({

    from,

    to,

}) {

    const { gameState } = useGameState();

    const visited = gameState.run.visitedConnections.some(
        c => c === from.id+"_"+to.id
    );

    return (

        <line

            x1={from.x}

            y1={from.y}

            x2={to.x}

            y2={to.y}

            stroke={visited ? "#fff" : "#777"}

            strokeWidth={visited ? "5" : "3"}

        />

    );

}