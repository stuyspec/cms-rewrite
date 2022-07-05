const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema({
	text: {
		required: true,
		type: String,
	},
	title: {
		required: true,
		type: String,
	},
	slug: {
		required: true,
		type: String,
	},
	contributors: {
		required: true,
		type: [String],
	},
	volume: {
		required: true,
		type: Number,
	},
	issue: {
		required: true,
		type: Number,
	},
	section_id: {
		required: true,
		type: Number,
	},
	summary: {
		required: true,
		type: String,
	},
	cover_image: {
		type: String,
	},
	cover_image_contributor: {
		type: String,
	},
	drafter_id: {
		required: true,
		type: String,
	},
});

const draftModelfordb = mongoose.model("Draft", draftSchema);

module.exports = draftModelfordb;
