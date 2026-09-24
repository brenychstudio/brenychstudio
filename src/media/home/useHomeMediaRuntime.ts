import { createContext, useContext } from "react";
import type { HomeMediaMode } from "./homeMediaPolicy";

export type HomeMediaObservation = {
  isWarm: boolean;
  visibleRatio: number;
};

export type HomeMediaListener = (
  state: HomeMediaObservation,
) => void;

export type HomeMediaRuntimeValue = {
  mode: HomeMediaMode;
  pageVisible: boolean;
  observeTarget: (
    element: HTMLElement,
    listener: HomeMediaListener,
  ) => () => void;
};

export const HomeMediaRuntimeContext =
  createContext<HomeMediaRuntimeValue | null>(null);

export function useHomeMediaRuntime(): HomeMediaRuntimeValue {
  const value = useContext(HomeMediaRuntimeContext);

  if (!value) {
    throw new Error(
      "useHomeMediaRuntime must be used inside HomeMediaRuntimeProvider",
    );
  }

  return value;
}
