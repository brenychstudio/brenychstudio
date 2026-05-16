import PolicySection from "../ui/policy/PolicySection";
import PolicyShell from "../ui/policy/PolicyShell";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

export default function PrivacyV2({ drawerOpen = false, onOpenProject, onCloseProject }: PageProps) {
  return (
    <PolicyShell
      drawerOpen={drawerOpen}
      onOpenProject={onOpenProject}
      onCloseProject={onCloseProject}
      sceneId="policy-privacy"
      label="Studio Trust Layer"
      title="Privacy Policy"
      intro="This page explains how Brenych Studio handles information shared through this website, project inquiries, preferences, and basic technical interactions."
      updated="2026"
    >
      <PolicySection index="01" title="Overview">
        <p>
          This website is designed as a portfolio, studio presentation, and project inquiry surface. It is not an
          e-commerce platform and does not process direct payments through the site.
        </p>
      </PolicySection>

      <PolicySection index="02" title="Information you provide">
        <p>
          When you contact Brenych Studio, you may provide your name, email address, company, project details, message
          content, or other information you choose to share.
        </p>
      </PolicySection>

      <PolicySection index="03" title="Project inquiries">
        <p>
          Information submitted through project-start actions or email is used to understand your request, respond to
          your inquiry, and discuss potential collaboration.
        </p>
      </PolicySection>

      <PolicySection index="04" title="Local preferences">
        <p>
          The site may store limited local preferences in your browser, such as language, sound mode, or interface
          preferences. These are used to improve the browsing experience and are not used for advertising.
        </p>
      </PolicySection>

      <PolicySection index="05" title="Analytics / tracking">
        <p>
          At this stage, this website does not use advertising pixels, behavioral advertising, or third-party ad
          tracking.
        </p>
        <p>
          If analytics or third-party services are added in the future, this page will be updated to explain what is
          used and why.
        </p>
      </PolicySection>

      <PolicySection index="06" title="Cookies / browser storage">
        <p>
          The site may use browser storage for interface preferences. It does not rely on advertising cookies for
          behavioral targeting.
        </p>
      </PolicySection>

      <PolicySection index="07" title="Third-party links">
        <p>
          The site may link to external platforms such as GitHub, LinkedIn, social profiles, hosting providers, or
          project pages. Those services are governed by their own privacy practices.
        </p>
      </PolicySection>

      <PolicySection index="08" title="Data retention">
        <p>
          Project inquiry information is kept only as long as needed to respond, discuss collaboration, maintain business
          records, or comply with applicable obligations.
        </p>
      </PolicySection>

      <PolicySection index="09" title="Your choices">
        <p>
          You can contact Brenych Studio to ask about information you have shared, request correction, or ask for
          deletion where applicable.
        </p>
      </PolicySection>

      <PolicySection index="10" title="Contact">
        <p>
          For privacy-related questions, contact Brenych Studio through the email or project inquiry channel listed on
          the site.
        </p>
      </PolicySection>
    </PolicyShell>
  );
}
