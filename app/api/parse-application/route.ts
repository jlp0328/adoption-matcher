import { NextResponse } from "next/server";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { getPath } from "pdf-parse/worker";

import { parseApplication } from "@/lib/applicationParser";
import { findMatches } from "@/lib/findMatches";

PDFParse.setWorker(getPath());

function getDogIds(
  matchMode: FormDataEntryValue | null,
  selectedDogsRaw: FormDataEntryValue | null,
  selectedRankingDogId: FormDataEntryValue | null
): string[] | undefined {
  if (matchMode === "selectedDogs" && typeof selectedDogsRaw === "string") {
    const dogIds = JSON.parse(selectedDogsRaw) as string[];
    return dogIds.length > 0 ? dogIds : undefined;
  }

  if (
    matchMode === "rankApplicants" &&
    typeof selectedRankingDogId === "string" &&
    selectedRankingDogId.length > 0
  ) {
    return [selectedRankingDogId];
  }

  return undefined;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const dogIds = getDogIds(
      formData.get("matchMode"),
      formData.get("selectedDogs"),
      formData.get("selectedRankingDogId")
    );

    const applicants = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const parser = new PDFParse({ data: buffer });
        const pdfData = await parser.getText();
        await parser.destroy();
        return parseApplication(pdfData.text);
      })
    );

    const matches = applicants.map((applicant) =>
      findMatches(applicant, dogIds)
    );

    return NextResponse.json({
      applicants,
      matches,
      applicant: applicants[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to process application",
      },
      {
        status: 500,
      }
    );
  }
}
