import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LinkNode } from "@lexical/link";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateNodesFromDOM } from "@lexical/html";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getRoot, $insertNodes } from "lexical";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import "./Editor.css";

type LexicalEditorProps = {
	config: Parameters<typeof LexicalComposer>["0"]["initialConfig"];
	setHTML: Function;
	htmlString?: string;
};

function ImportHTML(props: { htmlString?: string }) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		editor.update(() => {
			if (props.htmlString) {
				// In the browser you can use the native DOMParser API to parse the HTML string.
				const parser = new DOMParser();
				const dom = parser.parseFromString(
					props.htmlString,
					"text/html"
				);

				// Once you have the DOM instance it's easy to generate LexicalNodes.
				const nodes = $generateNodesFromDOM(editor, dom);

				// Select the root
				$getRoot().select();

				// Insert them at a selection.
				$insertNodes(nodes);
			}
		});
	}, [editor]);

	return null;
}

export function LexicalEditor(props: LexicalEditorProps) {
	const onChange = (editorState: any, editor: any) => {
		editor.update(() => {
			const rawHTML = $generateHtmlFromNodes(editor, null);
			props.setHTML(rawHTML);
		});
	};

	return (
		<LexicalComposer initialConfig={props.config}>
			<RichTextPlugin
				contentEditable={<ContentEditable />}
				placeholder={<Placeholder />}
				ErrorBoundary={LexicalErrorBoundary}
			/>
			<LinkPlugin />
			<ListPlugin />
			<OnChangePlugin onChange={onChange} />
			<ImportHTML htmlString={props.htmlString} />
		</LexicalComposer>
	);
}

const Placeholder = () => {
	return (
		<div className="absolute top-[1.125rem] left-[1.125rem] opacity-50">
			Start writing...
		</div>
	);
};

export default function Editor(props: {
	setHTML: Function;
	htmlString?: string;
}) {
	return (
		<div
			id="editor-wrapper"
			className={
				"relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2"
			}
		>
			<LexicalEditor
				setHTML={props.setHTML}
				config={{
					namespace: "lexical-editor",
					theme: {
						root: "editor-root",
						link: "cursor-pointer",
						text: {
							bold: "font-semibold",
							underline: "underline",
							italic: "italic",
							strikethrough: "line-through",
							underlineStrikethrough: "underlined-line-through",
						},
						list: {
							listitem: "editor-listItem",
						},
						paragraph: "editor-paragraph",
					},
					onError: (error) => {
						console.log(error);
					},
					nodes: [LinkNode, ListItemNode, ListNode],
				}}
				htmlString={props.htmlString}
			/>
		</div>
	);
}
