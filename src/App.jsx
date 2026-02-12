import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BottomNav from './components/BottomNav'
import Ketua from './pages/Ketua';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ketua" element={<Ketua />} />
        
      </Routes>
      <BottomNav />
    </Router>
    
  );
}

export default App;
