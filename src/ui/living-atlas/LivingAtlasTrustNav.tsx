import { Link } from "react-router-dom";

import { livingAtlasRoutes, type LivingAtlasRouteId } from "./livingAtlasRelease";

type LivingAtlasTrustNavProps = {
  current?: LivingAtlasRouteId;
  label?: string;
  className?: string;
};

const trustLinks: { id: LivingAtlasRouteId; label: string }[] = [
  { id: "product", label: "Living Atlas" },
  { id: "privacy", label: "Privacy" },
  { id: "support", label: "Support" },
  { id: "studio", label: "Brenych Studio" },
];

export default function LivingAtlasTrustNav({
  current,
  label = "Living Atlas",
  className = "",
}: LivingAtlasTrustNavProps) {
  return (
    <nav
      aria-label={label}
      className={["flex flex-wrap items-center gap-2", className].filter(Boolean).join(" ")}
    >
      {trustLinks
        .filter((link) => link.id !== current)
        .map((link) => (
          <Link
            key={link.id}
            to={livingAtlasRoutes[link.id]}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-neutral-950/14 bg-white/60 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-700 backdrop-blur transition hover:border-neutral-950/40 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          >
            <span>{link.label}</span>
            <span aria-hidden="true" className="text-neutral-400">
              -&gt;
            </span>
          </Link>
        ))}
    </nav>
  );
}
