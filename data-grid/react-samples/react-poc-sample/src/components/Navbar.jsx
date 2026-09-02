import { useLocation, useNavigate } from 'react-router';
import '../styles/Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isGridActive = location.pathname === '/grid';
    const isHomeActive = location.pathname === '/' || location.pathname === '/index.html' || location.pathname === '/home';
    const isAdaptiveActive = location.pathname === '/adaptive';
    const isUpdateGridActive = location.pathname === '/update-grid';
    return (
        <nav className="navbar">
            <div className="navbar-container">


                <div className="navbar-menu">
                    <button
                        className={`navbar-item ${isHomeActive ? 'active' : ''}`}
                        onClick={() => navigate('/home')}
                    >
                        <span className="e-icons e-home" style={{ marginRight: '6px' }}></span>
                        Orders Grid
                    </button>
                    <button
                        className={`navbar-item ${isGridActive ? 'active' : ''}`}
                        onClick={() => navigate('/grid')}
                    >
                        <span className="e-icons" style={{ marginRight: '6px' }}></span>
                        Status Grid
                    </button>

                    <button
                        className={`navbar-item ${isAdaptiveActive ? 'active' : ''}`}
                        onClick={() => navigate('/adaptive')}
                    >
                        Adaptive Layout
                    </button>

                    <button
                        className={`navbar-item ${isUpdateGridActive ? 'active' : ''}`}
                        onClick={() => navigate('/update-grid')}
                    >
                        Update Grid
                    </button>
                </div>
            </div>
        </nav>
    );
}
