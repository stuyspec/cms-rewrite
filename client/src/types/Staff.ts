export default interface Staff {
	_id: string;
	name: string;
	email: string;
	description: string | undefined;
	slug: string;
	created_at: Date;
}
