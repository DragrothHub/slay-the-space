export default function connectNodes(nodes, random) {

    const layers = groupByLayer(nodes);

    const layerIndices = Object.keys(layers)
        .map(Number)
        .sort((a, b) => a - b);

    const pathCount = random.range(4, 6);

    for (let i = 0; i < pathCount; i++) {

        let current = randomNode(layers[0], random);

        for (let layer = 1; layer < layerIndices.length; layer++) {

            const nextLayer = layers[layer];

            const next = chooseNextNode(current, nextLayer, random);

            if (!current.connections.includes(next.id)) {
                current.connections.push(next.id);
            }

            current = next;

        }

    }

}

function groupByLayer(nodes) {

    const layers = {};

    nodes.forEach(node => {

        if (!layers[node.layer]) {
            layers[node.layer] = [];
        }

        layers[node.layer].push(node);

    });

    return layers;

}

function randomNode(nodes, random) {

    return nodes[random.range(0, nodes.length - 1)];

}

function chooseNextNode(current, candidates, random) {

    const sorted = [...candidates].sort((a, b) =>

        Math.abs(a.x - current.x) -

        Math.abs(b.x - current.x)

    );

    const max = Math.min(sorted.length - 1, 1);

    return sorted[random.range(0, max)];

}