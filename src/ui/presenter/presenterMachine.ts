import type { PresenterAnswerId } from "./presenterContent";

export type PresenterPhase = "closed" | "idle_open" | "playing_answer" | "stopped" | "completed";

// `run` grows with every playback start and never goes back (not on the way back to the menu, not on Close), so every
// answer start, including a replay of the same answer in a later session, gets a fresh clock, media mode and director run.
export type PresenterState =
  | { phase: "closed"; run: number }
  | { phase: "idle_open"; run: number }
  | { phase: "playing_answer" | "stopped" | "completed"; answerId: PresenterAnswerId; run: number };

export type PresenterEvent =
  // Opens the question menu; from a running tour it is the way back to the questions.
  | { type: "open" }
  | { type: "close" }
  | { type: "select"; answerId: PresenterAnswerId }
  | { type: "stop" }
  | { type: "replay" }
  | { type: "ended" }
  // The tab was hidden mid-answer.
  | { type: "interrupt" };

export const initialPresenterState: PresenterState = { phase: "closed", run: 0 };

export function presenterReducer(state: PresenterState, event: PresenterEvent): PresenterState {
  switch (event.type) {
    case "open":
      if (state.phase === "idle_open") return state;
      return { phase: "idle_open", run: state.run };
    case "close":
      return state.phase === "closed" ? state : { phase: "closed", run: state.run };
    case "select":
      if (state.phase === "closed") return state;
      if (state.phase === "playing_answer" && state.answerId === event.answerId) return state;
      return { phase: "playing_answer", answerId: event.answerId, run: state.run + 1 };
    case "stop":
    case "interrupt":
      return state.phase === "playing_answer" ? { ...state, phase: "stopped" } : state;
    case "replay":
      return state.phase === "stopped" || state.phase === "completed"
        ? { phase: "playing_answer", answerId: state.answerId, run: state.run + 1 }
        : state;
    case "ended":
      return state.phase === "playing_answer" ? { ...state, phase: "completed" } : state;
  }
}
