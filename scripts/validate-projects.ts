import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { load as yamlLoad } from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const MEDIA_DIR = resolve(repoRoot, 'src/lib/media');

const REQUIRED_TEXT_FIELDS = ['title', 'description', 'link', 'tag', 'year_begin'] as const;
const OPTIONAL_FIELDS = ['year_end', 'project_type', 'team_people', 'author', 'sections'];

interface ValidationResult {
	tag: string;
	path: string;
	errors: string[];
	warnings: string[];
}

function validateProjectYaml(tag: string, yamlPath: string): ValidationResult {
	const result: ValidationResult = { tag, path: yamlPath, errors: [], warnings: [] };

	if (!existsSync(yamlPath)) {
		result.errors.push('project.yaml not found');
		return result;
	}

	let data: Record<string, unknown>;
	try {
		const text = readFileSync(yamlPath, 'utf8');
		data = yamlLoad(text) as Record<string, unknown>;
	} catch (err) {
		result.errors.push(`YAML parse error: ${err}`);
		return result;
	}

	if (!data || typeof data !== 'object') {
		result.errors.push('project.yaml must contain an object');
		return result;
	}

	for (const field of REQUIRED_TEXT_FIELDS) {
		const val = data[field];
		if (typeof val !== 'string' || val.trim().length === 0) {
			result.errors.push(`Missing or empty required field: ${field}`);
		}
	}

	if (data.tag !== tag) {
		result.errors.push(`tag mismatch: yaml says "${data.tag}", folder is "${tag}"`);
	}

	const mediaFiles = readdirSync(resolve(MEDIA_DIR, tag)).filter(
		(f) => f !== 'project.yaml' && !f.startsWith('.')
	);
	if (mediaFiles.length === 0) {
		result.warnings.push('No media files found in folder');
	}

	const hasThumb = mediaFiles.some(
		(f) => f.toLowerCase().includes('thumb') && /\.(png|jpg|jpeg|webp|gif)$/i.test(f)
	);
	if (!hasThumb) {
		result.warnings.push('No thumbnail file found (filename should contain "thumb")');
	}

	const extraneous = Object.keys(data).filter(
		(k) => ![...REQUIRED_TEXT_FIELDS, ...OPTIONAL_FIELDS].includes(k as any)
	);
	if (extraneous.length > 0) {
		result.warnings.push(`Unknown fields: ${extraneous.join(', ')}`);
	}

	return result;
}

console.log('Validating project folders...\n');

const entries = readdirSync(MEDIA_DIR, { withFileTypes: true });
let passed = 0;
let failed = 0;

for (const entry of entries) {
	if (!entry.isDirectory()) continue;

	const yamlPath = resolve(MEDIA_DIR, entry.name, 'project.yaml');
	const result = validateProjectYaml(entry.name, yamlPath);

	if (result.errors.length > 0) {
		console.log(`FAIL ${entry.name}/`);
		result.errors.forEach((e) => console.log(`  ERROR: ${e}`));
		result.warnings.forEach((w) => console.log(`  WARN: ${w}`));
		failed++;
	} else {
		console.log(`PASS ${entry.name}/`);
		result.warnings.forEach((w) => console.log(`  WARN: ${w}`));
		passed++;
	}
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
