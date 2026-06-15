import { Dog } from "./dogs";

export interface MatchResult {
    dogId: string;
    dogName: string;
  
    dogProfile: Dog;
  
    score: number;
  
    recommendation:
      | "Excellent Match"
      | "Strong Match"
      | "Possible Match"
      | "Needs Review"
      | "Poor Match";
  
    hardStops: string[];
  
    strengths: string[];
  
    concerns: string[];
  
    discussionPoints: string[];
  
    scoreDrivers: {
      positive: string[];
      negative: string[];
    };
  
    fosterSummary: string;
  }