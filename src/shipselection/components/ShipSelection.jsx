import { useMemo, useState } from "react";
import { MiniShipCard } from "../../components/ShipCard";
import { createShip } from "../../data/createShip";
import ShipCard from "../../components/ShipCard";

export default function ShipSelection({
    shipCount = 5,
    maxSelections = 2,
    onConfirm,
}) {

    const ships = useMemo(
        () => Array.from({ length: shipCount }, () => createShip()),
        [shipCount]
    );

    const [selectedShips, setSelectedShips] = useState([]);
    const [openedShip, setOpenedShip] = useState(null);

    function toggleShip(ship) {
        setSelectedShips(current => {

            const alreadySelected = current.some(
                s => s.id === ship.id
            );

            // Abwählen
            if (alreadySelected) {
                return current.filter(
                    s => s.id !== ship.id
                );
            }

            // Maximale Anzahl erreicht
            if (current.length >= maxSelections) {
                return current;
            }

            // Auswählen
            return [...current, ship];
        });
    }

    function confirmSelection() {
        onConfirm?.(selectedShips);
    }

    // -------------------------
    // Detailansicht
    // -------------------------

    if (openedShip) {

        const selected = selectedShips.some(
            s => s.id === openedShip.id
        );

        const maxReached =
            selectedShips.length >= maxSelections;

        return (
            <ShipCard
                ship={openedShip}
                close={() => setOpenedShip(null)}
                closeText="Back">
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
                            !selected && maxReached
                                ? "not-allowed"
                                : "default",
                        opacity:
                            !selected && maxReached
                                ? 0.5
                                : 1,
                    }}
                    disabled={!selected && maxReached}
                    onClick={() => {
                        toggleShip(openedShip);
                        setOpenedShip(null);
                    }}
                >
                    {selected ? "Abwählen" : "Auswählen"}
                </button>
            </ShipCard>
        );
    }

    // -------------------------
    // Übersicht
    // -------------------------

    return (
        <div>
            <div style={{textAlign: "center", fontSize: "1.5em", margin: "10px"}}>Choose {maxSelections} ships for your team</div>

            {ships.map(ship => {

                const selected = selectedShips.some(
                    s => s.id === ship.id
                );

                return (
                    <div
                        key={ship.id}
                        onClick={() => setOpenedShip(ship)}
                        style={{
                            border: selected
                                ? "2px solid #fcff4c"
                                : "2px solid transparent",
                            borderRadius: "10px",
                        }}
                    >
                        <MiniShipCard ship={ship} />
                    </div>
                );
            })}

            <button
                style={{
                    width: "100%",
                    height: "100px",
                    borderRadius: "10px",
                    background:
                        selectedShips.length !== maxSelections
                            ? "#2a2b2e"
                            : "linear-gradient(175deg,rgba(10, 17, 24, 1) 50%, rgba(252, 255, 76, 0.2) 100%)",
                    border: "1px solid #374151",
                    color:
                        selectedShips.length !== maxSelections
                            ? "#fff"
                            : "#fcff4c",
                    marginTop: "10px",
                    fontFamily: "monospace",
                }}
                onClick={confirmSelection}
                disabled={selectedShips.length !== maxSelections}
            >
                Confirm Selection ({selectedShips.length}/{maxSelections})
            </button>

        </div>
    );
}