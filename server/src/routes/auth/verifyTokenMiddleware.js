const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	try {
		const token = req.header("auth-token");
		if (!token) {
			throw new Error("Token not included");
		}
		// console.log("verify token middleware says token: ", token);
		// console.log("type of token: ", typeof token);
		// console.log("jwt secret: ", process.env.ACCESS_TOKEN_SECRET);
		const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = verified;
		next();
	} catch (error) {
		next(error);
	}
};
