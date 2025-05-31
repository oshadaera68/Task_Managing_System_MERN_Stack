import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/notFoundPage/NotFoundPage";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
