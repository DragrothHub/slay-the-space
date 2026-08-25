import { useState } from "react";
import { useGameState } from "../state/GameStateProvider";
import ShopItem from "./ShipItem";
import { getRandomDetonatorAbility, getRandomPrimerAbility } from "../data/abilities";
import { getRandomModule } from "../data/modules";

function ShopScreen() {

    const {
        gameState,
        setScreen,
        addCredits,
        buyShopItem,
    } = useGameState();

    const [purchasedItems, setPurchasedItems] = useState([]);

    if (!gameState || !gameState.run)
        return null;

    const credits =
        gameState.run.credits ?? 0;

    const [shopItems] = useState(() => [
        {
            id: getRandomModule(),
            type: "module",
            price: 80,
        },

        {
            id: getRandomPrimerAbility(),
            type: "primer",
            price: 120,
        },

        {
            id: getRandomDetonatorAbility(),
            type: "detonator",
            price: 90,
        },
    ]);

    function onBuy(item) {

        console.log("onBuy:", item);

        if (purchasedItems.includes(item.id))
            return;

        if (credits < item.price)
            return;

        buyShopItem({
            itemId: item.id,
            price: item.price,
            type: item.type,
        });

        setPurchasedItems(prev => [
            ...prev,
            item.id,
        ]);
    }


    function onLeave() {
        setScreen("map");
    }


    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                color: "#fff",

                // Mobile scrolling
                overflowY: "auto",

                padding:
                    "40px 16px 100px",
                boxSizing: "border-box",
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",

                    display: "flex",
                    flexDirection: "column",

                    gap: "16px",
                }}
            >

                {/* Header */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "8px",
                    }}
                >

                    <div
                        style={{
                            fontSize: "28px",
                        }}
                    >
                        Supply Shop
                    </div>

                    <div
                        style={{
                            marginTop: "8px",
                            opacity: 0.5,
                        }}
                    >
                        Purchase modules and abilities
                    </div>

                </div>


                {/* Credits */}

                <div
                    style={{
                        alignSelf: "center",

                        background: "#0a1118",
                        border: "1px solid #243342",
                        borderRadius: "10px",

                        padding: "10px 22px",

                        fontSize: "16px",
                    }}
                >

                    <span
                        style={{
                            opacity: 0.5,
                        }}
                    >
                        Credits
                    </span>

                    <span
                        style={{
                            marginLeft: "10px",
                            color: "#fcff4c",
                            fontWeight: "bold",
                        }}
                    >
                        {credits}
                    </span>

                </div>


                {/* Shop */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "8px",
                    }}
                >

                    {shopItems.map(item => {

                        const purchased =
                            purchasedItems.includes(
                                item.id
                            );

                        const tooExpensive =
                            credits < item.price;

                        return (
                            <ShopItem
                                key={item.id}
                                item={item}

                                purchased={
                                    purchased
                                }

                                disabled={
                                    purchased ||
                                    tooExpensive
                                }

                                onBuy={() =>
                                    onBuy(item)
                                }
                            />
                        );

                    })}

                </div>


                {/* Leave */}

                <button
                    onClick={onLeave}
                    style={{
                        background: "#0a1118",
                        color: "#fff",

                        border: "1px solid #243342",
                        borderRadius: "10px",

                        padding: "12px",

                        fontSize: "14px",

                        marginTop: "8px",
                    }}
                >
                    Leave
                </button>

            </div>

        </div>
    );
}

export default ShopScreen;