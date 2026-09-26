import type { ProjectRecord, ProjectRelationship } from "./projectRegistry.types";

// Canonical cross-ecosystem project registry (BSW-CORE-01, Architecture B).
//
// Records intentionally begin in BSW-CORE-01C.
// Do not populate from README prose without controller approval.
//
// Every record added here must pass `npm run core:validate`, which runs inside `npm run build`.

export const projects = [] as const satisfies readonly ProjectRecord[];

// Typed relationships between projects (Weekfield → StoryForm, BAF → game production, ...).
// Kept as one global array so no project repeats its own id inside every relation.
export const projectRelationships = [] as const satisfies readonly ProjectRelationship[];
