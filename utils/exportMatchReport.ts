import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Applicant } from "@/types/applicant";
import type { MatchResult } from "@/types/match";

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

export function exportMatchReport(
  applicant: Applicant,
  matches: MatchResult[]
): void {
  const doc = new jsPDF() as JsPdfWithAutoTable;

  const sortedMatches: MatchResult[] = [...matches]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  //--------------------------------------------------
  // PAGE 1
  //--------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CrisisDogsNC Adoption Match Report", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 24);

  autoTable(doc, {
    startY: 32,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    head: [["Applicant Summary", ""]],
    body: [
      [
        "Applicant",
        `${applicant.firstName} ${applicant.lastName}`,
      ],
      [
        "Household",
        applicant.householdType ?? "Unknown",
      ],
      [
        "Children",
        String(applicant.children?.length ?? 0),
      ],
      [
        "Resident Dogs",
        String(applicant.residentDogs?.length ?? 0),
      ],
      [
        "Resident Cats",
        String(applicant.residentCats?.length ?? 0),
      ],
      [
        "Fence",
        applicant.fencedYard ? "Yes" : "No",
      ],
    ],
  });

  autoTable(doc, {
    startY: (doc.lastAutoTable?.finalY ?? 32) + 8,
    head: [["Rank", "Dog", "Score", "Recommendation"]],
    body: sortedMatches.map((match, index) => [
      index + 1,
      match.dogName,
      `${match.score}%`,
      match.recommendation,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
  });

  //--------------------------------------------------
  // DOG PAGES
  //--------------------------------------------------

  sortedMatches.forEach((match: MatchResult) => {
    doc.addPage();

    const dog = match.dogProfile;

    //--------------------------------------------------
    // HEADER
    //--------------------------------------------------

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(match.dogName, 14, 18);

    doc.setFontSize(10);
    doc.text(
      `${match.score}% Match • ${match.recommendation}`,
      14,
      24
    );

    //--------------------------------------------------
    // DOG SNAPSHOT
    //--------------------------------------------------

    autoTable(doc, {
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      head: [["Dog Snapshot", ""]],
      body: [
        ["Breed", dog.breed],
        ["Age", `${dog.ageYears} years`],
        ["Weight", `${dog.weightLbs} lbs`],
        ["Energy", dog.energyLevel],
        ["Dogs", String(dog.goodWithDogs)],
        ["Cats", String(dog.goodWithCats)],
        ["Children", String(dog.goodWithChildren)],
        [
          "Fence",
          dog.fenceRequired ? "Required" : "Not Required",
        ],
      ],
    });

    //--------------------------------------------------
    // WHY THIS MATCH WORKS
    //--------------------------------------------------

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 30) + 6,
      head: [["Why This Match Works"]],
      body: match.strengths
        .slice(0, 6)
        .map((strength: string) => [strength]),
      styles: {
        fontSize: 8,
      },
    });

    //--------------------------------------------------
    // CONCERNS
    //--------------------------------------------------

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 30) + 4,
      head: [["Concerns"]],
      body:
        match.concerns.length > 0
          ? match.concerns
              .slice(0, 5)
              .map((concern: string) => [concern])
          : [["No major concerns identified"]],
      styles: {
        fontSize: 8,
      },
    });

    //--------------------------------------------------
    // DISCUSSION POINTS
    //--------------------------------------------------

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 30) + 4,
      head: [["Key Screening Topics"]],
      body: match.discussionPoints
        .slice(0, 5)
        .map((discussionPoint: string) => [discussionPoint]),
      styles: {
        fontSize: 8,
      },
    });

    //--------------------------------------------------
    // HARD STOPS
    //--------------------------------------------------

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 30) + 4,
      head: [["Hard Stops"]],
      body:
        match.hardStops.length > 0
          ? match.hardStops.map((hardStop: string) => [hardStop])
          : [["None"]],
      styles: {
        fontSize: 8,
      },
    });

    //--------------------------------------------------
    // SCREENER RECOMMENDATION
    //--------------------------------------------------

    const recommendation: string = [
      `${applicant.firstName} appears to be a ${match.recommendation.toLowerCase()} for ${match.dogName}.`,
      match.strengths.length > 0
        ? `Strongest alignment: ${match.strengths[0]}.`
        : "",
      match.concerns.length > 0
        ? `Primary area to discuss: ${match.concerns[0]}.`
        : "No major concerns identified.",
      "Recommended next step: proceed with screening call and discuss the topics listed above.",
    ]
      .filter(Boolean)
      .join(" ");

    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 30) + 4,
      head: [["Screener Recommendation"]],
      body: [[recommendation]],
      styles: {
        fontSize: 8,
        overflow: "linebreak",
      },
    });
  });

  //--------------------------------------------------
  // SAVE
  //--------------------------------------------------

  doc.save(
    `${applicant.firstName}_${applicant.lastName}_Match_Report.pdf`
  );
}
