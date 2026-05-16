import type { ReactNode } from "react";

type PolicySectionProps = {
  index: string;
  title: string;
  children: ReactNode;
};

export default function PolicySection({ index, title, children }: PolicySectionProps) {
  return (
    <section className="border-t border-neutral-950/10 py-7 sm:py-8 lg:py-9">
      <div className="grid gap-4 md:grid-cols-[4.5rem_minmax(10rem,0.28fr)_1fr] md:gap-6 lg:gap-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-300">{index}</div>
        <h2 className="text-[17px] font-normal uppercase leading-6 tracking-[0.09em] text-neutral-950 md:text-[18px]">
          {title}
        </h2>
        <div className="max-w-[68ch] space-y-4 text-[15px] leading-7 text-neutral-600 sm:text-[16px] sm:leading-8">
          {children}
        </div>
      </div>
    </section>
  );
}
