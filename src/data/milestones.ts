import type { MilestoneRecord } from "./projectRegistry.types";

// Public-safe program / release / event claims with exact status (BSW-CORE-01).
//
// Milestones intentionally begin after exact public statuses are approved.
// No program participation, release, event, hackathon, award or partnership claim may be
// added here without a recorded status, date and sources.

export const milestones = [] as const satisfies readonly MilestoneRecord[];
