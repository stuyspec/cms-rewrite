const AWS = require("aws-sdk");

// Enter copied or downloaded access ID and secret key here
const ID = process.env.AWS_ACCESS_ID;
const SECRET = process.env.AWS_ACCESS_SECRET;

const s3 = new AWS.S3({
	accessKeyId: ID,
	secretAccessKey: SECRET,
});

module.exports = s3;
