export default function cleanupMap(nodes) {

    const reachable = new Set();

    nodes.forEach(node => {

        node.connections.forEach(id => reachable.add(id));

    });

    nodes.forEach(node => {

        node.reachable =
            node.layer === 0 ||
            reachable.has(node.id);

    });

}