import generateWorldMap from "../worldmap/generator/generateWorldMap";

export function gameStateReducer(state, action)
{

    switch (action.type)
    {

        case "SET_SCREEN":
            return {
                ...state,
                screen: action.screen,
            };

        case "START_RUN":
            return {
                ...state,

                screen: "world",

                run: {
                    ships: action.ships,

                    credits: 0,

                    inventory: [],

                    map: action.map,

                    currentNodeId: action.map.nodes[0].id,

                    currentBattle: null,
                },

                statistics: {
                    ...state.statistics,
                    runsPlayed: state.statistics.runsPlayed + 1,
                },
            };

        case "ADD_CREDITS":

            return {
                ...state,

                run: {
                    ...state.run,

                    credits:
                        state.run.credits + action.amount,
                },
            };

        case "SET_CURRENT_BATTLE":

            return {
                ...state,

                screen: "battle",

                run: {
                    ...state.run,
                    currentBattle: action.enemyFleet,
                },
            };

        case "MOVE_TO_NODE": {

            const map = state.run.map;

            const currentNode = map.nodeLookup[state.run.currentNodeId];

            if (!currentNode.connections.includes(action.nodeId)) {
                return state;
            }

            return {

                ...state,

                run: {

                    ...state.run,

                    ...map,

                    currentNodeId: action.nodeId,

                },

            };

        }

        default:
            return state;
    }
}