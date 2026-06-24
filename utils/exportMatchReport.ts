import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Applicant } from "@/types/applicant";
import type { MatchResult } from "@/types/match";

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

function valueOrUnknown(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Unknown";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function listCount(value: unknown[] | undefined): string {
  return String(value?.length ?? 0);
}

function childSummary(applicant: Applicant): string {
  if (!applicant.children?.length) return "No children";
  return applicant.children
    .map((child: any) => `Age ${child.age ?? "unknown"}`)
    .join(", ");
}

function applicantName(applicant: Applicant): string {
  return `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`.trim();
}

export function exportMatchReport(
  applicant: Applicant,
  matches: MatchResult[]
): void {
  const doc = new jsPDF() as JsPdfWithAutoTable;

  const sortedMatches = [...matches]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CrisisDogsNC Adoption Match Report", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 24);

  autoTable(doc, {
    startY: 32,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Applicant Details", ""]],
    body: [
      ["Applicant", applicantName(applicant)],
      ["Location", valueOrUnknown((applicant as any).location)],
      ["Household Type", valueOrUnknown(applicant.householdType)],
      ["Children", childSummary(applicant)],
      ["Resident Dogs", listCount(applicant.residentDogs)],
      ["Resident Cats", String(applicant.residentCats ?? 0)],
      ["Fenced Yard", applicant.fencedYard ? "Yes" : "No"],
      ["Work Schedule", valueOrUnknown((applicant as any).workSchedule)],
      ["Activity Level", valueOrUnknown((applicant as any).activityLevel)],
      ["Dog Experience", valueOrUnknown((applicant as any).dogExperience)],
      ["Home Environment", valueOrUnknown((applicant as any).homeEnvironment)],
    ],
  });

  autoTable(doc, {
    startY: (doc.lastAutoTable?.finalY ?? 32) + 8,
    head: [["Rank", "Dog", "Score", "Recommendation", "Hard Stops"]],
    body: sortedMatches.map((match, index) => [
      index + 1,
      match.dogName,
      `${match.score}%`,
      match.recommendation,
      match.hardStops.length ? String(match.hardStops.length) : "None",
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
  });

  sortedMatches.forEach((match) => {
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${match.dogName}`, 14, 18);

    doc.setFontSize(10);
    doc.text(`${match.score}% Match • ${match.recommendation}`, 14, 24);

    autoTable(doc, {
      startY: 32,
      head: [["Why This May Be A Fit"]],
      body:
        match.strengths.length > 0
          ? match.strengths.slice(0, 7).map((item) => [item])
          : [["No specific strengths identified."]],
      styles: { fontSize: 8, cellPadding: 2 },
    });

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 32) + 5,
      head: [["Concerns / Watch Items"]],
      body:
        match.concerns.length > 0
          ? match.concerns.slice(0, 6).map((item) => [item])
          : [["No major concerns identified."]],
      styles: { fontSize: 8, cellPadding: 2 },
    });

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 32) + 5,
      head: [["Hard Stops"]],
      body:
        match.hardStops.length > 0
          ? match.hardStops.map((item) => [item])
          : [["None"]],
      styles: { fontSize: 8, cellPadding: 2 },
    });

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 32) + 5,
      head: [["Suggested Screening Topics"]],
      body:
        match.discussionPoints.length > 0
          ? match.discussionPoints.slice(0, 7).map((item) => [item])
          : [["No additional discussion points identified."]],
      styles: { fontSize: 8, cellPadding: 2 },
    });

    const recommendation = [
      `${applicantName(applicant)} appears to be a ${match.recommendation.toLowerCase()} for ${match.dogName}.`,
      match.strengths[0] ? `Main reason: ${match.strengths[0]}.` : "",
      match.concerns[0] ? `Primary concern: ${match.concerns[0]}.` : "No major concerns identified.",
      "Recommended next step: review the screening topics above before deciding whether to move forward with foster review or a home visit.",
    ]
      .filter(Boolean)
      .join(" ");

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 32) + 5,
      head: [["Screener Recommendation"]],
      body: [[recommendation]],
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
      },
    });
  });

  doc.save(`${applicantName(applicant).replace(/\s+/g, "_")}_Match_Report.pdf`);
}