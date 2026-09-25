import { Link } from "react-router-dom";

import PolicySection from "../ui/policy/PolicySection";
import PolicyShell from "../ui/policy/PolicyShell";
import LivingAtlasTrustNav from "../ui/living-atlas/LivingAtlasTrustNav";
import {
  LIVING_ATLAS_PLATFORM,
  LIVING_ATLAS_RELEASE_STATUS,
  LIVING_ATLAS_SUPPORT_EMAIL,
  livingAtlasMailto,
  livingAtlasRoutes,
} from "../ui/living-atlas/livingAtlasRelease";

type PageProps = {
  drawerOpen?: boolean;
  onOpenProject?: () => void;
  onCloseProject?: () => void;
};

const supportMailto = livingAtlasMailto("Living Atlas support");

const primaryLinkClass =
  "inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-neutral-950 bg-neutral-950 px-5 text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5";

const addressLinkClass =
  "inline-flex min-h-11 w-fit items-center font-mono text-[11px] tracking-[0.04em] text-neutral-800 underline decoration-neutral-950/30 underline-offset-4 transition hover:decoration-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2";

const inlineLinkClass =
  "text-neutral-950 underline decoration-neutral-950/35 underline-offset-4 transition hover:decoration-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2";

function EmailSupportCta() {
  return (
    <div className="grid gap-3">
      <a href={supportMailto} aria-label={`Email support — ${LIVING_ATLAS_SUPPORT_EMAIL}`} className={primaryLinkClass}>
        <span>Email support</span>
        <span aria-hidden="true">-&gt;</span>
      </a>
      <a href={supportMailto} className={addressLinkClass}>
        {LIVING_ATLAS_SUPPORT_EMAIL}
      </a>
    </div>
  );
}

export default function LivingAtlasSupport({ drawerOpen = false, onOpenProject, onCloseProject }: PageProps) {
  return (
    <PolicyShell
      drawerOpen={drawerOpen}
      onOpenProject={onOpenProject}
      onCloseProject={onCloseProject}
      sceneId="living-atlas-support"
      atmospherePreset="classic"
      label="Living Atlas · Support"
      title="Living Atlas Support"
      titleClassName="max-w-[12ch]"
      metaTitle="Living Atlas Support | Brenych Studio"
      intro="Help with captures, locations, light planning, Atlas Pro and local app data."
      meta={[LIVING_ATLAS_PLATFORM, LIVING_ATLAS_RELEASE_STATUS]}
      aside={<EmailSupportCta />}
      closing={
        <>
          <span>Living Atlas · Trust Surface</span>
          <LivingAtlasTrustNav current="support" label="Living Atlas pages" />
        </>
      }
    >
      <PolicySection index="01" title="Contact">
        <p>
          Support for Living Atlas is handled directly by Brenych Studio by email. Describe what you were doing, what
          you expected and what happened instead, and include your iPhone model and iOS version. Screenshots help.
        </p>
        <EmailSupportCta />
      </PolicySection>

      <PolicySection index="02" title="Atlas Pro">
        <p>
          Atlas Pro is a one-time lifetime unlock that adds advanced individual photographic tools. There is no
          subscription in V1.
        </p>
        <p>
          For an existing purchase, use Restore Purchases from the Atlas Pro management surface in the app while signed
          in to the same Apple Account that made the original purchase.
        </p>
        <p>
          Apple processes payment for Atlas Pro. Refund requests are handled by Apple through the App Store, not by
          Brenych Studio.
        </p>
      </PolicySection>

      <PolicySection index="03" title="Local captures">
        <p>
          Living Atlas V1 is local-first. Captures, photos, Locations, Visits and spatial memory live on your device.
          There is no Living Atlas cloud backup.
        </p>
        <p>
          Treat important captures and spatial memory as device-local data. Do not delete the app or clear its
          application storage while those captures are still needed: doing so can remove them permanently.
        </p>
        <p>If something looks wrong, contact support first, before taking any step that removes app data.</p>
      </PolicySection>

      <PolicySection index="04" title="Location and camera permissions">
        <p>
          Camera and location functionality depends on the relevant device permissions. If a capture cannot record its
          place, or the camera is unavailable, check that Living Atlas is allowed to use Location and Camera in iOS
          Settings.
        </p>
        <p>Permissions can be reviewed in system settings at any time. Changing a permission limits only the related functionality.</p>
      </PolicySection>

      <PolicySection index="05" title="Light planning">
        <p>Light planning is based on the recorded location and time of a place and on solar geometry.</p>
        <p>
          Buildings, terrain and other real-world obstructions may affect the actual light at a place. Treat the
          planner as guidance rather than a guarantee.
        </p>
      </PolicySection>

      <PolicySection index="06" title="Privacy">
        <p>
          How Living Atlas handles photos, location, spatial memory and Atlas Pro purchases is described in the{" "}
          <Link to={livingAtlasRoutes.privacy} className={inlineLinkClass}>
            Living Atlas Privacy Policy
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyShell>
  );
}
