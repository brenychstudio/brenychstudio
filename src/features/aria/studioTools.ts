import type { DirectorAction } from '../../ui/presenter/directorContract';

// The existing Studio Director remains the action engine. Model output can select
// only these public targets; it cannot supply selectors, scripts, URLs or forms.
const choices = {
  show_section: { key: 'id', values: ['ecosystem', 'collaboration'] },
  show_product: { key: 'projectId', values: ['weekfield', 'print-border-studio'] },
  show_spatial: { key: 'proof', values: ['whisper', 'webhero'] },
  open_page: { key: 'path', values: ['/games', '/offer', '/avatars'] },
  show_game: { key: 'slug', values: ['black-start', 'project-mars-2158', 'shift-world', 'project-territories'] },
  show_ai_system: { key: '', values: [] },
} as const;
const descriptions: Record<keyof typeof choices, string> = {
  show_section: 'Show a HOME section. Collaboration shows contact options but never submits or opens the project form.',
  show_product: 'Show a public Studio product on HOME. Wait for the actual page receipt before claiming it is visible.',
  show_spatial: 'Show WHISPER or WEBHERO evidence on HOME. Development evidence, not a promise of production readiness.',
  open_page: 'Open the existing Games, Offer or Digital Humans page. Digital Humans shows recorded introductions, not a live AI conversation.',
  show_game: 'Open Games and select one public game world; preserve its actual published development status.',
  show_ai_system: 'Open Offer and select AI & Agent Systems when that control exists. A skipped mobile control is not an applied selection.',
};
export const studioTools = Object.entries(choices).map(([name, spec]) => ({
  name, description: descriptions[name as keyof typeof choices],
  input_schema: {
    type: 'object' as const,
    properties: spec.key ? { [spec.key]: { type: 'string', enum: [...spec.values] } } : {},
    required: spec.key ? [spec.key] : [], additionalProperties: false,
  },
}));
export function parseStudioTool(name: string, input: unknown):
  { ok: true; action: DirectorAction; command: { type: string; [key: string]: unknown } } |
  { ok: false; errors: Array<{ field: string; message: string }> } {
  const reject = () => ({ ok: false as const, errors: [{ field: 'input', message: 'Unknown tool, target or extra field. Nothing executed.' }] });
  if (!Object.hasOwn(choices, name) || !input || typeof input !== 'object' || Array.isArray(input)) return reject();
  const spec = choices[name as keyof typeof choices];
  const object = input as Record<string, unknown>;
  if (Object.keys(object).length !== (spec.key ? 1 : 0)) return reject();
  if (spec.key && !(spec.values as readonly unknown[]).includes(object[spec.key])) return reject();
  let action: DirectorAction;
  switch (name) {
    case 'show_section': action = { kind: 'anchor', id: object.id as 'ecosystem' | 'collaboration' }; break;
    case 'show_product': action = { kind: 'product', projectId: object.projectId as 'weekfield' | 'print-border-studio' }; break;
    case 'show_spatial': action = { kind: 'spatial', proof: object.proof as 'whisper' | 'webhero' }; break;
    case 'open_page': action = { kind: 'route', path: object.path as '/games' | '/offer' | '/avatars' }; break;
    case 'show_game': action = { kind: 'route', path: '/games', game: object.slug as Extract<DirectorAction, {kind:'game'}>['slug'] }; break;
    case 'show_ai_system': action = { kind: 'offer-system', system: 'ai-agent-systems' }; break;
    default: return reject();
  }
  return { ok: true, action, command: { ...object, type: name } };
}
