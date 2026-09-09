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
          <h1 id="page-title">Task Management Grid</h1>
          <p>Review project tasks, track progress, and organize work across your teams. Open critical rows are pinned; use the context menu to pin or unpin rows and freeze columns left or right.</p>
        </section>
        <DataGrid />
      </main>
    </div>
  );
}

export default App;
