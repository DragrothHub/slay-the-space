import { moduleCollection } from "../data/modules";
import AbilityCard from "./AbilityCard";
import ModuleCard from "./ModuleCard";

function ShopItem({
    item,
    onBuy,
    disabled,
    purchased,
}) {

    return (
        <div
            style={{
                background: "#0a1118",
                border: "1px solid #243342",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            {item.type === "module" && <ModuleCard module={moduleCollection[item.id]}/>}

            {(item.type === "neutral" || item.type === "primer" || item.type === "detonator") && <AbilityCard abilityId={item.id} />}

            {/* Bottom */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "4px",
                }}
            >

                <div
                    style={{
                        color: "#fcff4c",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                >
                    {item.price} ¢
                </div>


                <button
                    onClick={onBuy}
                    disabled={disabled}
                    style={{
                        background:
                            disabled
                                ? "#111820"
                                : "#18242f",

                        color:
                            disabled
                                ? "#555"
                                : "#fff",

                        border: "1px solid #243342",
                        borderRadius: "8px",

                        padding: "9px 18px",

                        fontSize: "13px",

                        cursor:
                            disabled
                                ? "default"
                                : "pointer",
                    }}
                >
                    {purchased
                        ? "SOLD"
                        : disabled
                            ? "TOO EXPENSIVE"
                            : "BUY"}
                </button>

            </div>

        </div>
    );
}

export default ShopItem;