import { useParams } from "react-router-dom";
import handle_error from "../../helpers/handle_error";
import safe_fetch from "../../helpers/safe_fetch";
import ContributorPopUp from "../../components/ContributorPopUp/ContributorPopUp";
import Editor from "../../components/RichTextEditor/Editor";
import useSWR from 'swr';
import "./edit_prod.css"
import useAuth from "../../helpers/useAuth";


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
    const { loading, validauthtoken, isAdmin } = useAuth();

    const { slug } = useParams();


    // const { data, error, isLoading } = useSWR(window.BASE_URL + "/api/db/get_aricle/" + slug, fetcher as any)
    const { data, error, isLoading } = useSWR([window.BASE_URL + '/api/db/get_articles', validauthtoken, slug], ([url, token, slug]) => fetcher(url, token, slug));

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