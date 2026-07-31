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

                screen: "map",

                run: {
                    ships: action.ships,

                    credits: 0,

                    inventory: [],

                    map: action.map,

                    currentNodeId: action.map.nodes[0].id,

                    battle: null,
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
                    battle: action.enemyFleet,
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

        case "UPDATE_SHIPS":

            return {
                ...state,

                run: {
                    ...state.run,

                    ships: action.ships,
                },
            };

        case "START_BATTLE":

            return {
                ...state,

                run: {
                    ...state.run,

                    battle: action.battle,
                },
            };

        case "UPDATE_BATTLE":

            return {
                ...state,

                run: {
                    ...state.run,

                    battle: action.battle,
                },
            };
        
        case "FINISH_BATTLE":

            return {
                ...state,

                run: {
                    ...state.run,

                    ships: state.run.battle.teams.A,

                    battle: null,
                },
            };

        default:
            return state;
    }
}