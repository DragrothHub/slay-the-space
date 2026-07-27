import { useReducer, useMemo } from "react";

import { GameContext } from "./GameContext";
import { gameReducer } from "./gameReducer";
import { initialGameState } from "./initialState";

export default function GameProvider({ children }) {

    const [state, dispatch] = useReducer(
        gameReducer,
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
        game: state,
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