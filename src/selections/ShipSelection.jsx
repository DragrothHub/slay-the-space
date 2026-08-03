import { MiniShipCard } from "../components/ShipCard";
import ShipCard from "../components/ShipCard";
import Selection from "./Selection";

export default function ShipSelection({ ships, maxSelections, onConfirm })
{
    return (
        <Selection
            items={ships}
            maxSelections={maxSelections}
            title="Choose 2 ships"

            renderMini={({
                key,
                item,
                selected,
                open,
            }) => (
                <MiniShipCard
                    key={key}
                    ship={item}
                    borderColor={
                        selected
                            ? "2px solid #fcff4c"
                            : "2px solid transparent"
                    }
                    onClick={open}
                />
            )}

            renderDetail={({
                item,
                selected,
                maxReached,
                toggle,
                close,
            }) => (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <ShipCard
                        ship={item}
                        close={close}
                        closeText="Back"
                    >

                        <button
                            style={{
                                background: "#0a1118",
                                width: "100%",
                                padding: "10px",
                                borderRadius: "10px",
                                border: selected ? "2px solid #fcff4c" : "2px solid #243342",
                                margin: "10px auto",
                                height: "70px",
                                marginTop: "30px",
                                borderRadius: "10px",
                                color: "white",
                                fontFamily: "monospace",
                                cursor:
                                    maxSelections > 1 && !selected && maxReached
                                        ? "not-allowed"
                                        : "default",
                                opacity:
                                    maxSelections > 1 && !selected && maxReached
                                        ? 0.5
                                        : 1,
                            }}
                            disabled={maxSelections > 1 && !selected && maxReached}
                            onClick={() =>
                            {
                                toggle();
                                close();
                            }}
                        >
                            {selected ? "Deselect" : "Select"}
                        </button>
                    </ShipCard>
                </div>
            )}

            onConfirm={onConfirm}
        />
    );
}