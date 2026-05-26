import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { mobileMotionObserver } from "./motionTokens";
import { useMobileMotion } from "./useMobileMotion";

type MobileMotionTag = "div" | "figure" | "article";
type MobileMotionDelay = "none" | "soft" | "staged";

type MobileMotionMediaProps = HTMLAttributes<HTMLElement> & {
  as?: MobileMotionTag;
  children: ReactNode;
  delay?: MobileMotionDelay;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileMotionMedia({ as = "div", children, className, delay = "soft", ...props }: MobileMotionMediaProps) {
  const { active, hasEntered, inView, motionEnabled, ref } = useMobileMotion({
    rootMargin: mobileMotionObserver.media.rootMargin,
    threshold: mobileMotionObserver.media.threshold,
  });

  return createElement(
    as,
    {
      ...props,
      ref,
      className: cx("mobile-motion-media", className),
      "data-motion-active": active ? "true" : "false",
      "data-motion-delay": delay,
      "data-motion-entered": hasEntered ? "true" : "false",
      "data-motion-in-view": inView ? "true" : "false",
      "data-motion-ready": motionEnabled ? "true" : "false",
    },
    children,
  );
}
