import { dogs } from "@/data/dogs";
import { scoreDog } from "./scoreDog";
import { MatchResult } from "@/types/match";
import { Applicant } from "@/types/applicant";
import { Dog } from "@/types/dogs";

export function findMatches(
  applicant: Applicant,
  dogIds?: string[]
) {
  const dogsToScore =
    dogIds && dogIds.length > 0
      ? dogs.filter((dog) => dogIds.includes(dog.id))
      : dogs;

  return dogsToScore
    .map((dog) => scoreDog(dog as unknown as Dog, applicant))
    .sort((a: MatchResult, b: MatchResult) => b.score - a.score);
}   