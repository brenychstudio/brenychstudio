import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { mobileMotionObserver, type MobileMotionSignature } from "./motionTokens";
import { useMobileMotion } from "./useMobileMotion";

type MobileMotionTag = "div" | "ul" | "ol";
type MobileMotionRowTag = "div" | "li" | "article";

type MobileMotionLedgerProps = HTMLAttributes<HTMLElement> & {
  as?: MobileMotionTag;
  children: ReactNode;
  signature?: MobileMotionSignature;
};

type MobileMotionLedgerRowProps = HTMLAttributes<HTMLElement> & {
  as?: MobileMotionRowTag;
  children: ReactNode;
  signature?: MobileMotionSignature;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileMotionLedger({
  as = "div",
  children,
  className,
  signature,
  ...props
}: MobileMotionLedgerProps) {
  return createElement(
    as,
    {
      ...props,
      className: cx("mobile-motion-ledger", className),
      "data-motion-signature": signature,
    },
    children,
  );
}

export function MobileMotionLedgerRow({
  as = "div",
  children,
  className,
  signature,
  ...props
}: MobileMotionLedgerRowProps) {
  const { active, hasEntered, inView, motionEnabled, ref } = useMobileMotion({
    once: false,
    rootMargin: mobileMotionObserver.ledger.rootMargin,
    threshold: mobileMotionObserver.ledger.threshold,
  });

  return createElement(
    as,
    {
      ...props,
      ref,
      className: cx("mobile-motion-ledger-row", className),
      "data-motion-active": active ? "true" : "false",
      "data-motion-entered": hasEntered ? "true" : "false",
      "data-motion-in-view": inView ? "true" : "false",
      "data-motion-ready": motionEnabled ? "true" : "false",
      "data-motion-signature": signature,
    },
    children,
  );
}
