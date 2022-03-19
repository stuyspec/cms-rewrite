const handleFetchDraftError = (err: Error) => {
    console.log(err.message);
    window.location.href = `/${err.message}`;
};

export default handleFetchDraftError;
