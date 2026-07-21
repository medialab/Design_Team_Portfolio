import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const MAIN_YAML = resolve(repoRoot, 'src/lib/dataset/main.yaml');
const MEDIA_DIR = resolve(repoRoot, 'src/lib/projects');

interface Project {
	title: string;
	description: string;
	link: string;
	tag: string;
	year_begin: string;
	year_end?: string;
	project_type?: string;
	team_people?: string;
	author?: string;
}

interface YamlData {
	projects: Project[];
}

const text = readFileSync(MAIN_YAML, 'utf8');
const data = yamlLoad(text) as YamlData;

if (!data?.projects || !Array.isArray(data.projects)) {
	console.error('Invalid main.yaml: expected { projects: [...] }');
	process.exit(1);
}

let migrated = 0;
let skipped = 0;

for (const project of data.projects) {
	const tag = project.tag;
	const projectDir = resolve(MEDIA_DIR, tag);

	if (!existsSync(projectDir)) {
		mkdirSync(projectDir, { recursive: true });
		console.log(`  Created directory: ${tag}/`);
	}

	const yamlPath = resolve(projectDir, 'project.yaml');
	if (existsSync(yamlPath)) {
		console.log(`  SKIP ${tag}/project.yaml (already exists)`);
		skipped++;
		continue;
	}

	const projectYaml = {
		title: project.title,
		description: project.description,
		link: project.link,
		tag: project.tag,
		year_begin: project.year_begin,
		...(project.year_end && { year_end: project.year_end }),
		...(project.project_type && { project_type: project.project_type }),
		...(project.team_people && { team_people: project.team_people }),
		...(project.author && { author: project.author })
	};

	writeFileSync(yamlPath, yamlDump(projectYaml, { lineWidth: 120, noRefs: true, forceQuotes: false }));
	migrated++;
	console.log(`  Created ${tag}/project.yaml`);
}

console.log(`\nDone: ${migrated} created, ${skipped} skipped, ${data.projects.length} total`);
