import { useEffect, useState } from "react";
import BattleField from "./BattleField";
import ActionPanel from "./ActionPanel";
import BattleLog from "./BattleLog";
import { useGameState } from "../state/GameStateProvider";
import { createShip } from "../data/createShip";
import TurnOrder from "./TurnOrder";
import { detonatorAbilityCollection } from "../data/abilities";

export default function BattleScreen()
{

    const { gameState, currentNode, setScreen, startBattle, finishBattle, collectReward, confirmAction, resolveAction } = useGameState();
    const battle = gameState.run?.battle;
    const [gameOver, setGameOver] = useState(false);

    function getEnemyFleetByNode(node)
    {

        let enemyFleet = [];

        switch (currentNode.type)
        {
            case "combat":
                for (let i = 1; i <= Math.min(currentNode.layer, 4); i++)
                {
                    enemyFleet.push(createShip(0));
                }
                break;

            case "elite":
                for (let i = 1; i <= Math.min(currentNode.layer, 4); i++)
                {
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
    useEffect(() =>
    {
        let enemyFleet = getEnemyFleetByNode(currentNode);
        startBattle(enemyFleet);
    }, []);

    useEffect(() =>
    {
        if (!battle?.winner) return;

        if (battle.winner == "B")
        {
            setGameOver(true);
        }
        else
        {
            finishBattle();
            // setScreen("map");
            // setScreen("abilityselection");
            collectReward({possibleRewards: Object.values(detonatorAbilityCollection), maxSelection: 1, rewardType: "ability"});
        }
    }, [battle?.winner]);

    useEffect(() => {
        if (battle?.phase !== "enemy-confirm") return;

        const timer = setTimeout(() => {
            confirmAction();
        }, 500);

        return () => clearTimeout(timer);
    }, [battle?.phase, battle?.activeUnitId]);

    useEffect(() => {
        if (battle?.phase !== "ability-animation") return;

        console.log("animation phase");

        const timer = setTimeout(() => {
            resolveAction();
        }, 0);

        return () => clearTimeout(timer);
    }, [battle?.phase, battle?.activeUnitId, battle?.selectedAbilityId]);

    if (!battle) return <div>Loading...</div>;

    return (
        <div>
            <BattleField />

            <ActionPanel />

            <BattleLog />

            <TurnOrder />

            {gameOver &&
                <div
                    style={{
                        position: "absolute",
                        fontSize: "1.5em",
                        top: "0px",
                        left: "0px",
                        background: "rgba(0,0,0,0.8)",
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        alignContent: "center"
                    }}>
                    Game Over
                    <br></br>
                    <div
                        style={{
                            width: "200px",
                            height: "80px",
                            background: "#222",
                            borderRadius: "10px",
                            textAlign: "center",
                            alignContent: "center",
                            margin: "30px auto",
                        }}
                        onClick={() => window.location.reload()}>
                        Restart
                    </div>
                </div>
            }
        </div>
    );
}