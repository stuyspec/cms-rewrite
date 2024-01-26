const mongoose = require("mongoose");

const StaffModel = require("./Staff");

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
		type: [mongoose.Schema.Types.ObjectId],
		ref: StaffModel.modelName,
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
		type: [mongoose.Schema.Types.ObjectId],
		ref: StaffModel.modelName,
	},
	is_published: {
		required: true,
		type: Boolean,
	},
	sub_section: {
		type: String,
	},
	rank: {
		type: Number
	}
});

const articleModelfordb = mongoose.model("article", articleSchema);

module.exports = articleModelfordb;
