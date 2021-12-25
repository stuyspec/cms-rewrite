const verifyTokenMiddlware = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const router = require("express").Router();
const Article = require("../../model/Article");
const Draft = require("../../model/Draft");
const { draftValidation } = require("../../validation");

router.use(verifyTokenMiddlware);
// Base route
router.get("/", async (req, res) => {
	res.json({ message: "Index for db" });
});

// Get all articles
router.get("/get_articles", get_articles_handler);
router.post("/get_articles", get_articles_handler);

// Create an article
router.post("/publish_article", isAdminMiddleware, async (req, res, next) => {
	try {
		const draft_id = req.body.draft_id;
		if (!draft_id) {
			throw new Error("An id of a draft to publish was not specified");
		}

		const draft_data = await Draft.findById(draft_id).lean();

		if (!draft_data) {
			throw new Error(
				`A draft with an id of ${draft_id} does not exist.`
			);
		}

		delete draft_data._id;
		delete draft_data.drafter_id;
		delete draft_data.__v;

		draft_data.is_published = true;

		const articlewriter = await Article.create(draft_data);
		const saved_article = await articlewriter.save();

		await Draft.deleteOne({ _id: draft_id });

		res.json({
			message: "Published the article",
			article: saved_article,
		});
	} catch (error) {
		next(error);
	}
});

async function get_articles(query) {
	let articles = await Article.find(query);
	return articles;
}
async function get_articles_handler(req, res, next) {
	try {
		const articles = await get_articles(req.body || {});
		res.json({
			articles: articles,
			description: "Successfully retrieved articles.",
		});
	} catch (error) {
		next(error);
	}
}

// Get all articles
router.get("/get_drafts", get_drafts_handler);
router.post("/get_drafts", get_drafts_handler);

router.post("/create_draft", async (req, res, next) => {
	try {
		console.log("Req.user: ", req.user);
		const validation = draftValidation(req.body);
		if ("error" in validation) {
			throw new Error(validation.error.details[0].message);
		}
		const saved_draft = await create_draft(req.body, req.user._id);
		res.json({
			draft: saved_draft,
			description: "Successfully created the draft.",
		});
	} catch (error) {
		next(error);
	}
});

async function create_draft(query, uid) {
	let draft = await Draft.create({ ...query, drafter_id: uid });
	let saved_draft = await draft.save();
	return saved_draft;
}
async function get_drafts(query) {
	let drafts = await Draft.find(query);
	return drafts;
}

async function get_drafts_handler(req, res, next) {
	try {
		const drafts = await get_drafts(req.body || {});
		res.json({
			drafts: drafts,
			description: "Successfully retrieved drafts.",
		});
	} catch (error) {
		next(error);
	}
}

module.exports.router = router;
