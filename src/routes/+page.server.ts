import type { PageServerLoad } from './$types';
import { resolve } from 'path';

const yamlPath = resolve(process.cwd(), 'src/lib/dataset/main.yaml');
const file = Bun.file(yamlPath);

const text = await file.text();
let data: any = null;

try {
	data = Bun.YAML.parse(text);
} catch (error) {
	console.error(error);
}

console.log(data);

export const load: PageServerLoad = async () => {
	return {
		projects: data.projects
	};
};