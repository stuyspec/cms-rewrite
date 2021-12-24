const verifyTokenMiddlware = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const router = require("express").Router();
const Article = require("../../model/Article");
const Draft = require("../../model/Draft");
const { draftValidation } = require("../auth/validation");

router.use(verifyTokenMiddlware);
// Base route
router.get("/", async (req, res) => {
	res.json({ message: "Index for db" });
});

// Get all articles
router.get("/get_articles", get_articles_handler);
router.post("/get_articles", get_articles_handler);

// Do not have create article route
// Article must be drafted first
/* 
// Create an article
router.post("/create_article", isAdminMiddleware, async (req, res, next) => {
	try {
		const saved_article = await create_article(req.body);
		res.json({
			article: saved_article,
			description: "Successfully created the article.",
		});
	} catch (error) {
		next(error);
	}
});

async function create_article(query) {
	let article = await Article.create(query);
	let saved_article = await article.save();
	return saved_article;
}
*/
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
		const validation = draftValidation(req.body);
		if ("error" in validation) {
			throw new Error(validation.error.details[0].message);
		}

		const saved_draft = await create_draft(req.body);
		res.json({
			draft: saved_draft,
			description: "Successfully created the draft.",
		});
	} catch (error) {
		next(error);
	}
});

async function create_draft(query) {
	let draft = await Draft.create(query);
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
