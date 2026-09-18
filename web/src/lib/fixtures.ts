// Fictional demo corpus — ForgeLine Components, plant FL-01. Not for operational use.
export type Domain = "safety" | "maintenance" | "quality";
export type ApprovalStatus = "approved" | "superseded";

export interface DocChunk {
  id: string; // `${doc_id}:${revision}:${section}`
  doc_id: string;
  title: string;
  revision: number;
  section: string;
  category: Domain;
  equipment: string[];
  effective_date: string;
  approval_status: ApprovalStatus;
  owner: string;
  excerpt: string;
}

const c = (
  doc_id: string,
  title: string,
  revision: number,
  section: string,
  category: Domain,
  equipment: string[],
  effective_date: string,
  approval_status: ApprovalStatus,
  owner: string,
  excerpt: string,
): DocChunk => ({
  id: `${doc_id}:v${revision}:${section}`,
  doc_id, title, revision, section, category, equipment, effective_date, approval_status, owner, excerpt,
});

export const DOC_CHUNKS: DocChunk[] = [
  c("SAF-001", "Guarding and intervention boundaries", 3, "Access", "safety", ["CV-12", "PK-04"], "2026-09-01", "approved", "Safety Lead",
    "CV-12 and PK-04 have designated restricted operating zones. Supervisors must not direct staff to bypass guards or enter restricted zones while equipment is operating."),
  c("SAF-001", "Guarding and intervention boundaries", 3, "Jam escalation", "safety", ["CV-12", "PK-04"], "2026-09-01", "approved", "Safety Lead",
    "A reported jam requiring access to a guarded area must be referred to an authorized maintenance technician under the site's approved equipment-specific isolation procedure. This demonstration does not contain that isolation procedure and cannot provide isolation steps or authorize a restart."),
  c("SAF-001", "Guarding and intervention boundaries", 3, "Restart authority", "safety", ["CV-12", "PK-04"], "2026-09-01", "approved", "Safety Lead",
    "The maintenance lead owns mechanical clearance. Quality clearance is also required when affected product has been placed on hold. A chat response does not provide either clearance."),
  c("SAF-002", "Reporting and emergency boundaries", 2, "Near miss", "safety", [], "2026-09-01", "approved", "Safety Lead",
    "Record the time, plant/area, equipment ID, a factual description, and the shift supervisor's name on form NM-01. Send the report through the plant's established reporting channel before shift handover."),
  c("SAF-002", "Reporting and emergency boundaries", 2, "Immediate danger", "safety", [], "2026-09-01", "approved", "Safety Lead",
    "Use posted site emergency procedures and designated responders. Do not wait for this demonstration assistant. This document deliberately omits real telephone numbers and site-specific evacuation instructions."),
  c("MNT-001", "CV-12 maintenance reference", 4, "Schedule", "maintenance", ["CV-12"], "2026-09-01", "approved", "Maintenance Lead",
    "The fictional CV-12 maintenance plan lists an authorized-technician inspection every 250 operating hours or 30 calendar days, whichever occurs first. Supervisors check the maintenance log; this assistant has no live meter or log connection."),
  c("MNT-001", "CV-12 maintenance reference", 4, "Fault report", "maintenance", ["CV-12"], "2026-09-01", "approved", "Maintenance Lead",
    "For an E17 indication, capture equipment ID, displayed code, time, batch ID, and the operator's observation. Refer the report to the maintenance lead. E17 means inspection required in this fictional manual; no reset or repair steps are supplied. Guarded-area access is subject to SAF-001 section 2."),
  c("MNT-002", "PK-04 service requests", 2, "Label mismatch report", "maintenance", ["PK-04"], "2026-09-01", "approved", "Maintenance Lead",
    "Capture the expected label, observed label, batch ID, equipment ID, and time. The supervisor requests maintenance review and consults QLT-002 for affected product. Do not claim that a service request has been submitted by the assistant."),
  c("MNT-002", "PK-04 service requests", 2, "Procedure limits", "maintenance", ["PK-04"], "2026-09-01", "approved", "Maintenance Lead",
    "This fictional reference contains no torque values, lubrication specifications, or reset sequence. Refer requests for these values to the maintenance lead and the equipment manufacturer's approved manual."),
  c("QLT-001", "PX-20 dimensional inspection", 3, "Sampling", "quality", ["PX-20"], "2026-09-01", "approved", "Quality Lead",
    "PX-20 outer diameter is 20.00 mm with tolerance ±0.10 mm. The allowed interval is 19.90–20.10 mm inclusive. Inspect five parts at batch start and five parts every 60 minutes while the batch runs. Record individual measurements, time, batch ID, and inspector on QF-20."),
  c("QLT-001", "PX-20 dimensional inspection", 3, "Failure", "quality", ["PX-20"], "2026-09-01", "approved", "Quality Lead",
    "If any inspected part is outside the allowed interval, place the affected batch on quality hold and contact the quality lead. The quality lead determines the affected scope and disposition; the assistant cannot release product or authorize shipment."),
  c("QLT-002", "Hold and release", 2, "Trigger", "quality", ["PK-04", "PX-20"], "2026-09-01", "approved", "Quality Lead",
    "A dimensional failure or label mismatch requires affected product to be placed on quality hold pending quality review. Record batch ID, reason, discovery time, and reporter on QH-01."),
  c("QLT-002", "Hold and release", 2, "Release", "quality", ["PK-04", "PX-20"], "2026-09-01", "approved", "Quality Lead",
    "Only the quality lead can approve release after documented review. A repaired packing station does not automatically release held product. If maintenance intervention was necessary, mechanical clearance and product disposition remain separate approvals."),
  // Archived revision — excluded from normal retrieval; only compare_document_versions may read it.
  c("QLT-001", "PX-20 dimensional inspection", 2, "Sampling", "quality", ["PX-20"], "2026-08-01", "superseded", "Quality Lead",
    "PX-20 outer diameter is 20.00 mm with tolerance ±0.10 mm. Inspect five parts at batch start and five parts every 120 minutes while the batch runs. Record individual measurements, time, batch ID, and inspector on QF-20."),
];

export const CHANGES = [
  { id: "CHG-001", doc_id: "QLT-001", from: 2, to: 3, effective_date: "2026-09-01", summary: "Sampling interval changed from 120 minutes to 60 minutes.", ingestion: "indexed" },
];

export const SHIFT = {
  id: "SHIFT-001", plant: "FL-01", name: "Day shift", date: "2026-09-18", supervisor: "Maya Chen",
  observations: [
    { id: "OBS-001", equipment: "PK-04", batch: "B-204", time: "10:15", note: "Label mismatch observed on packed cartons.", status: "review pending" },
    { id: "OBS-002", equipment: "CV-12", batch: "B-203", time: "09:50", note: "E17 indication displayed on CV-12 panel.", status: "unresolved" },
  ],
};

export const EQUIPMENT = [
  { id: "CV-12", name: "Conveyor CV-12", zone: "Line 1" },
  { id: "PK-04", name: "Packing station PK-04", zone: "Line 1" },
  { id: "PX-20", name: "PX-20 spacer kit (product)", zone: "Line 1" },
];

export const USERS = [
  { id: "maya", name: "Maya Chen", role: "supervisor" as const },
  { id: "jordan", name: "Jordan Reyes", role: "supervisor" as const },
  { id: "priya", name: "Priya Natarajan", role: "approver" as const },
];

export const SEED_TASKS = [
  { title: "Log OBS-002 E17 fault report for CV-12", equipment: "CV-12", assignee: "maya", due: "2026-09-18", origin: "SHIFT-001" },
  { title: "Confirm QF-20 sampling at 60 min for B-204", equipment: "PX-20", assignee: "jordan", due: "2026-09-18", origin: "CHG-001" },
];

export const SUGGESTIONS = [
  "PK-04 is printing the wrong labels on B-204. Check maintenance, quality and safety requirements; create the demo follow-up tasks; draft the handover; and prepare an issue for my approval.",
  "What does E17 mean for conveyor CV-12?",
  "How often should we inspect PX-20 dimensions?",
  "Compare the old and current quality sampling intervals.",
];
