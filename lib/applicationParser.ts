import { Adult, Applicant, Child, ResidentDog } from "@/types/applicant";

function getValue(
  text: string,
  label: string
): string | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim());

  const index = lines.findIndex(
    (line) => line === label
  );

  if (index === -1) return null;

  return lines[index + 1]?.trim() || null;
}

function parseBoolean(
  value: string | null
): boolean {
  return value?.toLowerCase() === "yes";
}

function parseNumber(
  value: string | null
): number {
  if (!value) return 0;

  const match = value.match(/\d+/);

  return match ? Number(match[0]) : 0;
}

function getSection(
  text: string,
  startMarker: string,
  endMarker: string
): string {
  const start = text.indexOf(startMarker);

  if (start === -1) return "";

  const end = text.indexOf(
    endMarker,
    start
  );

  if (end === -1) return "";

  return text.substring(
    start + startMarker.length,
    end
  );
}

function parseChildren(
  text: string
): Child[] {
  const section = getSection(
    text,
    "nested_form_children",
    "Are There Other Dogs In The Home?"
  );

  const children: Child[] = [];

  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      line.includes("fname") ||
      line.includes("gender")
    ) {
      continue;
    }

    const ageMatch = line.match(/^(\d+)/);

    if (!ageMatch) continue;

    children.push({
      age: Number(ageMatch[1]),
      previousDogExperience: line
        .replace(ageMatch[1], "")
        .trim(),
    });
  }

  return children;
}

function parseResidentDogs(
  text: string
): ResidentDog[] {
  const section = getSection(
    text,
    "nested_form_dogs",
    "Are There Other Pets In The Home?"
  );

  const dogs: ResidentDog[] = [];

  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      line.includes("name breed") ||
      line.includes("gender")
    ) {
      continue;
    }

    const sexMatch = line.match(
      /(Male|Female)$/i
    );

    const ageMatch = line.match(
      /(Puppy|Youth|Adult|Senior)/i
    );

    if (!sexMatch || !ageMatch) {
      continue;
    }

    const sex = sexMatch[1];

    const ageCategory = ageMatch[1];

    const beforeAge = line.substring(
      0,
      line.indexOf(ageCategory)
    );

    const parts = beforeAge
      .split(" ")
      .filter(Boolean);

    if (parts.length < 2) continue;

    const name = parts[0];

    const breed = parts
      .slice(1)
      .join(" ")
      .trim();

    dogs.push({
      name,
      breed,
      ageCategory,
      sex,
    });
  }

  return dogs;
}

function parseAgeRanges(
  text: string
): string[] {
  const section = getSection(
    text,
    "Select Age Range",
    "Select Personality"
  );

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parsePersonalityTraits(
  text: string
): string[] {
  const section = getSection(
    text,
    "Select Personality",
    "Select Color"
  );

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseAdoptionReasons(
  text: string
): string[] {
  const section = getSection(
    text,
    "Reason For Adoption",
    "Would You Consider:"
  );

  const reasons: string[] = [];

  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i];
    const next = lines[i + 1];

    if (next === "Yes") {
      reasons.push(current);
    }
  }

  return reasons;
}

function parseAdults(text: string): Adult[] {
    const section = getSection(
      text,
      "nested_form_adults",
      "Are There Children In The Home?"
    );
  
    const adults: {
      firstName: string;
      lastName: string;
      ageRange: string;
      employed: boolean;
    }[] = [];
  
    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  
    for (const line of lines) {
      if (
        line.includes("fname") ||
        line.includes("lname")
      ) {
        continue;
      }
  
      const employed =
        line.endsWith("Yes");
  
      const cleanLine = line.replace(
        /\sYes$|\sNo$/,
        ""
      );
  
      const ageMatch =
        cleanLine.match(
          /(Age:\s*\d+\-\d+)/
        );
  
      if (!ageMatch) continue;
  
      const namePart =
        cleanLine.split("Age:")[0].trim();
  
      const names =
        namePart.split(" ");
  
      adults.push({
        firstName: names[0] ?? "",
        lastName:
          names.slice(1).join(" "),
        ageRange: ageMatch[1],
        employed,
      });
    }
  
    return adults;
  }
  
  function parsePreferredCharacteristics(
    text: string
  ): string[] {
    const characteristics: string[] =
      [];
  
    if (
      text.includes(
        "A Dog That Needs Medications?"
      )
    ) {
      const value = getValue(
        text,
        "A Dog That Needs Medications?"
      );
  
      if (
        value &&
        value !== "No"
      ) {
        characteristics.push(
          "Open To Medical Needs"
        );
      }
    }
  
    return characteristics;
  }

export function parseApplication(
  text: string
): Applicant {
  return {
    firstName:
      getValue(text, "First Name") ?? "",

    lastName:
      getValue(text, "Last Name") ?? "",

    ageRange:
      getValue(text, "Age Range") ?? "",

    email:
      getValue(text, "eMail Address") ?? "",

    residenceType:
      getValue(
        text,
        "Type of Residence"
      ) ?? "",

    ownsHome:
      getValue(
        text,
        "Do You Own or Rent?"
      ) === "Own",

    hasYard: parseBoolean(
      getValue(
        text,
        "Do You Have A Yard?"
      )
    ),

    fencedYard: parseBoolean(
      getValue(
        text,
        "Is The Yard Fenced?"
      )
    ),

    fenceHeight: parseNumber(
      getValue(
        text,
        "How High Is The Fence?"
      )
    ),

    householdType:
      getValue(
        text,
        "What Type Of Household Do You Have?"
      ) ?? "",

    longestTimeAlone:
      getValue(
        text,
        "What Is The Longest Time The Dog Will Be Alone (without humans)?"
      ) ?? "",

    trainingPlan:
      getValue(
        text,
        "What Are Your Plans For Training Your New Dog?"
      ) ?? "",

    walksDogDaily: parseBoolean(
      getValue(
        text,
        "Do You Plan On Walking Your Dog Daily?"
      )
    ),

    preferredGender:
      getValue(
        text,
        "Select Gender"
      ) ?? "",

    children: parseChildren(
      text
    ),

    residentDogs:
      parseResidentDogs(text),

    residentCats: parseBoolean(
      getValue(
        text,
        "Are There Other Pets In The Home?"
      )
    )
      ? 1
      : 0,

    preferredAgeRanges:
      parseAgeRanges(text),

    preferredPersonalityTraits:
      parsePersonalityTraits(text),

    adoptionReasons:
      parseAdoptionReasons(text),

    willingForAdjustmentPeriod:
      parseBoolean(
        getValue(
          text,
          "Dogs can take a month or longer to adjust to a new home, particularly if other pets are involved. Are you willing to devote this much time to making the dog comfortable in your home?"
        )
      ),
      adults: parseAdults(text),

    exercisePlan:
      getValue(text, "What Other Means of Exercise Do You Plan On Providing The Dog?") ?? "",

    sleepLocation:
      getValue(text, "Where Will The Dog Sleep?") ?? "",

aloneLocation:
  getValue(
    text,
    "Where Will The Dog Be When Alone?"
  ) ?? "",

vacationCarePlan:
  getValue(
    text,
    "Who Will Care For The Dog While You Are On Vacation?"
  ) ?? "",

employerName:
  getValue(
    text,
    "Name of Employer"
  ) ?? "",

employmentLength:
  getValue(
    text,
    "How Long Employed There?"
  ) ?? "",

smokersInHome:
  parseBoolean(
    getValue(
      text,
      "Does Any Member Of Your Household Smoke?"
    )
  ),

dogAllergiesInHome:
  parseBoolean(
    getValue(
      text,
      "Is Any Member Of Your Household Allergic To Dogs?"
    )
  ),

vetName:
  getValue(
    text,
    "Please Provide Veterinarian's Name"
  ) ?? "",

vetPhone:
  getValue(
    text,
    "Please Provide Veterinarian's Phone Number"
  ) ?? "",

readyToAdoptIn:
  getValue(
    text,
    "When Will You Be Ready To Adopt?"
  ) ?? "",

otherPetsInHome:
  parseBoolean(
    getValue(
      text,
      "Are There Other Pets In The Home?"
    )
  ),

preferredCharacteristics:
  parsePreferredCharacteristics(
    text
  ),
  };
}