import { useEffect, useState } from "react";
import BattleField from "./BattleField";
import ActionPanel from "./ActionPanel";
import BattleLog from "./BattleLog";
import { useGameState } from "../state/GameStateProvider";

export default function BattleScreen({ enemyFleet }) {

    const { gameState, setScreen, startBattle, finishBattle } = useGameState();
    const battle = gameState.run?.battle;

    // Init battle
    useEffect(() => {
        startBattle(enemyFleet);
    }, []);

    useEffect(() => {
        if (!battle?.winner) return;

        finishBattle();

        setScreen("map");
    }, [battle?.winner]);

    if (!battle) return <div>Loading...</div>;

    return (
        <div>
            <BattleField/>

            <ActionPanel/>

            <BattleLog/>
        </div>
    );
}