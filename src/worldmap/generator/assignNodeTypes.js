import NodeTypes from "../constants/nodeTypes";

export default function assignNodeTypes(nodes, random) {

    const maxLayer = Math.max(...nodes.map(n => n.layer));

    nodes.forEach(node => {

        if (!node.reachable) return;

        if (node.layer === 0) {

            node.type = NodeTypes.START;
            return;

        }

        if (node.layer === maxLayer) {

            node.type = NodeTypes.BOSS;
            return;

        }

        // elite on half
        if (node.layer === 7) {

            node.type = NodeTypes.ELITE;
            return;

        }

        const roll = random.next();

        if (roll < 0.60) {

            node.type = NodeTypes.COMBAT;

        } else if (roll < 0.75) {

            node.type = NodeTypes.EVENT;

        } else if (roll < 0.87) {

            node.type = NodeTypes.SHOP;

        } else if (roll < 0.95) {

            node.type = NodeTypes.TREASURE;

        } else {

            node.type = NodeTypes.ELITE;

        }

    });

}