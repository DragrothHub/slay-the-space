import { neutralBaseDamage, primerBaseDamage, detonatorBaseDamage, baseCooldown } from "./constants";
import { debuffs } from "../engine/debuffs";

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

const primerTemplates = [
    {
        id: "primer_offensive_laser_exhausted",
        displayName: "Primer_1",
        type: "laser",
        appliesDebuff: debuffs.exhausted.id,
    },
    {
        id: "primer_offensive_kinetic_marked",
        displayName: "Primer_2",
        type: "kinetic",
        appliesDebuff: debuffs.marked.id,
    },
    {
        id: "primer_offensive_kinetic_weakened",
        displayName: "Primer_3.1",
        type: "kinetic",
        appliesDebuff: debuffs.weakened.id,
    },
    {
        id: "primer_offensive_laser_weakened",
        displayName: "Primer_3.2",
        type: "laser",
        appliesDebuff: debuffs.weakened.id,
    },
    {
        id: "primer_offensive_laser_shocked",
        displayName: "Primer_5",
        type: "laser",
        appliesDebuff: debuffs.shocked.id,
    },
]

const detonatorTemplates = [
    // VAMPIRE
    {
        id: "detonator_offensive_kinetic_exhausted_vampire",
        displayName: "Detonator_1_vampire",
        type: "kinetic",
        detonatorEffect: "vampire",
        detonatesDebuff: debuffs.exhausted.id,
    },
    {
        id: "detonator_offensive_laser_marked_vampire",
        displayName: "Detonator_2_vampire",
        type: "laser",
        detonatorEffect: "vampire",
        detonatesDebuff: debuffs.marked.id,
    },
    {
        id: "detonator_offensive_kinetic_weakened_vampire",
        displayName: "Detonator_3.1_vampire",
        type: "kinetic",
        detonatorEffect: "vampire",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_weakened_vampire",
        displayName: "Detonator_3.2_vampire",
        type: "laser",
        detonatorEffect: "vampire",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_shocked_vampire",
        displayName: "Detonator_5_vampire",
        type: "laser",
        detonatorEffect: "vampire",
        detonatesDebuff: debuffs.shocked.id,
    },

    // BOMBER
    {
        id: "detonator_offensive_kinetic_exhausted_bomber",
        displayName: "Detonator_1_bomber",
        type: "kinetic",
        detonatorEffect: "bomber",
        detonatesDebuff: debuffs.exhausted.id,
    },
    {
        id: "detonator_offensive_laser_marked_bomber",
        displayName: "Detonator_2_bomber",
        type: "laser",
        detonatorEffect: "bomber",
        detonatesDebuff: debuffs.marked.id,
    },
    {
        id: "detonator_offensive_kinetic_weakened_bomber",
        displayName: "Detonator_3.1_bomber",
        type: "kinetic",
        detonatorEffect: "bomber",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_weakened_bomber",
        displayName: "Detonator_3.2_bomber",
        type: "laser",
        detonatorEffect: "bomber",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_shocked_bomber",
        displayName: "Detonator_5_bomber",
        type: "laser",
        detonatorEffect: "bomber",
        detonatesDebuff: debuffs.shocked.id,
    },

    // SPIKE
    {
        id: "detonator_offensive_kinetic_exhausted_spike",
        displayName: "Detonator_1_spike",
        type: "kinetic",
        detonatorEffect: "spike",
        detonatesDebuff: debuffs.exhausted.id,
    },
    {
        id: "detonator_offensive_laser_marked_spike",
        displayName: "Detonator_2_spike",
        type: "laser",
        detonatorEffect: "spike",
        detonatesDebuff: debuffs.marked.id,
    },
    {
        id: "detonator_offensive_kinetic_weakened_spike",
        displayName: "Detonator_3.1_spike",
        type: "kinetic",
        detonatorEffect: "spike",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_weakened_spike",
        displayName: "Detonator_3.2_spike",
        type: "laser",
        detonatorEffect: "spike",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_shocked_spike",
        displayName: "Detonator_5_spike",
        type: "laser",
        detonatorEffect: "spike",
        detonatesDebuff: debuffs.shocked.id,
    },

    // SPREADER
    {
        id: "detonator_offensive_kinetic_exhausted_spreader",
        displayName: "Detonator_1_spreader",
        type: "kinetic",
        detonatorEffect: "spreader",
        detonatesDebuff: debuffs.exhausted.id,
    },
    {
        id: "detonator_offensive_laser_marked_spreader",
        displayName: "Detonator_2_spreader",
        type: "laser",
        detonatorEffect: "spreader",
        detonatesDebuff: debuffs.marked.id,
    },
    {
        id: "detonator_offensive_kinetic_weakened_spreader",
        displayName: "Detonator_3.1_spreader",
        type: "kinetic",
        detonatorEffect: "spreader",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_weakened_spreader",
        displayName: "Detonator_3.2_spreader",
        type: "laser",
        detonatorEffect: "spreader",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_shocked_spreader",
        displayName: "Detonator_5_spreader",
        type: "laser",
        detonatorEffect: "spreader",
        detonatesDebuff: debuffs.shocked.id,
    },

    // CASCADE
    {
        id: "detonator_offensive_kinetic_exhausted_cascade",
        displayName: "Detonator_1_cascade",
        type: "kinetic",
        detonatorEffect: "cascade",
        detonatesDebuff: debuffs.exhausted.id,
    },
    {
        id: "detonator_offensive_laser_marked_cascade",
        displayName: "Detonator_2_cascade",
        type: "laser",
        detonatorEffect: "cascade",
        detonatesDebuff: debuffs.marked.id,
    },
    {
        id: "detonator_offensive_kinetic_weakened_cascade",
        displayName: "Detonator_3.1_cascade",
        type: "kinetic",
        detonatorEffect: "cascade",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_weakened_cascade",
        displayName: "Detonator_3.2_cascade",
        type: "laser",
        detonatorEffect: "cascade",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_shocked_cascade",
        displayName: "Detonator_5_cascade",
        type: "laser",
        detonatorEffect: "cascade",
        detonatesDebuff: debuffs.shocked.id,
    },

    // STUNNER
    {
        id: "detonator_offensive_kinetic_exhausted_stunner",
        displayName: "Detonator_1_stunner",
        type: "kinetic",
        detonatorEffect: "stunner",
        detonatesDebuff: debuffs.exhausted.id,
    },
    {
        id: "detonator_offensive_laser_marked_stunner",
        displayName: "Detonator_2_stunner",
        type: "laser",
        detonatorEffect: "stunner",
        detonatesDebuff: debuffs.marked.id,
    },
    {
        id: "detonator_offensive_kinetic_weakened_stunner",
        displayName: "Detonator_3.1_stunner",
        type: "kinetic",
        detonatorEffect: "stunner",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_weakened_stunner",
        displayName: "Detonator_3.2_stunner",
        type: "laser",
        detonatorEffect: "stunner",
        detonatesDebuff: debuffs.weakened.id,
    },
    {
        id: "detonator_offensive_laser_shocked_stunner",
        displayName: "Detonator_5_stunner",
        type: "laser",
        detonatorEffect: "stunner",
        detonatesDebuff: debuffs.shocked.id,
    },

    // ELITE BOMBER
    {
        id: "detonator_offensive_kinetic_exhausted_bomber_elite",
        displayName: "Detonator_1_bomber_elite",
        type: "kinetic",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: debuffs.exhausted.id,
        rarity: "elite",
    },
    {
        id: "detonator_offensive_laser_marked_bomber_elite",
        displayName: "Detonator_2_bomber_elite",
        type: "laser",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: debuffs.marked.id,
        rarity: "elite",
    },
    {
        id: "detonator_offensive_kinetic_weakened_bomber_elite",
        displayName: "Detonator_3.1_bomber_elite",
        type: "kinetic",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: debuffs.weakened.id,
        rarity: "elite",
    },
    {
        id: "detonator_offensive_laser_weakened_bomber_elite",
        displayName: "Detonator_3.2_bomber_elite",
        type: "laser",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: debuffs.weakened.id,
        rarity: "elite",
    },
    {
        id: "detonator_offensive_laser_shocked_bomber_elite",
        displayName: "Detonator_5_bomber_elite",
        type: "laser",
        detonatorEffect: "bomber_elite",
        detonatesDebuff: debuffs.shocked.id,
        rarity: "elite",
    },
]

function buildNeutral(template) {
    return {
        id: template.id,
        displayName: template.displayName,
        type: template.type,

        rarity: template.rarity ?? "common",

        category: "offensive",
        primer: false,
        detonator: false,
        value: neutralBaseDamage,
        cooldown: 0,
        remainingCooldown: 0,
        appliesDebuff: null,
        detonatesDebuff: null,
    };
}

function buildPrimer(template) {
    return {
        id: template.id,
        displayName: template.displayName,
        type: template.type,
        appliesDebuff: template.appliesDebuff,

        rarity: template.rarity ?? "common",

        category: "offensive",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        remainingCooldown: 0,
        detonatesDebuff: null,
    };
}

function buildDetonator(template) {
    return {
        id: template.id,
        displayName: template.displayName,
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
        appliesDebuff: null,
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

function randomItem(array)
{
    return array[Math.floor(Math.random() * array.length)];
}


function getRandomAbility(collection, rarity = "common")
{
    const available = Object.keys(collection)
    .filter(id => collection[id].rarity === rarity);
    
    return randomItem(available);
}

export function getRandomNeutralAbility()
{
    return getRandomAbility(neutralAbilityCollection);
}

export function getRandomPrimerAbility()
{
    return getRandomAbility(primerAbilityCollection);
}

export function getRandomDetonatorAbility()
{
    return getRandomAbility(detonatorAbilityCollection);
}

export function getRandomEliteDetonatorAbility()
{
    return getRandomAbility(detonatorAbilityCollection, "elite");
}