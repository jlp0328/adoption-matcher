import { Applicant } from "@/types/applicant";
import { Dog } from "@/types/dogs";

type Row = {
  category: string;
  applicant: string;
  dogNeeds: string;
  pass: boolean;
};

const OLDER_CHILDREN_MIN_AGE = 10;

function formatGoodWithCats(
  value: Dog["goodWithCats"]
): string {
  switch (value) {
    case "yes":
      return "Cat friendly";
    case "no":
      return "No cats";
    case "unknown":
      return "Cat compatibility unknown";
    default:
      return "Cat compatibility unknown";
  }
}

function formatGoodWithDogs(value: Dog["goodWithDogs"]): string {
  switch (value) {
    case "yes":
      return "Good with other dogs";
    case "no":
      return "Not good with other dogs";
    case "selective":
      return "Selective with other dogs";
    case "unknown":
      return "Dog compatibility unknown";
    default:
      return "Dog compatibility unknown";
  }
}

function formatGoodWithChildren(dog: Dog): string {
  if (dog.adultOnlyHome) {
    return "Adult-only home";
  }

  if (dog.kidRestrictions === "older_children_only") {
    return `Older children only (${OLDER_CHILDREN_MIN_AGE}+)`;
  }

  switch (dog.goodWithChildren) {
    case "yes":
      return "Good with children";
    case "no":
      return "Not recommended with children";
    case "older_children_only":
      return `Older children only (${OLDER_CHILDREN_MIN_AGE}+)`;
    case "likely":
      return "Likely good with children";
    case "unknown":
      return "Child compatibility unknown";
    default:
      return "Child compatibility unknown";
  }
}

function childrenRequirementPasses(
  dog: Dog,
  childCount: number,
  youngestChild: number | null
): boolean {
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

function residentDogsRequirementPasses(
  dog: Dog,
  residentDogCount: number
): boolean {
  if (dog.goodWithDogs === "no") {
    return residentDogCount === 0;
  }

  if (dog.requiresAnotherDog) {
    return residentDogCount > 0;
  }

  if (dog.goodWithDogs === "selective" && residentDogCount > 0) {
    return false;
  }

  return true;
}

function formatResidentDogNeeds(dog: Dog): string {
  if (dog.requiresAnotherDog) {
    return "Needs another dog in home";
  }

  return formatGoodWithDogs(dog.goodWithDogs);
}

function applicantHasDogExperience(applicant: Applicant): boolean {
  return (
    applicant.residentDogs.length > 0 ||
    applicant.trainingPlan.trim().length > 0
  );
}

function formatApplicantExperience(applicant: Applicant): string {
  if (applicant.residentDogs.length > 0) {
    return "Has resident dog(s)";
  }

  if (applicant.trainingPlan.trim().length > 0) {
    return "Has training plan on file";
  }

  return "No dog ownership indicated";
}

function formatExperienceNeeds(dog: Dog): string {
  if (dog.behavioralManagementRequired) {
    return "Experienced adopter preferred";
  }

  if (dog.preferredHome?.dogExperience) {
    return dog.preferredHome.dogExperience;
  }

  return "Any adopter";
}

export function CompatibilityMatrix({
  applicant,
  dog,
}: {
  applicant: Applicant;
  dog: Dog;
}) {
  const youngestChild =
    applicant.children.length > 0
      ? Math.min(...applicant.children.map((child) => child.age))
      : null;

  const residentDogCount = applicant.residentDogs.length;
  const residentCatCount = applicant.residentCats ?? 0;

  const rows: Row[] = [
    {
      category: "Fence",
      applicant: applicant.fencedYard
        ? "Has fenced yard"
        : "No fenced yard",
      dogNeeds: dog.fenceRequired
        ? "Fence required"
        : "No fence required",
      pass: !dog.fenceRequired || applicant.fencedYard,
    },
    {
      category: "Children",
      applicant:
        applicant.children.length === 0
          ? "No children"
          : `Youngest child: ${youngestChild}`,
      dogNeeds: formatGoodWithChildren(dog),
      pass: childrenRequirementPasses(
        dog,
        applicant.children.length,
        youngestChild
      ),
    },
    {
      category: "Resident Dogs",
      applicant:
        residentDogCount === 0
          ? "No dogs"
          : `${residentDogCount} dog(s)`,
      dogNeeds: formatResidentDogNeeds(dog),
      pass: residentDogsRequirementPasses(dog, residentDogCount),
    },
    {
      category: "Resident Cats",
      applicant:
        residentCatCount === 0
          ? "No cats"
          : `${residentCatCount} cat(s)`,
      dogNeeds: formatGoodWithCats(dog.goodWithCats),
      pass:
        dog.goodWithCats === "no"
          ? residentCatCount === 0
          : true,
    },
    {
      category: "Experience",
      applicant: formatApplicantExperience(applicant),
      dogNeeds: formatExperienceNeeds(dog),
      pass:
        !dog.behavioralManagementRequired ||
        applicantHasDogExperience(applicant),
    },
  ];

  const passes = rows.filter((row) => row.pass).length;
  const percentage = Math.round((passes / rows.length) * 100);

  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Compatibility Matrix</h4>
        <div className="font-bold">{percentage}% Match</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Applicant</th>
              <th className="text-left p-3">Dog Needs</th>
              <th className="text-center p-3">Result</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.category} className="border-b">
                <td className="p-3 font-medium">{row.category}</td>
                <td className="p-3">{row.applicant}</td>
                <td className="p-3">{row.dogNeeds}</td>
                <td className="p-3 text-center">
                  {row.pass ? (
                    <span className="font-semibold text-green-600">PASS</span>
                  ) : (
                    <span className="font-semibold text-red-600">FAIL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
