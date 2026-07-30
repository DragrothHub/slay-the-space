import SeededRandom from "./seededRandom";

import createLayers from "./createLayers";
import createNodes from "./createNodes";
import connectNodes from "./connectNodes";
import assignNodeTypes from "./assignNodeTypes";
import cleanupMap from "./cleanupMap";

export default function generateWorldMap(seed) {

    const random = new SeededRandom(seed);

    const layers = createLayers(random);

    const nodes = createNodes(layers);

    const nodeLookup = nodes.map(node => [node.id, node]);

    connectNodes(nodes, random);

    cleanupMap(nodes);

    assignNodeTypes(nodes, random);

    return {

        seed,

        nodes,

        nodeLookup,
        
    };
}