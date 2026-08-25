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
                console.log(NodeTypes.COMBAT);

                setScreen("battle");
                break;
        
            case NodeTypes.ELITE:
                console.log(NodeTypes.ELITE);

                setScreen("battle");
                break;

            case NodeTypes.BOSS:
                console.log(NodeTypes.BOSS);

                setScreen("battle");
                break;

            case NodeTypes.DOCK:
                console.log(NodeTypes.DOCK);

                setScreen("dock");
                break;

            case NodeTypes.SHOP:
                console.log(NodeTypes.SHOP);

                setScreen("shop");
                break;

            case NodeTypes.EVENT:
                console.log(NodeTypes.EVENT);

                // setScreen("event");
                break;

            case NodeTypes.REPAIR:
                console.log(NodeTypes.REPAIR);
                
                setScreen("repair");
                break;

            case NodeTypes.START:
                console.log(NodeTypes.START);

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
                    ? "3px solid white"
                    : "2px solid #222",

                background: isVisited ? "#fff" : colors[node.type],

                cursor: selectable ? "pointer" : "default",

                opacity: selectable || currentNode.id === node.id || isVisited ? 1 : 0.2,

            }}

        />

    );

}