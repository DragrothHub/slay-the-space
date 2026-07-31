import { useReducer, useMemo, createContext, useContext } from "react";
import { gameStateReducer } from "./gameStateReducer";
import generateWorldMap from "../worldmap/generator/generateWorldMap";
import { getConnectedNodes } from "../worldmap/utils/mapHelpers";
import { createBattleState, initBattle } from "../engine/turnEngine";

const initialGameState = {
    screen: "shipselection",

    run: null,

    settings: {
        sound: true,
        music: true,
    },

    statistics: {
        runsPlayed: 0,
        battlesWon: 0,
    },
};

const GameContext = createContext(null);

export function useGameState() {
    return useContext(GameContext);
}

export default function GameStateProvider({ children }) {

    const [state, dispatch] = useReducer(
        gameStateReducer,
        initialGameState
    );

    //--------------------
    // Screens
    //--------------------

    function setScreen(screen) {

        dispatch({
            type: "SET_SCREEN",
            screen,
        });

    }

    //--------------------
    // Run
    //--------------------

    function startRun(ships, seed = 12345) {

        const map = generateWorldMap(seed);

        dispatch({
            type: "START_RUN",
            ships,
            map,
        });

    }

    function addCredits(amount) {

        dispatch({
            type: "ADD_CREDITS",
            amount,
        });

    }

    function startBattle(enemyFleet) {

        dispatch({
            type: "SET_CURRENT_BATTLE",
            enemyFleet,
        });

    }

    //--------------------
    // Ships
    //--------------------

    function updateShips(ships){

        dispatch({
            type: "UPDATE_SHIPS",
            ships,
        });

    }

    //--------------------
    // Battle
    //--------------------

    function startBattle(enemyFleet) {

        const battle = createBattleState(
            structuredClone(state.run.ships),
            structuredClone(enemyFleet)
        );

        initBattle(battle);

        dispatch({
            type: "START_BATTLE",
            battle,
        });

    }

    function updateBattle(updater) {
        const updatedBattle = structuredClone(state.run.battle);

        const result = updater(updatedBattle);

        dispatch({
            type: "UPDATE_BATTLE",
            battle: result ?? updatedBattle,
        });
    }

    function finishBattle(){
        
        dispatch({
            type: "FINISH_BATTLE",
        });

    }

    //--------------------
    // Map
    //--------------------

    function moveToNode(nodeId) {

        dispatch({
            type: "MOVE_TO_NODE",
            nodeId,
        });

    }

    const map = state.run?.map;
    
    const currentNode = map?.nodeLookup[state.run?.currentNodeId];

    const availableNodes = useMemo(() => {

        if (!map || !currentNode) return [];

        return getConnectedNodes(
            map,   
            currentNode
        );

    }, [map, currentNode]);

    //--------------------

    const value = {
        gameState: state,

        setScreen,
        startRun,
        addCredits,

        startBattle,
        updateBattle,
        finishBattle,

        updateShips,

        moveToNode,
        currentNode,
        availableNodes,
    };

    return (

        <GameContext.Provider value={value}>

            {children}

        </GameContext.Provider>

    );
}