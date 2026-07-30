import { Link, useLocation } from 'react-router-dom';
import logo from '../logos/indigo.png';

export default function Header() {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/ingles-tecnico';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="container nav-row">
        <Link to="/" className="brand">
          <img src={logo} alt="Movimiento Indigo CUGDL" className="brand-icon-img" />
          <span className="brand-text">
            <span className="brand-main">Curso intensivo de Ingles tecnico</span>
            <span className="brand-sub">CUGDL x growmo.tech</span>
          </span>
        </Link>
        <div className="nav-actions">
          <Link to="/" className={`btn btn-nav ${isActive('/') ? 'is-active' : ''}`}>
            Inicio
          </Link>
          <Link to="/preregistro" className={`btn btn-nav ${isActive('/preregistro') ? 'is-active' : ''}`}>
            Pre-registro
          </Link>
          <Link to="/encuesta-curso" className={`btn btn-nav ${isActive('/encuesta-curso') ? 'is-active' : ''}`}>
            Encuesta del curso
          </Link>
        </div>
      </div>
    </header>
  );
}
