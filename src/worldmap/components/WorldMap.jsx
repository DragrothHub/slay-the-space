import { useGameState } from "../../state/GameStateProvider";
import MapConnection from "./MapConnection";
import MapLegend from "./MapLegend";
import MapNode from "./MapNode";
import PlayerMarker from "./PlayerMarker";

export default function WorldMap({ startBattle }) {

    const {
        gameState,

        setScreen,

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
                                key={node.id + "_" + map.nodeLookup[connection].id}
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
                    />

                ))}

            <PlayerMarker
                node={currentNode}
            />

            <MapLegend/>
        </div>

    );

}