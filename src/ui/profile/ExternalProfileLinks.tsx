export const externalProfiles = [
  {
    label: "Brenych.com",
    href: "https://brenych.com",
    meta: "Studio hub",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brenych/",
    meta: "Professional profile",
  },
  {
    label: "GitHub",
    href: "https://github.com/brenychstudio",
    meta: "Code archive",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/koolberk/",
    meta: "Visual stream",
  },
] as const;

type Props = {
  label: string;
  title?: string;
  description?: string;
  variant?: "cards" | "compact";
};

export default function ExternalProfileLinks({
  label,
  title,
  description,
  variant = "cards",
}: Props) {
  if (variant === "compact") {
    return (
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          {label}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {externalProfiles.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-400 hover:text-neutral-900"
            >
              {item.label} <span className="ml-2 text-neutral-400">↗</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="grid gap-8 xl:grid-cols-[minmax(260px,0.34fr)_minmax(0,0.66fr)] xl:items-start xl:gap-14">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
            {label}
          </div>

          {title ? (
            <h2 className="mt-3 max-w-[13ch] text-[24px] leading-[1.06] tracking-tight sm:text-3xl md:text-[34px] xl:max-w-[12ch] xl:text-[38px]">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-4 max-w-[52ch] text-[14px] leading-[1.8] text-neutral-600 sm:text-[15px] md:text-[16px]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {externalProfiles.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[22px] border border-neutral-100 bg-white/82 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.025)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:border-neutral-300 hover:shadow-[0_18px_34px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    {item.label}
                  </div>
                  <div className="mt-2 text-sm text-neutral-900">{item.meta}</div>
                </div>

                <span className="text-neutral-400 transition duration-300 group-hover:text-neutral-700">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
