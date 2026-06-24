"use client";

export type MatchMode =
  | "allDogs"
  | "selectedDogs"
  | "rankApplicants";

interface MatchModeSelectorProps {
  mode: MatchMode;
  onChange: (mode: MatchMode) => void;
}

export function MatchModeSelector({
  mode,
  onChange,
}: MatchModeSelectorProps) {
  return (
    <div className="rounded-lg border p-4 mb-6">
      <h3 className="font-semibold mb-4">
        Match Mode
      </h3>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="match-mode"
            checked={mode === "allDogs"}
            onChange={() =>
              onChange("allDogs")
            }
          />

          <span>
            Compare Against All Dogs
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="match-mode"
            checked={mode === "selectedDogs"}
            onChange={() =>
              onChange("selectedDogs")
            }
          />

          <span>
            Compare Selected Dogs
          </span>
        </label>

        {/* <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="match-mode"
            checked={mode === "rankApplicants"}
            onChange={() =>
              onChange("rankApplicants")
            }
          />

          <span>
            Rank Applicants For One Dog
          </span>
        </label> */}
      </div>
    </div>
  );
}