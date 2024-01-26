import ArticleExtra from "../../types/ArticleExtra";
import Staff from "../../types/Staff";
import ContributorPopUp from "../ContributorPopUp/ContributorPopUp";
import "./ImageExtras.css"

interface Props {
    article_extras: ArticleExtra[];
    setArticleExtras: (article_extras: ArticleExtra[]) => void
}

export default function ImageExtras({ article_extras, setArticleExtras }: Props) {
    const image_extras = article_extras.filter(v => v.type == "image");

    const setSelectedImageContributors = async (contributors: Staff[], _id: string) => {
        const index = article_extras.findIndex(v => v._id == _id);
        article_extras[index].contributors = contributors;
        setArticleExtras(structuredClone(article_extras));
    }

    const deleteExtra = async (_id: string) => {
        setArticleExtras(structuredClone(article_extras.filter(v => v._id != _id)));
    }

    const updateIndex = async (indexStr: string, _id: string) => {
        const index = article_extras.findIndex(v => v._id == _id);
        article_extras[index].index = parseInt(indexStr);
        setArticleExtras(structuredClone(article_extras));
    }

    return <section className="image-extras">
        {image_extras.map((extra: ArticleExtra, index: number) => <div key={extra._id} className="image-extra">
            <h2>Image extra:</h2>
            <img src={extra.image_src} alt="Image extra for article" />
            <ContributorPopUp
                selectedContributors={
                    extra.contributors
                }
                setSelectedContributors={
                    (contributors: Staff[]) => setSelectedImageContributors(contributors, extra._id)
                }
                title="Extra Image Contributors:"
                max_contributors={1}
            ></ContributorPopUp>

            <p>Index of extra in article body:</p>
            <input type="number" inputMode="numeric" value={extra.index} onChange={(e) => updateIndex(e.target.value, extra._id)} />
            <br />
            <button onClick={() => deleteExtra(extra._id)}>Delete extra</button>
        </div>)}
    </section>
}