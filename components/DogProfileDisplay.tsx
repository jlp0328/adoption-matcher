import type { ReactNode } from "react";
import { Dog } from "@/types/dogs";

function formatCompatibility(
  value: Dog["goodWithDogs"] | Dog["goodWithCats"] | Dog["goodWithChildren"]
): string {
  if (!value) return "Unknown";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatBoolean(value: boolean | undefined): string | null {
  if (value === undefined) return null;
  return value ? "Yes" : "No";
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined | null;
}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-sm">{display}</div>
    </div>
  );
}

function DetailGrid({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t pt-4">
      <h4 className="mb-3 font-semibold text-gray-900">{title}</h4>
      {children}
    </section>
  );
}

function StringList({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items?.length) return null;

  return (
    <div className="mb-3">
      <div className="mb-1 text-sm font-medium text-gray-700">{title}</div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function NoteBlock({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="mb-3 rounded-md bg-gray-50 p-3 text-sm">
      <div className="mb-1 font-medium text-gray-700">{label}</div>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}

function AlertBadges({ dog }: { dog: Dog }) {
  const badges: { label: string; tone: "red" | "amber" | "blue" }[] = [];

  if (dog.biteHistory) {
    badges.push({ label: "Bite History", tone: "red" });
  }
  if (dog.adultOnlyHome) {
    badges.push({ label: "Adult-Only Home", tone: "red" });
  }
  if (dog.behavioralManagementRequired) {
    badges.push({ label: "Behavioral Management", tone: "amber" });
  }
  if (dog.fenceRequired) {
    badges.push({ label: "Fence Required", tone: "blue" });
  }
  if (dog.resourceGuarding) {
    badges.push({ label: "Resource Guarding", tone: "amber" });
  }
  if (dog.requiresAnotherDog) {
    badges.push({ label: "Needs Another Dog", tone: "blue" });
  }
  if (dog.goodWithDogs === "selective") {
    badges.push({ label: "Selective With Dogs", tone: "amber" });
  }
  if (dog.goodWithChildren === "older_children_only") {
    badges.push({ label: "Older Children Only", tone: "amber" });
  }

  if (badges.length === 0) return null;

  const toneClasses = {
    red: "border-red-200 bg-red-50 text-red-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`rounded border px-2 py-1 text-xs font-medium ${toneClasses[badge.tone]}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

export function DogProfileDisplay({ dog }: { dog: Dog }) {
  const preferredHome = dog.preferredHome;

  return (
    <div className="space-y-4">
      <AlertBadges dog={dog} />

      <Section title="Basics">
        <DetailGrid>
          <DetailItem label="ID" value={dog.id} />
          <DetailItem label="Name" value={dog.name} />
          <DetailItem label="Breed" value={dog.breed} />
          <DetailItem label="Age" value={`${dog.ageYears} yrs`} />
          <DetailItem label="Weight" value={`${dog.weightLbs} lbs`} />
          <DetailItem label="Sex" value={dog.sex} />
          <DetailItem label="Size" value={dog.size} />
          <DetailItem label="Life Stage" value={dog.lifeStage} />
          <DetailItem label="Energy Level" value={dog.energyLevel} />
          <DetailItem
            label="Adoption Priority"
            value={dog.adoptionPriority?.replace("_", " ")}
          />
        </DetailGrid>
      </Section>

      <Section title="Training & Skills">
        <DetailGrid>
          <DetailItem
            label="House Trained"
            value={formatBoolean(dog.houseTrained)}
          />
          <DetailItem
            label="Crate Trained"
            value={formatBoolean(dog.crateTrained)}
          />
          <DetailItem label="Leash Skills" value={dog.leashSkills} />
        </DetailGrid>
        <NoteBlock label="Training Notes" value={dog.trainingNotes} />
      </Section>

      <Section title="Compatibility">
        <DetailGrid>
          <DetailItem
            label="Good With Dogs"
            value={formatCompatibility(dog.goodWithDogs)}
          />
          <DetailItem
            label="Good With Cats"
            value={formatCompatibility(dog.goodWithCats)}
          />
          <DetailItem
            label="Good With Children"
            value={formatCompatibility(dog.goodWithChildren)}
          />
        </DetailGrid>
        <NoteBlock
          label="Dog Compatibility Notes"
          value={dog.dogCompatibilityNotes}
        />
        <NoteBlock label="Child Notes" value={dog.childNotes} />
        <NoteBlock label="Kid Restrictions" value={dog.kidRestrictions} />
      </Section>

      <Section title="Home Requirements">
        <DetailGrid>
          <DetailItem
            label="Fence Required"
            value={formatBoolean(dog.fenceRequired)}
          />
          <DetailItem
            label="Apartment Appropriate"
            value={formatBoolean(dog.apartmentAppropriate)}
          />
          <DetailItem
            label="Requires Another Dog"
            value={formatBoolean(dog.requiresAnotherDog)}
          />
          <DetailItem
            label="Adult-Only Home"
            value={formatBoolean(dog.adultOnlyHome)}
          />
        </DetailGrid>

        {preferredHome && (
          <div className="mt-3 rounded-md bg-gray-50 p-3">
            <div className="mb-2 text-sm font-medium text-gray-700">
              Preferred Home
            </div>
            <DetailGrid>
              <DetailItem
                label="Fenced Yard"
                value={formatBoolean(preferredHome.fencedYard)}
              />
              <DetailItem
                label="Dog Experience"
                value={preferredHome.dogExperience}
              />
              <DetailItem
                label="Activity Level"
                value={preferredHome.activityLevel}
              />
              <DetailItem label="Children" value={preferredHome.children} />
              <DetailItem label="Other Dogs" value={preferredHome.otherDogs} />
              <DetailItem label="Cats" value={preferredHome.cats} />
            </DetailGrid>
          </div>
        )}
      </Section>

      <Section title="Behavior & Management">
        <DetailGrid>
          <DetailItem
            label="Resource Guarding"
            value={formatBoolean(dog.resourceGuarding)}
          />
          <DetailItem
            label="Guards Food"
            value={formatBoolean(dog.resourceGuardingFood)}
          />
          <DetailItem
            label="Guards Crate"
            value={formatBoolean(dog.resourceGuardingCrate)}
          />
          <DetailItem
            label="Separation Anxiety"
            value={dog.separationAnxiety}
          />
          <DetailItem
            label="Bite History"
            value={formatBoolean(dog.biteHistory)}
          />
          <DetailItem
            label="Behavioral Management Required"
            value={formatBoolean(dog.behavioralManagementRequired)}
          />
        </DetailGrid>
        <NoteBlock label="Separation Notes" value={dog.separationNotes} />
      </Section>

      {(dog.medications?.length || dog.medicalNeeds?.length) && (
        <Section title="Medical">
          <StringList title="Medications" items={dog.medications} />
          <StringList title="Medical Needs" items={dog.medicalNeeds} />
        </Section>
      )}

      <Section title="Personality & Activity">
        <StringList title="Temperament Traits" items={dog.temperamentTraits} />
        <StringList title="Strengths" items={dog.strengths} />
        <StringList title="Activity Needs" items={dog.activityNeeds} />
      </Section>

      {(dog.dealBreakers?.length || dog.discussionPoints?.length) && (
        <Section title="Placement Notes">
          <StringList title="Deal Breakers" items={dog.dealBreakers} />
          <StringList title="Discussion Points" items={dog.discussionPoints} />
        </Section>
      )}
    </div>
  );
}
