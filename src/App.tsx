import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import MatrixCalculator from "@/pages/MatrixCalculator";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/matrix" element={<MatrixCalculator />} />
			</Routes>
		</Router>
	);
}

export default App;
