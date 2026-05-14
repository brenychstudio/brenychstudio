import type { CSSProperties } from "react";

import "../../styles/atmosphere.css";
import { atmospherePresets, type AtmospherePreset } from "./atmospherePresets";

type AtmosphericSiteShellProps = {
  preset?: AtmospherePreset;
  className?: string;
};

export default function AtmosphericSiteShell({
  preset = "living",
  className = "",
}: AtmosphericSiteShellProps) {
  const config = atmospherePresets[preset];
  const style = {
    "--atmosphere-base": config.base,
    "--atmosphere-wash-a": config.washA,
    "--atmosphere-wash-b": config.washB,
    "--atmosphere-wash-c": config.washC,
    "--atmosphere-grid-opacity": config.gridOpacity,
    "--atmosphere-grid-size": `${config.gridSize}px`,
    "--atmosphere-line-opacity": config.lineOpacity,
    "--atmosphere-ring-opacity": config.ringOpacity,
    "--atmosphere-noise-opacity": config.noiseOpacity,
    "--atmosphere-line-speed": `${config.lineSpeed}s`,
  } as CSSProperties;

  return (
    <div
      className={`atmospheric-site-shell pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div className="atmospheric-site-shell__wash" />
      <div className="atmospheric-site-shell__grid" />
      <div className="atmospheric-site-shell__noise" />
      <div className="atmospheric-site-shell__ring" />
      <div className="atmospheric-site-shell__ring atmospheric-site-shell__ring--secondary" />
      <div className="atmospheric-site-shell__line" />
      <div className="atmospheric-site-shell__line atmospheric-site-shell__line--secondary" />
      <div className="atmospheric-site-shell__bottom-fade" />
    </div>
  );
}
