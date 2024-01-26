const mongoose = require("mongoose");

const StaffModel = require("./Staff");
const ArticleModel = require("./Article");

const articleExtraSchema = new mongoose.Schema({
    article: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: ArticleModel.modelName,
    },
    contributors: {
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: StaffModel.modelName,
    },
    type: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    image_src: {
        type: String,
    },
});

const articleExtrafordb = mongoose.model("article_extra", articleExtraSchema);

module.exports = articleExtrafordb;
