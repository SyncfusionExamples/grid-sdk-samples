import { BrowserRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import './Home.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Grid from './components/Grid';
import Adaptive from './components/Adaptive';

const appBasePath = import.meta.env.DEV ? '/' : '/CustomDemos/868499';

function App() {
  return (
    <Router basename={appBasePath}>
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Grid />} />
            <Route path="/index.html" element={<Grid />} />
            <Route path="/home" element={<Home />} />
            <Route path="/adaptive" element={<Adaptive />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
