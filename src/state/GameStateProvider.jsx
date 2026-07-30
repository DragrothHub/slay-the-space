import { useReducer, useMemo, createContext, useContext } from "react";
import { gameStateReducer } from "./gameStateReducer";

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

    function startRun(ships) {

        dispatch({
            type: "START_RUN",
            ships,
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

    const value = useMemo(() => ({
        gameState: state,
        setScreen,
        startRun,
        addCredits,
        startBattle,
    }), [state]);

    return (

        <GameContext.Provider value={value}>

            {children}

        </GameContext.Provider>

    );
}