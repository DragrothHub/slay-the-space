import NodeTypes from "../constants/nodeTypes";

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

export default function MapLegend() {
    return (
        <div style={{
            position: "fixed",
            top: 10,
            right: 10,
            display: "flex",
            flexDirection: "column"
        }}>
            {Object.keys(NodeTypes).map((nodeType) => (
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    // justifyContent: "space-between"
                }}>
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            marginRight: 4,
                            borderRadius: "50%",
                            background: colors[nodeType.toLowerCase()],
                        }}
                    ></div>
                    <span>
                        {nodeType}
                    </span>
                </div>
            ))}
        </div>
    );
}