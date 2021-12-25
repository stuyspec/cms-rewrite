export default interface Draft {
	_id: string;
	text: string;
	title: string;
	slug: string;
	contributors: string[];
	volume: number;
	issue: number;
	section: string;
	summary: string;
	cover_image: string;
	cover_image_contributor: string;
	drafter_id: string;
}
