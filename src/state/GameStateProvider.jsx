import { useReducer, useMemo, createContext, useContext } from "react";
import { gameStateReducer } from "./gameStateReducer";
import generateWorldMap from "../worldmap/generator/generateWorldMap";
import { getConnectedNodes } from "../worldmap/utils/mapHelpers";

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
    // Map
    //--------------------

    function moveToNode(nodeId) {

        dispatch({
            type: "MOVE_TO_NODE",
            nodeId,
        });

    }

    const map = state.run?.map;
    const currentNodeId = state.run?.currentNodeId;

    const currentNode = useMemo(() => {

        if (!map) return null;

        return map.nodeLookup[currentNodeId];

    }, [map]);

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