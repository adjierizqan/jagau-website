// Fictional records only. This file cannot connect to or mutate an application database.
export const seedVersion = "jagau-fictional-id-v1";
export const fictionalFixtures = {
  seedVersion, classification: "synthetic demonstration data", date: "2026-09-15",
  people: [
    {id:"SYN-USER-001",name:"Raka Pratama",email:"raka@example.test"},
    {id:"SYN-USER-002",name:"Nabila Safitri",email:"nabila@example.test"},
    {id:"SYN-USER-003",name:"Dimas Saputra",email:"dimas@example.test"},
  ],
  labstock: {requestId:"SYN-REQ-001",requester:"Nabila Safitri",item:"Tabung sampel",lot:"SYN-LOT-001",opening:120,received:40,issued:25,closing:135},
  suhulog: {point:"Lemari pendingin reagen",actor:"Raka Pratama",lower:2,upper:8,readings:[{date:"2026-09-15",slot:"morning",value:4.6},{date:"2026-09-15",slot:"afternoon",value:5.1}]},
  bdrs: {caseId:"SYN-CASE-001",person:"Dimas Saputra",requestId:"SYN-REQ-002",bagId:"SYN-BAG-001",notice:"Invented workflow fixture; no real patient, clinical result or outcome"},
  elab: {documentId:"SYN-DOC-001",title:"Prosedur pemeriksaan contoh",author:"Nabila Safitri",revision:1,notice:"Fictional document, not an institutional procedure"},
} as const;
