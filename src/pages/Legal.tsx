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
    title: "Site owner",
    body: [
      "This website is operated by Rostyslav Brenych / Brenychstudio.",
      "Website: https://brenychstudio.com",
      "Contact: info@brenych.com",
    ],
  },
  {
    title: "Purpose of the website",
    body: [
      "This website is a portfolio and studio presentation site. It showcases selected work, case studies, capabilities, services, project materials, and inquiry options.",
      "Nothing on this website should be interpreted as a binding commercial offer, fixed quote, formal engagement, or guaranteed availability unless explicitly confirmed in a separate written agreement.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "Unless otherwise stated, all original content on this website is protected by copyright and other applicable intellectual property rights.",
      "This includes original text, layout, visual design, interface concepts, graphics, motion direction, case presentation systems, curated visual compositions, code written for this website, project descriptions, naming, page structures, and other authored materials created by Rostyslav Brenych / Brenychstudio.",
      "You may not reproduce, republish, distribute, adapt, scrape, copy, imitate, train on, sell, license, commercially exploit, or use any part of this website or its original materials without prior written permission, except where limited personal viewing is naturally required for browsing the website.",
    ],
  },
  {
    title: "Code and public repositories",
    body: [
      "Some projects may link to public repositories or external demos. A public link does not automatically grant unrestricted permission to copy, resell, rebrand, or reuse the work.",
      "Where a repository includes a separate license, that license applies to that repository only. Where no separate license is provided, all rights are reserved unless written permission is granted.",
    ],
  },
  {
    title: "Project and case materials",
    body: [
      "Some project materials shown on this website may include client-facing, exploratory, staged, conceptual, prototype, demo, or presentation-oriented content.",
      "Their inclusion is intended to communicate design, system thinking, visual direction, front-end delivery, and project framing.",
      "Specific outcomes, availability, scope, live status, implementation details, metrics, and commercial results should not be assumed beyond what is explicitly stated.",
    ],
  },
  {
    title: "Website use",
    body: ["You agree not to misuse this website."],
    bullets: [
      "attempting unauthorized access to the website or its infrastructure",
      "interfering with website operation, security, or availability",
      "using automated means to extract content in a harmful, abusive, or commercial way",
      "copying or using site materials in a misleading, unlawful, infringing, or competing manner",
      "misrepresenting authorship, ownership, affiliation, or project involvement",
    ],
  },
  {
    title: "No professional relationship by browsing",
    body: [
      "Browsing this website, reading case studies, downloading public materials, or sending a general inquiry does not by itself create a formal client, contractor, advisor, fiduciary, employment, or professional relationship.",
      "Any project relationship, scope, fees, deliverables, timelines, ownership, licensing, confidentiality, responsibilities, or rights will be defined separately in direct written communication and, where relevant, formal client agreements.",
    ],
  },
  {
    title: "External links",
    body: [
      "This website may contain links to third-party websites, social profiles, repositories, live demos, or external resources.",
      "These links are provided for reference or convenience only. We do not control and are not responsible for the content, availability, security, or practices of external sites.",
    ],
  },
  {
    title: "No warranty",
    body: [
      "We aim to keep this website accurate, current, and functioning well. However, the website and its content are provided on an “as is” and “as available” basis, without warranties of any kind, express or implied, to the fullest extent permitted by applicable law.",
      "We do not guarantee uninterrupted availability, complete accuracy, permanent availability of linked projects, or the absence of errors at all times.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the fullest extent permitted by applicable law, Rostyslav Brenych / Brenychstudio will not be liable for any indirect, incidental, consequential, special, or business loss arising from the use of, or inability to use, this website, its content, downloadable materials, linked demos, repositories, or external links.",
      "Nothing in this notice excludes liability where such exclusion is not permitted by law.",
    ],
  },
  {
    title: "Changes to the website and this notice",
    body: [
      "We may update, suspend, revise, remove, or restructure parts of the website or this Legal Notice at any time without prior notice.",
      "The latest version will always be the one published on this page.",
    ],
  },
  {
    title: "Governing framework",
    body: [
      "This Legal Notice is intended as a general website notice for visitors.",
      "Any project engagement, contract terms, commercial conditions, licensing terms, confidentiality terms, or jurisdiction-specific legal terms will be defined separately in direct written agreements where relevant.",
    ],
  },
] as const;

function LegalSection({
  title,
  body,
  bullets,
}: {
  title: string;
  body?: readonly string[];
  bullets?: readonly string[];
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
        </div>
      </div>
    </section>
  );
}

export default function Legal({
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
                Website use
              </div>
              <h1 className="mt-5 max-w-[13ch] text-[42px] leading-[0.95] tracking-[-0.05em] text-neutral-950 sm:text-[58px] md:text-[74px]">
                Legal Notice.
              </h1>
              <p className="mt-6 max-w-[68ch] text-[14px] leading-7 text-neutral-600 md:text-[15px] md:leading-8">
                This notice explains the ownership, permitted use,
                intellectual property protection, disclaimers, and general
                website-use conditions for brenychstudio.com.
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
