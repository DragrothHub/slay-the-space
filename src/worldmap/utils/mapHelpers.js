export function getConnectedNodes(map, node) {

    return node.connections.map(id => getNodeById(map, id));

}

export function isConnected(node, targetId) {

    return node.connections.includes(targetId);

}

export function addConnection(from, to) {

    if (!from.connections.includes(to.id)) {

        from.connections.push(to.id);

    }

}