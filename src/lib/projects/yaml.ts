import { readFileSync, statSync, existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { load as yamlLoad } from 'js-yaml';
import type { YamlData, Project } from '$lib/utils/types';

const isProject = (value: unknown): value is Project => {
	if (!value || typeof value !== 'object') return false;
	const p = value as Record<string, unknown>;
	return typeof p.title === 'string' && typeof p.tag === 'string' && typeof p.link === 'string';
};

const isYamlData = (value: unknown): value is YamlData => {
	return (
		typeof value === 'object' &&
		value !== null &&
		'projects' in value &&
		Array.isArray((value as { projects?: unknown }).projects)
	);
};

let cachedYamlData: YamlData | undefined;
let cachedYamlMtimeMs: number | undefined;
const mediaDir = resolve(process.cwd(), 'src/lib/projects');

function readProjectYamls(): Project[] {
	const projects: Project[] = [];
	if (!existsSync(mediaDir)) return projects;

	const entries = readdirSync(mediaDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const yamlPath = resolve(mediaDir, entry.name, 'project.yaml');
		if (!existsSync(yamlPath)) continue;

		try {
			const text = readFileSync(yamlPath, 'utf8');
			const data = yamlLoad(text);
			if (isProject(data)) {
				projects.push(data);
			}
		} catch (err) {
			console.error(`Error reading ${entry.name}/project.yaml:`, err);
		}
	}

	return projects;
}

export const extractYamlData = (): YamlData | undefined => {
	try {
		const perProject = readProjectYamls();
		if (perProject.length > 0) {
			return { projects: perProject };
		}

		const yamlPath = resolve(process.cwd(), 'src/lib/projects/_dataset/main.yaml');
		if (!existsSync(yamlPath)) {
			console.warn('No main.yaml or per-project yaml files found');
			return undefined;
		}

		const mtimeMs = statSync(yamlPath).mtimeMs;
		if (cachedYamlData && cachedYamlMtimeMs === mtimeMs) {
			return cachedYamlData;
		}

		const text = readFileSync(yamlPath, 'utf8');
		const data = yamlLoad(text);

		if (!isYamlData(data)) {
			throw new Error('Invalid main.yaml format: expected an object with a projects array.');
		}

		cachedYamlData = data;
		cachedYamlMtimeMs = mtimeMs;

		return cachedYamlData;
	} catch (error) {
		cachedYamlData = undefined;
		cachedYamlMtimeMs = undefined;
		console.error('Error loading YAML data:', error);
		return undefined;
	}
};
