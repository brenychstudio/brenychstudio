import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function PageSurface({ children, className = "" }: Props) {
  return <div className={className}>{children}</div>;
}
