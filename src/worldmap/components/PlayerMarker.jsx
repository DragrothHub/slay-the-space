export default function PlayerMarker({

    node,

}) {

    return (

        <div

            style={{

                position: "absolute",

                left: node.x - 24,

                top: node.y - 24,

                width: 48,

                height: 48,

                borderRadius: "50%",

                border: "3px solid cyan",

                pointerEvents: "none",

                boxSizing: "border-box",

            }}

        />

    );

}