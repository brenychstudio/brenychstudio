import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { mobileMotionObserver } from "./motionTokens";
import { useMobileMotion } from "./useMobileMotion";

type MobileMotionTag = "div" | "section" | "article" | "aside" | "header" | "footer" | "main";
type MobileMotionVariant = "threshold" | "ledger" | "media" | "dark" | "closing" | "default";
type MobileMotionDelay = "none" | "soft" | "staged";

type MobileMotionSectionProps = HTMLAttributes<HTMLElement> & {
  as?: MobileMotionTag;
  children: ReactNode;
  delay?: MobileMotionDelay;
  index?: number;
  variant?: MobileMotionVariant;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileMotionSection({
  as = "div",
  children,
  className,
  delay = "none",
  index,
  variant = "default",
  ...props
}: MobileMotionSectionProps) {
  const observer = variant === "media" ? mobileMotionObserver.media : mobileMotionObserver.section;
  const { active, hasEntered, inView, motionEnabled, ref } = useMobileMotion({
    enabled: variant !== "threshold",
    rootMargin: observer.rootMargin,
    threshold: observer.threshold,
  });

  return createElement(
    as,
    {
      ...props,
      ref,
      className: cx("mobile-motion-section", className),
      "data-motion-active": active ? "true" : "false",
      "data-motion-delay": delay,
      "data-motion-entered": hasEntered ? "true" : "false",
      "data-motion-in-view": inView ? "true" : "false",
      "data-motion-index": index,
      "data-motion-ready": motionEnabled ? "true" : "false",
      "data-motion-variant": variant,
    },
    children,
  );
}
