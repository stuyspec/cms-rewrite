const router = require("express").Router();

router.get("/", async (req, res) => {
	res.json({ message: "Index for db" });
});

module.exports.router = router;
