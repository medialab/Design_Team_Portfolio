import type { PageServerLoad } from './$types';
import { extractYamlData } from '$lib/functions';
import { mediaFilesModules } from '$lib/medias';
import type { YamlData } from '$lib/functions';

export const load: PageServerLoad = async ({ parent }) => {
	try {
		const data: YamlData = extractYamlData() ?? { projects: [] };
		const { deviceType } = await parent();

		return {
			projects: data.projects,
			mediaFilesModules: mediaFilesModules,
			deviceType,
		};
	} catch (error) {
		console.error('Error loading YAML data:', error);
		return {
			projects: [],
			mediaFilesModules: mediaFilesModules,
		};
	}
};