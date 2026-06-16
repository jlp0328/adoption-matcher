import { Dog } from "@/types/dogs";
import { Applicant } from "@/types/applicant";

const OLDER_CHILDREN_MIN_AGE = 10;

function childrenRequirementPasses(
  dog: Dog,
  applicant: Applicant
): boolean {
  const childCount = applicant.children.length;
  const youngestChild =
    childCount > 0
      ? Math.min(...applicant.children.map((child) => child.age))
      : null;

  if (dog.adultOnlyHome) {
    return childCount === 0;
  }

  if (dog.goodWithChildren === "no") {
    return childCount === 0;
  }

  if (
    dog.goodWithChildren === "older_children_only" ||
    dog.kidRestrictions === "older_children_only"
  ) {
    return (
      childCount === 0 ||
      (youngestChild !== null &&
        youngestChild >= OLDER_CHILDREN_MIN_AGE)
    );
  }

  return true;
}

export function MatchRequirements({
  dog,
  applicant,
}: {
  dog: Dog;
  applicant: Applicant;
}) {
  const checks = [
    {
      label: "Fenced Yard",
      passed:
        !dog.fenceRequired ||
        applicant.fencedYard,
    },

    {
      label: "Adult Only Home",
      passed:
        !dog.adultOnlyHome ||
        applicant.children.length === 0,
    },

    {
      label: "Child Compatibility",
      passed: childrenRequirementPasses(dog, applicant),
    },
  ];

  return (
    <div className="rounded-lg border p-4">
      <h4 className="font-semibold mb-4">
        Requirement Check
      </h4>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex justify-between"
          >
            <span>{check.label}</span>

            <span
              className={
                check.passed
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {check.passed
                ? "PASS"
                : "FAIL"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}