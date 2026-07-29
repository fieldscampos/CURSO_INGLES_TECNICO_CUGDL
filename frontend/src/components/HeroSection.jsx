import { Link } from 'react-router-dom';
import GDGLogo from '../logos/GDG Guadalajara (1).png';
import CUGDLLogo from '../logos/Logos CUGDL-06.png';
import IndigoLogo from '../logos/indigo.png';
import { 
  ClockIcon, 
  TargetIcon, 
  CertificateIcon, 
  ArrowRightIcon 
} from '../utils/icons';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* Header con logos y título */}
          <div className="hero-header">
            <div className="header-left">
              <img src={IndigoLogo} alt="Python Indigo" className="indigo-logo" />
              <h1 className="header-title">Curso Intensivo de Python</h1>
            </div>
            <div className="header-right">
              <div className="hero-logos">
                <img src={GDGLogo} alt="GDG Guadalajara" className="logo" />
                <span className="logo-separator">×</span>
                <img src={CUGDLLogo} alt="CUGDL" className="logo" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="hero-text">
            <p className="kicker">2026 - 5 Semanas Intensivas</p>
            <h2 className="hero-subtitle">
              De cero a construir tu primera <span className="highlight">aplicación web</span>
            </h2>
            <p className="hero-description">
              Un programa práctico orientado a la industria. Aprende Python desde lo básico hasta crear aplicaciones web interactivas. Sin requisitos previos. Certificación oficial incluida.
            </p>

            {/* Pills/Badges */}
            <div className="pills-row">
              <span className="pill">
                <ClockIcon size="sm" className="pill-icon" />
                5 semanas
              </span>
              <span className="pill">
                <TargetIcon size="sm" className="pill-icon" />
                Nivel principiante
              </span>
              <span className="pill">
                <CertificateIcon size="sm" className="pill-icon" />
                Certificación oficial
              </span>
            </div>

            {/* CTA Button */}
            <Link to="/preregistro" className="btn btn-primary btn-lg">
              Comienza tu pre-registro
              <ArrowRightIcon size="sm" className="btn-arrow" />
            </Link>
          </div>

          {/* Visual Code Block */}
          <div className="hero-code">
            <div className="code-block">
              <div className="code-header">
                <span className="code-title">app.py</span>
                <span className="code-status">learning</span>
              </div>
              <pre className="code-content">{`from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "¡Bienvenido a Python!"

if __name__ == '__main__':
    app.run()`}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
