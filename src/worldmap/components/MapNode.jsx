import NodeTypes from "../constants/NodeTypes";

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

export default function MapNode({

    node,

    selectable,

    current,

    onClick,

}) {

    return (

        <button

            onClick={onClick}

            disabled={!selectable}

            style={{

                position: "absolute",

                left: node.x - 18,

                top: node.y - 18,

                width: 36,

                height: 36,

                borderRadius: "50%",

                border: current
                    ? "3px solid white"
                    : "2px solid #222",

                background: colors[node.type],

                cursor: selectable ? "pointer" : "default",

                opacity: selectable || current ? 1 : 0.4,

            }}

        />

    );

}