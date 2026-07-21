const fileStem = (pathOrName: string): string | null => {
	const baseName = pathOrName.split('/').pop();
	if (!baseName) return null;
	const withoutExt = baseName.replace(/\.[^.]+$/, '');
	return withoutExt || null;
};

export const buildDidascaliaByStem = (
	mediaCaptions: Record<string, string>
): Record<string, string> => {
	const result: Record<string, string> = {};

	for (const [filename, description] of Object.entries(mediaCaptions)) {
		const stem = fileStem(filename);
		if (!stem) continue;
		if (description.trim().length === 0) continue;
		result[stem] = description.trim();
	}

	return result;
};

export const stemFromFilePath = (pathOrName: string): string | null => fileStem(pathOrName);
