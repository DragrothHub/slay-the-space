import NodeTypes from "../constants/NodeTypes";

export default function createNodes(layers) {

    const nodes = [];

    const width = 380;
    const height = 750;

    layers.forEach(layer => {

        const y =
            height -
            ((height - 40) / (layers.length - 1)) * layer.index;

        const spacing = width / (layer.nodeCount + 1);

        for (let i = 0; i < layer.nodeCount; i++) {

            nodes.push({

                id: `L${layer.index}_N${i}`,

                layer: layer.index,

                type: NodeTypes.COMBAT,

                x: spacing * (i + 1),

                y,

                connections: [],

                payload: {},

            });

        }

    });

    return nodes;

}