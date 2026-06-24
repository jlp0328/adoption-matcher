import { Applicant } from "./applicant";
import { MatchResult } from "./match";

export interface RankedApplicant {
  applicant: Applicant;

  matchResult: MatchResult;

  rank: number;

  riskLevel:
    | "Low"
    | "Medium"
    | "High";
}

export interface DogApplicantRanking {
  dogId: string;
  dogName: string;

  applicants: RankedApplicant[];
}