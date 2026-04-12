import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

type Props = {
  children: ReactNode;
  className?: string;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PageSurface({ children, className = "" }: Props) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={location.pathname}
      className={["transform-gpu will-change-transform", className].filter(Boolean).join(" ")}
      initial={{ opacity: 0, y: 10, scale: 0.998, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  );
}
