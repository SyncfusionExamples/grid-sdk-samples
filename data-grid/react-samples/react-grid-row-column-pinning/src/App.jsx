import { HashRouter as Router, Routes, Route } from 'react-router';
import './App.css';
import { getPublicBasePath } from './basePath.ts';
import DataGrid from './components/Grid';

function App() {
  return (
    <Router basename={getPublicBasePath()}>
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
