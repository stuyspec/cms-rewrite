import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";

const container = document.getElementById("root") as HTMLElement;

const root = ReactDOMClient.createRoot(container);

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);
