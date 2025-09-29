import type { PageServerLoad } from './$types';
import { extractYamlData } from '$lib/functions';
import { mediaFilesModules } from '$lib/images';
import type { YamlData } from '$lib/functions';

export const load: PageServerLoad = () => {
	try {
		const data: YamlData = extractYamlData() ?? { projects: [] };
		return {
			projects: data.projects,
			mediaFilesModules: mediaFilesModules,
		};
	} catch (error) {
		console.error('Error loading YAML data:', error);
		return {
			projects: [], //bckp return an emtpy array if the yaml file is not found
			mediaFilesModules: mediaFilesModules,
		};
	}
};