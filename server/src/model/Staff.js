const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String,
	},
	email: {
		required: true,
		type: String,
	},
	slug: {
		required: true,
		type: String,
	},
	position: {
		type: String,
	},
	role: {
		type: String,
	},
	description: {
		type: String,
	},
	pfp_url: {
		type: String,
	},
	years: [
		{
			type: Number,
		},
	],
	created_at: {
		type: Date,
		required: true,
	},
});
staffSchema.index({ name: "text" });

const staffModelfordb = mongoose.model("staff", staffSchema);

module.exports = staffModelfordb;
