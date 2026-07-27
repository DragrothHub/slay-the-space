import useWorldMap from "../hooks/useWorldMap";
import MapConnection from "./MapConnection";
import MapNode from "./MapNode";
import PlayerMarker from "./PlayerMarker";

export default function WorldMap({ startBattle }) {

    const {
        map,
        currentNodeId,
        availableNodes,
        nodeLookup,
        moveToNode,
    } = useWorldMap(Math.floor(Math.random() * 1000));

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
                                to={nodeLookup[connection]}
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
                        current={currentNodeId === node.id}
                        onClick={() => {
                            moveToNode(node.id);
                            startBattle();
                        }}
                    />

                ))}

            <PlayerMarker
                node={map.nodes.find(n => n.id === currentNodeId)}
            />
        </div>

    );

}