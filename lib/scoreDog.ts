import { Applicant } from "@/types/applicant";
import { Dog } from "@/types/dog";
import { MatchResult } from "@/types/match";

export function scoreDog(
  dog: Dog,
  applicant: Applicant
): MatchResult {
  let earnedPoints = 0;
  let possiblePoints = 100;

  const hardStops: string[] = [];
  const strengths: string[] = [];
  const concerns: string[] = [];
  const discussionPoints: string[] = [];

  const positiveDrivers: string[] = [];
  const negativeDrivers: string[] = [];

  //
  // FENCE (20)
  //

  if (dog.fenceRequired) {
    if (applicant.fencedYard) {
      earnedPoints += 20;

      strengths.push(
        "Applicant has required fenced yard"
      );

      positiveDrivers.push(
        "+20 Fenced yard requirement met"
      );
    } else {
      hardStops.push(
        "Dog requires a fenced yard"
      );

      negativeDrivers.push(
        "-20 Missing required fenced yard"
      );
    }
  } else {
    earnedPoints += 20;
  }

  //
  // DOG COMPATIBILITY (15)
  //

  if (applicant.residentDogs.length > 0) {
    if (dog.goodWithDogs === true) {
      earnedPoints += 15;

      strengths.push(
        "Dog is compatible with resident dogs"
      );

      positiveDrivers.push(
        "+15 Dog compatibility"
      );
    } else if (
      dog.goodWithDogs === "unknown"
    ) {
      earnedPoints += 7;

      discussionPoints.push(
        "Verify dog compatibility with foster"
      );

      positiveDrivers.push(
        "+7 Dog compatibility unknown"
      );
    } else {
      negativeDrivers.push(
        "-15 Not dog compatible"
      );
    }
  } else {
    earnedPoints += 15;
  }

  //
  // CAT COMPATIBILITY (15)
  //

  if (applicant.otherPetsInHome) {
    if (dog.goodWithCats === true) {
      earnedPoints += 15;

      strengths.push(
        "Dog has been cat tested"
      );

      positiveDrivers.push(
        "+15 Cat compatibility"
      );
    } else if (
      dog.goodWithCats === "unknown"
    ) {
      earnedPoints += 7;

      discussionPoints.push(
        "Cat compatibility unknown"
      );

      positiveDrivers.push(
        "+7 Cat compatibility unknown"
      );
    } else {
      hardStops.push(
        "Dog is not cat compatible"
      );

      negativeDrivers.push(
        "-15 Not cat compatible"
      );
    }
  } else {
    earnedPoints += 15;
  }

  //
  // CHILDREN (15)
  //

  if (applicant.children.length > 0) {
    const youngestChild = Math.min(
      ...applicant.children.map(
        (child) => child.age
      )
    );

    if (
      dog.goodWithChildren === true
    ) {
      earnedPoints += 15;

      strengths.push(
        "Dog is child friendly"
      );

      positiveDrivers.push(
        "+15 Child compatibility"
      );
    } else if (
      dog.goodWithChildren ===
      "unknown"
    ) {
      earnedPoints += 7;

      discussionPoints.push(
        "Discuss child compatibility"
      );

      positiveDrivers.push(
        "+7 Child compatibility unknown"
      );
    }

    if (
      dog.resourceGuarding &&
      youngestChild < 10
    ) {
      earnedPoints -= 10;

      concerns.push(
        "Resource guarding with younger children"
      );

      negativeDrivers.push(
        "-10 Resource guarding concern"
      );
    }
  } else {
    earnedPoints += 15;
  }

  //
  // ENERGY MATCH (15)
  //

  const wantsHighEnergy =
    applicant.preferredPersonalityTraits.includes(
      "High Energy"
    );

  if (
    dog.energyLevel === "high" &&
    wantsHighEnergy
  ) {
    earnedPoints += 15;

    strengths.push(
      "Applicant requested a high-energy dog"
    );

    positiveDrivers.push(
      "+15 Energy match"
    );
  } else if (
    dog.energyLevel === "medium"
  ) {
    earnedPoints += 12;

    positiveDrivers.push(
      "+12 Moderate energy fit"
    );
  } else {
    earnedPoints += 8;

    positiveDrivers.push(
      "+8 Low energy fit"
    );
  }

  //
  // AGE MATCH (10)
  //

  const ageMatch =
    applicant.preferredAgeRanges.some(
      (age) =>
        age.toLowerCase() ===
        dog.lifeStage.toLowerCase()
    );

  if (ageMatch) {
    earnedPoints += 10;

    strengths.push(
      "Dog matches requested age range"
    );

    positiveDrivers.push(
      "+10 Age preference match"
    );
  }

  //
  // PERSONALITY MATCH (10)
  //

  const personalityMatches =
    dog.temperamentTraits.filter(
      (trait) =>
        applicant.preferredPersonalityTraits.some(
          (pref) =>
            pref
              .toLowerCase()
              .includes(
                trait.toLowerCase()
              ) ||
            trait
              .toLowerCase()
              .includes(
                pref.toLowerCase()
              )
        )
    );

  if (
    personalityMatches.length >= 3
  ) {
    earnedPoints += 10;

    positiveDrivers.push(
      "+10 Personality match"
    );
  } else if (
    personalityMatches.length >= 1
  ) {
    earnedPoints += 5;

    positiveDrivers.push(
      "+5 Partial personality match"
    );
  }

  //
  // ALONE TIME (5)
  //

  if (
    dog.separationAnxiety ===
      "none" ||
    dog.separationAnxiety ===
      "mild"
  ) {
    earnedPoints += 5;

    positiveDrivers.push(
      "+5 Separation needs fit"
    );
  } else {
    discussionPoints.push(
      "Discuss daily alone time"
    );
  }

  //
  // DOG PROFILE CONCERNS
  //

  discussionPoints.push(
    ...dog.discussionPoints
  );

  //
  // HARD STOP PENALTY
  //

  if (hardStops.length > 0) {
    earnedPoints = Math.min(
      earnedPoints,
      50
    );
  }

  //
  // FINAL SCORE
  //

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (earnedPoints /
          possiblePoints) *
          100
      )
    )
  );

  let recommendation:
    | "Excellent Match"
    | "Strong Match"
    | "Possible Match"
    | "Needs Review"
    | "Poor Match";

  if (hardStops.length > 0) {
    recommendation =
      "Needs Review";
  } else if (score >= 90) {
    recommendation =
      "Excellent Match";
  } else if (score >= 80) {
    recommendation =
      "Strong Match";
  } else if (score >= 65) {
    recommendation =
      "Possible Match";
  } else if (score >= 50) {
    recommendation =
      "Needs Review";
  } else {
    recommendation =
      "Poor Match";
  }

  const fosterSummary = `
${applicant.firstName} ${applicant.lastName}
appears to be a ${recommendation.toLowerCase()} for ${dog.name}.

Strengths:
${strengths.map((s) => `• ${s}`).join("\n")}

Concerns:
${concerns.map((c) => `• ${c}`).join("\n")}

Discussion Items:
${discussionPoints
  .slice(0, 5)
  .map((d) => `• ${d}`)
  .join("\n")}
`.trim();

  return {
    dogId: dog.id,
    dogName: dog.name,
    dogProfile: dog,

    score,

    recommendation,

    hardStops,

    strengths,

    concerns,

    discussionPoints,

    scoreDrivers: {
      positive: positiveDrivers,
      negative: negativeDrivers,
    },

    fosterSummary,
  };
}