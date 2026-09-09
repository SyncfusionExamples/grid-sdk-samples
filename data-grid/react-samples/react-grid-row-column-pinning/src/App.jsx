import { HashRouter as Router, Routes, Route, Navigate } from 'react-router';
import './App.css';

import DataGrid from './components/Grid';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<DataGrid />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
