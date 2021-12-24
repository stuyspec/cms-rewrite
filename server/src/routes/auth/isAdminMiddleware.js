const checkIsAdmin = require("./auth").checkIsAdmin;
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
	try {
		const token = req.header("auth-token");
		if (!token) {
			throw new Error("No token was provided");
		}

		const uid = req.user._id;

		const userisAdmin = await checkIsAdmin(uid);

		if (userisAdmin) {
			next();
		} else {
			throw new Error("User is not an admin.");
		}
	} catch (error) {
		next(error);
	}
};
