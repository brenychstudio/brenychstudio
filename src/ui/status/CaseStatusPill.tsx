import type { CaseStatusKind } from "./status.types";

type PillTone = "light" | "dark";

type CaseStatusPillProps = {
  kind: CaseStatusKind;
  label?: string;
  tone?: PillTone;
  className?: string;
};

const defaultLabelMap: Record<CaseStatusKind, string> = {
  shipped: "Shipped",
  preview: "Preview",
  in_progress: "In progress",
  rnd: "R&D",
};

const lightToneMap: Record<CaseStatusKind, string> = {
  shipped:
    "border border-black/[0.055] bg-[#f6f6f7] text-neutral-700",
  preview:
    "border border-black/[0.055] bg-[#f5f5f6] text-neutral-700",
  in_progress:
    "border border-black/[0.06] bg-[#f3f4f6] text-neutral-800",
  rnd:
    "border border-black/[0.05] bg-[#f7f7f8] text-neutral-600",
};

const darkToneMap: Record<CaseStatusKind, string> = {
  shipped:
    "border border-white/16 bg-white/8 text-white/82",
  preview:
    "border border-white/16 bg-white/8 text-white/82",
  in_progress:
    "border border-white/18 bg-white/10 text-white/90",
  rnd:
    "border border-white/14 bg-white/6 text-white/70",
};

export default function CaseStatusPill({
  kind,
  label,
  tone = "light",
  className = "",
}: CaseStatusPillProps) {
  const styles = tone === "dark" ? darkToneMap[kind] : lightToneMap[kind];

  return (
    <span
      className={[
        "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]",
        styles,
        className,
      ].join(" ")}
    >
      {label ?? defaultLabelMap[kind]}
    </span>
  );
}
