// import { $getRoot, $getSelection } from "lexical";
// import { useEffect } from "react";

// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

// const theme = {
// 	// Theme styling goes here
// 	// ...
// };

// // When the editor changes, you can get notified via the
// // LexicalOnChangePlugin!
// function onChange(editorState: any) {
// 	editorState.read(() => {
// 		// Read the contents of the EditorState here.
// 		const root = $getRoot();
// 		const selection = $getSelection();

// 		console.log(root, selection);
// 	});
// }

// // Lexical React plugins are React components, which makes them
// // highly composable. Furthermore, you can lazy load plugins if
// // desired, so you don't pay the cost for plugins until you
// // actually use them.
// function MyCustomAutoFocusPlugin() {
// 	const [editor] = useLexicalComposerContext();

// 	useEffect(() => {
// 		// Focus the editor when the effect fires!
// 		editor.focus();
// 	}, [editor]);

// 	return null;
// }

// // Catch any errors that occur during Lexical updates and log them
// // or throw them as needed. If you don't throw them, Lexical will
// // try to recover gracefully without losing user data.
// function onError(error: Error) {
// 	console.error(error);
// }

// function Editor() {
// 	const initialConfig = {
// 		namespace: "MyEditor",
// 		theme,
// 		onError,
// 	};

// 	return (
// 		<LexicalComposer initialConfig={initialConfig}>
// 			<RichTextPlugin
// 				contentEditable={<ContentEditable />}
// 				placeholder={<div>Enter some text...</div>}
// 				ErrorBoundary={LexicalErrorBoundary}
// 			/>
// 			<OnChangePlugin onChange={onChange} />
// 			<HistoryPlugin />
// 			<MyCustomAutoFocusPlugin />
// 		</LexicalComposer>
// 	);
// }

// export default Editor;

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
			console.log("fired once!");
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
						root: "p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black",
						link: "cursor-pointer",
						text: {
							bold: "font-semibold",
							underline: "underline",
							italic: "italic",
							strikethrough: "line-through",
							underlineStrikethrough: "underlined-line-through",
						},
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
