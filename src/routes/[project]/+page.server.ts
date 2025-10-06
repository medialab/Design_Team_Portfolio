import type { PageServerLoad } from './$types';
import { extractYamlData, projectMediaFilesObtainer } from '$lib/functions';
import { mediaFilesModules } from '$lib/images';
import { error, type HttpError } from '@sveltejs/kit';

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
			mediaFilesModules,
		};

	} catch (err) {
		// Check if this is already an HttpError from SvelteKit
		if (err && typeof err === 'object' && 'status' in err) {
			const httpError = err as HttpError;
			// Log the error with context for monitoring
			console.error(`[${httpError.status}] Error loading project "${params.project}":`, httpError.body?.message || err);
			// Rethrow the original HttpError (preserves 404, 500, etc.)
			throw err;
		}
		
		// For unexpected errors (YAML parse failures, filesystem errors, etc.)
		console.error(`[500] Unexpected error loading project "${params.project}":`, err);
		// Throw a proper 500 error so operators notice real faults
		const errorMessage = err instanceof Error ? err.message : String(err);
		throw error(500, `Internal server error while loading project: ${errorMessage}`);
	}
};
