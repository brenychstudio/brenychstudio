import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "../store/useLocale";

type Props = {
  open: boolean;
  onClose: () => void;
};

const overlayAnimate = {
  opacity: 1,
  backgroundColor: "rgba(246,246,246,0.40)",
};

type ProjectTypeValue =
  | "premiumWebsite"
  | "interactivePresentation"
  | "broaderSystemBuild"
  | "signatureBespoke"
  | "other";

type BudgetValue = "1-2k" | "2-5k" | "5-8k" | "8k-plus";

type TimelineValue = "asap" | "2-4-weeks" | "1-2-months" | "flexible";

export default function ProjectDrawer({ open, onClose }: Props) {
  const { t } = useLocale();
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const email = "info@brenych.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "premiumWebsite" as ProjectTypeValue,
    budget: "2-5k" as BudgetValue,
    timeline: "2-4-weeks" as TimelineValue,
    links: "",
    message: "",
  });

  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const projectTypeLabel =
    t.drawer.inquiry.options.projectType.find((option) => option.value === form.type)?.label ??
    form.type;

  const budgetLabel =
    t.drawer.inquiry.options.budget.find((option) => option.value === form.budget)?.label ??
    form.budget;

  const timelineLabel =
    t.drawer.inquiry.options.timeline.find((option) => option.value === form.timeline)?.label ??
    form.timeline;

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  const mailtoHref = useMemo(() => {
    const subjectBase = t.drawer.mail.subjectBase;
    const subject = form.name ? `${subjectBase} — ${form.name}` : subjectBase;
    const empty = t.drawer.mail.empty;
    const labels = t.drawer.mail.labels;

    const bodyLines = [
      `${labels.name}: ${form.name || empty}`,
      `${labels.email}: ${form.email || empty}`,
      `${labels.projectType}: ${projectTypeLabel || empty}`,
      `${labels.budget}: ${budgetLabel || empty}`,
      `${labels.timeline}: ${timelineLabel || empty}`,
      `${labels.links}: ${form.links || empty}`,
      "",
      `${labels.message}:`,
      form.message || empty,
      "",
      "—",
      t.drawer.mail.sentFrom,
    ];

    const body = bodyLines.join("\n");

    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [
    budgetLabel,
    email,
    form.email,
    form.links,
    form.message,
    form.name,
    projectTypeLabel,
    t,
    timelineLabel,
  ]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function copyEmail() {
    try {
      await navigator.clipboard?.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(false);
    setSending(true);

    window.setTimeout(() => {
      window.location.href = mailtoHref;
      setSending(false);
      setSent(true);
    }, 220);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="drawer"
          className="fixed inset-0 z-[90] bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(244,244,244,0.32)_100%)] backdrop-blur-[12px]"
          initial={{ opacity: 0, backgroundColor: "rgba(248,248,248,0.0)" }}
          animate={{
            ...overlayAnimate,
            transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
          }}
          exit={{
            opacity: 0,
            backgroundColor: "rgba(248,248,248,0.0)",
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
          }}
          onClick={onClose}
        >
          <div className="absolute inset-0 flex justify-end pointer-events-none">
            <motion.aside
              className="pointer-events-auto relative right-0 top-0 h-full w-full overflow-hidden border-l border-neutral-200/70 bg-white/84 shadow-[0_20px_54px_rgba(0,0,0,0.08)] backdrop-blur-[18px] sm:w-[min(92vw,520px)] sm:rounded-l-[22px] sm:bg-white/78"
              initial={{ x: 18, opacity: 1 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }}
              exit={{
                x: 18,
                opacity: 1,
                transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.18)_22%,rgba(248,248,248,0.08)_100%)]" />
                <div className="absolute inset-y-0 left-0 w-px bg-white/55" />
                <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_100%)]" />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27 opacity=%270.35%27/%3E%3C/svg%3E")',
                }}
              />

              <div className="flex h-full flex-col">
                <div className="shrink-0 flex flex-col gap-3.5 border-b border-neutral-100/90 px-4 pb-4 pt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-5 sm:px-5 sm:pb-5 sm:pt-6 md:px-6">
                  <div>
                    <div className="text-[11px] tracking-[0.28em] uppercase text-neutral-500">
                      {t.drawer.title}
                    </div>
                    <div className="mt-2 max-w-[47ch] text-[13px] leading-6 text-neutral-600 sm:text-[14px]">
                      {t.drawer.description}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 self-start rounded-full border border-neutral-200/80 bg-white/56 px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-neutral-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-400 hover:bg-white/72 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2"
                  >
                    {t.drawer.close}
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="grid gap-8 px-4 py-5 sm:px-5 sm:py-6 md:gap-9 md:px-6 md:py-7">
                    <section className="grid gap-4">
                      <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                        {t.drawer.packagesLabel}
                      </div>

                      {t.drawer.packages.map((pkg) => (
                        <div
                          key={pkg.name}
                          className="rounded-[22px] border border-neutral-100 bg-white/68 p-4 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-200 hover:bg-white/76 sm:p-5"
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                              {pkg.name}
                            </div>

                            <span className="inline-flex items-center rounded-full border border-neutral-200/80 bg-white/64 px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-neutral-700">
                              {pkg.price}
                            </span>
                          </div>

                          <ul className="mt-3 grid gap-1.5 text-[14px] leading-7 text-neutral-700">
                            {pkg.features.map((feature) => (
                              <li key={feature}>— {feature}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </section>

                    <section className="grid gap-4 rounded-[26px] border border-neutral-100 bg-neutral-50/56 p-4 sm:p-5">
                      <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                        {t.drawer.faqLabel}
                      </div>

                      <div className="overflow-hidden rounded-[20px] border border-neutral-100 bg-white/58">
                        {t.drawer.faq.map((item, i) => {
                          const isOpen = faqOpen === i;

                          return (
                            <div key={item.question} className="border-t border-neutral-100 first:border-t-0">
                              <button
                                type="button"
                                onClick={() => setFaqOpen(isOpen ? null : i)}
                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/30 focus:outline-none focus-visible:bg-white/40"
                              >
                                <div className="text-[14px] leading-6 text-neutral-900">{item.question}</div>
                                <span
                                  className={[
                                    "shrink-0 text-[18px] leading-none text-neutral-400 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                    isOpen ? "rotate-45" : "rotate-0",
                                  ].join(" ")}
                                  aria-hidden
                                >
                                  +
                                </span>
                              </button>

                              {isOpen ? (
                                <div className="max-w-[50ch] px-5 pb-5 text-[14px] leading-7 text-neutral-700">
                                  {item.answer}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-0.5 text-[10px] tracking-[0.24em] uppercase text-neutral-400">
                        {t.drawer.faqTip}
                      </div>
                    </section>

                    <section className="grid gap-5 rounded-[26px] border border-neutral-100 bg-neutral-50/62 p-4 sm:p-5">
                      <div className="flex flex-col items-start gap-2 border-b border-neutral-100 pb-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                        <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                          {t.drawer.inquiry.label}
                        </div>
                        <div className="text-[10px] tracking-[0.22em] uppercase text-neutral-400">
                          {t.drawer.inquiry.responseTime}
                        </div>
                      </div>

                      <form onSubmit={onSubmit} className="grid gap-5">
                        <div className="grid gap-3.5 sm:gap-4">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
                            <div className="grid gap-1.5">
                              <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                                {t.drawer.inquiry.fields.name}
                              </div>
                              <input
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder={t.drawer.inquiry.placeholders.name}
                                className="w-full rounded-[18px] border border-neutral-200/90 bg-white/82 px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
                              />
                            </div>

                            <div className="grid gap-1.5">
                              <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                                {t.drawer.inquiry.fields.email}
                              </div>
                              <input
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                placeholder={t.drawer.inquiry.placeholders.email}
                                type="email"
                                required
                                className="w-full rounded-[18px] border border-neutral-200/90 bg-white/82 px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
                            <div className="grid gap-1.5">
                              <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                                {t.drawer.inquiry.fields.projectType}
                              </div>
                              <select
                                value={form.type}
                                onChange={(e) => updateField("type", e.target.value as ProjectTypeValue)}
                                className="w-full rounded-[18px] border border-neutral-200/90 bg-white/82 px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
                              >
                                {t.drawer.inquiry.options.projectType.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid gap-1.5">
                              <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                                {t.drawer.inquiry.fields.budget}
                              </div>
                              <select
                                value={form.budget}
                                onChange={(e) => updateField("budget", e.target.value as BudgetValue)}
                                className="w-full rounded-[18px] border border-neutral-200/90 bg-white/82 px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
                              >
                                {t.drawer.inquiry.options.budget.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
                            <div className="grid gap-1.5">
                              <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                                {t.drawer.inquiry.fields.timeline}
                              </div>
                              <select
                                value={form.timeline}
                                onChange={(e) => updateField("timeline", e.target.value as TimelineValue)}
                                className="w-full rounded-[18px] border border-neutral-200/90 bg-white/82 px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
                              >
                                {t.drawer.inquiry.options.timeline.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid gap-1.5">
                              <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                                {t.drawer.inquiry.fields.links}
                              </div>
                              <input
                                value={form.links}
                                onChange={(e) => updateField("links", e.target.value)}
                                placeholder={t.drawer.inquiry.placeholders.links}
                                className="w-full rounded-[18px] border border-neutral-200/90 bg-white/82 px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
                              />
                            </div>
                          </div>

                          <div className="grid gap-1.5">
                            <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                              {t.drawer.inquiry.fields.message}
                            </div>
                            <textarea
                              value={form.message}
                              onChange={(e) => updateField("message", e.target.value)}
                              placeholder={t.drawer.inquiry.placeholders.message}
                              rows={5}
                              required
                              className="min-h-[132px] w-full rounded-[18px] border border-neutral-200/90 bg-white/82 px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:bg-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-200"
                            />
                          </div>
                        </div>

                        <div className="rounded-[22px] border border-neutral-200/90 bg-white/70 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:p-5">
                          <div className="text-[10px] tracking-[0.24em] uppercase text-neutral-500">
                            {t.drawer.directEmail.label}
                          </div>
                          <div className="mt-2 text-[15px] text-neutral-900">{email}</div>
                          <div className="mt-1 text-[12px] text-neutral-500">{t.drawer.directEmail.hint}</div>

                          <div className="mt-4 flex flex-wrap gap-2.5">
                            <button
                              type="submit"
                              disabled={sending}
                              className={[
                                "inline-flex items-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2.5",
                                "text-[12px] tracking-[0.01em] text-white transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[13px]",
                                "hover:translate-y-[-1px] hover:bg-neutral-800 hover:border-neutral-800",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
                                "active:scale-[0.995]",
                                "disabled:cursor-not-allowed disabled:opacity-60",
                              ].join(" ")}
                            >
                              {sending ? t.drawer.directEmail.preparing : t.drawer.directEmail.send}
                              <span className="text-white/70">→</span>
                            </button>

                            <button
                              type="button"
                              onClick={copyEmail}
                              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/56 px-4 py-2 text-[12px] tracking-[0.01em] text-neutral-800 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-400 hover:bg-white/72 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 sm:text-[13px]"
                            >
                              {copied ? t.drawer.directEmail.copied : t.drawer.directEmail.copy}
                            </button>

                            <a
                              href={mailtoHref}
                              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/56 px-4 py-2 text-[12px] tracking-[0.01em] text-neutral-800 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-y-[-1px] hover:border-neutral-400 hover:bg-white/72 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 sm:text-[13px]"
                            >
                              {t.drawer.directEmail.open} <span className="text-neutral-400">↗</span>
                            </a>
                          </div>

                          {sent ? (
                            <div className="mt-3 text-[12px] leading-6 text-neutral-500">
                              {t.drawer.directEmail.draftReady}
                            </div>
                          ) : (
                            <div className="mt-3 text-[12px] leading-6 text-neutral-500">
                              {t.drawer.directEmail.responseNote}
                            </div>
                          )}
                        </div>
                      </form>
                    </section>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
