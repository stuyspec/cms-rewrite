const verifyTokenMiddlware = require("../auth/verifyTokenMiddleware");
const isAdminMiddleware = require("../auth/isAdminMiddleware");
const router = require("express").Router();
const Article = require("../../model/Article");
const Staff = require("../../model/Staff");
const Draft = require("../../model/Draft");
const ArticleExtra = require("../../model/ArticleExtra");
const { draftValidation, createStaffValidation } = require("../../validation");
const sharp = require("sharp");
const s3 = require("../../aws");
const mongoose = require('mongoose'); // only used for bson id generation, other mongoose setup is in index.js

const uuidv1 = require("uuid").v1;

router.use(verifyTokenMiddlware);
// Base route
router.get("/", async (req, res) => {
	res.json({ message: "Index for db" });
});

// get one article
router.get("/get_article", isAdminMiddleware, getArticleHandler);
router.post("/get_article", isAdminMiddleware, getArticleHandler);


// Get all articles
router.get("/get_articles", get_articles_handler);
router.post("/get_articles", get_articles_handler);

// Create an article
router.post("/publish_article", isAdminMiddleware, async (req, res, next) => {
	try {
		const draft_id = req.body.draft_id;
		if (!draft_id) {
			res.status(400);
			throw new Error("An id of a draft to publish was not specified");
		}

		const draft_data = await Draft.findById(draft_id).lean();

		if (!draft_data) {
			res.status(404);
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
	let articles = await Article.find(query)
		.populate({ path: "cover_image_contributor", select: "-password" })
		.populate({ path: "contributors", select: "-password" });
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


async function getArticleHandler(req, res, next) {
	try {
		const slug = req.body.slug;
		if (!slug) {
			res.status(400);
			throw new Error("A slug must be provided to fetch article.");
		}

		const articles = await get_articles({ slug });
		if (articles.length == 0) {
			res.status(404);
			throw new Error("No article with that slug found.");
		}

		const article = articles[0];

		const article_extras = await ArticleExtra.find({ 'article': article._id }).populate({ path: "contributors", select: "-password" });

		return res.json({
			article,
			article_extras
		})

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

		const saved_draft = await create_draft(req.body, req.user._id);
		res.json({
			draft: saved_draft,
			description: "Successfully created the draft.",
		});
	} catch (error) {
		next(error);
	}
});

router.post("/update_article", isAdminMiddleware, async (req, res, next) => {
	try {
		const article_id = req.body.article_id;

		if (!article_id) {
			throw new Error("Article id must be specified!");
		}

		if (!req.body.text) {
			throw new Error("Article text must be specified!");
		}

		const article = await Article.findById(article_id);
		if (!article) {
			res.status(404);
			throw new Error("No article with that id found.");
		}

		await Article.findByIdAndUpdate(article_id, { text: req.body.text }, {
			upsert: false,
		})

		// handle article extras
		await ArticleExtra.deleteMany({ 'article': article_id });

		const new_extras = req.body.article_extras.map(v => { return { ...v, _id: new mongoose.Types.ObjectId() } });

		let extras = await ArticleExtra.create(new_extras);

		return res.json({
			extras,
			success: true
		})

	} catch (error) {
		next(error);
	}
});

const editMiddleware = async function (req, res, next) {
	try {
		if (!req.user.isApproved) {
			throw new Error("User has not been verified.");
		}

		if (!req?.body?.draft_id) {
			throw new Error("draft_id not specified in request body");
		}

		const draft = await Draft.findById(req.body.draft_id);

		if (!draft) {
			throw new Error("Draft with that id does not exist");
		}

		req.draft = draft;
		console.log("Req user", req.user);
		if (req.user.isAdmin) {
			next();
			return;
		} else {
			const draft_owner = draft.drafter_id;
			if (draft_owner == req.user._id) {
				next();
				return;
			}
		}

		throw new Error(
			"User must be an admin or the user must own this draft."
		);
	} catch (error) {
		next(error);
	}
};

router.put("/update_draft", editMiddleware, async (req, res, next) => {
	try {
		if (!req.body.update) {
			res.status(400);
			throw new Error("update object not specified in request body");
		}
		await Draft.findByIdAndUpdate(req.body.draft_id, req.body.update, {
			upsert: false,
		})
			.populate({ path: "cover_image_contributor", select: "-password" })
			.populate({ path: "contributors", select: "-password" });
		res.json({ success: true });
	} catch (error) {
		next(error);
	}
});

router.delete("/delete_draft", editMiddleware, async (req, res, next) => {
	try {
		await Draft.findByIdAndDelete(req.draft._id);
		res.json({ success: true });
	} catch (error) {
		next(error);
	}
});
async function create_draft(query, uid) {
	const slug = String(query.title)
		.toLowerCase()
		.trim()
		.replace(/([^a-z| |0-9])/g, "") // Remove everything but the 26 ascii leters and spaces
		.replace(new RegExp(" ", "g"), "-");

	console.log("Slug: ", slug);
	let draft = await Draft.create({ ...query, drafter_id: uid, slug: slug });
	let saved_draft = await draft.save();
	return saved_draft;
}
async function get_drafts(query) {
	let drafts = await Draft.find(query)
		.populate({ path: "cover_image_contributor", select: "-password" })
		.populate({ path: "contributors", select: "-password" });
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

// Staff
async function get_staff(query) {
	let staff = await Staff.find(query).select("-password");
	return staff;
}

async function get_staff_handler(req, res, next) {
	try {
		if (req.body.fuzzy_name) {
			console.log("Search by fuzzy name: ", req.body.fuzzy_name);
			const staff = await get_staff({
				$text: { $search: req.body.fuzzy_name },
			});
			res.json({
				staff: staff,
				description:
					"Successfully retrieved staff by doing a fuzzy search.",
			});
		} else {
			const staff = await get_staff(req.body || {});
			res.json({
				staff: staff,
				description: "Successfully retrieved staff.",
			});
		}
	} catch (error) {
		next(error);
	}
}

router.get("/get_staff", get_staff_handler);
router.post("/get_staff", get_staff_handler);

// Create a staff member, aka a contributor
router.post("/create_staff", isAdminMiddleware, async (req, res, next) => {
	try {
		const validation = createStaffValidation(req.body);
		if ("error" in validation) {
			throw new Error(validation.error.details[0].message);
		}

		const slug = String(req.body.name)
			.toLowerCase()
			.trim()
			.replace(/([^a-z| ])/g, "") // Remove everything but the 26 ascii leters and spaces
			.replace(new RegExp(" ", "g"), "-");

		// Attempt to see if a staff member with that slug already exists
		const attempt_to_find_staff = await Staff.find({ slug });
		console.log({ attempt_to_find_staff });
		if (attempt_to_find_staff.length > 0) {
			throw new Error(`A staff member with slug ${slug} already exists!`);
		}

		const staff_body = {
			name: req.body.name,
			slug: slug,
			email: req.body.email,
			created_at: new Date(),
		};
		if (req.body.description && req.body.description.length > 1) {
			staff_body.description = req.body.description;
		}

		let staff = await Staff.create(staff_body);
		let saved_staff = await staff.save();

		res.json({
			message: "Created the staff member",
			staff: saved_staff,
		});
	} catch (error) {
		next(error);
	}
});

router.post("/upload_media", async (req, res, next) => {
	try {
		if (!req.files) {
			res.status(400);
			throw new Error("No files included");
		} else {
			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let file = req.files.file;
			let s = sharp(file.data);
			let { height: h, width: w } = await getHeightandWidth(s);
			if (h > 1100) {
				s.resize(1100, Math.round(h * (1100 / w)));
			}

			const sbuffer = await s.toBuffer();

			const fname = process.env.MEDIA_DIR + "/" + uuidv1() + ".jpg";
			// Setting up S3 upload parameters
			const params = {
				Bucket: process.env.BUCKET_NAME,
				Key: fname, // File name you want to save as in S3
				Body: sbuffer,
				ContentType: "image/jpg",
			};

			// Uploading files to the bucket
			const upData = await s3.upload(params).promise();

			res.json({ success: true, public_url: upData.Location });
		}
	} catch (error) {
		next(error);
	}
});

async function getHeightandWidth(s) {
	const m = await s.metadata();
	const height = m.height;
	const width = m.width;
	return { height, width };
}
module.exports.router = router;
