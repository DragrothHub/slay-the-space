import { useGameState } from "../../state/GameStateProvider";
import MapConnection from "./MapConnection";
import MapNode from "./MapNode";
import PlayerMarker from "./PlayerMarker";

export default function WorldMap({ startBattle }) {

    const {
        gameState,
        moveToNode,
        currentNode,
        availableNodes,
    } = useGameState();

    if (!gameState.run) {
        return null;
    }

    const map = gameState.run.map;

    return (

        <div>
            <svg
                width={390}
                height={800}
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "visible",
                }}
            >

                {map.nodes
                    .filter(node => node.reachable)
                    .map(node =>

                        node.connections.map(connection => (

                            <MapConnection
                                from={node}
                                to={map.nodeLookup[connection]}
                            />

                        ))

                    )}

            </svg>

            {map.nodes
                .filter(node => node.reachable)
                .map(node => (

                    <MapNode
                        key={node.id}
                        node={node}
                        selectable={availableNodes.some(n => n.id === node.id)}
                        current={currentNode.id === node.id}
                        onClick={() => {
                            moveToNode(node.id);
                            startBattle();
                        }}
                    />

                ))}

            <PlayerMarker
                node={currentNode}
            />
        </div>

    );

}