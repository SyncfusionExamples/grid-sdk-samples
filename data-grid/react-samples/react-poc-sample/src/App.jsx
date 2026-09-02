import { HashRouter as Router, Routes, Route, Navigate } from 'react-router';
import './App.css';
import './Home.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Grid from './components/Grid';
import Adaptive from './components/Adaptive';
import UpdateGrid from './components/UpdateGrid';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/grid" element={<Grid />} />
            <Route path="/adaptive" element={<Adaptive />} />
            <Route path="/update-grid" element={<UpdateGrid />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;