import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import GDGLogo from '../logos/GDG Guadalajara (1).png';
import CUGDLLogo from '../logos/Logos CUGDL-06.png';

const PERSONNEL_TYPES = [
  { value: 'academic', label: 'Personal Académico / Docente' },
  { value: 'administrative', label: 'Personal Administrativo / Operativo' },
  { value: 'directive', label: 'Directivo' }
];

const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const SCHEDULE_OPTIONS = [
  { value: 'tuesday', label: 'Martes de 6:00 PM a 8:00 PM' },
  { value: 'saturday', label: 'Sábado de 10:00 AM a 12:00 PM' }
];

export default function AcademicRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    personnelType: '',
    department: '',
    email: '',
    phoneExtension: '',
    shirtSize: '',
    courseInterest: false,
    preferredSchedule: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }

    if (!formData.personnelType) {
      setError('El tipo de personal es requerido');
      return false;
    }

    if (!formData.department.trim()) {
      setError('El área/coordinación/departamento es requerido');
      return false;
    }

    if (!formData.email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingresa un correo válido');
      return false;
    }

    if (!formData.shirtSize) {
      setError('La talla de playera es requerida');
      return false;
    }

    if (formData.courseInterest && !formData.preferredSchedule) {
      setError('Debes seleccionar un horario de preferencia');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/registrations/academic-registro', {
        full_name: formData.fullName,
        personnel_type: formData.personnelType,
        department: formData.department,
        email: formData.email,
        phone_extension: formData.phoneExtension || null,
        shirt_size: formData.shirtSize,
        course_interest: formData.courseInterest,
        preferred_schedule: formData.courseInterest ? formData.preferredSchedule : null
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al enviar el formulario. Intenta de nuevo.');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="preregistration-page">
        <div className="container narrow">
          <div className="success-message">
            <h1>¡Registro completado!</h1>
            <p>Gracias por tu participación en el Curso de Python del GDG Guadalajara × CUGDL.</p>
            <p>Tu kit conmemorativo será procesado pronto.</p>
            <Link to="/" className="btn btn-primary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="preregistration-page">
      <div className="container narrow">
        <div className="preregistration-header">
          <div className="logos-row">
            <img src={GDGLogo} alt="GDG Guadalajara" className="logo" />
            <span className="separator">×</span>
            <img src={CUGDLLogo} alt="CUGDL" className="logo" />
          </div>
          <h1>Registro: Kit Conmemorativo y Participación</h1>
          <div className="intro-section">
            <p className="intro-text">
              Estimadas y estimados profesores, académicos y personal administrativo del CUGDL:
            </p>
            <p className="intro-text">
              Queremos agradecer su constante apoyo a las iniciativas tecnológicas de nuestro centro universitario. En el marco del próximo Curso de Python en colaboración con el GDG Guadalajara organizado por la sociedad de alumnos de la Division de Gestion de la Innovacion, nos complace obsequiarles un Kit Conmemorativo (playera oficial y swag del evento).
            </p>
            <p className="intro-text">
              Además, abrimos un espacio por si desean aprovechar esta oportunidad para tomar el curso intensivo de Python CUGDL. Por favor, compártanos sus datos para asegurar su kit. ¡Muchas gracias por todo lo que hacen por nuestra comunidad!
            </p>
            <p className="intro-text contact-info">
              Cualquier duda o comentario, no duden en contactarnos: <strong>jose.gonzalez5305@alumnos.udg.mx</strong>
            </p>
            <p className="intro-text signature">
              Atentamente: Alejandro Campos, Presidente de la Sociedad de Alumnos de la Division de Gestion de la Innovacion.
            </p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="preregistration-form">
          {/* Sección 1: Datos Generales e Institucionales */}
          <section className="form-section">
            <h2>Datos Generales e Institucionales</h2>
            <p className="section-description">Datos indispensables para la entrega del kit.</p>

            <div className="form-group">
              <label htmlFor="fullName">Nombre completo *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Lic. María García López"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="personnelType">Tipo de personal *</label>
              <select
                id="personnelType"
                name="personnelType"
                value={formData.personnelType}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {PERSONNEL_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department">Área, Coordinación o Departamento de adscripción *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Ej. Coordinación de Tecnologías, Control Escolar, Departamento de Ciencias"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico (para contacto y confirmación) *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nombre@correo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneExtension">Número de teléfono / Extensión</label>
              <input
                type="text"
                id="phoneExtension"
                name="phoneExtension"
                value={formData.phoneExtension}
                onChange={handleChange}
                placeholder="Ej. Ext. 2345 o +52 33 1234 5678"
              />
            </div>
          </section>

          {/* Sección 2: Su Kit de Regalo */}
          <section className="form-section">
            <h2>Su Kit de Regalo</h2>
            <p className="section-description"></p>

            <div className="form-group">
              <label htmlFor="shirtSize">Talla de playera *</label>
              <select
                id="shirtSize"
                name="shirtSize"
                value={formData.shirtSize}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {SHIRT_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <small>Corte Unisex</small>
            </div>
          </section>

          {/* Sección 3: Interés en el Curso y Horarios */}
          <section className="form-section">
            <h2>Interés en el Curso y Horarios</h2>
            <p className="section-description"></p>

            <div className="form-group">
              <label>¿Le interesaría participar como alumno(a) en este Curso de Python intensivo del CUGDL? *</label>
              <p className="field-description">.</p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="courseInterest"
                    checked={formData.courseInterest === true}
                    onChange={() => setFormData(prev => ({ ...prev, courseInterest: true }))}
                  />
                  Sí, me interesa tomar el curso
                </label>
                <label>
                  <input
                    type="radio"
                    name="courseInterest"
                    checked={formData.courseInterest === false}
                    onChange={() => setFormData(prev => ({ ...prev, courseInterest: false }))}
                  />
                  No por el momento, solo deseo recibir mi kit
                </label>
              </div>
            </div>

            {formData.courseInterest && (
              <div className="form-group">
                <label>En caso de asistir, ¿cuál es su horario de preferencia? *</label>
                <div className="radio-group">
                  {SCHEDULE_OPTIONS.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name="preferredSchedule"
                        value={option.value}
                        checked={formData.preferredSchedule === option.value}
                        onChange={handleChange}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Completar Registro'}
            </button>
            <Link to="/" className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
