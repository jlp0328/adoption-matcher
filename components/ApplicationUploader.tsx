"use client";

import { useId, useRef, useState } from "react";
import { Applicant } from "@/types/applicant";
import { MatchResult } from "@/types/match";
import { ScreenerDogProfile } from "@/components/ScreenerDogProfile";
import { MatchRequirements } from "@/components/MatchRequirements";
import { CompatibilityMatrix } from "@/components/CompatabilityMatrix";
import { MatchMode, MatchModeSelector } from "@/components/MatchModeSelector";
import { DogSelector } from "@/components/DogSelector";
import { exportMatchReport } from "@/utils/exportMatchReport";
import { dogs } from "@/data/dogs";
import { Dog } from "@/types/dogs";
import { RankingDogSelector } from "./RankingDogSelector";

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
  const fileInputId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>("allDogs");
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);
  const [selectedRankingDogId, setSelectedRankingDogId] = useState("");

  const MAX_APPLICATIONS = 5;

  const [files, setFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dogOptions = dogs.map((dog) => ({
    id: dog.id,
    name: dog.name,
  }));

  async function handleUpload() {
    if (files.length === 0) {
      setError("Please select a PDF.");
      return;
    }

    if (matchMode === "rankApplicants" && !selectedRankingDogId) {
      setError("Please select a dog.");

      return;
    }

    if (
        matchMode === "selectedDogs" &&
        selectedDogIds.length === 0
      ) {
        setError(
          "Please select at least one dog."
        );
      
        return;
      }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("matchMode", matchMode);
      formData.append("selectedDogs", JSON.stringify(selectedDogIds));
      formData.append("selectedRankingDogId", selectedRankingDogId);

      const response = await fetch("/api/parse-application", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setApplicant(data.applicant ?? data.applicants?.[0] ?? null);
      setMatches(data.matches?.[0] ?? data.matches ?? []);
    } catch (err) {
      console.error(err);
      setError("Unable to process application.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFiles([]);
    setLoading(false);
    setError("");

    setApplicant(null);
    setMatches([]);

    setMatchMode("allDogs");
    setSelectedDogIds([]);
    setSelectedRankingDogId("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setFileInputKey((key) => key + 1);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="border rounded-lg p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">Adoption Matcher</h1>

        <MatchModeSelector mode={matchMode} onChange={setMatchMode} />

        {/* Compare Selected Dogs Mode */}
        {matchMode === "selectedDogs" && (
          <div className="mt-4">
            <DogSelector
              dogs={dogs as Dog[]}
              selectedDogIds={selectedDogIds}
              onChange={setSelectedDogIds}
            />
          </div>
        )}

        {/* Rank Applicants Mode */}
        {/* {matchMode === "rankApplicants" && (
          <div className="mt-4">
            <RankingDogSelector
              dogs={dogs as Dog[]}
              selectedDogId={selectedRankingDogId}
              onChange={setSelectedRankingDogId}
            />
          </div>
        )} */}

        <div className="space-y-3">
          <input
            key={fileInputKey}
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            multiple
            accept=".pdf"
            className="sr-only"
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files ?? []);

              if (selectedFiles.length > MAX_APPLICATIONS) {
                setError(`Maximum ${MAX_APPLICATIONS} applications allowed`);
                return;
              }

              setFiles(selectedFiles);
              setError("");
            }}
          />

          <label
            htmlFor={fileInputId}
            className="inline-flex cursor-pointer items-center gap-2 rounded border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-blue-700 transition hover:border-blue-500 hover:bg-blue-100"
          >
            <span className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">
              Choose PDF
            </span>
            <span className="text-sm">
              {files.length > 0
                ? `${files.length} application(s) selected`
                : "Click to select adoption applications"}
            </span>
          </label>

          {files.length > 0 && (
            <div className="mt-3">
              <div className="font-medium mb-2">Applications Selected</div>

              <ul className="space-y-1 text-sm">
                {files.map((file) => (
                  <li key={file.name} className="text-gray-700">
                    ✓ {file.name}
                  </li>
                ))}
              </ul>

              <div className="mt-2 text-xs text-gray-500">
                Selected: {files.length} / {MAX_APPLICATIONS}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "Analyze Application"}
          </button>

          <button
            onClick={resetForm}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-red-500 disabled:opacity-50"
          >
            Reset
          </button>
          {applicant && matches.length > 0 && (
            <button
              onClick={() => {
                if (!applicant) return;
                exportMatchReport(applicant, matches);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Export PDF
            </button>
          )}
        </div>

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
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{match.dogName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Match score for {applicant?.firstName}{" "}
                      {applicant?.lastName}
                    </p>

                    {match.hardStops.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {match.hardStops.map((stop) => (
                          <span
                            key={stop}
                            className="px-2 py-1 text-xs rounded bg-red-100 text-red-800"
                          >
                            {stop}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold">{match.score}%</div>
                    <div className="font-medium text-blue-700">
                      {match.recommendation}
                    </div>
                  </div>
                </div>

                {match.hardStops.length > 0 && (
                  <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
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

                <div className="mb-6 rounded-lg border p-4">
                  <h4 className="text-lg font-semibold mb-4">
                    Adoption Requirements
                  </h4>

                  <MatchRequirements
                    applicant={applicant as unknown as Applicant}
                    dog={match.dogProfile}
                  />
                </div>

                <div className="mb-6">
                  <CompatibilityMatrix
                    applicant={applicant as unknown as Applicant}
                    dog={match.dogProfile}
                  />
                </div>

                <div className="mb-6 rounded-lg border p-4">
                  <h4 className="text-lg font-semibold mb-4">Dog Profile</h4>

                  <ScreenerDogProfile dog={match.dogProfile} />
                </div>

                <div className="mb-6 rounded-lg border p-4">
                  <h4 className="text-lg font-semibold mb-4">Match Analysis</h4>

                  <MatchList title="Match Strengths" items={match.strengths} />
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
                    <pre className="whitespace-pre-wrap rounded p-4 text-sm border">
                      {match.fosterSummary}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
