import { useLocation, useNavigate } from 'react-router';
import '../styles/Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isGridActive = location.pathname === '/';
    const isHomeActive = location.pathname === '/home';

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
                        onClick={() => navigate('/')}
                    >
                        <span className="e-icons" style={{ marginRight: '6px' }}></span>
                        Status Grid
                    </button>


                    <button
                        className={`navbar-item `}
                        onClick={() => navigate('/adaptive')}
                    >
                        Adaptive Layout
                    </button>
                </div>
            </div>
        </nav>
    );
}
