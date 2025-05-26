import { useNavigate, useParams } from "react-router-dom";
import safe_fetch from "../../helpers/safe_fetch";
import useSWR from "swr";
import "./edit_prod.css";
import useAuth from "../../helpers/useAuth";
import Article from "../../types/Article";
import { useEffect, useState } from "react";
import ArticleExtra from "../../types/ArticleExtra";
import ImageExtras from "../../components/ImageExtras/ImageExtras";

const fetcher = (
  input: RequestInfo,
  token: string,
  slug: string | undefined,
  ...args: any[]
) => {
  if (!token) {
    return Promise.reject("No auth token provided");
  }

  const response = safe_fetch(input, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify({ slug }),
  });

  console.log(response);

  return response;
};

interface ArticlesResponse {
  article: Article;
  article_extras: ArticleExtra[];
}

export default function EditProd() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { _, validauthtoken, isAdmin } = useAuth();
  const [articleExtras, setArticleExtras] = useState<ArticleExtra[] | null>(
    null,
  );

  const { data, error, isLoading } = useSWR<ArticlesResponse>(
    [window.BASE_URL + "/api/db/get_article", validauthtoken, slug],
    ([url, token, slug]) => fetcher(url, token as string, slug as string),
  );

  const [article, setArticle] = useState({} as Article);

  useEffect(() => {
    data && setArticle(data.article);
  }, [data]);

  const updateArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (article.text == "" && articleExtras == null) {
      // means no change has occurred from the article text in the db!
      return;
    }

    console.log(article);

    const rjson = await safe_fetch(window.BASE_URL + "/api/db/update_article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": validauthtoken,
      },
      body: JSON.stringify({
        ...article,
        article_id: data?.article._id,
        article_extras:
          articleExtras != null ? articleExtras : data?.article_extras,
      }),
    });

    if (rjson.success) {
      console.log("Suceess! Reloading.");
      navigate(0);
    }
  };

  if (!isAdmin) {
    return <h1>Non-admins can't view this page!</h1>;
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error || !data) {
    return <h1>An unknown error occurred while fetching the article.</h1>;
  }

  return (
    <>
      <main id="edit_prod">
        <h1>Edit a Production Article</h1>
        <h2>Slug: {slug}</h2>
        <p>Slug:</p>
        <input
          type="text"
          value={article.slug || ""}
          onChange={(e) => setArticle({ ...article, slug: e.target.value })}
        />

        <p>Title:</p>
        <input
          type="text"
          value={article.title || ""}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
        />

        <p>Section Id:</p>
        <input
          type="number"
          value={article.section_id || 0}
          onChange={(e) =>
            setArticle({ ...article, section_id: +e.target.value })
          }
        />

        <p>
          For section id:{" "}
          {[
            "news",
            "features",
            "opinions",
            "science",
            "humor",
            "sports",
            "ae",
            "media",
            "spec-plus",
          ]
            .map((v, i) => `${i}: ${v}`)
            .join("; ")}
        </p>

        <form onSubmit={updateArticle}>
          <p>Volume:</p>
          <input
            type="number"
            value={article.volume || 0}
            onChange={(e) =>
              setArticle({ ...article, volume: +e.target.value })
            }
          />
          <p>Issue:</p>
          <input
            type="number"
            value={article.issue || 0}
            onChange={(e) => setArticle({ ...article, issue: +e.target.value })}
          />
          <p>Article text:</p>

          <textarea
            name="text"
            className="article-text"
            value={article.text || ""}
            onChange={(e) => setArticle({ ...article, text: e.target.value })}
          ></textarea>
          <ImageExtras
            article={article}
            article_extras={
              articleExtras != null ? articleExtras : data.article_extras
            }
            setArticleExtras={setArticleExtras}
          />
          <input type="submit" value="Update production article" />
        </form>

        <section>
          <h2>Notes:</h2>
          <p>To create an image within the body, use:</p>
          <code>{'<div class="content_img"></div>'}</code>
        </section>
      </main>
    </>
  );
}
