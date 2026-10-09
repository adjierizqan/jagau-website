export const studio = {
  name: "JAGAU",
  email: "adjie@jagau.id",
  origin: "https://jagau.id",
  founder: "Adjie Rizqan",
  portfolio: "https://adjierizqan.github.io/",
  proposition: "Real systems. Thoughtfully engineered.",
  positioning:
    "An independent software studio in Indonesia. Rooted in Banjar. Building software for the real world.",
} as const;

// Reviewed public founder work. These are not claims of JAGAU client contracts.
// Sources and asset provenance: docs/release/content-provenance.md.
export const projects = [
  {
    id: "labstock",
    number: "01",
    name: "LabStock",
    category: "Laboratory inventory",
    title: "Every movement has a source.",
    summary:
      "From the source workbook to the final report. One ledger connects stock movements, corrections and Excel exports.",
    problem:
      "Moving inventory out of spreadsheets is only half the problem. Each balance still needs an identifiable source when records are imported again, corrected or exported.",
    solution:
      "Adjie built LabStock around a stock movement ledger. Source-aware validation and repeat-import checks protect the input. Corrections preserve the earlier record rather than erasing it.",
    decision:
      "One ledger, many outputs. Monthly and yearly reports and exported workbooks read from the same stock movements.",
    flow: [
      "Source workbook",
      "Validate identity",
      "Stock ledger",
      "Report & export",
    ],
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Drizzle ORM", "ExcelJS"],
    status: "Maintenance · public portfolio record",
    role: "Founder work · product, data and release engineering",
    image: "/projects/labstock/thumb-reset-a.webp",
    width: 1600,
    height: 1000,
    caption:
      "Desktop and phone views captured with demo users and synthetic inventory.",
    boundary:
      "Demo database only. Production records, infrastructure and hospital identity are withheld.",
    evidence: "https://adjierizqan.github.io/projects/labstock/",
  },
  {
    id: "suhulog",
    number: "02",
    name: "SuhuLog",
    category: "Temperature monitoring",
    title: "A reading. A record. A history.",
    summary:
      "QR-based temperature entry, exception monitoring and monthly exports, with correction history kept intact.",
    problem:
      "Daily laboratory temperature logs need quick entry without losing morning and afternoon slots, configured limits or the reporting format people rely on.",
    solution:
      "Adjie designed, built and released a focused application. A QR label opens the exact monitoring point. Staff record a reading; monthly charts and exports use the same effective records.",
    decision:
      "Preserve the reading. Out-of-range values are flagged, never silently clamped. Corrections append a record and supersede the previous value.",
    flow: [
      "Monitoring point",
      "Record reading",
      "Review exceptions",
      "Monthly output",
    ],
    stack: ["TypeScript", "Node.js", "Express 5", "SQLite", "EJS", "Chart.js"],
    status: "Released v1.2.3 · public portfolio record",
    role: "Founder work · product design, full-stack and release engineering",
    image: "/projects/suhulog/device-story.webp",
    width: 1600,
    height: 1000,
    caption:
      "Sanitized portfolio views of temperature entry and monthly monitoring.",
    boundary:
      "Sanitized public captures only. Operational data and encoded QR destinations are withheld.",
    evidence: "https://adjierizqan.github.io/projects/suhulog/",
  },
  {
    id: "bdrs",
    number: "03",
    name: "BDRS",
    category: "Blood-bank operations",
    title: "One case. Separate truths.",
    summary:
      "Requests, per-bag crossmatch, issue and physical outcomes connected in one case workspace.",
    problem:
      "A blood-bank workflow spans different events. Issuing a bag does not mean it was used, and a physical outcome does not replace a recorded transfusion event.",
    solution:
      "Adjie designed and built a case workstation with separate state machines for service, crossmatch and transfusion. Named readiness checks make unresolved work visible before finalisation.",
    decision:
      "Keep events distinct. Corrections and controlled reopening preserve history with a recorded reason. Server-side policies enforce access beyond visible buttons.",
    flow: [
      "Request",
      "Per-bag crossmatch",
      "Issue & outcome",
      "Controlled close",
    ],
    stack: ["Laravel 13", "PHP 8.4", "Inertia 3", "React 19", "SQLite"],
    status: "Maintenance · public portfolio record",
    role: "Founder work · product owner, sole developer, QA and release",
    image: "/projects/bdrs/workstation.webp",
    width: 1208,
    height: 950,
    caption:
      "Case workstation with synthetic test fixtures; no real patient records.",
    boundary:
      "Synthetic fixtures only. No clinical AI, compliance certification or patient outcome claim is made.",
    evidence: "https://adjierizqan.github.io/projects/bdrs/",
  },
] as const;
export type ProjectId = (typeof projects)[number]["id"];

export const topics = [
  {
    id: "work",
    label: "What has JAGAU built?",
    title: "Software with a real operational job.",
    answer:
      "Explore the founder’s work in laboratory inventory, temperature monitoring and blood-bank workflows. These case studies show the engineering behind the interface: traceable records, explicit states and reports connected to their source.",
    projectIds: ["labstock", "suhulog", "bdrs"],
  },
  {
    id: "reliability",
    label: "How do you build reliable operational software?",
    title: "Make the record trustworthy.",
    answer:
      "Start with the actual workflow and the meaning of each record. Preserve correction history. Enforce important rules on the server. Verify the output people use, and plan recovery before release. LabStock’s source ledger and SuhuLog’s correction history show this approach in practice.",
    projectIds: ["labstock", "suhulog"],
  },
  {
    id: "story",
    label: "What does JAGAU mean?",
    title: "Rooted in Banjar. Grounded in the work.",
    answer:
      "JAGAU is an independent software practice founded by Adjie Rizqan in Indonesia. The name reflects its Banjar roots. Here, that identity is expressed through care for the work: understanding real processes and building systems people can inspect and maintain.",
    projectIds: [],
  },
  {
    id: "contact",
    label: "Discuss a project",
    title: "Start with the problem you want to solve.",
    answer:
      "Tell Adjie about your current workflow, where it breaks down and what a useful outcome would look like. Get in touch at adjie@jagau.id to discuss fit, scope and the next step. Pricing, availability and delivery dates are agreed directly, rather than inferred here.",
    projectIds: [],
  },
] as const;
export type TopicId = (typeof topics)[number]["id"];
