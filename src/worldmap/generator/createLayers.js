export default function createLayers(random) {

    const layerCount = 15;

    const layers = [];

    for (let i = 0; i < layerCount; i++) {

        let nodeCount = random.range(2, 4);

        if (i === 0) nodeCount = 1;
        if (i === layerCount - 1) nodeCount = 1;

        if(i === 7) nodeCount = 1; // elite on half

        layers.push({
            index: i,
            nodeCount,
        });

    }

    return layers;

}