export interface Dog {
    id: string;
    name: string;
  
    breed: string;
    ageYears: number;
    weightLbs: number;
    sex: "male" | "female";
    size: "small" | "medium" | "large";
    lifeStage: "puppy" | "young" | "adult" | "senior";
  
    houseTrained: boolean;
    crateTrained: boolean;
  
    energyLevel: "low" | "medium" | "high";
  
    goodWithDogs: boolean | "unknown";
    goodWithCats: boolean | "unknown";
    goodWithChildren: boolean | "unknown";
  
    fenceRequired: boolean;
    apartmentAppropriate: boolean;
  
    resourceGuarding: boolean;
    resourceGuardingFood?: boolean;
    resourceGuardingCrate?: boolean;
  
    separationAnxiety: "none" | "mild" | "moderate" | "severe";
  
    leashSkills: "poor" | "fair" | "good" | "excellent";
  
    strengths: string[];
    temperamentTraits: string[];
    activityNeeds: string[];
  
    preferredHome: {
      fencedYard: boolean;
      dogExperience: string;
      activityLevel: string;
      children: string;
      otherDogs: string;
      cats: string;
    };
  
    dealBreakers: string[];
    discussionPoints: string[];
  
    dogCompatibilityNotes?: string;
    childNotes?: string;
    separationNotes?: string;
    trainingNotes?: string;

    biteHistory?: boolean;
    adultOnlyHome?: boolean;
    behavioralManagementRequired?: boolean;
    medications?: string[];
  
    adoptionPriority: "standard" | "urgent" | "long_term";
    requiresAnotherDog?: boolean;
    medicalNeeds?: string[];
    kidRestrictions?: string;
  }