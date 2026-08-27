import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import './Home.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Grid from './components/Grid';
import Adaptive from './components/Adaptive';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Grid />} />
            <Route path="/home" element={<Home />} />
            <Route path="/adaptive" element={<Adaptive />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
