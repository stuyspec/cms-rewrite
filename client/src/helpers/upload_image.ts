import store from "../store";
import safe_fetch from "./safe_fetch";

interface UploadCoverImageResponse {
	success: boolean;
	public_url: string;
}

const upload_image_helper = async (uploaded_file: File) => {
	const formData = new FormData();
	formData.append("file", uploaded_file);
	const uploaded_json = (await safe_fetch(
		window.BASE_URL + "/api/db/upload_media",
		{
			method: "POST",
			body: formData,
			headers: {
				"auth-token": store.getState().validauthtoken.value,
			},
		}
	)) as UploadCoverImageResponse;

	if (uploaded_json.success) {
		return uploaded_json.public_url;
	}
};

export default upload_image_helper;
