import { useEffect, useState } from "react";
import BattleField from "./BattleField";
import ActionPanel from "./ActionPanel";
import BattleLog from "./BattleLog";
import { selectTarget } from "../engine/turnEngine";
import { getActiveUnit, canSelectTarget } from "../engine/helpers";
import { useGameState } from "../state/GameStateProvider";


export default function BattleScreen({ enemyFleet }) {

    const { gameState, setScreen, startBattle, updateBattle, finishBattle } = useGameState();
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

    const activeUnit = getActiveUnit(battle);
    
    function handleSelectTarget(target) {

        if(canSelectTarget(battle, target))
        {
            updateBattle(s => selectTarget(s, target.id));
        }

        // if(target.stats.currentHull <= 0)
        //     return;

        // const targetIsInTeamA = battle.teams.A.some(u => u.id === target.id);
        // const sourceIsInTeamA = battle.teams.A.some(u => u.id === activeUnit.id);

        // if(targetIsInTeamA == sourceIsInTeamA)
        //     return;

        // updateBattle(s => selectTarget(s, target.id));
    }

    return (
        <div className="battle-screen">
            <BattleField
                handleSelectTarget={handleSelectTarget}
            />

            <ActionPanel/>

            <BattleLog/>
        </div>
    );
}