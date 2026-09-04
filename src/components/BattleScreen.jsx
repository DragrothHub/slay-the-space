import { useEffect, useState } from "react";
import BattleField from "./BattleField";
import ActionPanel from "./ActionPanel";
import BattleLog from "./BattleLog";
import { useGameState } from "../state/GameStateProvider";
import { createEnemy } from "../data/createEnemy";
import TurnOrder from "./TurnOrder";
import { detonatorAbilityCollection, primerAbilityCollection } from "../data/abilities";
import { moduleCollection } from "../data/modules";
import { applyDebuff } from "../engine/debuffs";

export default function BattleScreen()
{
    const {
        gameState,
        currentNode,
        setScreen,
        startBattle,
        finishBattle,
        selectRewards,
        confirmAction,
        resolveAction,
        addCredits
    } = useGameState();

    const battle = gameState.run?.battle;

    const [gameOver, setGameOver] = useState(false);
    const [battleWon, setBattleWon] = useState(false);

    function getEnemyFleetByNode(node)
    {
        let enemyFleet = [];

        switch (currentNode.type)
        {
            case "combat":
                for (let i = 1; i <= Math.min(currentNode.layer, 4); i++)
                {
                    let enemy = createEnemy(0,1);
                    // applyDebuff(enemy, "summonClone", 3);
                    enemyFleet.push(enemy);
                }
                break;

            case "elite":
                for (let i = 1; i <= Math.min(currentNode.layer, 4); i++)
                {
                    enemyFleet.push(createEnemy(1, 1));
                }
                break;

            case "boss":
                enemyFleet.push(createEnemy(1, 1));
                
                let boss = createEnemy(6,2);
                applyDebuff(boss, "shieldExplosion");
                applyDebuff(boss, "shieldRegeneration", 5);
                enemyFleet.push(boss);

                enemyFleet.push(createEnemy(1, 1));
                break;

            default:
                setScreen("map");
                break;
        }

        return enemyFleet;
    }

    function getRandomRewards(collection, amount)
    {
        const rewards = Object.values(collection);

        return rewards
            .sort(() => Math.random() - 0.5)
            .slice(0, amount);
    }

    // Init battle
    useEffect(() =>
    {
        let enemyFleet = getEnemyFleetByNode(currentNode);
        startBattle(enemyFleet);
    }, []);

    // Detect battle result
    useEffect(() =>
    {
        if (!battle?.winner) return;

        if (battle.winner === "B") {
            // setGameOver(true);
            const timer = setTimeout(() => {
                setGameOver(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
        else {
            setBattleWon(true);
        }
    }, [battle?.winner]);

    function continueAfterVictory()
    {
        if (!battleWon) return;

        const rewardTypes = [
            {
                type: "ability",
                collection: detonatorAbilityCollection,
                amount: 3,
            },
            {
                type: "ability",
                collection: primerAbilityCollection,
                amount: 3,
            },
            {
                type: "module",
                collection: moduleCollection,
                amount: 3,
            }
        ];

        const reward = rewardTypes[
            Math.floor(Math.random() * rewardTypes.length)
        ];

        selectRewards({
            possibleRewards: getRandomRewards(
                reward.collection,
                reward.amount
            ),
            maxSelection: 1,
            rewardType: reward.type
        });

        addCredits(100); // todo

        // Only now leave the battle.
        finishBattle();
    }

    useEffect(() =>
    {
        if (battle?.phase !== "enemy-confirm") return;

        const timer = setTimeout(() =>
        {
            confirmAction();
        }, 500);

        return () => clearTimeout(timer);
    }, [battle?.phase, battle?.activeUnitId]);

    useEffect(() =>
    {
        if (battle?.phase !== "ability-animation") return;

        console.log("animation phase");

        const timer = setTimeout(() =>
        {
            resolveAction();
        }, 0);

        return () => clearTimeout(timer);
    }, [
        battle?.phase,
        battle?.activeUnitId,
        battle?.selectedAbilityId
    ]);

    if (!battle) return <div>Loading...</div>;

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
            }}
        >
            <BattleField />

            <ActionPanel />

            <BattleLog />

            <TurnOrder />

            {/* VICTORY */}
            {battleWon &&
                <div
                    onClick={continueAfterVictory}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        background: "rgba(0, 0, 0, 0.62)",

                        cursor: "pointer",

                        animation: "battleVictoryFadeIn 250ms ease-out",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            userSelect: "none",

                            animation: "battleVictoryScaleIn 350ms ease-out",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "0.8rem",
                                letterSpacing: "0.45em",
                                opacity: 0.65,
                                marginBottom: "10px",
                            }}
                        >
                            BATTLE COMPLETE
                        </div>

                        <div
                            style={{
                                fontSize: "4rem",
                                letterSpacing: "0.1em",
                                color: "#fff",
                                textShadow: `
                                    0 0 10px rgba(255,255,255,0.5),
                                    0 0 30px #0064c1,
                                    0 0 60px #0084ff
                                `,
                            }}
                        >
                            VICTORY
                        </div>

                        <div
                            style={{
                                marginTop: "20px",
                                fontSize: "0.9rem",
                                opacity: 0.55,
                                letterSpacing: "0.15em",
                            }}
                        >
                            TAP TO CONTINUE
                        </div>
                    </div>

                    <style>
                        {`
                            @keyframes battleVictoryFadeIn
                            {
                                from
                                {
                                    opacity: 0;
                                }

                                to
                                {
                                    opacity: 1;
                                }
                            }

                            @keyframes battleVictoryScaleIn
                            {
                                from
                                {
                                    opacity: 0;
                                    transform: scale(0.85);
                                }

                                to
                                {
                                    opacity: 1;
                                    transform: scale(1);
                                }
                            }
                        `}
                    </style>
                </div>
            }

            {/* GAME OVER */}
            {gameOver &&
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 100,

                        background: "rgba(0,0,0,0.8)",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",

                        textAlign: "center",
                        fontSize: "1.5em",
                    }}
                >
                    <div>
                        Game Over
                    </div>

                    <div
                        style={{
                            width: "200px",
                            height: "80px",
                            background: "#222",
                            borderRadius: "10px",
                            textAlign: "center",
                            alignContent: "center",
                            margin: "30px auto",
                            cursor: "pointer",
                        }}
                        onClick={() => window.location.reload()}
                    >
                        Restart
                    </div>
                </div>
            }
        </div>
    );
}