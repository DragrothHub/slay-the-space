import NodeTypes from "../constants/nodeTypes";
import { useGameState } from "../../state/GameStateProvider";

const colors = {

    [NodeTypes.START]: "#00ff99",

    [NodeTypes.COMBAT]: "#66ccff",

    [NodeTypes.EVENT]: "#ffcc00",

    [NodeTypes.DOCK]: "#bb88ff",

    [NodeTypes.SHOP]: "#ffaa33",

    [NodeTypes.ELITE]: "#ff4444",

    [NodeTypes.REPAIR]: "#44ff44",

    [NodeTypes.BOSS]: "#ffffff",

};

export default function MapNode({ node }) {

    const { setScreen, moveToNode, currentNode, availableNodes, gameState, updateShips } = useGameState();

    const isVisited = gameState.run.visitedNodes.includes(node.id) && !(currentNode.id === node.id);

    function handleClick(){

        moveToNode(node.id);

        switch (node.type) {
            case NodeTypes.COMBAT:
                setScreen("battle");
                break;
        
            case NodeTypes.ELITE:
                setScreen("battle");
                break;

            case NodeTypes.BOSS:
                setScreen("battle");
                break;

            case NodeTypes.DOCK:
                setScreen("dock");
                break;

            case NodeTypes.SHOP:
                setScreen("shop");
                break;

            case NodeTypes.EVENT:
                // setScreen("event");
                break;

            case NodeTypes.REPAIR:
                setScreen("repair");
                break;

            case NodeTypes.START:
                setScreen("map");
                break;

            default:
                break;
        }
    }

    const selectable = availableNodes.some(n => n.id === node.id);

    return (

        <button

            onClick={handleClick}

            disabled={!selectable}

            style={{

                position: "absolute",

                left: node.x - 18,

                top: node.y - 18,

                width: 36,

                height: 36,

                borderRadius: "50%",

                border: currentNode.id === node.id
                    ? "4px solid #fff"
                    : isVisited ? "4px solid #fff" : "2px solid transparent", // `10px solid ${colors[node.type]}` : "2px solid #22222200",

                background: colors[node.type], // isVisited ? "#fff" : colors[node.type],

                cursor: selectable ? "pointer" : "default",

                opacity: selectable || currentNode.id === node.id || isVisited ? 1 : 0.3,

            }}

        />

    );

}