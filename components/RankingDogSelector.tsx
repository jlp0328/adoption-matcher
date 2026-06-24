"use client";

import { Dog } from "@/types/dogs";

interface RankingDogSelectorProps {
  dogs: Dog[];
  selectedDogId: string;
  onChange: (dogId: string) => void;
}

export function RankingDogSelector({
  dogs,
  selectedDogId,
  onChange,
}: RankingDogSelectorProps) {
  return (
    <div className="rounded-lg border p-4 mb-6">
      <h3 className="font-semibold mb-4">
        Select Dog To Rank Applications Against
      </h3>

      <div className="grid md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {dogs.map((dog) => (
          <label
            key={dog.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="ranking-dog"
              checked={selectedDogId === dog.id}
              onChange={() => onChange(dog.id)}
            />

            <span>{dog.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}