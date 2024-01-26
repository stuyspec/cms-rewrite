import { useState } from "react";
import ArticleExtra from "../../types/ArticleExtra";
import Staff from "../../types/Staff";
import ContributorPopUp from "../ContributorPopUp/ContributorPopUp";
import "./ImageExtras.css"
import Article from "../../types/Article";
import UploadImageHelper from "../UploadImageHelper/UploadImageHelper";
import useAuth from "../../helpers/useAuth";

interface Props {
    article_extras: ArticleExtra[];
    setArticleExtras: (article_extras: ArticleExtra[]) => void;
    article: Article;
}

export default function ImageExtras({ article_extras, setArticleExtras, article }: Props) {
    const { validauthtoken } = useAuth();

    const [newIndex, setNewIndex] = useState(0);
    const [newContributors, setNewContributors] = useState<Staff[]>([]);
    const [newImgSource, setNewImageSource] = useState("");

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

    const addExtra = async () => {
        setArticleExtras([...article_extras, {
            _id: "new_extra_" + Date.now(),
            article,
            type: "image",
            contributors: newContributors,
            image_src: newImgSource,
            index: newIndex
        }]);
        setNewContributors([]);
        setNewImageSource("");
        setNewIndex(0);
    }

    return <>
        <section className="image-extras">
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
        <section className="new-image-extra">
            <h2>Create a new image extra:</h2>
            <UploadImageHelper imageSource={newImgSource} setImageSource={setNewImageSource} validauthtoken={validauthtoken} />
            <ContributorPopUp
                selectedContributors={
                    newContributors
                }
                setSelectedContributors={
                    setNewContributors
                }
                title="New Extra Image Contributors:"
                max_contributors={1}
            ></ContributorPopUp>

            <p>Index of new extra in article body:</p>
            <input type="number" inputMode="numeric" value={newIndex} onChange={(e) => setNewIndex(parseInt(e.target.value))} />
            <br />
            <button onClick={addExtra} type="button">Add new Extra</button>
        </section>
    </>
}