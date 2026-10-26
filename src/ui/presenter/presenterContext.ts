import { createContext, useContext } from "react";
import type { PublicLocale } from "../../data/projectRegistry.types";
import type { PresenterAnswerId, PresenterCopy } from "./presenterContent";
import type { PresenterState } from "./presenterMachine";

export type PresenterApi = {
  state: PresenterState;
  locale: PublicLocale;
  copy: PresenterCopy;
  // Opens the question menu (and ends a running tour without moving the page).
  open: () => void;
  close: (restoreFocus?: boolean) => void;
  select: (answerId: PresenterAnswerId) => void;
  // The HOME trigger, so focus can return to it when the presenter closes.
  registerTrigger: (element: HTMLButtonElement | null) => void;
  // The HOME stage plate: the dock grows out of it when an answer starts.
  registerStagePlate: (element: HTMLElement | null) => void;
  // Moves the pre-recorded idle/answer media into a plate; returns the matching detach.
  mountMedia: (host: HTMLElement) => () => void;
  // The visitor showed interest (hover, focus, open): the idle loop may load now, never before.
  engage: () => void;
};

export const PresenterContext = createContext<PresenterApi | null>(null);

export function usePresenter() {
  const api = useContext(PresenterContext);
  if (!api) throw new Error("usePresenter must be used inside StudioPresenterProvider");
  return api;
}
