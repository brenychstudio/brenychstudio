import PolicySection from "../ui/policy/PolicySection";
import PolicyShell from "../ui/policy/PolicyShell";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

export default function LegalV2({ drawerOpen = false, onOpenProject, onCloseProject }: PageProps) {
  return (
    <PolicyShell
      drawerOpen={drawerOpen}
      onOpenProject={onOpenProject}
      onCloseProject={onCloseProject}
      sceneId="policy-legal"
      label="Studio Trust Layer"
      title="Legal Notice"
      intro="This page outlines the basic terms for using this website, viewing portfolio materials, and contacting Brenych Studio about potential projects."
      updated="2026"
    >
      <PolicySection index="01" title="Website purpose">
        <p>
          This website presents the work, services, experiments, concepts, and studio practice of Brenych Studio. It is
          intended for portfolio review, project discovery, and professional contact.
        </p>
      </PolicySection>

      <PolicySection index="02" title="Intellectual property">
        <p>
          All visual systems, interface concepts, text, layouts, motion direction, project presentations, and original
          materials on this site are owned by Brenych Studio or their respective rights holders unless otherwise stated.
        </p>
      </PolicySection>

      <PolicySection index="03" title="Portfolio and concept work">
        <p>
          Some projects are presented as concepts, prototypes, case studies, or ready-to-adapt system foundations. Their
          publication does not transfer ownership, license, or usage rights to visitors.
        </p>
      </PolicySection>

      <PolicySection index="04" title="Available Systems">
        <p>
          Selected concepts may be available as commissioned adaptations. This does not mean instant purchase or template
          resale. Each adaptation is scoped, customized, and agreed separately based on the client&apos;s brand, content,
          market, technical needs, and ownership terms.
        </p>
      </PolicySection>

      <PolicySection index="05" title="No unauthorized reuse">
        <p>
          You may not copy, reproduce, resell, redistribute, extract, or adapt materials from this site without written
          permission.
        </p>
      </PolicySection>

      <PolicySection index="06" title="External links">
        <p>
          This website may include links to external websites, repositories, social profiles, or live projects. Brenych
          Studio is not responsible for third-party content or policies.
        </p>
      </PolicySection>

      <PolicySection index="07" title="Accuracy and availability">
        <p>
          The site is maintained as an evolving portfolio and studio presentation. Information may change, and some
          experimental sections may be updated over time.
        </p>
      </PolicySection>

      <PolicySection index="08" title="Project discussions">
        <p>
          Submitting a project inquiry does not create a client relationship, contract, or obligation until a scope,
          agreement, timeline, and terms are confirmed in writing.
        </p>
      </PolicySection>

      <PolicySection index="09" title="Limitation">
        <p>
          The website is provided for informational and portfolio purposes. Brenych Studio aims to keep information
          accurate and accessible, but cannot guarantee uninterrupted availability or error-free operation.
        </p>
      </PolicySection>

      <PolicySection index="10" title="Contact">
        <p>
          For legal or usage questions, contact Brenych Studio through the official contact channel listed on the site.
        </p>
      </PolicySection>
    </PolicyShell>
  );
}
