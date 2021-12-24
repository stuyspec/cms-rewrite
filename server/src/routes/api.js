const router = require("express").Router();
const dbRouter = require("./db/db").router;
router.get("/", (req, res) => {
	res.json({ message: "Hello world from /api." });
});
router.use("/db", dbRouter);

module.exports.router = router;
