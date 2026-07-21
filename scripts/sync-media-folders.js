import { existsSync, readFileSync, readdirSync, mkdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const yamlPath = resolve(rootDir, 'src/lib/projects/_dataset/main.yaml');
const mediaDir = resolve(rootDir, 'src/lib/projects');

const tags = new Set();

// Collect tags from per-project yamls
if (existsSync(mediaDir)) {
	const entries = readdirSync(mediaDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const projectYaml = resolve(mediaDir, entry.name, 'project.yaml');
		if (!existsSync(projectYaml)) continue;
		try {
			const data = yaml.load(readFileSync(projectYaml, 'utf8'));
			if (data && typeof data === 'object' && (data).tag) {
				tags.add((data).tag);
			}
		} catch {}
	}
}

// Also collect from main.yaml for backward compatibility
if (existsSync(yamlPath)) {
	try {
		const data = yaml.load(readFileSync(yamlPath, 'utf8'));
		if (data && data.projects) {
			data.projects.forEach((p) => {
				if (p.tag) tags.add(p.tag);
			});
		}
	} catch {}
}

if (tags.size === 0) {
	console.log('No tags found in project.yaml files or main.yaml');
	process.exit(0);
}

const existingFolders = readdirSync(mediaDir).filter((f) => {
	return statSync(resolve(mediaDir, f)).isDirectory();
});

let createdCount = 0;

tags.forEach((tag) => {
	if (!existingFolders.includes(tag)) {
		mkdirSync(resolve(mediaDir, tag), { recursive: true });
		console.log(`Created folder: ${tag}`);
		createdCount++;
	}
});

if (createdCount === 0) {
	console.log('All project folders already exist');
} else {
	console.log(`Created ${createdCount} folder(s)`);
}
