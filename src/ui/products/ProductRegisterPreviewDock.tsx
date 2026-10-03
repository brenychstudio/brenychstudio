import { AnimatePresence, motion } from "framer-motion";
import PortfolioImage from "../media/PortfolioImage";
import { useMobileMotion } from "../mobile-motion/useMobileMotion";
import type { ProductIndexItem } from "./productIndexModel";

/** Still-only, fixed geometry: preview transitions never take space from the ledger. */
export default function ProductRegisterPreviewDock({ item, es }: { item?: ProductIndexItem; es: boolean }) {
  const { reducedMotion } = useMobileMotion({ enabled: false });
  return <aside className="product-register-preview-dock" aria-label={es ? "Vista previa del producto" : "Product preview"}>
    <p className="product-system-micro">{es ? "Superficie / Vista previa" : "Surface / Preview"}<span aria-hidden="true">↗</span></p>
    <div className="product-register-preview-stage">
      <AnimatePresence initial={false}>
        {item ? <motion.figure key={item.project.id} data-preview-product={item.project.id}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
          transition={{ duration: reducedMotion ? 0 : .26, ease: [.22, .8, .22, 1] }}>
          {item.presentation.poster ? <PortfolioImage src={item.presentation.poster.src} alt={item.presentation.poster.alt} sizes="(min-width: 1600px) 390px, 30vw" containerClassName="product-register-dock-poster" imageClassName="product-system-poster-bitmap" /> : <div className="product-register-dock-poster" />}
          <figcaption>{item.project.publicName}<span className="product-system-micro">{item.presentation.stateLabel}</span></figcaption>
        </motion.figure> : null}
      </AnimatePresence>
    </div>
  </aside>;
}
