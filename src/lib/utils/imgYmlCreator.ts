import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';

const MEDIA_EXTENSIONS = new Set([
	'.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg',
	'.mp4', '.mov', '.MOV',
	'.pdf'
]);

function getMediaFiles(dir: string, prefix = ''): string[] {
	if (!existsSync(dir)) return [];
	const files: string[] = [];
	const entries = readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
	if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
		if (entry.name === 'project.yaml') continue;
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...getMediaFiles(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name));
		} else if (entry.isFile()) {
			const ext = entry.name.toLowerCase().slice(entry.name.lastIndexOf('.'));
			if (MEDIA_EXTENSIONS.has(ext)) {
				files.push(prefix ? `${prefix}/${entry.name}` : entry.name);
			}
		}
	}
	return files.sort((a, b) => a.localeCompare(b, 'en'));
}

const projectsDir = resolve(process.cwd(), 'src/lib/projects');
const entries = readdirSync(projectsDir, { withFileTypes: true });

let updated = 0;

for (const entry of entries) {
	if (!entry.isDirectory()) continue;
	if (entry.name.startsWith('.')) continue;

	const projectDir = resolve(projectsDir, entry.name);
	const yamlPath = resolve(projectDir, 'project.yaml');
	if (!existsSync(yamlPath)) continue;

	const mediaFiles = getMediaFiles(projectDir);
	if (mediaFiles.length === 0) continue;

	const raw = readFileSync(yamlPath, 'utf8');
	const data = yamlLoad(raw) as Record<string, unknown>;

	const existing = (data.media_captions as Record<string, string>) || {};
	const updatedCaptions: Record<string, string> = {};

	let changed = false;

	for (const file of mediaFiles) {
		if (file in existing) {
			updatedCaptions[file] = existing[file];
		} else {
			updatedCaptions[file] = '';
			changed = true;
			console.log(`  ${entry.name}/project.yaml: added "${file}"`);
		}
	}

	for (const key of Object.keys(existing)) {
		if (!mediaFiles.includes(key)) {
			if (existing[key] && existing[key].trim().length > 0) {
				console.warn(`  ⚠ ${entry.name}/project.yaml: REMOVED "${key}" — had caption "${existing[key].trim()}"`);
			} else {
				console.log(`  ${entry.name}/project.yaml: removed "${key}" (file gone)`);
			}
			changed = true;
		}
	}

	if (changed) {
		data.media_captions = updatedCaptions;
		writeFileSync(yamlPath, yamlDump(data, { lineWidth: 120, noRefs: true, forceQuotes: false }));
		updated++;
	}
}

if (updated === 0) {
	console.log('All project.yaml files are up to date');
} else {
	console.log(`Updated ${updated} project.yaml file(s)`);
}
