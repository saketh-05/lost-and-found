import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing"; // Make sure the file exists and is correctly named
import ReportLostItem from "./pages/ReportLostItem";
import ReportFoundItem from "./pages/ReportFoundItem";
import AboutUs from "./pages/AboutUs"; // Ensure this file exists and is correctly named
import Auth from "./pages/Auth"; // Ensure this file exists and is correctly named
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<Auth/>} />
        <Route path='/reportlostitem' element={<ReportLostItem />} />
        <Route path='/reportfounditem' element={<ReportFoundItem />} />
        <Route path='/about-us' element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
