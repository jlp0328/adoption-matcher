import { duke } from "@/data/dogs/duke";
import { gigi } from "@/data/dogs/gigi";
import { Applicant } from "@/types/applicant";
import { scoreDog } from "./scoreDog";

export function findMatches(
  applicant: Applicant
) {
  return [duke, gigi]
    .map((dog) =>
      scoreDog(dog, applicant)
    )
    .sort(
      (a, b) => b.score - a.score
    );
}