const handleFetchDraftError = (err: Error) => {
	console.log(err.message);
	window.location.href = `/${err.message}`;
	// respectfully. what?????????? (always 404's for obvious reasons) TODO: figure this out
};

export default handleFetchDraftError;
