import NodeTypes from "../constants/NodeTypes";

const testMap = {
    seed: 12345,

    currentNodeId: "start",

    nodes: [
        {
            id: "start",
            type: NodeTypes.START,
            x: 250,
            y: 700,
            connections: ["c1", "c2"],
            payload: {},
        },

        {
            id: "c1",
            type: NodeTypes.COMBAT,
            x: 150,
            y: 560,
            connections: ["e1"],
            payload: {},
        },

        {
            id: "c2",
            type: NodeTypes.COMBAT,
            x: 350,
            y: 560,
            connections: ["s1"],
            payload: {},
        },

        {
            id: "e1",
            type: NodeTypes.EVENT,
            x: 170,
            y: 390,
            connections: ["boss"],
            payload: {},
        },

        {
            id: "s1",
            type: NodeTypes.SHOP,
            x: 330,
            y: 390,
            connections: ["boss"],
            payload: {},
        },

        {
            id: "boss",
            type: NodeTypes.BOSS,
            x: 250,
            y: 180,
            connections: [],
            payload: {},
        },
    ],
};

export default testMap;