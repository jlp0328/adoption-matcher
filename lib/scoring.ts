import { Applicant } from "@/types/applicant";
import { Dog } from "@/types/dogs";

export function scoreDog(
  dog: Dog,
  applicant: Applicant
) {
  let score = 100;

  const pros: string[] = [];
  const concerns: string[] = [];

  if (dog.fenceRequired && !applicant.fencedYard) {
    score -= 30;
    concerns.push("Dog requires a fenced yard");
  }

  if (dog.goodWithDogs && applicant.residentDogs > 0) {
    pros.push("Applicant already has dogs");
  }

  if (
    dog.goodWithCats === false &&
    applicant.residentCats > 0
  ) {
    score -= 50;
    concerns.push(
      "Dog is not compatible with cats"
    );
  }

  if (
    dog.energyLevel === "high" &&
    applicant.activityLevel === "high"
  ) {
    score += 10;
    pros.push(
      "Applicant lifestyle matches dog's energy level"
    );
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    pros,
    concerns
  };
}