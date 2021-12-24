// App.js
import * as React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Login from "./routes/login/login";
import { Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<div>
			<Navbar />
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="login" element={<Login />} />
				</Routes>
			</main>
		</div>
	);
}

function Home() {
	return (
		<main>
			<h1>Home</h1>
		</main>
	);
}

export default App;
