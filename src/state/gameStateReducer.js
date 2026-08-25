import { detonatorAbilityCollection, neutralAbilityCollection, primerAbilityCollection } from "../data/abilities";
import { confirmAction, resolveAction } from "../engine/turnEngine";
import generateWorldMap from "../worldmap/generator/generateWorldMap";

export function gameStateReducer(state, action) {

    switch (action.type) {

        case "SET_SCREEN": {
            return {
                ...state,
                screen: action.screen,
            };
        }


        case "START_RUN": {
            return {
                ...state,

                screen: "map",

                run: {
                    ships: action.ships,

                    credits: 80,

                    map: action.map,

                    currentNodeId: action.map.nodes[0].id,

                    battle: null,
                },

                inventory: {
                    modules: [],

                    neutralAbilities: [],
                    primerAbilities: [],
                    detonatorAbilities: [],
                },

                statistics: {
                    ...state.statistics,
                    runsPlayed: state.statistics.runsPlayed + 1,
                },
            };
        }


        case "ADD_CREDITS": {
            return {
                ...state,

                run: {
                    ...state.run,

                    credits:
                        state.run.credits + action.amount,
                },
            };
        }


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


        case "UPDATE_SHIPS": {
            return {
                ...state,

                run: {
                    ...state.run,

                    ships: action.ships,
                },
            };
        }


        case "START_BATTLE": {
            return {
                ...state,

                run: {
                    ...state.run,

                    battle: action.battle,
                },
            };
        }


        case "UPDATE_BATTLE": {
            return {
                ...state,

                run: {
                    ...state.run,

                    battle: action.battle,
                },
            };
        }


        case "FINISH_BATTLE": {
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
        }


        case "CONFIRM_ACTION": {
            return {
                ...state,
                run: {
                    ...state.run,
                    battle: confirmAction(structuredClone(state.run.battle)),
                },
            };
        }


        case "RESOLVE_ACTION": {
            return {
                ...state,
                run: {
                    ...state.run,
                    battle: resolveAction(structuredClone(state.run.battle)),
                },
            };
        }


        case "SELECT_REWARDS": {
            return {
                ...state,

                screen: "selectRewards",

                rewards: {
                    ...state.rewards,

                    possibleRewards: action.possibleRewards,
                    maxSelection: action.maxSelection,
                    rewardType: action.rewardType,
                },

            };
        }

        case "COLLECT_REWARDS": {
            const newNeutralAbilities =
                action.rewardType === "ability"
                    ? action.selectedRewards.filter(abilityId =>
                        Object.hasOwn(neutralAbilityCollection, abilityId)
                    )
                    : [];

            const newPrimerAbilities =
                action.rewardType === "ability"
                    ? action.selectedRewards.filter(abilityId =>
                        Object.hasOwn(primerAbilityCollection, abilityId)
                    )
                    : [];

            const newDetonatorAbilities =
                action.rewardType === "ability"
                    ? action.selectedRewards.filter(abilityId =>
                        Object.hasOwn(detonatorAbilityCollection, abilityId)
                    )
                    : [];

            return {
                ...state,

                screen: action.screen,

                rewards: {
                    ...state.rewards,

                    possibleRewards: [],
                    maxSelection: 1,
                    rewardType: "",
                },

                inventory: {
                    modules:
                        action.rewardType === "module"
                            ? [
                                ...(state.inventory.modules ?? []),
                                ...action.selectedRewards
                            ]
                            : state.inventory.modules ?? [],

                    neutralAbilities: [
                        ...(state.inventory.neutralAbilities ?? []),
                        ...newNeutralAbilities
                    ],

                    primerAbilities: [
                        ...(state.inventory.primerAbilities ?? []),
                        ...newPrimerAbilities
                    ],

                    detonatorAbilities: [
                        ...(state.inventory.detonatorAbilities ?? []),
                        ...newDetonatorAbilities
                    ],
                }
            };
        }


        case "CHANGE_MODULE": {
            const shipIndex = state.run.ships.findIndex(
                ship => ship.id === action.ship.id
            );

            if (shipIndex === -1)
                return state;

            const ship = state.run.ships[shipIndex];

            const oldModuleId =
                ship.modules[action.index];

            const newModuleId =
                action.newModuleId;

            const updatedShips = [...state.run.ships];

            updatedShips[shipIndex] = {
                ...ship,

                modules: ship.modules.map(
                    (moduleId, index) =>
                        index === action.index
                            ? newModuleId
                            : moduleId
                ),
            };

            const modules = [
                ...(state.inventory.modules ?? []),
            ];

            // Neues Modul aus dem Inventory entfernen
            const newModuleIndex =
                modules.indexOf(newModuleId);

            if (newModuleIndex !== -1) {
                modules.splice(newModuleIndex, 1);
            }

            // Altes Modul zurück ins Inventory
            if (oldModuleId) {
                modules.push(oldModuleId);
            }

            return {
                ...state,

                run: {
                    ...state.run,
                    ships: updatedShips,
                },

                inventory: {
                    ...state.inventory,
                    modules,
                },
            };
        }


        case "CHANGE_ABILITY": {
            const shipIndex = state.run.ships.findIndex(
                ship => ship.id === action.ship.id
            );

            if (shipIndex === -1)
                return state;

            const ship = state.run.ships[shipIndex];

            const oldAbilityId =
                ship.abilities[action.index];

            const newAbilityId =
                action.newAbilityId;

            /*
            * ----------------------------------------
            * Ability-Typ anhand des Slots bestimmen
            * ----------------------------------------
            */

            let inventoryKey;

            switch (action.index) {
                case 0:
                    inventoryKey = "neutralAbilities";
                    break;

                case 1:
                    inventoryKey = "primerAbilities";
                    break;

                case 2:
                    inventoryKey = "detonatorAbilities";
                    break;

                default:
                    return state;
            }

            /*
            * ----------------------------------------
            * Ship aktualisieren
            * ----------------------------------------
            */

            const updatedShips = [...state.run.ships];

            updatedShips[shipIndex] = {
                ...ship,

                abilities: ship.abilities.map(
                    (abilityId, index) =>
                        index === action.index
                            ? newAbilityId
                            : abilityId
                ),
            };

            /*
            * ----------------------------------------
            * Passendes Inventory aktualisieren
            * ----------------------------------------
            */

            const updatedAbilityInventory = [
                ...(state.inventory[inventoryKey] ?? []),
            ];

            // Neue Ability aus dem Inventory entfernen

            const newAbilityIndex =
                updatedAbilityInventory.indexOf(
                    newAbilityId
                );

            if (newAbilityIndex !== -1) {
                updatedAbilityInventory.splice(
                    newAbilityIndex,
                    1
                );
            }

            // Alte Ability zurück ins Inventory

            if (oldAbilityId) {
                updatedAbilityInventory.push(
                    oldAbilityId
                );
            }

            /*
            * ----------------------------------------
            * State zurückgeben
            * ----------------------------------------
            */

            return {
                ...state,

                run: {
                    ...state.run,

                    ships: updatedShips,
                },

                inventory: {
                    ...state.inventory,

                    [inventoryKey]:
                        updatedAbilityInventory,
                },
            };
        }


        case "BUY_SHOP_ITEM": {

            console.log("BUY_SHOP_ITEM:", action);

            if (state.run.credits < action.price)
                return state;

            return {
                ...state,

                run: {
                    ...state.run,

                    credits:
                        state.run.credits - action.price,
                },

                inventory: {
                    ...state.inventory,

                    modules:
                        action.itemType === "module"
                            ? [
                                ...(state.inventory.modules ?? []),
                                action.itemId,
                            ]
                            : state.inventory.modules,

                    neutralAbilities:
                        action.itemType === "neutral"
                            ? [
                                ...(state.inventory.neutralAbilities ?? []),
                                action.itemId,
                            ]
                            : state.inventory.neutralAbilities,

                    primerAbilities:
                        action.itemType === "primer"
                            ? [
                                ...(state.inventory.primerAbilities ?? []),
                                action.itemId,
                            ]
                            : state.inventory.primerAbilities,

                    detonatorAbilities:
                        action.itemType === "detonator"
                            ? [
                                ...(state.inventory.detonatorAbilities ?? []),
                                action.itemId,
                            ]
                            : state.inventory.detonatorAbilities,
                },
            };
        }

        default:
            return state;
    }
}