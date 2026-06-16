import { Dog } from "@/types/dogs";

export function ScreenerDogProfile({
  dog,
}: {
  dog: Dog;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">
          {dog.name}
        </h3>

        <p className="text-gray-600">
          {dog.breed} • {dog.ageYears} years •{" "}
          {dog.weightLbs} lbs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <InfoCard
          title="Basics"
          items={[
            `Energy: ${dog.energyLevel}`,
            `Dogs: ${dog.goodWithDogs}`,
            `Cats: ${dog.goodWithCats}`,
            `Kids: ${dog.goodWithChildren}`,
            dog.houseTrained
              ? "House trained"
              : "Not house trained",
            dog.crateTrained
              ? "Crate trained"
              : "Not crate trained",
          ]}
        />

        <InfoCard
          title="Requirements"
          items={[
            dog.fenceRequired
              ? "Fence required"
              : "Fence not required",

            dog.adultOnlyHome
              ? "Adult-only home"
              : "",

            dog.kidRestrictions?.split(" ")[0] ?? 0
              ? `Minimum child age: ${dog.kidRestrictions?.split(" ")[0] ?? 0}`
              : "",

            dog.requiresAnotherDog
              ? "Requires another dog"
              : "",

            dog.goodWithDogs
              ? `Good with dogs: ${dog.goodWithDogs}`
              : "",
          ].filter(Boolean)}
        />

        <InfoCard
          title="Behavior"
          items={[
            dog.resourceGuarding
              ? "Resource guarding"
              : "",

            dog.biteHistory
              ? "Bite history"
              : "",

            dog.behavioralManagementRequired
              ? "Experienced adopter needed"
              : "",
          ].filter(Boolean)}
        />
      </div>

      {dog.temperamentTraits?.length > 0 && (
        <TagSection
          title="Temperament"
          tags={dog.temperamentTraits}
        />
      )}

      {dog.strengths?.length > 0 && (
        <BulletSection
          title="Strengths"
          items={dog.strengths}
        />
      )}

      {dog.medications && dog.medications.length > 0 && (
        <BulletSection
          title="Medications"
          items={dog.medications}
        />
      )}

      {dog.medicalNeeds && dog.medicalNeeds.length > 0 && (
        <BulletSection
          title="Medical Needs"
          items={dog.medicalNeeds}
        />
      )}

      {dog.discussionPoints?.length > 0 && (
        <BulletSection
          title="Screening Discussion Points"
          items={dog.discussionPoints}
        />
      )}
    </div>
  );
}

function InfoCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-3">
        {title}
      </h4>

      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function BulletSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="font-semibold mb-2">
        {title}
      </h4>

      <ul className="list-disc ml-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TagSection({
  title,
  tags,
}: {
  title: string;
  tags: string[];
}) {
  return (
    <div>
      <h4 className="font-semibold mb-2">
        {title}
      </h4>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full bg-blue-100 text-sm text-black"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}