"use client";

import { Dog } from "@/types/dogs";

interface DogSelectorProps {
  dogs: Dog[];
  selectedDogIds: string[];
  onChange: (dogIds: string[]) => void;
}

const MAX_DOGS = 5;

export function DogSelector({
  dogs,
  selectedDogIds,
  onChange,
}: DogSelectorProps) {
  function toggleDog(dogId: string) {
    const isSelected =
      selectedDogIds.includes(dogId);

    if (isSelected) {
      onChange(
        selectedDogIds.filter(
          (id) => id !== dogId
        )
      );

      return;
    }

    if (
      selectedDogIds.length >= MAX_DOGS
    ) {
      return;
    }

    onChange([
      ...selectedDogIds,
      dogId,
    ]);
  }

  return (
    <div className="rounded-lg border p-4 mb-6">
      <h3 className="font-semibold mb-4">
        Select Dogs
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {dogs.sort((a, b) => a.name.localeCompare(b.name)).map((dog) => {
          const checked =
            selectedDogIds.includes(
              dog.id
            );

          const disabled =
            !checked &&
            selectedDogIds.length >=
              MAX_DOGS;

          return (
            <label
              key={dog.id}
              className={`flex items-center gap-2 ${
                disabled
                  ? "opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() =>
                  toggleDog(dog.id)
                }
              />

              <span>{dog.name}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Selected:{" "}
        {selectedDogIds.length} /{" "}
        {MAX_DOGS}
      </div>
    </div>
  );
}