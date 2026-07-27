import InfoDialog from "./InfoDialog";
import { debuffs } from "../engine/debuffs";

export default function AbilityInfoDialog({
    ability,
    onClose
}) {
    if (!ability) return null;

    return (

        <InfoDialog
            open={ability != null}
            title={ability?.displayName}
            onClose={() => onClose()}
        >
            <p>
                <strong>Type:</strong> {ability.type}
            </p>

            {ability.primer && (
                <p>
                    <strong>Primer</strong>
                </p>
            )}

            {ability.detonator && (
                <p>
                    <strong>Detonator</strong>
                </p>
            )}

            <p>
                <strong>Damage:</strong> {ability.value}
            </p>

            {ability.cooldown > 0 && (
                <p>
                    <strong>Cooldown:</strong> {ability.cooldown}
                </p>
            )}

            {ability.appliesDebuff && (
                <>
                    <p>
                        <strong>
                            Applies{" "}
                            <span
                                style={{
                                    color: debuffs[ability.appliesDebuff].color,
                                }}
                            >
                                {debuffs[ability.appliesDebuff].displayName}
                            </span>
                        </strong>
                    </p>

                    <p style={{ color: "#9ab0c0" }}>
                        {debuffs[ability.appliesDebuff].description}
                    </p>
                </>
            )}

            {ability.detonatesDebuff && (
                <>
                    <p>
                        <strong>
                            Detonates{" "}
                            <span
                                style={{
                                    color: debuffs[ability.detonatesDebuff].color,
                                }}
                            >
                                {debuffs[ability.detonatesDebuff].displayName}
                            </span>
                        </strong>
                    </p>

                    <p style={{ color: "#9ab0c0" }}>
                        Consumes the debuff for bonus effects.
                    </p>
                </>
            )}
        </InfoDialog>)
};