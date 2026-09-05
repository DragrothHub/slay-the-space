import Detonation from "../components/Detonation";
import MechanicAura from "../components/MechanicAura";

export default function ShipAnimations({
    detonationFlash,
    mechanicFlash,
    damageFlash,
}) {
    return (
        <>
            {detonationFlash && (
                <Detonation color={detonationFlash} />
            )}

            {mechanicFlash && (
                <MechanicAura color={mechanicFlash} />
            )}

            {damageFlash && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            left: -30,
                            color: "#ef4444",
                            fontWeight: "bold",
                            fontSize: 24,
                            animation: "floatUp 2.5s ease-out",
                            pointerEvents: "none",
                        }}
                    >
                        -{damageFlash}
                    </div>
            )}
        </>
    );
}