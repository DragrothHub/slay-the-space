export default function PlayerMarker({

    node,

}) {

    return (

        <div

            style={{

                position: "absolute",

                left: node.x - 25,

                top: node.y - 25,

                width: 50,

                height: 50,

                borderRadius: "50%",

                border: "4px solid #fff",

                pointerEvents: "none",

                boxSizing: "border-box",

            }}

        />

    );

}