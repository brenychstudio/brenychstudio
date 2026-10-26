// AI Digital Humans (AVATARS-01, cast names in AVATARS-02). The eight owner-approved character identities (visual
// concepts, 2026-10-22): the display truth only. Recorded media lives apart in avatarMedia.ts, so a build without a
// cleared clip can never show one. Names 02–08 are fictional stage-name proposals the owner can change here (identity 01 is
// the founder); roles are editorial working labels, never biographies, languages, nationalities or proof of a working
// agent.

export type AvatarLocale = "en" | "es";
export type AvatarId = `avatar-0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
type Localized = Record<AvatarLocale, string>;

/** How a character can be presented. Only modes whose media or runtime really exists may be activated. */
export type AvatarRendererMode = "portrait-static" | "prerecorded" | "interactive" | "unreal-3d";

/** What a future presenter adapter receives: which character and where it appears. Matches the HOME presenter's run
 *  contract (character + context in, DOM-confirmed actions out) without depending on that unreleased work. */
export type AvatarExperienceContext = {
  characterId: AvatarId;
  route: "/avatars";
  locale: AvatarLocale;
  mode: AvatarRendererMode;
};

/** The registry ships in the public bundle, so it carries no archive folder names or descriptions: identity 0N is proven by
 *  the SHA-256 of its files (owner order, checked by scripts/validate-avatars.mts). */
export type AvatarProfile = {
  id: AvatarId;
  displayNumber: string;
  /** Stage name. "owner": the founder's own first name; "provisional": a fictional proposal awaiting owner approval. */
  name: string;
  nameStatus: "owner" | "provisional";
  status: "visual-concept";
  portraitWebp: string;
  thumbWebp: string;
  /** 4:5 cast-library crop of the same master (full height, centred on the face; no other edit). */
  cardWebp: string;
  /** SHA-256 of the shipped files: they must stay byte-identical to the approved derivatives. */
  portraitSha256: string;
  thumbSha256: string;
  cardSha256: string;
  portraitSize: number;
  role: Localized;
  scenario: Localized;
  /** Where the face sits in the square source (object-position) and how much the stage zooms in so that faces read at a
   *  similar size: the sources are framed differently (the founder's portrait is a closer crop). */
  imageFocalPoint: string;
  stageZoom: number;
  allowedActions: readonly ["request-project"];
  proofSource: "owner-approved-assets-2026-10-22";
};

const base = (n: number) => `/avatars/avatar-0${n}`;

function identity(
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  name: { name: string; status: AvatarProfile["nameStatus"] },
  role: Localized,
  scenario: Localized,
  hashes: { portrait: string; thumb: string; card: string; size: number },
  framing: { focal: string; zoom: number },
): AvatarProfile {
  return {
    id: `avatar-0${n}`,
    displayNumber: `0${n}`,
    name: name.name,
    nameStatus: name.status,
    status: "visual-concept",
    portraitWebp: `${base(n)}/portrait.webp`,
    thumbWebp: `${base(n)}/thumb_320.webp`,
    cardWebp: `${base(n)}/card.webp`,
    portraitSha256: hashes.portrait,
    thumbSha256: hashes.thumb,
    cardSha256: hashes.card,
    portraitSize: hashes.size,
    role,
    scenario,
    imageFocalPoint: framing.focal,
    stageZoom: framing.zoom,
    allowedActions: ["request-project"],
    proofSource: "owner-approved-assets-2026-10-22",
  };
}

export const avatarProfiles: readonly AvatarProfile[] = [
  identity(1, { name: "Rostyslav", status: "owner" },
    { en: "Founder / Studio Representative", es: "Fundador / Representante del estudio" },
    { en: "Studio presentation and a guided portfolio", es: "Presentación del estudio y portafolio guiado" },
    { portrait: "4312b2e347b91a59944c49ea3bae244d9a75ada087950a47333974c95100166f", thumb: "d401e9b71ff784abcc8c709644e613b84be5b094c3c606e9a48312b43e89a08d", card: "8299a60e6e399e5944b8c848dd1a28101ec02e477645bec1c91f453fc1b1a015", size: 1536 },
    { focal: "48% 40%", zoom: 1 }),
  identity(2, { name: "Aria", status: "provisional" },
    { en: "Studio Host", es: "Anfitriona del estudio" },
    { en: "Hospitality concierge scenario", es: "Escenario de conserjería para hostelería" },
    { portrait: "a18da6d3ac18d63e2d1300f3795e714fb0f10ade90b7095875b89c8715727bbb", thumb: "b63ffc7736737670742f3fb1625d4ee9fd64b99f40ee75f9ce906bd5aa4d70dc", card: "10a6f8aeb44bcb2f44fdb8548995d9b133a9db207c8f04d5fc4170b025d46e1d", size: 1254 },
    { focal: "50% 34%", zoom: 1.16 }),
  identity(3, { name: "Leo", status: "provisional" },
    { en: "Product Advisor", es: "Asesor de producto" },
    { en: "Product demonstrations", es: "Demostraciones de producto" },
    { portrait: "be7cbea43636b3cda3ec99fccc5012c8575a9714db805a04bbc1dd990a3e032d", thumb: "418ef435f630bbe231f26d1cb1b01ea946b5a5596e0c4dfb4c1996d74580fb17", card: "40902d5c9d9930a776173337bf72836e32855ddf2aedc45843aaaf940bffccda", size: 1254 },
    { focal: "52% 36%", zoom: 1.14 }),
  identity(4, { name: "Eva", status: "provisional" },
    { en: "Brand Presenter", es: "Presentadora de marca" },
    { en: "Premium brand storytelling", es: "Narrativa para marcas premium" },
    { portrait: "c28088712095f487b405eda62d16bc3d77a32d6876299a6f27ad45ec85645d43", thumb: "7fa89ca2a5bb414eb84d9e3f929925cb22a1119864c5289a39fd1e813766f124", card: "fc11e186b8f2245a2bf07599ffb1c427d2178524cb12475d166f2f3c30fe5397", size: 1254 },
    { focal: "52% 33%", zoom: 1.16 }),
  identity(5, { name: "Adrian", status: "provisional" },
    { en: "Experience Guide", es: "Guía de experiencias" },
    { en: "Interactive experiences", es: "Experiencias interactivas" },
    { portrait: "05ddb2b8329f86697d952965d162ba82cd7d014eac6ea173beb21d126a2a3168", thumb: "3a45ce686500919706101132ee6d7d4e82ba9741d9f9805a213ff38657516819", card: "36bc3edb222ed3b0825d1eeada43c30122d6492e8109e81eeb1a55a66b18bc8c", size: 1254 },
    { focal: "50% 36%", zoom: 1.12 }),
  identity(6, { name: "Zara", status: "provisional" },
    { en: "Digital Consultant", es: "Consultora digital" },
    { en: "Business consultation scenario", es: "Escenario de consultoría para empresas" },
    { portrait: "6337ff354dd0b6f69e7e2f14de9479b7c6a5cc2fcb1e5b40853031faecd4be1b", thumb: "ff5e044834da79844b74a41f895e1dafc1994ed64d424de7255de0df09b5ab9b", card: "bcd0306c6f0ff4e5315b14f8e1675da91fb35bc9e6f632aba999ffcb17764fc3", size: 1254 },
    { focal: "50% 31%", zoom: 1.18 }),
  identity(7, { name: "Elias", status: "provisional" },
    { en: "Digital Specialist", es: "Especialista digital" },
    { en: "Complex technical services", es: "Servicios técnicos complejos" },
    { portrait: "d7dca2e0c2a0c51a888b8f8aab7ff04d2b74e59e89aca9ace3029d90dda96bdb", thumb: "13bb5bacb51e1e5028b9a5a18c90591f09021ceb6ba953b40b859d1e3a7e0c2d", card: "3ff0ab904a7fdfda143b3d1c7055d0b344668cb06b0f9d81d2e791cd98959d94", size: 1254 },
    { focal: "50% 33%", zoom: 1.16 }),
  identity(8, { name: "Sofia", status: "provisional" },
    { en: "Client Guide", es: "Guía para clientes" },
    { en: "Service discovery scenario", es: "Escenario de descubrimiento de servicios" },
    { portrait: "809661193fe625f21e196acfb43d0298697835c57356b90be9214160713f968d", thumb: "6cf93f0d277af21bfed46795094091fed5c40fb4edbb1a73686abc7b686652bd", card: "16d07d1877bdd43d48bbd545ff3338bc81c902c088996c16a9828cd1a81fb6e8", size: 1254 },
    { focal: "52% 31%", zoom: 1.18 }),
];

/** `#avatar-05` → 4; anything else (empty, unknown, malformed) → -1 so the page falls back to the first identity. */
export function avatarIndexFromHash(hash: string) {
  let id: string;
  try {
    id = decodeURIComponent(hash.replace(/^#/, "")).trim().toLowerCase();
  } catch {
    return -1; // a malformed escape such as #%E0%A4%A
  }
  return avatarProfiles.findIndex((profile) => profile.id === id);
}
