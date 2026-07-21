const fileName = (pathOrName: string): string => {
	const base = pathOrName.split('/').pop() || pathOrName;
	return base;
};

export const buildDidascaliaByStem = (
	mediaCaptions: Record<string, string>
): Record<string, string> => {
	const result: Record<string, string> = {};
	const seen = new Set<string>();

	for (const [key, description] of Object.entries(mediaCaptions)) {
		const name = fileName(key);
		if (!name) continue;
		if (description.trim().length === 0) continue;

		if (seen.has(name)) {
			console.warn(`Duplicate stem collision: "${name}" appears multiple times (from "${key}"). Using the last entry.`);
		}
		seen.add(name);
		result[name] = description.trim();
	}

	return result;
};

export const stemFromFilePath = (pathOrName: string): string => fileName(pathOrName);
