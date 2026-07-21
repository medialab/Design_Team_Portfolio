export type Project = {
	title: string;
	description: string;
	link: string;
	tag: string;
	year_begin: string;
	year_end?: string;
	project_type?: string;
	team_people?: string;
	author?: string;
	sections?: MarkdownSection[];
};

export type MarkdownSection = {
	id: string;
	title: string;
	content: string;
};

export type DeviceType = {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
};

export type YamlData = {
	projects: Project[];
};

export type YamlTextModule = {
	default: string;
};

export type ImageMetadata = {
	src: string;
	width: number;
	height: number;
	format: string;
	default: string;
	space?: string;
	channels?: number;
	hasAlpha?: boolean;
	hasTransparency?: boolean;
	isOpaque?: boolean;
	orientation?: number;
	density?: number;
	hasProfile?: boolean;
	palette?: object;
	background?: string | { r: number; g: number; b: number; alpha?: number };
};

export type MousePosition = {
	x: number;
	y: number;
};

export type TrailPoint = {
	x: number;
	y: number;
	t: number;
};

export type CardVec2 = {
	x: number;
	y: number;
};

export type CardProps = {
	isMobile: boolean;
	isDimmed?: boolean;
	thumbnail: HomeCardThumbnail;
	tag: string;
	title: string;
	stackPreview?: HomeCardPreviewImage[];
	index: number;
};

export type HomeCardPreviewImage = Pick<ImageMetadata, 'src' | 'width' | 'height'>;

export type HomeCardThumbnail = HomeCardPreviewImage;

export type HomeCardDTO = {
	tag: string;
	title: string;
	thumb: HomeCardThumbnail;
	stackPreview: HomeCardPreviewImage[];
};

export type PdfWrapperProps = {
	mediafile: { default: string };
	scale: number;
	twoPage: boolean;
};
