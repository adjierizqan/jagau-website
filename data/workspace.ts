export type WorkspaceProject = {
  slug: string;
  title: string;
  eyebrow: string;
  year: string;
  status?: string;
  summary: string;
  opener: { prompt: string; response: string };
  problem: string;
  solution: string;
  howItWorks: string[];
  role: string;
  stack: string[];
  evidence: { label: string; value: string }[];
  whyItMatters: string;
  publicLimitations: string;
  askSuggestion: string;
  image?: string;
  thumb?: string;
  socialImage?: string;
  decisions?: { title: string; detail: string }[];
  presentation?: {
    flow: { title: string; items: string[] }[];
    decisions: { title: string; detail: string }[];
    stockCaption: string;
    headline: string;
    category: string;
    hero: { src: string; caption: string };
    walkthrough: { title: string; detail: string }[];
  };
  video?: string;
  gallery?: { src: string; caption: string }[];
  href?: string;
  assetNote?: string;
};

export const featuredWork: WorkspaceProject[] = [
  {
    "slug": "labstock",
    "opener": {
      "prompt": "How do you keep inventory traceable from spreadsheet import to final report?",
      "response": "The workbook is the entry point. LabStock carries source identity into a stock ledger, preserves corrections instead of overwriting history, and builds reports and Excel exports from that same record."
    },
    "title": "LabStock",
    "eyebrow": "Operational software",
    "year": "2026",
    "status": "Closed · maintenance",
    "summary": "Laboratory inventory, from the source workbook to the final report. One ledger connects stock movements, corrections and Excel exports.",
    "problem": "Moving inventory out of spreadsheets is only half the problem. The source of each balance still needs to be identifiable when data is imported again, corrected, or exported.",
    "solution": "Adjie built LabStock around a stock movement ledger. Source-aware validation and repeat-import checks protect the input; history-preserving corrections keep reports and exported workbooks connected to that record.",
    "howItWorks": [
      "Maps imported records to workbook, sheet, and source row evidence.",
      "Maps source records to the effective item identities used by reports and exports.",
      "Recognizes a repeated import instead of duplicating its ledger movements.",
      "Keeps monthly and yearly web reports and exported workbooks on the same ledger data."
    ],
    "role": "Product engineering · data correctness · release engineering",
    "stack": [
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "ExcelJS"
    ],
    "evidence": [
      {
        "label": "Workflow",
        "value": "Import → ledger → report → export"
      },
      {
        "label": "Import safety",
        "value": "Idempotent re-import"
      },
      {
        "label": "Corrections",
        "value": "Auditable · history-preserving"
      },
      {
        "label": "Monthly output",
        "value": "Detail + recap workbook"
      }
    ],
    "whyItMatters": "A usable operational product and a traceable data model, designed together—from source identity to the workbook people need at the end.",
    "publicLimitations": "Screens shown come from a demo database with synthetic items, rooms, requesters, and users. Production infrastructure, hospital data, URLs, and unsanitized screenshots are withheld.",
    "askSuggestion": "How does LabStock keep imports and reports traceable?",
    "assetNote": "Screens were captured from the final release running against the labstock_pk_demo database: demo users, 22 generic items, rooms and requesters marked demo, no migrated hospital rows.",
    "image": "/projects/labstock/stok.webp",
    "thumb": "/projects/labstock/thumb-reset-a.webp",
    "socialImage": "/projects/labstock/thumb-reset-a.jpg",
    "presentation": {
      "headline": "Every movement has a source.",
      "category": "Laboratory inventory",
      "hero": {
        "src": "/projects/labstock/thumb-reset-a.webp",
        "caption": "LabStock on desktop and phone. Existing demo screens; mobile view cropped for the cover."
      },
      "walkthrough": [
        {
          "title": "Know what needs attention.",
          "detail": "Today brings low stock, expiry, recent requisitions and recorded movements into one operational view."
        },
        {
          "title": "One request. Every item recorded.",
          "detail": "Amprah collects the items in a single requisition. The phone view keeps room and requester alongside items leaving the lab."
        },
        {
          "title": "Close the loop in Excel.",
          "detail": "Monthly and yearly reporting reads from the ledger. The monthly screen exposes corrections alongside the closing balance and Excel export."
        }
      ],
      "stockCaption": "The Stok screen: usable stock per item with expiry and condition, derived from the ledger.",
      "flow": [
        {
          "title": "Source",
          "items": [
            "Workbook",
            "Sheet",
            "Source row"
          ]
        },
        {
          "title": "Validate",
          "items": [
            "Item identity",
            "Unit",
            "Period",
            "Source mapping"
          ]
        },
        {
          "title": "Ledger",
          "items": [
            "OPENING",
            "IN",
            "OUT",
            "ADJUSTMENT",
            "REVERSAL"
          ]
        },
        {
          "title": "Output",
          "items": [
            "Monthly report",
            "Yearly report",
            "Excel export"
          ]
        }
      ],
      "decisions": [
        {
          "title": "Source identity",
          "detail": "Workbook, sheet, row, item identity, unit, and period travel together."
        },
        {
          "title": "Repeat import",
          "detail": "A repeated source is recognized before it can create another stock movement."
        },
        {
          "title": "Correction",
          "detail": "Supersession records the change while retaining the earlier ledger evidence."
        }
      ]
    },
    "gallery": [
      {
        "src": "/projects/labstock/hari-ini.webp",
        "caption": "The Hari Ini (Today) screen: what needs action, recent requisitions and movements."
      },
      {
        "src": "/projects/labstock/amprah.webp",
        "caption": "Amprah, the lab's requisition form: one request posts every item to the stock ledger in one step."
      },
      {
        "src": "/projects/labstock/amprah-mobile.webp",
        "caption": "The requisition form on a phone: room and requester for items leaving the lab."
      },
      {
        "src": "/projects/labstock/laporan.webp",
        "caption": "Monthly report read from the same ledger, ready as the Excel workbook."
      }
    ]
  },
  {
    "slug": "suhulog",
    "opener": {
      "prompt": "How do you simplify daily temperature logging without losing correction history?",
      "response": "A QR label opens the exact monitoring point. Staff record the reading and its Pagi or Sore slot; corrections preserve the previous value, while monitoring and monthly exports share the same effective records."
    },
    "title": "SuhuLog",
    "eyebrow": "Operational software",
    "year": "2026",
    "summary": "A hospital laboratory temperature-logging system for QR-based entry, exception monitoring, auditable corrections, and official monthly exports.",
    "problem": "Manual refrigerator and room-temperature records had to become faster to capture without losing the laboratory's twice-daily slots, correction history, configured limits, or official workbook format.",
    "solution": "Adjie designed, built, and released a focused web application that opens the correct monitoring point from a QR label and produces charts, Excel, PDF, and ZIP reports from the same effective records.",
    "howItWorks": [
      "A QR label opens the entry form for one exact monitoring point.",
      "Staff select Pagi or Sore; the server stamps the recording time. Each point, date and period has one effective ordinary record.",
      "Configured ranges flag out-of-range readings without blocking or clamping them.",
      "Corrections append a new record and supersede the prior value instead of overwriting history.",
      "Monthly views, charts, Excel, PDF, and ZIP exports read the same stored records."
    ],
    "role": "Product design · full-stack engineering · release engineering",
    "stack": [
      "TypeScript",
      "Node.js",
      "Express 5",
      "SQLite",
      "EJS",
      "Chart.js",
      "Nginx"
    ],
    "evidence": [
      {
        "label": "Release",
        "value": "v1.2.3"
      },
      {
        "label": "Quality gate",
        "value": "276 automated tests"
      },
      {
        "label": "Exports",
        "value": "Official Excel · PDF · ZIP"
      },
      {
        "label": "Operations",
        "value": "HTTPS · systemd · verified backups"
      }
    ],
    "whyItMatters": "SuhuLog replaces a fragile manual handoff while preserving the reporting format and audit history the laboratory relies on.",
    "publicLimitations": "Only sanitized portfolio screenshots and public-safe system behavior are shown; operational records and hospital-identifying data are excluded.",
    "askSuggestion": "How does SuhuLog preserve trustworthy temperature records?",
    "image": "/projects/suhulog/device-story.webp",
    "thumb": "/projects/suhulog/cover-final.webp",
    "socialImage": "/projects/suhulog/cover-final.jpg",
    "gallery": [
      {
        "src": "/projects/suhulog/phone-catat-suhu.webp",
        "caption": "On a phone: staff pick the monitoring point and the morning (Pagi) or afternoon (Sore) slot, then enter the reading."
      },
      {
        "src": "/projects/suhulog/desktop-monitoring.webp",
        "caption": "On a laptop: the monthly curve per point, with configured limits and exceptions."
      },
      {
        "src": "/projects/suhulog/desktop-laporan.webp",
        "caption": "Monthly report backed by the same records used for the Excel and PDF export."
      }
    ],
    "assetNote": "Existing sanitized portfolio captures; no hospital-identifying operational records. Scannable labels are withheld; the QR entry stage is explained without publishing an encoded destination.",
    "href": "/projects/suhulog"
  },
  {
    "slug": "bdrs",
    "opener": {
      "prompt": "How do you model a blood-bank workflow without collapsing different events into one status?",
      "response": "Issuing a bag does not mean it was used. BDRS keeps service, per-bag crossmatch, physical outcome and transfusion events distinct, then brings them together in one case workspace."
    },
    "title": "BDRS",
    "eyebrow": "Operational software",
    "year": "2026",
    "status": "Closed · maintenance",
    "summary": "A blood-bank system of record: requests, per-bag crossmatch, issue and outcomes connected in one case workspace.",
    "problem": "The original process spanned 12 Excel workbooks and a Word document. Producing the monthly report meant manually transcribing between files; the lifecycle of a request and each blood unit needed a shared record.",
    "solution": "Adjie designed and built a domain-led system with one case workstation, separate state machines for service, crossmatch and transfusion, and controlled finalisation. Product decisions, full-stack implementation, testing and release were Adjie’s responsibility, with AI-assisted implementation.",
    "howItWorks": [
      "Receipt confirmation brings units into inventory; unconfirmed deliveries are not stock.",
      "Crossmatch belongs to a specific bag–patient pairing. An incompatible bag cannot be issued.",
      "Issue, physical outcome, transfusion episode and reaction remain separate recorded events.",
      "Finalisation evaluates seven blockers and two warnings; the open-episode check runs again inside the transaction.",
      "Corrections and controlled reopening preserve history with a recorded reason."
    ],
    "decisions": [
      {
        "title": "One case. Separate truths.",
        "detail": "Issuing a bag does not mean it was used. A used bag does not imply a recorded transfusion episode. Each event keeps its own meaning."
      },
      {
        "title": "Compatibility belongs to the pairing.",
        "detail": "Crossmatch is per bag, never a single verdict for the request. An incompatible result leaves the request line short."
      },
      {
        "title": "A refusal must be actionable.",
        "detail": "Named readiness checks explain what is unresolved and where to resolve it. Warnings remain distinct from blockers."
      },
      {
        "title": "Enforce the boundary on the server.",
        "detail": "Staff handle daily transactions; administration and correction require the super-admin role. Policies enforce the distinction beyond visible buttons."
      }
    ],
    "role": "Product owner · sole developer · QA and release",
    "stack": [
      "Laravel 13",
      "PHP 8.4",
      "Inertia 3",
      "React 19",
      "Tailwind 4",
      "SQLite"
    ],
    "evidence": [
      {
        "label": "Recorded release",
        "value": "19 September 2026 · owner UAT passed"
      },
      {
        "label": "Unit / feature suite",
        "value": "2,672 passed · 74 skipped · 3 incomplete"
      },
      {
        "label": "End-to-end suite",
        "value": "44 passed"
      },
      {
        "label": "Handover",
        "value": "Operator manual + technical maintenance package"
      }
    ],
    "whyItMatters": "Domain modelling, traceable corrections and release discipline are part of the product—not work left behind the interface.",
    "publicLimitations": "Release figures are the recorded September 2026 gate, not a fresh backend audit. No compliance, penetration-test, efficiency or cost claim is made. Restore rehearsal used a schema-complete, record-empty database. Public screens contain synthetic fixtures only; patient records, hospital identity and infrastructure remain private.",
    "askSuggestion": "Why does BDRS separate issue, physical outcome and transfusion?",
    "assetNote": "Existing public workstation views are sidebar-cropped derivatives of the final UI archive captured with synthetic fixtures. Readiness and mobile captures are element-scoped originals from the same archive, with no hospital mark. Canonical captures remain unmodified.",
    "image": "/projects/bdrs/workstation.webp",
    "thumb": "/projects/bdrs/cover-final.webp",
    "socialImage": "/projects/bdrs/cover-final.jpg",
    "gallery": [
      {
        "src": "/projects/bdrs/readiness.webp",
        "caption": "Synthetic case: named blockers explain why finalisation is refused."
      },
      {
        "src": "/projects/bdrs/mobile.webp",
        "caption": "The synthetic case workstation at phone width."
      },
      {
        "src": "/projects/bdrs/dashboard.webp",
        "caption": "Operational summary: active services, items needing action, stock condition."
      },
      {
        "src": "/projects/bdrs/pengeluaran.webp",
        "caption": "Issue register: bags leaving the bank and their outcome."
      },
      {
        "src": "/projects/bdrs/inventaris.webp",
        "caption": "Inventory by component and blood group, with expiry."
      },
      {
        "src": "/projects/bdrs/episode.webp",
        "caption": "Transfusion episodes traced from request to result."
      },
      {
        "src": "/projects/bdrs/laporan.webp",
        "caption": "Monthly report centre for the lab's workbook templates."
      }
    ]
  }
];
export const labWork: WorkspaceProject[] = [];
// Source-reviewed additions stay outside the approved three-image home preview.
export const elab: WorkspaceProject = {
  slug: "elab", title: "ELAB", eyebrow: "Document & records management", year: "2026",
  status: "In progress · release not verified",
  summary: "Laboratory documents with separate view/download permissions, checksum-based duplicate detection and revision history.",
  opener: { prompt: "How do you keep document access and revision history distinct?", response: "ELAB separates document semantics from binary storage. Its source implements distinct view and download capabilities, SHA-256 duplicate detection and controlled revisions. Public production acceptance has not been independently verified." },
  problem: "A folder of files cannot by itself explain who may view a document, who may download its original, or which controlled revision is current.",
  solution: "ELAB implements a document library, protected preview and upload workflow backed by metadata, permissions and revision records. Binary storage remains separate from document semantics.",
  howItWorks: ["Store binaries separately from searchable document metadata.", "Authorize view and original-file download as distinct capabilities.", "Detect exact content duplicates with SHA-256 before creating another object.", "Preserve document revisions, relationships and audit history."],
  role: "Founder work · software engineering",
  stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Drizzle ORM"],
  evidence: [{label:"Evidence level",value:"Local source and milestone records reviewed; runtime not retested"},{label:"Source revision",value:"a2f15ef"},{label:"Verified implementation",value:"Document access, storage commit, revisions and search"},{label:"Release boundary",value:"In progress; no independently verified public production release"}],
  decisions: [{title:"Metadata is not a folder path.",detail:"Binary storage does not define the document library's information architecture."},{title:"View is not download.",detail:"Permission to inspect a document does not automatically authorize its original-file download."},{title:"A duplicate is not a revision.",detail:"Exact content duplicates are identified separately from controlled revision changes."}],
  whyItMatters: "Document semantics and access controls remain explicit rather than being inferred from physical storage.",
  publicLimitations: "This is a source-reviewed, in-progress project record, not a production or security certification. Private documents, infrastructure, credentials and institutional identity are withheld. Screenshots await an isolated synthetic recapture and image clearance.",
  askSuggestion: "How does ELAB separate view permission from download?",
};
export const allWorkspaceProjects = [...featuredWork, elab];
