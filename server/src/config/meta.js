import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let version = '0.0.0';

try {
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  const parsed = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  version = parsed.version || version;
} catch {
  // keep default version fallback
}

export const meta = {
  service: 'ai-dsa-copilot-api',
  version
};
