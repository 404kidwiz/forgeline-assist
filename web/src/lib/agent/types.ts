export type ResultStatus = "completed" | "partial" | "failed" | "needs_input" | "boundary";

export interface AgentResult {
  status: ResultStatus;
  answer: string;
  evidenceIds: string[];
  missingChecks: string[];
  questions: string[];
  taskReceipts: { taskId: string; title: string }[];
  proposalIds: string[];
  handoverDraft?: string;
}

export interface AgentContext {
  investigationId: string;
  runId: string;
  question: string;
  equipment?: string;
  batch?: string;
  userId: string;
  isCancelled: () => boolean;
}

export interface AgentAdapter {
  name: "mock" | "dify";
  run(ctx: AgentContext): Promise<AgentResult>;
}

export const EMERGENCY_BOUNDARY =
  "This demo cannot manage an emergency. Follow the site's posted emergency procedure and contact the designated emergency response team. Do not wait for an AI answer.";

const EMERGENCY_RE = /\b(fire|smoke|injur(y|ed)|gas leak|explosion|bleeding|unconscious|evacuat|chemical spill|electrocut)/i;
export const isEmergency = (q: string) => EMERGENCY_RE.test(q);

// Never allow machinery control/bypass/restart/release as actions — text only, no tools.
const FORBIDDEN_ACTION_RE = /\b(bypass|override|restart|release (the )?(batch|product|hold)|start the (machine|line)|disable (the )?guard)/i;
export const requestsForbiddenAction = (q: string) => FORBIDDEN_ACTION_RE.test(q);
