import Staff from "./Staff";

export default interface Draft {
	_id: string;
	text: string;
	title: string;
	slug: string;
	contributors: Staff[];
	volume: number;
	issue: number;
	section_id: number;
	summary: string;
	cover_image: string;
	cover_image_summary: string;
	cover_image_contributor: Staff;
	cover_image_source: string;
	sub_section: string | undefined;
}
