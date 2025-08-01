import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage"; // Importa la nuova pagina

function App() {
  return (
    <Router>
      <Routes>
        {/* Route con layout condiviso */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} /> {/* Nuova rotta */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

