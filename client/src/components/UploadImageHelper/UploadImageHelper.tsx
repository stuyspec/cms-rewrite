import { useRef } from "react";
import upload_image_helper from "../../helpers/upload_image";

interface Props {
    imageSource: string;
    setImageSource: (v: string) => void;
    validauthtoken: string;
}

export default function UploadImageHelper({ imageSource, setImageSource, validauthtoken }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const upload_cover_image = async () => {
        // In case event listener remains, or is triggered manually, etc
        const uploaded_files = fileInputRef.current?.files;
        if (uploaded_files && uploaded_files.length > 0) {
            const uploaded_file = uploaded_files[0]; // always grab first
            const public_url = (await upload_image_helper(
                uploaded_file, validauthtoken
            )) as string;
            console.log(public_url);
            setImageSource(public_url);
        }
    };


    return <div>
        <img
            id="image"
            src={imageSource}
        />
        <div>
            <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                className="upload_image"
                onChange={upload_cover_image}
                ref={fileInputRef}
            />
        </div>
    </div>
}