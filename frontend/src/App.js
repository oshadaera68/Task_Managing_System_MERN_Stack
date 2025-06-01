import {Route, Routes} from "react-router-dom";
import NotFoundPage from "./components/notFoundPage/NotFoundPage";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import CrudPage from "./components/crudPage/CrudPage";

function App() {
    return (<div className="App">
            <Routes>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/crud" element={<CrudPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
                <Route path="/" element={<Login/>}/>
            </Routes>
        </div>);
}

export default App;
