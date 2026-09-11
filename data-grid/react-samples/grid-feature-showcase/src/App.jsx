import './App.css';
import DataGrid from './components/Grid';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">Task Grid</div>
      </header>
      <main className="app-main">
        <section className="intro-panel" aria-labelledby="page-title">
          <h2 id="page-title">Order Management Grid</h2>
          <p>Open critical orders are pinned; use the context menu to pin or unpin rows, freeze columns left or right.</p>
        </section>
        <DataGrid />
      </main>
    </div>
  );
}

export default App;
