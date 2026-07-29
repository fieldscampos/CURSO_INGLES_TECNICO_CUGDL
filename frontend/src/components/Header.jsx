import { Link } from 'react-router-dom';
import logo from '../logos/growmo.png';

export default function Header() {
  return (
    <header className="header">
      <div className="container nav-row">
        <Link to="/" className="brand">
          <img src={logo} alt="Logo Growmo Tech" className="brand-icon-img" />
          <span className="brand-text">
            <span className="brand-main">Curso intensivo de Ingles tecnico</span>
            <span className="brand-sub">CUGDL x growmo.tech</span>
          </span>
        </Link>
        <div className="nav-actions">
          <Link to="/" className="btn btn-nav">
            Inicio
          </Link>
          <Link to="/preregistro" className="btn btn-nav">
            Pre-registro
          </Link>
          <Link to="/encuesta-curso" className="btn btn-nav">
            Encuesta del curso
          </Link>
        </div>
      </div>
    </header>
  );
}
