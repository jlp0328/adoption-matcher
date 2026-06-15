import { NextResponse } from "next/server";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { getPath } from "pdf-parse/worker";

import { parseApplication } from "@/lib/applicationParser";
import { findMatches } from "@/lib/findMatches";

PDFParse.setWorker(getPath());

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    await parser.destroy();

    const applicant = parseApplication(
      pdfData.text
    );

    const matches = findMatches(
      applicant
    );

    return NextResponse.json({
      applicant,
      matches,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to process application",
      },
      {
        status: 500,
      }
    );
  }
}