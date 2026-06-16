import { Dog } from "@/types/dogs";

export const duke: Dog = {
  id: "duke",
  name: "Duke",

  breed: "German Shepherd",
  ageYears: 4,
  weightLbs: 78,
  sex: "male",
  size: "large",

  houseTrained: true,
  crateTrained: true,

  energyLevel: "medium",
  lifeStage: "adult",

  goodWithDogs: "yes",
  goodWithCats: "unknown",
  goodWithChildren: "unknown",

  fenceRequired: true,
  apartmentAppropriate: false,

  resourceGuarding: true,
  resourceGuardingFood: true,
  resourceGuardingCrate: true,

  separationAnxiety: "mild",

  leashSkills: "excellent",

  strengths: [
    "House trained",
    "Crate trained",
    "Good with dogs",
    "Affectionate",
    "Playful",
    "Loyal",
    "Good leash manners",
    "Medium energy"
  ],

  temperamentTraits: [
    "affectionate",
    "loyal",
    "gentle",
    "playful",
    "social"
  ],

  activityNeeds: [
    "daily walks",
    "yard play",
    "mental stimulation"
  ],

  preferredHome: {
    fencedYard: true,
    dogExperience: "any",
    activityLevel: "moderate",
    children: "older_respectful",
    otherDogs: "yes_with_management",
    cats: "unknown"
  },

  dealBreakers: [
    "no_fenced_yard"
  ],

  discussionPoints: [
    "Resource guards food",
    "Resource guards crate",
    "Cat compatibility unknown",
    "Child compatibility not fully tested"
  ],

  dogCompatibilityNotes:
    "Gets along well with dogs but should be fed separately and given space around his crate.",

  childNotes:
    "Would likely do best with respectful older children after a proper meet and greet.",

  separationNotes:
    "May vocalize briefly when left alone but settles.",

  trainingNotes:
    "Walks well on leash using a harness and enjoys outdoor activities.",

  adoptionPriority: "standard"
};

export default duke;