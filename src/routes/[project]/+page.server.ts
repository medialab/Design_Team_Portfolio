import type { PageServerLoad } from './$types';
import { extractYamlData, projectMediaFilesObtainer } from '$lib/functions';
import { mediaFilesModules } from '$lib/images';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const data = extractYamlData();
		
		if (!data) {
			throw error(500, 'Failed to load data');
		}
		
		const project = data.projects.find((p) => p.tag === params.project);
		
		if (!project) {
			throw error(404, 'Project not found');
		}

		const projectMediaFiles = projectMediaFilesObtainer(mediaFilesModules, project.tag);

		return {
			project,
			projectMediaFiles,
		};
	} catch (err) {
		console.error('Error loading project data:', err);
		throw error(404, 'Project not found');
	}
};