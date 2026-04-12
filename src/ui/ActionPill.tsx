import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  suffix?: ReactNode;
};

export default function ActionPill({ children, suffix, className = "", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-[44px] min-w-[11rem] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white",
        "px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:border-neutral-400 hover:text-neutral-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
        "hover:translate-y-[-1px] active:translate-y-0 active:scale-[0.995]",
        "sm:px-5",
        className,
      ].join(" ")}
      {...props}
    >
      <span>{children}</span>
      {suffix ? <span aria-hidden="true" className="text-neutral-400">{suffix}</span> : null}
    </button>
  );
}
