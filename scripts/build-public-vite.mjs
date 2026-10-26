// Public recovery always includes the exact accepted recorded media and offline Focus interface.
// Private LIVE is a separate authenticated server; this build cannot enable provider calls.
import { spawnSync } from 'node:child_process';
const result=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build',...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,VITE_AVATARS_MEDIA:'release-candidate',VITE_STUDIO_AVATAR_MEDIA:'release-candidate',VITE_ARIA_LIVE:'frontend-preview'}});
process.exit(result.status??1);
