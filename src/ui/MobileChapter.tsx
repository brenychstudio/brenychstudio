import type { ReactNode } from "react";

type Props = {
  label: string;
  heading: string;
  summary?: string;
  children?: ReactNode;
  detail?: ReactNode;
  className?: string;
};

export default function MobileChapter({
  label,
  heading,
  summary,
  children,
  detail,
  className = "",
}: Props) {
  return (
    <section
      className={[
        "mobile-chapter grid min-w-0 gap-5 px-4 py-12 sm:px-6 lg:px-0 lg:py-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <div className="mobile-chapter__label text-neutral-500">{label}</div>
        <h2 className="mobile-chapter__heading mt-3 text-neutral-950">{heading}</h2>
        {summary ? (
          <p className="mobile-chapter__summary mt-4 text-neutral-600">{summary}</p>
        ) : null}
      </div>

      {children ? <div className="min-w-0">{children}</div> : null}

      {detail ? (
        <details className="group border-y border-neutral-950/12 py-3">
          <summary className="cursor-pointer list-none text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
            More detail
          </summary>
          <div className="mt-4 text-[14px] leading-7 text-neutral-600">{detail}</div>
        </details>
      ) : null}
    </section>
  );
}
