import { Route, Routes } from "react-router-dom";
import Root from "./routes/root.jsx";
import ViewNode from "./routes/nodes/view.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Root />}>
                <Route path="nodes/:id" element={<ViewNode />} />
            </Route>
        </Routes>
    );
};