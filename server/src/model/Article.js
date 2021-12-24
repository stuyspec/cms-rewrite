const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
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
	section: {
		required: true,
		type: String,
	},
	summary: {
		required: true,
		type: String,
	},
	cover_image: {
		required: true,
		type: String,
	},
	cover_image_contributor: {
		required: true,
		type: String,
	},
	is_published: {
		required: true,
		type: Boolean,
	},
});

const articleModelfordb = mongoose.model("article", articleSchema);

module.exports = articleModelfordb;
