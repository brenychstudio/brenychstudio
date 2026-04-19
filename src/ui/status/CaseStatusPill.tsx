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
    "border border-black/[0.05] bg-white/88 text-neutral-600",
  preview:
    "border border-black/[0.05] bg-[#f7f7f8] text-neutral-600",
  in_progress:
    "border border-black/[0.055] bg-[#f4f5f7] text-neutral-700",
  rnd:
    "border border-black/[0.045] bg-[#fafafb] text-neutral-500",
};

const darkToneMap: Record<CaseStatusKind, string> = {
  shipped:
    "border border-white/14 bg-white/[0.07] text-white/78",
  preview:
    "border border-white/14 bg-white/[0.07] text-white/78",
  in_progress:
    "border border-white/16 bg-white/[0.09] text-white/86",
  rnd:
    "border border-white/12 bg-white/[0.05] text-white/66",
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
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-[5px] text-[10px] uppercase tracking-[0.12em]",
        styles,
        className,
      ].join(" ")}
    >
      {label ?? defaultLabelMap[kind]}
    </span>
  );
}
