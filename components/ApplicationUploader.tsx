"use client";

import { useState } from "react";
import { Applicant } from "@/types/applicant";
import { MatchResult } from "@/types/match";

function MatchList({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: string[];
  emptyMessage?: string;
}) {
  if (items.length === 0 && !emptyMessage) {
    return null;
  }

  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      {items.length > 0 ? (
        <ul className="list-disc ml-6">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      )}
    </div>
  );
}

export default function ApplicationUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  async function handleUpload() {
    if (!file) {
      setError("Please select a PDF.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-application", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setApplicant(data.applicant);
      setMatches(data.matches);
    } catch (err) {
      console.error(err);
      setError("Unable to process application.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="border rounded-lg p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">Adoption Matcher</h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Analyze Application"}
        </button>

        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>

      {applicant && (
        <div className="mt-8 border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Applicant Summary</h2>

          <div>
            <strong>Applicant:</strong> {applicant.firstName}{" "}
            {applicant.lastName}
          </div>

          <div>
            <strong>Household:</strong> {applicant.householdType}
          </div>

          <div>
            <strong>Fenced Yard:</strong> {applicant.fencedYard ? "Yes" : "No"}
          </div>

          <div>
            <strong>Children:</strong> {applicant.children.length}
          </div>

          <div>
            <strong>Resident Dogs:</strong> {applicant.residentDogs.length}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Match Results</h2>

          <div className="space-y-6">
            {matches.map((match) => (
              <div key={match.dogId} className="border rounded-lg p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{match.dogName}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {match.dogProfile.breed} · {match.dogProfile.ageYears}{" "}
                      yrs · {match.dogProfile.weightLbs} lbs ·{" "}
                      {match.dogProfile.energyLevel} energy
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold">{match.score}%</div>
                    <div className="font-medium">{match.recommendation}</div>
                  </div>
                </div>

                {match.hardStops.length > 0 && (
                  <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
                    <h4 className="font-semibold text-red-800 mb-2">
                      Hard Stops
                    </h4>
                    <ul className="list-disc ml-6 text-red-800">
                      {match.hardStops.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {match.dogProfile.goodWithDogs === true && (
                    <span className="border rounded px-2 py-1 text-sm">
                      Good With Dogs
                    </span>
                  )}

                  {match.dogProfile.goodWithCats === true && (
                    <span className="border rounded px-2 py-1 text-sm">
                      Good With Cats
                    </span>
                  )}

                  {match.dogProfile.goodWithChildren === true && (
                    <span className="border rounded px-2 py-1 text-sm">
                      Good With Kids
                    </span>
                  )}

                  {match.dogProfile.fenceRequired && (
                    <span className="border rounded px-2 py-1 text-sm">
                      Fence Required
                    </span>
                  )}

                  {match.dogProfile.resourceGuarding && (
                    <span className="border rounded px-2 py-1 text-sm">
                      Resource Guarding
                    </span>
                  )}
                </div>

                <MatchList title="Strengths" items={match.strengths} />
                <MatchList title="Concerns" items={match.concerns} />
                <MatchList
                  title="Discussion Points"
                  items={match.discussionPoints}
                />

                {(match.scoreDrivers.positive.length > 0 ||
                  match.scoreDrivers.negative.length > 0) && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Score Breakdown</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {match.scoreDrivers.positive.length > 0 && (
                        <ul className="space-y-1">
                          {match.scoreDrivers.positive.map((item, index) => (
                            <li key={index} className="text-green-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {match.scoreDrivers.negative.length > 0 && (
                        <ul className="space-y-1">
                          {match.scoreDrivers.negative.map((item, index) => (
                            <li key={index} className="text-red-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Foster Summary</h4>
                  <pre className="whitespace-pre-wrap rounded p-4 text-sm">
                    {match.fosterSummary}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
