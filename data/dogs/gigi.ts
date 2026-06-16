import { Dog } from "@/types/dogs";

export const gigi: Dog = {
  id: "gigi",
  name: "Gigi",

  breed: "Doodle Mix",
  ageYears: 0.5,
  weightLbs: 20,
  sex: "female",
  size: "medium",

  houseTrained: false,
  crateTrained: true,

  energyLevel: "high",
  lifeStage: "puppy",

  goodWithDogs: "yes",
  goodWithCats: "yes",
  goodWithChildren: "yes",

  fenceRequired: false,
  apartmentAppropriate: true,

  resourceGuarding: false,

  separationAnxiety: "mild",

  leashSkills: "fair",

  strengths: [
    "Dog friendly",
    "Cat friendly",
    "Kid friendly",
    "Crate trained",
    "Social",
    "Affectionate",
    "Playful",
    "Highly trainable",
    "Adventure ready",
    "Friendly with strangers"
  ],

  temperamentTraits: [
    "playful",
    "social",
    "affectionate",
    "energetic",
    "friendly",
    "outgoing",
    "intelligent"
  ],

  activityNeeds: [
    "daily exercise",
    "active play",
    "mental enrichment",
    "training",
    "social interaction"
  ],

  preferredHome: {
    fencedYard: false,
    dogExperience: "any",
    activityLevel: "high",
    children: "school_age_or_older",
    otherDogs: "preferred",
    cats: "dog_savvy"
  },

  dealBreakers: [],

  discussionPoints: [
    "Very high energy puppy",
    "Still working on house training",
    "Needs continued leash training",
    "Should not be crated for long periods",
    "May be too bouncy for toddlers",
    "Requires significant daily exercise and enrichment"
  ],

  dogCompatibilityNotes:
    "Thrives with active, playful dogs and would likely enjoy a canine companion.",

  childNotes:
    "Does well with children but is likely best suited for school-aged kids due to her enthusiastic puppy energy.",

  separationNotes:
    "Gets sad when left alone for extended periods and should not be crated for long stretches.",

  trainingNotes:
    "Eager to learn but still developing leash manners and puppy life skills. Potty training is approximately 90% complete.",

  adoptionPriority: "standard"
};

export default gigi;