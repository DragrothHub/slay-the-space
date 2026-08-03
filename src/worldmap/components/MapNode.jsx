import NodeTypes from "../constants/nodeTypes";
import { useGameState } from "../../state/GameStateProvider";

const colors = {

    [NodeTypes.START]: "#00ff99",

    [NodeTypes.COMBAT]: "#66ccff",

    [NodeTypes.EVENT]: "#ffcc00",

    [NodeTypes.SHOP]: "#bb88ff",

    [NodeTypes.TREASURE]: "#ffaa33",

    [NodeTypes.ELITE]: "#ff4444",

    [NodeTypes.REPAIR]: "#44ff44",

    [NodeTypes.BOSS]: "#ffffff",

};

export default function MapNode({ node }) {

    const { setScreen, moveToNode, currentNode, availableNodes } = useGameState();

    function handleClick(){
        moveToNode(node.id);
        setScreen("battle");
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

                background: colors[node.type],

                cursor: selectable ? "pointer" : "default",

                opacity: selectable || currentNode.id === node.id ? 1 : 0.4,

            }}

        />

    );

}