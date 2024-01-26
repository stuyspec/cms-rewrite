import Article from "./Article";
import Staff from "./Staff";

export default interface ArticleExtra {
    _id: string;
    article: Article;
    contributors: Staff[];
    type: "image";
    index: number;
    image_src: string;
}
