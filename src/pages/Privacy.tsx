import Container from "../ui/Container";
import Header from "../ui/Header";
import LegalFooterLinks from "../ui/LegalFooterLinks";
import PageSurface from "../ui/PageSurface";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

const sections = [
  {
    title: "Who is responsible for this site",
    body: [
      "This website is operated by Rostyslav Brenych / Brenychstudio.",
      "For privacy-related questions or requests, you can contact us at: info@brenych.com.",
    ],
  },
  {
    title: "What information we collect",
    body: [
      "We may collect personal information that you choose to share with us, including your name, email address, project brief, message content, and any other information you voluntarily include when contacting us.",
      "We may also receive limited technical information that is routinely processed through website hosting, security, or email delivery systems, such as server logs, device/browser information, IP address, and basic request metadata.",
    ],
  },
  {
    title: "How we collect information",
    body: [
      "We collect information when you contact us through an inquiry drawer, contact form, project form, direct email link, or other communication channel connected to this website.",
      "We may also process limited technical information when the website is loaded, delivered, secured, or maintained.",
    ],
  },
  {
    title: "Why we use your information",
    body: [
      "We use personal information only where it is relevant to running this website and responding to genuine communication.",
    ],
    bullets: [
      "replying to your message or project inquiry",
      "discussing a potential project or collaboration",
      "maintaining communication related to a request you initiated",
      "protecting the website from misuse and maintaining technical reliability",
      "keeping basic records needed for administration, professional follow-up, legal, or accounting reasons where applicable",
    ],
    after: ["We do not sell your personal information."],
  },
  {
    title: "Legal basis",
    body: [
      "Where privacy laws require a legal basis for processing, we rely on one or more of the following, as applicable:",
    ],
    bullets: [
      "your request for us to respond to your inquiry",
      "our legitimate interest in operating, securing, and improving the website and managing professional communication",
      "compliance with legal obligations where required",
    ],
  },
  {
    title: "How long we keep information",
    body: [
      "We keep personal information only for as long as reasonably necessary for the purpose for which it was provided, including responding to your inquiry, continuing relevant communication, or maintaining records needed for administrative, legal, accounting, or professional follow-up.",
      "If information is no longer needed, we aim to delete or minimize it within a reasonable period unless we are required to keep it for legal, security, or accounting reasons.",
    ],
  },
  {
    title: "Who we share information with",
    body: [
      "We do not share personal information for advertising or resale purposes.",
      "We may share limited information with service providers only where necessary to operate the website or handle communication, such as website hosting providers, email providers, form delivery providers, infrastructure providers, or security services.",
      "These providers only receive what is reasonably necessary for the relevant service.",
    ],
  },
  {
    title: "International processing",
    body: [
      "Because website infrastructure, hosting, repository, deployment, or email services may operate in different countries, your information may be processed outside your place of residence.",
      "Where this happens, we aim to use services that provide an appropriate level of protection for personal information.",
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "This website is currently intended to operate without analytics, advertising pixels, behavioral tracking, embedded third-party media, or non-essential cookies.",
      "If this changes in the future, this page will be updated and, where required, an appropriate cookie notice or consent mechanism will be added.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Depending on the law that applies to you, you may have the right to request access, correction, deletion, restriction, objection, portability, or withdrawal of consent where processing is based on consent.",
      "You may also have the right to lodge a complaint with your local data protection authority.",
      "To make a privacy request, contact: info@brenych.com.",
    ],
  },
  {
    title: "Data security",
    body: [
      "We take reasonable technical and organizational measures to protect personal information against unauthorized access, loss, misuse, or disclosure.",
      "However, no online system can guarantee absolute security.",
    ],
  },
  {
    title: "External links",
    body: [
      "This website may include links to third-party websites, public repositories, project demos, social profiles, or external resources.",
      "We are not responsible for the content, privacy practices, or policies of those external sites.",
    ],
  },
  {
    title: "Updates to this Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in the website, our practices, or applicable requirements.",
      "The latest version will always be published on this page.",
    ],
  },
] as const;

function LegalSection({
  title,
  body,
  bullets,
  after,
}: {
  title: string;
  body?: readonly string[];
  bullets?: readonly string[];
  after?: readonly string[];
}) {
  return (
    <section className="border-t border-neutral-100 py-7 md:py-9">
      <div className="grid gap-4 md:grid-cols-[0.34fr_0.66fr] md:gap-10">
        <h2 className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          {title}
        </h2>
        <div className="space-y-4 text-[14px] leading-7 text-neutral-600 md:text-[15px] md:leading-8">
          {body?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {bullets?.length ? (
            <ul className="list-disc space-y-2 pl-5">
              {bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {after?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Privacy({
  drawerOpen = false,
  onOpenProject,
  onCloseProject,
}: PageProps) {
  return (
    <div className="min-h-screen overflow-x-clip bg-white text-neutral-900">
      <Header
        drawerOpen={drawerOpen}
        onOpenProject={onOpenProject}
        onCloseProject={onCloseProject}
      />

      <main className="pb-20 pt-24 md:pb-24 md:pt-28">
        <PageSurface>
          <Container>
            <section className="border-b border-neutral-100 pb-10 md:pb-14">
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                Legal layer
              </div>
              <h1 className="mt-5 max-w-[12ch] text-[42px] leading-[0.95] tracking-[-0.05em] text-neutral-950 sm:text-[58px] md:text-[74px]">
                Privacy Policy.
              </h1>
              <p className="mt-6 max-w-[68ch] text-[14px] leading-7 text-neutral-600 md:text-[15px] md:leading-8">
                This Privacy Policy explains how personal information is
                handled when you visit brenychstudio.com, browse selected work,
                download public materials, or contact us about a potential
                project.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                <span className="rounded-full border border-neutral-200 px-3 py-2">
                  Effective date: 26 April 2026
                </span>
                <span className="rounded-full border border-neutral-200 px-3 py-2">
                  Contact: info@brenych.com
                </span>
              </div>
            </section>

            {sections.map((section) => (
              <LegalSection key={section.title} {...section} />
            ))}

            <section className="border-t border-neutral-100 pt-8">
              <LegalFooterLinks />
            </section>
          </Container>
        </PageSurface>
      </main>
    </div>
  );
}
