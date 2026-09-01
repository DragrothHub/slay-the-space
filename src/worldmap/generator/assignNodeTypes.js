import NodeTypes from "../constants/nodeTypes";

const SPECIAL_NODE_TYPES = [
    NodeTypes.REPAIR,
    NodeTypes.DOCK,
    NodeTypes.SHOP,
    NodeTypes.ELITE,
];

const MAX_SPECIAL_NODES_PER_LAYER = 2;

const NODE_RULES = [

    // Early game
    {
        type: NodeTypes.DOCK,
        min: 1,
        max: 1,
        layerFrom: 2,
        layerTo: 4,
    },
    {
        type: NodeTypes.DOCK,
        min: 1,
        max: 3,
        layerFrom: 5,
        layerTo: 12,
    },

    {
        type: NodeTypes.REPAIR,
        min: 1,
        max: 1,
        layerFrom: 2,
        layerTo: 5,
    },

    // First shop
    {
        type: NodeTypes.SHOP,
        min: 1,
        max: 1,
        layerFrom: 3,
        layerTo: 6,
    },

    // First elite
    {
        type: NodeTypes.ELITE,
        min: 1,
        max: 1,
        layerFrom: 6,
        layerTo: 8,
    },

    // Second elite
    {
        type: NodeTypes.ELITE,
        min: 1,
        max: 1,
        layerFrom: 9,
        layerTo: 11,
    },

    // Recovery before boss
    {
        type: NodeTypes.REPAIR,
        min: 1,
        max: 1,
        layerFrom: 11,
        layerTo: 13,
    },

    // Optional final shop
    {
        type: NodeTypes.SHOP,
        min: 0,
        max: 1,
        layerFrom: 11,
        layerTo: 13,
    },
];

export default function assignNodeTypes(nodes, random) {

    const maxLayer = Math.max(...nodes.map(node => node.layer));

    // Reset types
    nodes.forEach(node => {
        node.type = null;
    });

    // Start
    nodes
        .filter(node => node.layer === 0)
        .forEach(node => {
            node.type = NodeTypes.START;
        });

    // Boss
    nodes
        .filter(node => node.layer === maxLayer)
        .forEach(node => {
            node.type = NodeTypes.BOSS;
        });

    // Assign required nodes
    for (const rule of NODE_RULES) {
        assignRule(nodes, rule, random);
    }

    // Fill remaining nodes
    fillRemainingNodes(nodes, random);
}


/**
 * Assigns nodes for a single rule.
 */
function assignRule(nodes, rule, random) {

    const candidates = nodes.filter(node => {

        // Nodes must be reachable
        if (!node.reachable) return false;
        
        // Node must be inside the requested layer range
        if (
            node.layer < rule.layerFrom ||
            node.layer > rule.layerTo
        ) {
            return false;
        }

        // Node must not already have a type
        if (node.type !== null) {
            return false;
        }

        // Do not exceed the special-node limit on a layer
        if (
            isSpecialNode(rule.type) &&
            getSpecialNodeCount(nodes, node.layer) >= MAX_SPECIAL_NODES_PER_LAYER
        ) {
            return false;
        }

        return true;
    });

    if (candidates.length === 0) {
        return;
    }

    shuffle(candidates, random);

    /*
     * First satisfy the minimum.
     */
    const minCount = Math.min(rule.min, candidates.length);

    for (let i = 0; i < minCount; i++) {
        candidates[i].type = rule.type;
        console.log("Set:", candidates[i], rule.type);
    }

    /*
     * Then optionally add more nodes up to max.
     */
    const currentCount = minCount;

    const remainingCandidates = candidates.slice(minCount);

    const additionalCount = Math.min(
        rule.max - currentCount,
        remainingCandidates.length
    );

    for (let i = 0; i < additionalCount; i++) {

        /*
         * Only add optional nodes randomly.
         *
         * This means:
         *
         * min: 1
         * max: 3
         *
         * can result in 1, 2 or 3 nodes.
         */
        if (random.next() < 0.5) {
            remainingCandidates[i].type = rule.type;
            console.log("Set:", remainingCandidates[i], rule.type);
        }
    }
}


/**
 * Fill all nodes that haven't been assigned
 * by a rule yet.
 */
function fillRemainingNodes(nodes, random) {

    nodes.forEach(node => {

        if (node.type !== null || !node.reachable) {
            return;
        }

        node.type = getRandomNodeType(random);
    });
}


/**
 * Random node types for nodes that aren't
 * controlled by a rule.
 *
 * Elite is intentionally NOT included here.
 * Elites should only be created by rules.
 */
function getRandomNodeType(random) {

    const roll = random.next();

    if (roll < 0.90) {
        return NodeTypes.COMBAT;
    }

    if (roll < 0.98) {
        return NodeTypes.REPAIR;
    }

    // if (roll < 0.92) {
    //     return NodeTypes.DOCK;
    // }

    return NodeTypes.SHOP;
}


/**
 * Returns how many special nodes already
 * exist on a given layer.
 */
function getSpecialNodeCount(nodes, layer) {

    return nodes.filter(node =>
        node.layer === layer &&
        isSpecialNode(node.type)
    ).length;
}


function isSpecialNode(type) {
    return SPECIAL_NODE_TYPES.includes(type);
}


/**
 * Fisher-Yates shuffle using your seeded random.
 */
function shuffle(array, random) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(random.next() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}