const verifyTokenMiddlware = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const router = require("express").Router();
const Article = require("../../model/Article");

router.use(verifyTokenMiddlware);
// Base route
router.get("/", async (req, res) => {
	res.json({ message: "Index for db" });
});

// Get all articles
router.get("/get_articles", get_articles_handler);
router.post("/get_articles", get_articles_handler);
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
module.exports.router = router;
