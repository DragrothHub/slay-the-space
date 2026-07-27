import { neutralBaseDamage, primerBaseDamage, detonatorBaseDamage, baseCooldown } from "./constants";
import { debuffs } from "../engine/debuffs";

export const neutralAbilityCollection = {
    neutral_offensive_kinetic: {
        id: "neutral_offensive_kinetic",
        displayName: "Neutral_1",
        category: "offensive",
        type: "kinetic",
        primer: false,
        detonator: false,
        value: neutralBaseDamage,
        cooldown: 0,
        appliesDebuff: null,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
    neutral_offensive_laser: {
        id: "neutral_offensive_laser",
        displayName: "Neutral_1",
        category: "offensive",
        type: "laser",
        primer: false,
        detonator: false,
        value: neutralBaseDamage,
        cooldown: 0,
        appliesDebuff: null,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
}

export const primerAbilityCollection = {
    primer_offensive_laser_weakenedShields: {
        id: "primer_offensive_laser_weakenedShields",
        displayName: "Primer_1",
        category: "offensive",
        type: "laser",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: debuffs.weakened_shields.id,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
    primer_offensive_kinetic_weakenedArmor: {
        id: "primer_offensive_kinetic_weakenedArmor",
        displayName: "Primer_2",
        category: "offensive",
        type: "kinetic",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: debuffs.weakened_armor.id,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
    primer_offensive_kinetic_weakened: {
        id: "primer_offensive_kinetic_weakened",
        displayName: "Primer_3.1",
        category: "offensive",
        type: "kinetic",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: debuffs.weakened.id,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
    primer_offensive_laser_weakened: {
        id: "primer_offensive_laser_weakened",
        displayName: "Primer_3.2",
        category: "offensive",
        type: "laser",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: debuffs.weakened.id,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
    primer_offensive_kinetic_stunned: {
        id: "primer_offensive_kinetic_stunned",
        displayName: "Primer_4",
        category: "offensive",
        type: "kinetic",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: debuffs.stunned.id,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
    primer_offensive_laser_shocked: {
        id: "primer_offensive_laser_shocked",
        displayName: "Primer_5",
        category: "offensive",
        type: "laser",
        primer: true,
        detonator: false,
        value: primerBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: debuffs.shocked.id,
        detonatesDebuff: null,
        remainingCooldown: 0,
    },
}

export const detonatorAbilityCollection = {
    detonator_offensive_kinetic_weakenedShields: {
        id: "detonator_offensive_kinetic_weakenedShields",
        displayName: "Detonator_1",
        category: "offensive",
        type: "kinetic",
        primer: false,
        detonator: true,
        value: detonatorBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: null,
        detonatesDebuff: debuffs.weakened_shields.id,
        remainingCooldown: 0,
    },
    detonator_offensive_laser_weakenedArmor: {
        id: "detonator_offensive_laser_weakenedArmor",
        displayName: "Detonator_2",
        category: "offensive",
        type: "laser",
        primer: false,
        detonator: true,
        value: detonatorBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: null,
        detonatesDebuff: debuffs.weakened_armor.id,
        remainingCooldown: 0,
    },
    detonator_offensive_kinetic_weakened: {
        id: "detonator_offensive_kinetic_weakened",
        displayName: "Detonator_3.1",
        category: "offensive",
        type: "kinetic",
        primer: false,
        detonator: true,
        value: detonatorBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: null,
        detonatesDebuff: debuffs.weakened.id,
        remainingCooldown: 0,
    },
    detonator_offensive_laser_weakened: {
        id: "detonator_offensive_laser_weakened",
        displayName: "Detonator_3.2",
        category: "offensive",
        type: "laser",
        primer: false,
        detonator: true,
        value: detonatorBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: null,
        detonatesDebuff: debuffs.weakened.id,
        remainingCooldown: 0,
    },
    detonator_offensive_kinetic_stunned: {
        id: "detonator_offensive_kinetic_stunned",
        displayName: "Detonator_4",
        category: "offensive",
        type: "kinetic",
        primer: false,
        detonator: true,
        value: detonatorBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: null,
        detonatesDebuff: debuffs.stunned.id,
        remainingCooldown: 0,
    },
    detonator_offensive_laser_shocked: {
        id: "detonator_offensive_laser_shocked",
        displayName: "Detonator_5",
        category: "offensive",
        type: "laser",
        primer: false,
        detonator: true,
        value: detonatorBaseDamage,
        cooldown: baseCooldown,
        appliesDebuff: null,
        detonatesDebuff: debuffs.shocked.id,
        remainingCooldown: 0,
    },
}

export const abilityCollection = {
    neutral_offensive_kinetic: neutralAbilityCollection.neutral_offensive_kinetic,
    neutral_offensive_laser: neutralAbilityCollection.neutral_offensive_laser,

    primer_offensive_laser_weakenedShields: primerAbilityCollection.primer_offensive_laser_weakenedShields,
    primer_offensive_kinetic_weakenedArmor: primerAbilityCollection.primer_offensive_kinetic_weakenedArmor,
    primer_offensive_kinetic_weakened: primerAbilityCollection.primer_offensive_kinetic_weakened,
    primer_offensive_laser_weakened: primerAbilityCollection.primer_offensive_laser_weakened,
    primer_offensive_kinetic_stunned: primerAbilityCollection.primer_offensive_kinetic_stunned,
    primer_offensive_laser_shocked: primerAbilityCollection.primer_offensive_laser_shocked,

    detonator_offensive_kinetic_weakenedShields: detonatorAbilityCollection.detonator_offensive_kinetic_weakenedShields,
    detonator_offensive_laser_weakenedArmor: detonatorAbilityCollection.detonator_offensive_laser_weakenedArmor,
    detonator_offensive_kinetic_weakened: detonatorAbilityCollection.detonator_offensive_kinetic_weakened,
    detonator_offensive_laser_weakened: detonatorAbilityCollection.detonator_offensive_laser_weakened,
    detonator_offensive_kinetic_stunned: detonatorAbilityCollection.detonator_offensive_kinetic_stunned,
    detonator_offensive_laser_shocked: detonatorAbilityCollection.detonator_offensive_laser_shocked,
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomNeutralAbility(){
    return randomItem(Object.keys(neutralAbilityCollection));
}

export function getRandomPrimerAbility(){
    return randomItem(Object.keys(primerAbilityCollection));
}

export function getRandomDetonatorAbility(){
    return randomItem(Object.keys(detonatorAbilityCollection));
}