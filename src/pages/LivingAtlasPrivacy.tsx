import { Link } from "react-router-dom";

import PolicySection from "../ui/policy/PolicySection";
import PolicyShell from "../ui/policy/PolicyShell";
import LivingAtlasTrustNav from "../ui/living-atlas/LivingAtlasTrustNav";
import {
  LIVING_ATLAS_PLATFORM,
  LIVING_ATLAS_POLICY_UPDATED,
  LIVING_ATLAS_SUPPORT_EMAIL,
  livingAtlasMailto,
  livingAtlasRoutes,
} from "../ui/living-atlas/livingAtlasRelease";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

const privacyMailto = livingAtlasMailto("Living Atlas privacy");

const contactLinkClass =
  "inline-flex min-h-11 w-fit items-center rounded-full border border-neutral-950/14 bg-white/60 px-4 font-mono text-[11px] tracking-[0.04em] text-neutral-900 underline decoration-neutral-950/30 underline-offset-4 backdrop-blur transition hover:border-neutral-950/40 hover:decoration-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2";

const inlineLinkClass =
  "text-neutral-950 underline decoration-neutral-950/35 underline-offset-4 transition hover:decoration-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2";

const appStoreDisclosure = [
  { term: "Data collected", detail: "Purchase history" },
  { term: "Purposes", detail: "App functionality, Analytics" },
  { term: "Linked to your identity", detail: "No" },
  { term: "Used to track you", detail: "No" },
];

export default function LivingAtlasPrivacy({ drawerOpen = false, onOpenProject, onCloseProject }: PageProps) {
  return (
    <PolicyShell
      drawerOpen={drawerOpen}
      onOpenProject={onOpenProject}
      onCloseProject={onCloseProject}
      sceneId="living-atlas-privacy"
      atmospherePreset="classic"
      label="Living Atlas · Privacy"
      title="Living Atlas Privacy Policy"
      titleClassName="max-w-[12ch]"
      metaTitle="Living Atlas Privacy Policy | Brenych Studio"
      intro="How Living Atlas handles photos, location, spatial memory and Atlas Pro purchases in the current V1 release."
      meta={[`Last updated: ${LIVING_ATLAS_POLICY_UPDATED}`, LIVING_ATLAS_PLATFORM]}
      aside={
        <div className="grid gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.17em] text-neutral-400">Privacy contact</div>
          <a href={privacyMailto} className={contactLinkClass}>
            {LIVING_ATLAS_SUPPORT_EMAIL}
          </a>
        </div>
      }
      closing={
        <>
          <span>Living Atlas · Trust Surface</span>
          <LivingAtlasTrustNav current="privacy" label="Living Atlas pages" />
        </>
      }
    >
      <PolicySection index="01" title="Overview">
        <p>
          Living Atlas is designed as a local-first photography application. In the current V1 release, Brenych Studio
          does not operate a Living Atlas account, cloud photo library or cloud location-history service.
        </p>
        <p>
          The app&apos;s core photographic and spatial memory — captures, photos, Locations, Visits and the
          relationships between them — is stored locally on your device.
        </p>
        <p>
          Living Atlas is published by Brenych Studio, an independent studio based in Barcelona, Spain. Privacy
          questions can be sent to the contact listed at the end of this policy.
        </p>
      </PolicySection>

      <PolicySection index="02" title="Photos and media">
        <p>
          Photos and capture media used by Living Atlas are stored locally on your device as part of the current V1
          functionality.
        </p>
        <p>
          Brenych Studio does not upload your Living Atlas photo library to Brenych Studio servers in the current V1.
        </p>
      </PolicySection>

      <PolicySection index="03" title="Location and spatial data">
        <p>
          Living Atlas may use device location, direction and orientation data, and capture-time context to create
          local spatial memories. This data may include:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>precise capture location;</li>
          <li>capture time;</li>
          <li>device direction and orientation data where available;</li>
          <li>Location and Visit relationships generated from your local captures.</li>
        </ul>
        <p>
          Direction information is based on the device&apos;s orientation sensors where available and may be
          approximate.
        </p>
        <p>
          In the current V1 this Living Atlas spatial memory is stored locally on your device and is not uploaded to
          Brenych Studio&apos;s own servers.
        </p>
      </PolicySection>

      <PolicySection index="04" title="Atlas Pro purchases">
        <p>
          Atlas Pro is an optional one-time lifetime unlock. Purchases are processed through Apple&apos;s App Store.
          Brenych Studio does not receive your payment card or bank-account details from an App Store purchase.
        </p>
        <p>Living Atlas uses RevenueCat, a third-party purchase infrastructure service, to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>validate purchase status;</li>
          <li>manage the Atlas Pro entitlement;</li>
          <li>support Restore Purchases;</li>
          <li>provide purchase-related product analytics.</li>
        </ul>
        <p>
          Your purchase history may therefore be processed for app functionality and analytics. It is not used by
          Living Atlas for advertising or cross-app tracking.
        </p>
      </PolicySection>

      <PolicySection index="05" title="App Store privacy summary">
        <p>The current App Store privacy disclosure for Living Atlas is:</p>
        <dl className="grid gap-x-6 gap-y-2 border-y border-neutral-950/10 py-4 sm:grid-cols-[minmax(11rem,0.4fr)_1fr]">
          {appStoreDisclosure.map((row) => (
            <div key={row.term} className="contents">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 sm:pt-1">{row.term}</dt>
              <dd className="text-neutral-800">{row.detail}</dd>
            </div>
          ))}
        </dl>
        <p>
          If Living Atlas data handling changes, this page and the App Store privacy disclosure will be updated
          together.
        </p>
      </PolicySection>

      <PolicySection index="06" title="Identifiers and accounts">
        <p>
          Living Atlas V1 does not ask you to create an account or sign in. There is no Living Atlas login identity.
        </p>
        <p>
          Brenych Studio does not link purchase records to your name, email address or other real-world identity.
          Apple keeps its own record of App Store purchases under your Apple Account and Apple&apos;s terms.
        </p>
      </PolicySection>

      <PolicySection index="07" title="Map services">
        <p>Living Atlas loads map and terrain information from third-party mapping services.</p>
        <p>
          When your device requests map content, those providers may receive ordinary technical request information
          required to deliver the service, such as your IP address and request metadata, subject to their own service
          and privacy terms.
        </p>
        <p>
          Brenych Studio does not use those map requests to create an advertising profile. Map providers are
          independent services, not servers operated by Brenych Studio.
        </p>
      </PolicySection>

      <PolicySection index="08" title="Advertising and tracking">
        <p>Living Atlas V1 does not contain third-party advertising.</p>
        <p>
          Living Atlas does not use purchase history for advertising or cross-app tracking, and does not build an
          advertising profile of you.
        </p>
        <p>
          Ordinary technical network traffic — such as map requests and purchase validation — is still required for
          the app to work.
        </p>
      </PolicySection>

      <PolicySection index="09" title="Data retention">
        <p>
          Local Living Atlas data remains on your device until it is removed through the app or device lifecycle.
          Removing the app or clearing its storage may remove locally stored Living Atlas data, including captures and
          spatial memory. There is no Living Atlas cloud copy to recover it from in V1.
        </p>
        <p>
          Apple and RevenueCat may retain purchase records as necessary to process, verify or restore purchases under
          their respective policies and legal obligations.
        </p>
      </PolicySection>

      <PolicySection index="10" title="Your choices">
        <p>
          Camera and location permissions can be reviewed and changed at any time in iOS Settings. Removing a permission
          can limit the related Living Atlas functionality.
        </p>
        <p>
          Purchase records are managed through Apple. An existing Atlas Pro purchase can be restored with Restore
          Purchases in the app.
        </p>
        <p>
          Because Living Atlas V1 has no account, there is no account to delete. You can contact Brenych Studio with
          any privacy question or with a request about information you have shared with the studio directly.
        </p>
        <p>
          Practical help with the app is available on the{" "}
          <Link to={livingAtlasRoutes.support} className={inlineLinkClass}>
            Living Atlas Support
          </Link>{" "}
          page.
        </p>
      </PolicySection>

      <PolicySection index="11" title="Changes">
        <p>
          This policy may be updated as Living Atlas evolves. Material changes to data handling will be reflected on
          this page and, where required, in the App Store privacy disclosure. The date at the top of this page shows
          the current version.
        </p>
      </PolicySection>

      <PolicySection index="12" title="Contact">
        <p>For privacy questions about Living Atlas, contact Brenych Studio by email.</p>
        <div className="grid gap-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">Privacy contact</div>
          <a href={privacyMailto} className={contactLinkClass}>
            {LIVING_ATLAS_SUPPORT_EMAIL}
          </a>
        </div>
        <p>Brenych Studio · Barcelona, Spain.</p>
      </PolicySection>
    </PolicyShell>
  );
}
