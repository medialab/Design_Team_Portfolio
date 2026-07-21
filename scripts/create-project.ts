import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { dump as yamlDump } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const tag = process.argv[2]?.trim();
const title = process.argv[3]?.trim();

if (!tag || !title) {
	console.error('Usage: bun scripts/create-project.ts <TAG> "<Project Title>"');
	console.error('Example: bun scripts/create-project.ts MYPROJ "My Amazing Project"');
	process.exit(1);
}

const projectDir = resolve(repoRoot, 'src/lib/projects', tag);

if (existsSync(projectDir)) {
	console.error(`Folder already exists: src/lib/projects/${tag}/`);
	process.exit(1);
}

mkdirSync(projectDir, { recursive: true });

const projectYaml = {
	title,
	description: '',
	link: '',
	tag,
	year_begin: new Date().getFullYear().toString()
};

writeFileSync(
	resolve(projectDir, 'project.yaml'),
	yamlDump(projectYaml, { lineWidth: 120, noRefs: true, forceQuotes: false })
);

console.log(`Created src/lib/projects/${tag}/`);
console.log(`Created src/lib/projects/${tag}/project.yaml`);
console.log('');
console.log('Next steps:');
console.log(`  1. Add media files to src/lib/projects/${tag}/`);
console.log(`  2. Include a file with "thumb" in the name (for the homepage card)`);
console.log(`  3. Edit src/lib/projects/${tag}/project.yaml to add description/link`);
console.log(`  4. Run: bun run imgYmlCreator`);
console.log(`  5. Run: bun run dither:all`);
console.log(`  6. Run: bun run dev to preview`);
