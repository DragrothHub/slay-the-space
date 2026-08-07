import { confirmAction } from "../engine/turnEngine";
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

        case "MOVE_TO_NODE": {

            const currentNode = state.run.map.nodeLookup[state.run.currentNodeId];

            if (!currentNode.connections.includes(action.nodeId)) {
                return state;
            }

            return {

                ...state,

                run: {
                    ...state.run,

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
            
            // Reset cds
            const ships = state.run.battle.teams.A.map(ship => ({
                ...ship,
                stats: {
                    ...ship.stats,
                    cooldowns: [],
                    debuffs: [],
                },
            }));

            return {
                ...state,

                run: {
                    ...state.run,

                    ships: ships,

                    battle: null,
                },
            };

        case "AI_CONFIRM":

            return {
                ...state,

                run: {
                    ...state.run,

                    battle: confirmAction(
                        structuredClone(state.run.battle)
                    ),
                },
            };

        default:
            return state;
    }
}