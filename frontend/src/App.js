import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/notFoundPage/NotFoundPage";

function App() {
  return <div className="App">
    <Router>
        <Routes>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    </Router>
  </div>;
}

export default App;
