import "./brandMonogram.css";

type BrandMonogramProps = {
  className?: string;
};

/** The studio's B monogram: public/brand/brenych-monogram.png, a raster verified against the owner's original mark, used
 *  as an alpha mask and filled with currentColor, so it takes the ink of wherever it sits. The host sets its height; the
 *  width follows the mark. Decorative: it always sits next to the live BRENYCH STUDIO text, so it is hidden from assistive
 *  tech and is never a target. */
export default function BrandMonogram({ className }: BrandMonogramProps) {
  return <span className={className ? `brand-monogram ${className}` : "brand-monogram"} aria-hidden="true" />;
}
