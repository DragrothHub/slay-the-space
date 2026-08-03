import { useEffect, useState } from "react";
import BattleField from "./BattleField";
import ActionPanel from "./ActionPanel";
import BattleLog from "./BattleLog";
import { useGameState } from "../state/GameStateProvider";
import { createShip } from "../data/createShip";

export default function BattleScreen() {

    const { gameState, currentNode, setScreen, startBattle, finishBattle } = useGameState();
    const battle = gameState.run?.battle;

    function getEnemyFleetByNode(node){

        let enemyFleet = [];

        switch (currentNode.type) {
            case "combat":
                for(let i = 1; i <= Math.min(currentNode.layer, 4); i++){
                    enemyFleet.push(createShip(0));
                }
                break;

            case "elite":
                for(let i = 1; i <= Math.min(currentNode.layer, 4); i++){
                    enemyFleet.push(createShip(1));
                }
                break;

            case "boss":
                enemyFleet.push(createShip(0));
                enemyFleet.push(createShip(6));
                enemyFleet.push(createShip(0));
                break;
                
            default:
                setScreen("map");
                break;
        }

        return enemyFleet;
    }

    // Init battle
    useEffect(() => {
        let enemyFleet = getEnemyFleetByNode(currentNode);
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