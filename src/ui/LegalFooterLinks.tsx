import { Link } from "react-router-dom";

type LegalPath = "/privacy" | "/legal";

type LegalFooterLinksProps = {
  className?: string;
  onNavigate?: (to: LegalPath) => void;
};

const legalLinks: { label: string; to: LegalPath }[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Legal", to: "/legal" },
];

export default function LegalFooterLinks({
  className = "",
  onNavigate,
}: LegalFooterLinksProps) {
  return (
    <nav
      aria-label="Legal"
      className={[
        "relative z-20 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-neutral-400",
        className,
      ].join(" ")}
    >
      {legalLinks.map((item) =>
        onNavigate ? (
          <button
            key={item.to}
            type="button"
            onClick={() => onNavigate(item.to)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-2 transition hover:border-neutral-400 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            {item.label}
          </button>
        ) : (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full border border-neutral-200 bg-white px-3 py-2 transition hover:border-neutral-400 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
