import { readdirSync, existsSync, mkdirSync, renameSync, writeFileSync, statSync } from 'fs';
import { resolve } from 'path';
import { dump as yamlDump } from 'js-yaml';

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg'];
const VIDEO_EXTS = ['.mp4', '.mov', '.MOV', '.webm'];
const DOC_EXTS = ['.pdf'];
const SKIP_NAMES = new Set(['project.yaml', 'project.yml', '.gitkeep']);

const projectsDir = resolve(process.cwd(), 'src/lib/projects');
const entries = readdirSync(projectsDir, { withFileTypes: true });

let bootstrapped = 0;
let sorted = 0;

for (const entry of entries) {
	if (!entry.isDirectory()) continue;
	if (entry.name.startsWith('.')) continue;

	const projectDir = resolve(projectsDir, entry.name);
	const yamlPath = resolve(projectDir, 'project.yaml');

	// 1. Bootstrap project.yaml if missing
	if (!existsSync(yamlPath)) {
		const projectYaml = {
			title: entry.name,
			description: '',
			link: '',
			tag: entry.name,
			year_begin: new Date().getFullYear().toString()
		};
		writeFileSync(yamlPath, yamlDump(projectYaml, { lineWidth: 120, noRefs: true, forceQuotes: false }));
		console.log(`  ${entry.name}/ — created project.yaml`);
		bootstrapped++;
	}

	// 2. Sort media files into subdirectories
	const files = readdirSync(projectDir);
	const videoDir = resolve(projectDir, '_videos');
	const docDir = resolve(projectDir, '_documents');

	for (const file of files) {
		if (SKIP_NAMES.has(file) || file.startsWith('.')) continue;

		const filePath = resolve(projectDir, file);
		if (!statSync(filePath).isFile()) continue;

		const ext = file.toLowerCase().slice(file.lastIndexOf('.'));

		if (VIDEO_EXTS.includes(ext)) {
			if (!existsSync(videoDir)) mkdirSync(videoDir, { recursive: true });
			renameSync(filePath, resolve(videoDir, file));
			console.log(`  ${entry.name}/ — moved ${file} → _videos/`);
			sorted++;
		} else if (DOC_EXTS.includes(ext)) {
			if (!existsSync(docDir)) mkdirSync(docDir, { recursive: true });
			renameSync(filePath, resolve(docDir, file));
			console.log(`  ${entry.name}/ — moved ${file} → _documents/`);
			sorted++;
		}
	}
}

if (bootstrapped === 0 && sorted === 0) {
	console.log('Nothing to do — all projects have project.yaml and files are sorted');
} else {
	console.log(`Bootstrapped ${bootstrapped} project(s), sorted ${sorted} file(s)`);
}
