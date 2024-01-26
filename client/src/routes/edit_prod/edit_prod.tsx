import { useParams } from "react-router-dom";
import safe_fetch from "../../helpers/safe_fetch";
import useSWR from 'swr';
import "./edit_prod.css"
import useAuth from "../../helpers/useAuth";
import Article from "../../types/Article";
import { useState } from "react";
import ArticleExtra from "../../types/ArticleExtra";

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
        body: JSON.stringify({ slug }),
    })
}

interface ArticlesResponse {
    article: Article;
    article_extras: ArticleExtra[];
}

export default function EditProd() {
    const { slug } = useParams();
    const { loading, validauthtoken, isAdmin } = useAuth();
    const [text, setText] = useState("");

    const { data, error, isLoading } = useSWR<ArticlesResponse>([window.BASE_URL + '/api/db/get_article', validauthtoken, slug], ([url, token, slug]) => fetcher(url, token as string, slug as string));

    const updateArticle = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (text == "") {
            // means no change has occurred from the article text in the db!
            return;
        }
    }

    if (!isAdmin) {
        return <h1>Non-admins can't view this page!</h1>
    }

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (error || !data) {
        return <h1>An unknown error occurred while fetching the article.</h1>
    }

    let article = data.article;
    article.text = article.text.replaceAll("</p><", "</p>\n\n<"); // for visual change, no difference

    return <>
        <main id="edit_prod">
            <h1>Edit a Production Article</h1>
            <h2>Slug: {slug}</h2>
            <form onSubmit={updateArticle}>
                <textarea name="text" className="article-text" value={text || article.text} onChange={(e) => setText(e.target.value)}></textarea>
                <input type="submit" value="Update production article" />
            </form>

            <section>
                <h2>Notes:</h2>
                <p>To create an image within the body, use:</p>
                <code>{'<div class="content_img"></div>'}</code>
            </section>

            <pre>{JSON.stringify(data.article_extras, null, 2)}</pre>
        </main>
    </>
}