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
  
  export interface Applicant {
    firstName: string;
    lastName: string;
  
    children: Child[];
    residentDogs: ResidentDog[];
  
    residentCats: number;
  
    ownsHome: boolean;
    fencedYard: boolean;
    fenceHeight?: number;
  
    householdType: string;
  
    longestTimeAlone: string;
  
    preferredAgeRanges: string[];
    preferredPersonalityTraits: string[];

    adults: number[];
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