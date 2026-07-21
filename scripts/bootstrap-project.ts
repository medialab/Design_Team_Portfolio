import { readdirSync, existsSync, mkdirSync, copyFileSync, unlinkSync, writeFileSync, statSync } from 'fs';
import { resolve } from 'path';
import { dump as yamlDump } from 'js-yaml';

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg'];
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.MOV', '.webm']);
const DOC_EXTS = new Set(['.pdf']);
const SKIP_NAMES = new Set(['project.yaml', 'project.yml', '.gitkeep']);

const projectsDir = resolve(process.cwd(), 'src/lib/projects');
const entries = readdirSync(projectsDir, { withFileTypes: true });

let bootstrapped = 0;
let sorted = 0;

function safeMove(src: string, destDir: string, filename: string): void {
	if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
	const dest = resolve(destDir, filename);

	if (existsSync(dest)) {
		const srcStat = statSync(src);
		const destStat = statSync(dest);
		if (srcStat.size === destStat.size && srcStat.mtimeMs === destStat.mtimeMs) {
			// Same file already exists — remove source (it's a duplicate)
			unlinkSync(src);
			return;
		}
		// Different file — add a suffix to avoid overwrite
		const ext = filename.slice(filename.lastIndexOf('.'));
		const base = filename.slice(0, filename.lastIndexOf('.'));
		let counter = 1;
		let newDest: string;
		do {
			newDest = resolve(destDir, `${base}_${counter}${ext}`);
			counter++;
		} while (existsSync(newDest));
		copyFileSync(src, newDest);
		unlinkSync(src);
		console.log(`  renamed to ${newDest.split('/').pop()} (collision avoided)`);
		return;
	}

	copyFileSync(src, dest);
	unlinkSync(src);
}

for (const entry of entries) {
	if (!entry.isDirectory()) continue;
	if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

	const projectDir = resolve(projectsDir, entry.name);
	const yamlPath = resolve(projectDir, 'project.yaml');

	// Bootstrap project.yaml if missing
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

	// Sort media files into subdirectories
	const files = readdirSync(projectDir);
	const videoDir = resolve(projectDir, '_videos');
	const docDir = resolve(projectDir, '_documents');

	for (const file of files) {
		if (SKIP_NAMES.has(file) || file.startsWith('.')) continue;

		const filePath = resolve(projectDir, file);
		if (!statSync(filePath).isFile()) continue;

		const ext = file.toLowerCase().slice(file.lastIndexOf('.'));

		if (VIDEO_EXTS.has(ext)) {
			safeMove(filePath, videoDir, file);
			console.log(`  ${entry.name}/ — moved ${file} → _videos/`);
			sorted++;
		} else if (DOC_EXTS.has(ext)) {
			safeMove(filePath, docDir, file);
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
