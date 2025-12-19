import LandingPage from "./pages/Landing"
import LegalChatbotPage from "./pages/LegalChatbotPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/legal-chatbot" element={<LegalChatbotPage />} />
      </Routes>
    </Router>
  )
}

export default App
