import { useParams } from "react-router-dom";
import handle_error from "../../helpers/handle_error";
import safe_fetch from "../../helpers/safe_fetch";
import ContributorPopUp from "../../components/ContributorPopUp/ContributorPopUp";
import Editor from "../../components/RichTextEditor/Editor";
import useSWR from 'swr';
import { useAppSelector } from "../../hooks";
import store from "../../store";
import "./edit_prod.css"

const fetcher = (input: RequestInfo,
    token: string,
    slug: string | undefined,
    ...args: any[]) => {
    if (!token) {
        return Promise.reject("No auth token provided")
    }

    return safe_fetch(input, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token,
        },
        body: JSON.stringify({
            slug: slug
        }),
    })
}

export default function EditProd() {
    const isAdmin = useAppSelector((state) => state.isAdmin.value);
    const token = useAppSelector((state) => state.validauthtoken.value);

    const { slug } = useParams();

    console.log("DEBUG TOKEN: ", token)

    // const { data, error, isLoading } = useSWR(window.BASE_URL + "/api/db/get_aricle/" + slug, fetcher as any)
    const { data, error, isLoading } = useSWR([window.BASE_URL + '/api/db/get_articles', token, slug], ([url, token, slug]) => fetcher(url, token, slug));

    if (!isAdmin) {
        return <>
            <h1>Non-admins can't view this page!</h1>
        </>
    }


    return <>
        <main id="edit_prod">
            <h1>Edit a Production Article</h1>
            <h2>Slug: {slug}</h2>
            <pre>Data: {JSON.stringify(data, null, 2)}</pre>
        </main>
    </>
}