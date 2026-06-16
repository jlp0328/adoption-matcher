type MatchMode = "all" | "selected";

interface DogOption {
  id: string;
  name: string;
}

interface MatchModeSelectorProps {
  value: MatchMode;
  onChange: (mode: MatchMode) => void;

  dogs: DogOption[];

  selectedDogs: string[];
  onSelectedDogsChange: (
    dogIds: string[]
  ) => void;
}

export function MatchModeSelector({
  value,
  onChange,
  dogs,
  selectedDogs,
  onSelectedDogsChange,
}: MatchModeSelectorProps) {
  function toggleDog(id: string) {
    const selected =
      selectedDogs.includes(id);

    if (selected) {
      onSelectedDogsChange(
        selectedDogs.filter(
          (dogId) => dogId !== id
        )
      );

      return;
    }

    if (selectedDogs.length >= 5) {
      return;
    }

    onSelectedDogsChange([
      ...selectedDogs,
      id,
    ]);
  }

  return (
    <div className="rounded-lg border p-4 mb-6">
      <h3 className="font-semibold text-lg mb-4">
        Match Mode
      </h3>

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="matchMode"
            checked={value === "all"}
            onChange={() => onChange("all")}
            className="mt-1"
          />

          <div>
            <div className="font-medium">
              Compare against all dogs
            </div>

            <div className="text-sm text-gray-500">
              Evaluate against every available
              dog and rank the best matches.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="matchMode"
            checked={value === "selected"}
            onChange={() => onChange("selected")}
            className="mt-1"
          />

          <div>
            <div className="font-medium">
              Compare selected dogs
            </div>

            <div className="text-sm text-gray-500">
              Choose up to 5 dogs to compare.
            </div>
          </div>
        </label>
      </div>

      {value === "selected" && (
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">
              Select Dogs
            </h4>

            <span className="text-sm text-gray-500">
              Selected: {selectedDogs.length}
              / 5
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-2">
            {dogs.map((dog) => {
              const checked =
                selectedDogs.includes(
                  dog.id
                );

              const disabled =
                !checked &&
                selectedDogs.length >= 5;

              return (
                <label
                  key={dog.id}
                  className={`
                    flex items-center gap-3
                    rounded border p-3
                    cursor-pointer
                    transition
                    ${
                      checked
                        ? "border-blue-500"
                        : "border-gray-200"
                    }
                    ${
                      disabled
                        ? "opacity-50"
                        : ""
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() =>
                      toggleDog(dog.id)
                    }
                  />

                  <span>
                    {dog.name}
                  </span>
                </label>
              );
            })}
          </div>

          {selectedDogs.length === 5 && (
            <p className="text-xs text-amber-600 mt-2">
              Maximum of 5 dogs can be
              compared at once.
            </p>
          )}
        </div>
      )}
    </div>
  );
}