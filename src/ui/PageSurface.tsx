import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function PageSurface({ children, className = "" }: Props) {
  return (
    <div className={["mobile-interface-surface", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
