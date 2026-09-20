import { neutralBaseDamage, primerBaseDamage, detonatorBaseDamage, baseCooldown } from "./constants";
import { debuffs } from "../engine/debuffs";
import detonator_icon from "../images/detonator_icon.png";
import primer_icon from "../images/primer_icon.png";

const neutralTemplates = [
    {
        id: "neutral_offensive_kinetic",
        displayName: "Neutral_1",
        type: "kinetic",
    },
    {
        id: "neutral_offensive_laser",
        displayName: "Neutral_1",
        type: "laser",
    }
]

// use debuffs.marked.id, debuffs.exhausted.id,  debuffs.weakened.id, debuffs.shocked.id

const primerTemplates = [
    {
        id: "primer_offensive_laser_exhausted",
        displayName: "Primer_1",
        type: "laser",
        appliesDebuff: [debuffs.exhausted.id],
    },
    {
        id: "primer_offensive_kinetic_marked",
        displayName: "Primer_2",
        type: "kinetic",
        appliesDebuff: [debuffs.marked.id],
    },
    {
        id: "primer_offensive_kinetic_weakened",
        displayName: "Primer_3",
        type: "kinetic",
        appliesDebuff: [debuffs.weakened.id],
    },
    {
        id: "primer_offensive_laser_shocked",
        displayName: "Primer_5",
        type: "laser",
        appliesDebuff: [debuffs.shocked.id],
    },
]

const detonatorTemplates = [
    // VAMPIRE
    {
        id: "detonator_offensive_kinetic_exhausted_vampire",
        displayName: "Detonator_1_vampire",
        type: "kinetic",
        detonatorEffect: "vampire",
        detonatesDebuff: [debuffs.exhausted.id],
    },
    {
        id: "detonator_offensive_laser_marked_vampire",
        displayName: "Detonator_2_vampire",
        type: "laser",
        detonatorEffect: "vampire",
        detonatesDebuff: [debuffs.marked.id],
    },
    {
        id: "detonator_offensive_kinetic_weakened_vampire",
        displayName: "Detonator_3_vampire",
        type: "kinetic",
        detonatorEffect: "vampire",
        detonatesDebuff: [debuffs.weakened.id],
    },
    {
        id: "detonator_offensive_laser_shocked_vampire",
        displayName: "Detonator_5_vampire",
        type: "laser",
        detonatorEffect: "vampire",
        detonatesDebuff: [debuffs.shocked.id],
    },

    // BOMBER
    {
        id: "detonator_offensive_kinetic_exhausted_bomber",
        displayName: "Detonator_1_bomber",
        type: "kinetic",
        detonatorEffect: "bomber",
        detonatesDebuff: [debuffs.exhausted.id],
    },
    {
        id: "detonator_offensive_laser_marked_bomber",
        displayName: "Detonator_2_bomber",
        type: "laser",
        detonatorEffect: "bomber",
        detonatesDebuff: [debuffs.marked.id],
    },
    {
        id: "detonator_offensive_kinetic_weakened_bomber",
        displayName: "Detonator_3_bomber",
        type: "kinetic",
        detonatorEffect: "bomber",
        detonatesDebuff: [debuffs.weakened.id],
    },
    {
        id: "detonator_offensive_laser_shocked_bomber",
        displayName: "Detonator_5_bomber",
        type: "laser",
        detonatorEffect: "bomber",
        detonatesDebuff: [debuffs.shocked.id],
    },

    // SPIKE
    {
        id: "detonator_offensive_kinetic_exhausted_spike",
        displayName: "Detonator_1_spike",
        type: "kinetic",
        detonatorEffect: "spike",
        detonatesDebuff: [debuffs.exhausted.id],
    },
    {
        id: "detonator_offensive_laser_marked_spike",
        displayName: "Detonator_2_spike",
        type: "laser",
        detonatorEffect: "spike",
        detonatesDebuff: [debuffs.marked.id],
    },
    {
        id: "detonator_offensive_kinetic_weakened_spike",
        displayName: "Detonator_3_spike",
        type: "kinetic",
        detonatorEffect: "spike",
        detonatesDebuff: [debuffs.weakened.id],
    },
    {
        id: "detonator_offensive_laser_shocked_spike",
        displayName: "Detonator_5_spike",
        type: "laser",
        detonatorEffect: "spike",
        detonatesDebuff: [debuffs.shocked.id],
    },

    // SPREADER
    {
        id: "detonator_offensive_kinetic_exhausted_spreader",
        displayName: "Detonator_1_spreader",
        type: "kinetic",
        detonatorEffect: "spreader",
        detonatesDebuff: [debuffs.exhausted.id],
    },
    {
        id: "detonator_offensive_laser_marked_spreader",
        displayName: "Detonator_2_spreader",
        type: "laser",
        detonatorEffect: "spreader",
        detonatesDebuff: [debuffs.marked.id],
    },
    {
        id: "detonator_offensive_kinetic_weakened_spreader",
        displayName: "Detonator_3_spreader",
        type: "kinetic",
        detonatorEffect: "spreader",
        detonatesDebuff: [debuffs.weakened.id],
    },
    {
        id: "detonator_offensive_laser_shocked_spreader",
        displayName: "Detonator_5_spreader",
        type: "laser",
        detonatorEffect: "spreader",
        detonatesDebuff: [debuffs.shocked.id],
    },

    // CASCADE
    {
        id: "detonator_offensive_kinetic_exhausted_cascade",
        displayName: "Detonator_1_cascade",
        type: "kinetic",
        detonatorEffect: "cascade",
        detonatesDebuff: [debuffs.exhausted.id],
    },
    {
        id: "detonator_offensive_laser_marked_cascade",
        displayName: "Detonator_2_cascade",
        type: "laser",
        detonatorEffect: "cascade",
        detonatesDebuff: [debuffs.marked.id],
    },
    {
        id: "detonator_offensive_kinetic_weakened_cascade",
        displayName: "Detonator_3_cascade",
        type: "kinetic",
        detonatorEffect: "cascade",
        detonatesDebuff: [debuffs.weakened.id],
    },
    {
        id: "detonator_offensive_laser_shocked_cascade",
        displayName: "Detonator_5_cascade",
        type: "laser",
        detonatorEffect: "cascade",
        detonatesDebuff: [debuffs.shocked.id],
    },

    // STUNNER
    {
        id: "detonator_offensive_kinetic_exhausted_stunner",
        displayName: "Detonator_1_stunner",
        type: "kinetic",
        detonatorEffect: "stunner",
        detonatesDebuff: [debuffs.exhausted.id],
    },
    {
        id: "detonator_offensive_laser_marked_stunner",
        displayName: "Detonator_2_stunner",
        type: "laser",
        detonatorEffect: "stunner",
        detonatesDebuff: [debuffs.marked.id],
    },
    {
        id: "detonator_offensive_kinetic_weakened_stunner",
        displayName: "Detonator_3_stunner",
        type: "kinetic",
        detonatorEffect: "stunner",
        detonatesDebuff: [debuffs.weakened.id],
    },
    {
        id: "detonator_offensive_laser_shocked_stunner",
        displayName: "Detonator_5_stunner",
        type: "laser",
        detonatorEffect: "stunner",
        detonatesDebuff: [debuffs.shocked.id],
    },

    // CLEANSE
    {
        id: "detonator_offensive_laser_exhausted_cleanse",
        displayName: "Detonator_cleanse",
        type: "laser",
        detonatorEffect: "cleanse",
        detonatesDebuff: [debuffs.exhausted.id],
        rarity: "common",
    },
    {
        id: "detonator_offensive_laser_marked_cleanse",
        displayName: "Detonator_cleanse",
        type: "laser",
        detonatorEffect: "cleanse",
        detonatesDebuff: [debuffs.marked.id],
        rarity: "common",
    },
    {
        id: "detonator_offensive_laser_weakened_cleanse",
        displayName: "Detonator_cleanse",
        type: "laser",
        detonatorEffect: "cleanse",
        detonatesDebuff: [debuffs.weakened.id],
        rarity: "common",
    },
    {
        id: "detonator_offensive_laser_shocked_cleanse",
        displayName: "Detonator_cleanse",
        type: "laser",
        detonatorEffect: "cleanse",
        detonatesDebuff: [debuffs.shocked.id],
        rarity: "common",
    },

    // ELITE BOMBER SPREAD
    {
        id: "detonator_offensive_kinetic_exhausted_bomber_elite",
        displayName: "Detonator_1_bomber_elite",
        type: "kinetic",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: [debuffs.exhausted.id],
        rarity: "elite",
    },
    {
        id: "detonator_offensive_laser_marked_bomber_elite",
        displayName: "Detonator_2_bomber_elite",
        type: "laser",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: [debuffs.marked.id],
        rarity: "elite",
    },
    {
        id: "detonator_offensive_kinetic_weakened_bomber_elite",
        displayName: "Detonator_3_bomber_elite",
        type: "kinetic",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: [debuffs.weakened.id],
        rarity: "elite",
    },
    {
        id: "detonator_offensive_laser_shocked_bomber_elite",
        displayName: "Detonator_5_bomber_elite",
        type: "laser",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: [debuffs.shocked.id],
        rarity: "elite",
    },

    // ELITE BOMBER ALL
    {
        id: "detonator_offensive_kinetic_bomber_all_elite",
        displayName: "Detonator_bomber_all_elite",
        type: "kinetic",
        detonatorEffect: "bomber",
        detonatesDebuff: [debuffs.marked.id, debuffs.exhausted.id,  debuffs.weakened.id, debuffs.shocked.id],
        rarity: "elite",
    },
    {
        id: "detonator_offensive_laser_bomber_all_elite",
        displayName: "Detonator_bomber_all_elite",
        type: "laser",
        detonatorEffect: "bomber",
        detonatesDebuff: [debuffs.marked.id, debuffs.exhausted.id,  debuffs.weakened.id, debuffs.shocked.id],
        rarity: "elite",
    },

    // ELITE SPREADER
    {
        id: "detonator_offensive_laser_spreader_elite",
        displayName: "Detonator_5_spreader_elite",
        type: "laser",
        detonatorEffect: "spreader",
        detonatesDebuff: [debuffs.marked.id, debuffs.exhausted.id,  debuffs.weakened.id, debuffs.shocked.id],
        rarity: "elite",
    },
    {
        id: "detonator_offensive_kinetic_spreader_elite",
        displayName: "Detonator_5_spreader_elite",
        type: "kinetic",
        detonatorEffect: "spreader",
        detonatesDebuff: [debuffs.marked.id, debuffs.exhausted.id,  debuffs.weakened.id, debuffs.shocked.id],
        rarity: "elite",
    },
]

const detonatorInfo = {
    vampire: {
        displayName: "Shield Vampyr",
        description: "Restores Shields when a detonated target takes damage",
    },

    bomber: {
        displayName: "Blast Charge",
        description: "Deals additional area damage around the target",
    },

    spike: {
        displayName: "Impaler",
        description: "Deals a powerful burst of additional damage to the target",
    },

    spreader: {
        displayName: "Contagion",
        description: "Spreads the detonated effect to nearby enemies",
    },

    cascade: {
        displayName: "Cascade",
        description: "Triggers additional detonations on nearby targets",
    },

    stunner: {
        displayName: "System Shock",
        description: "Stuns the target after the detonation",
    },

    cleanse: {
        displayName: "Cleanse",
        description: "Cleanse all debuffs from all friendly ships",
    },

    bomber_elite: {
        displayName: "Contagion Blast Charge (Elite)",
        description: "Deals additional area damage around the target and spreads the debuff",
    }
};

function getEliteDetonatorName(effect) {
    const eliteNames = {
        bomber: "Blast Charge (Elite)",
        spreader: "Contagion (Elite)",
        bomber_elite: "Contagion Blast Charge (Elite)",
    };

    return eliteNames[effect] ?? "Elite Detonator";
}

function getDetonatorInfo(template) {
    const info = detonatorInfo[template.detonatorEffect];

    if (!info) {
        return {
            displayName: "Detonator",
            description: "",
        };
    }

    if (template.rarity === "elite") {
        return {
            displayName: getEliteDetonatorName(template.detonatorEffect),
            description: info.description,
        };
    }

    return info;
}

function buildNeutral(template) {
    return {
        id: template.id,
        displayName: template.type === "laser" ? "Laser Battery" : "Cannon Barrage",
        type: template.type,

        rarity: template.rarity ?? "common",

        category: "offensive",
        primer: false,
        detonator: false,
        value: neutralBaseDamage,
        cooldown: 0,
        remainingCooldown: 0,
        appliesDebuff: [],
        detonatesDebuff: [],
        icon: null,
    };
}

function buildPrimer(template) {
    const debuffDescriptions = template.appliesDebuff
        .map(debuffId => {
            const debuff = debuffs[debuffId];

            if (!debuff) return null;

            return `${debuff.displayName} (${debuff.description})`;
        })
        .filter(Boolean)
        .join(" ");

    return {
        id: template.id,
        displayName: "Primer",
        type: template.type,
        appliesDebuff: template.appliesDebuff,

        description: debuffDescriptions
            ? `Applies ${debuffDescriptions}`
            : "",

        rarity: template.rarity ?? "common",

        category: "offensive",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        remainingCooldown: 0,
        detonatesDebuff: [],
        icon: primer_icon,
    };
}

function buildDetonator(template) {
    const info = getDetonatorInfo(template);

    return {
        id: template.id,
        displayName: info.displayName,
        description:  "Detonation: " + info.description,

        type: template.type,
        detonatorEffect: template.detonatorEffect,
        detonatesDebuff: template.detonatesDebuff,

        rarity: template.rarity ?? "common",

        category: "offensive",
        primer: false,
        detonator: true,
        value: detonatorBaseDamage,
        cooldown: baseCooldown,
        remainingCooldown: 0,
        appliesDebuff: [],
        icon: detonator_icon,
    };
}

export const abilityCollection = {};
export const neutralAbilityCollection = {};
export const primerAbilityCollection = {};
export const detonatorAbilityCollection = {};

neutralTemplates.forEach(template => {
    abilityCollection[template.id] = buildNeutral(template);
    neutralAbilityCollection[template.id] = abilityCollection[template.id];
});

primerTemplates.forEach(template => {
    abilityCollection[template.id] = buildPrimer(template);
    primerAbilityCollection[template.id] = abilityCollection[template.id];
});

detonatorTemplates.forEach(template => {
    abilityCollection[template.id] = buildDetonator(template);
    detonatorAbilityCollection[template.id] = abilityCollection[template.id];
});

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}


function getRandomAbility(collection, rarity = "common") {
    const available = Object.keys(collection)
        .filter(id => collection[id].rarity === rarity);

    return randomItem(available);
}

export function getRandomNeutralAbility() {
    return getRandomAbility(neutralAbilityCollection);
}

export function getRandomPrimerAbility() {
    return getRandomAbility(primerAbilityCollection);
}

export function getRandomDetonatorAbility() {
    return getRandomAbility(detonatorAbilityCollection);
}

export function getRandomEliteDetonatorAbility() {
    return getRandomAbility(detonatorAbilityCollection, "elite");
}