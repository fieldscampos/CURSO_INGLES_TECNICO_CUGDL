import { Link, useLocation } from 'react-router-dom';
import logo from '../logos/indigo.png';

export default function Header() {
  const location = useLocation();
  const isEnglishPage = location.pathname.startsWith('/ingles-tecnico');

  return (
    <header className="header">
      <div className="container nav-row">
        <Link to={isEnglishPage ? '/ingles-tecnico' : '/'} className="brand">
          <img src={logo} alt="Logo GDG Guadalajara" className="brand-icon-img" />
          <span className="brand-text">
            <span className="brand-main">
              {isEnglishPage ? 'Curso intensivo de Inglés Técnico' : 'Curso intensivo de Python'}
            </span>
            <span className="brand-sub">
              {isEnglishPage ? 'CUGDL × growmo.tech' : 'GDG Guadalajara'}
            </span>
          </span>
        </Link>
        <div className="nav-actions">
          <Link to={isEnglishPage ? '/' : '/ingles-tecnico'} className="btn btn-nav">
            {isEnglishPage ? 'Ver curso de Python' : 'Ver curso de inglés técnico'}
          </Link>
          <Link to="/encuesta-curso" className="btn btn-nav">
            Encuesta del curso
          </Link>
        </div>
      </div>
    </header>
  );
}
