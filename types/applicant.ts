export interface Child {
  age: number;
  previousDogExperience: string;
}

export interface ResidentDog {
  name: string;
  breed: string;
  ageCategory: string;
  sex: string;
}

export interface Adult {
  firstName: string;
  lastName: string;
  ageRange: string;
  employed: boolean;
}

export interface Applicant {
  firstName: string;
  lastName: string;
  ageRange: string;
  email: string;
  residenceType: string;

  children: Child[];
  residentDogs: ResidentDog[];
  adults: Adult[];

  residentCats: number;

  ownsHome: boolean;
  hasYard: boolean;
  fencedYard: boolean;
  fenceHeight?: number;

  householdType: string;

  longestTimeAlone: string;
  trainingPlan: string;
  walksDogDaily: boolean;
  preferredGender: string;

  preferredAgeRanges: string[];
  preferredPersonalityTraits: string[];
  adoptionReasons: string[];
  willingForAdjustmentPeriod: boolean;

  exercisePlan: string;
  sleepLocation: string;
  aloneLocation: string;
  vacationCarePlan: string;

  employerName: string;
  employmentLength: string;

  smokersInHome: boolean;
  dogAllergiesInHome: boolean;

  vetName: string;
  vetPhone: string;

  readyToAdoptIn: string;

  preferredCharacteristics: string[];

  otherPetsInHome: boolean;
}
