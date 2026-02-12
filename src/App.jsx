import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BottomNav from './components/BottomNav'
import Ketua from './pages/Ketua';
import All from './components/All';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ketua" element={<Ketua />} />
        {/* <Route path="/ketua" element={<Ketua folderName="Ketua" />} /> */}
        <Route path="/all" element={<All />} />
        
      </Routes>
      {/* <BottomNav /> */}
    </Router>
    
  );
}

export default App;
