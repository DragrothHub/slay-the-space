import { useMemo, useState } from "react";

import generateWorldMap from "../generator/generateWorldMap";

import {
    getConnectedNodes,
    getNodeById,
    createNodeLookup,
} from "../utils/mapHelpers";

export default function useWorldMap(seed = 12345) {

    const map = useMemo(() => generateWorldMap(seed), [seed]);

    const [currentNodeId, setCurrentNodeId] = useState(
        map.currentNodeId
    );

    const currentNode = getNodeById(map, currentNodeId);

    const availableNodes = getConnectedNodes(map, currentNode);

    function moveToNode(nodeId) {

        if (!currentNode.connections.includes(nodeId)) {
            return;
        }

        setCurrentNodeId(nodeId);

    }

    const nodeLookup = useMemo(
        () => createNodeLookup(map),
        [map]
    );

    return {

        map,

        currentNode,

        currentNodeId,

        availableNodes,

        nodeLookup,

        moveToNode,

    };

}