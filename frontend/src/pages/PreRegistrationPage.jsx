import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import GDGLogo from '../logos/GDG Guadalajara (1).png';
import CUGDLLogo from '../logos/Logos CUGDL-06.png';

const CAREERS = [
  'Ciberseguridad',
  'Inteligencia Artificial',
  'Creatividad Digital',
  'Inteligencia Financiera',
  'Tecnologías Biomédicas',
  'Otro centro universitario/Externo CUGDL'
];

const SEMESTERS = ['1ro', '2do', '3ro', '4to'];

const PROGRAMMING_LEVELS = ['Nulo', 'Básico', 'Intermedio', 'Avanzado'];

const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function PreRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentCode: '',
    institutionalEmail: '',
    personalEmail: '',
    phoneWhatsapp: '',
    career: '',
    semester: '',
    programmingLevel: '',
    pythonExperience: false,
    operatingSystem: '',
    hasLaptop: false,
    preferredDays: '', // 'weekdays', 'weekend', o 'both'
    preferredSchedule: '', // 'afternoon', 'evening', o 'both'
    motivation: '',
    shirtSize: '',
    attendanceCommitment: false,
    paymentOption: '', // 'payment' o 'scholarship'
    scholarshipReason: ''
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
    // Validaciones requeridas
    if (!formData.fullName.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }

    if (!formData.studentCode.trim()) {
      setError('El código de estudiante es requerido');
      return false;
    }

    if (!/^\d+$/.test(formData.studentCode)) {
      setError('El código de estudiante debe contener solo números');
      return false;
    }

    if (!formData.institutionalEmail.trim()) {
      setError('El email institucional es requerido');
      return false;
    }

    if (!formData.institutionalEmail.endsWith('@alumnos.udg.mx')) {
      setError('El email institucional debe terminar en @alumnos.udg.mx');
      return false;
    }

    if (!formData.career) {
      setError('La carrera es requerida');
      return false;
    }

    if (!formData.semester) {
      setError('El semestre es requerido');
      return false;
    }

    if (!formData.programmingLevel) {
      setError('El nivel de experiencia es requerido');
      return false;
    }

    if (!formData.operatingSystem) {
      setError('El sistema operativo es requerido');
      return false;
    }

    if (!formData.preferredDays) {
      setError('Tu preferencia de días es requerida');
      return false;
    }

    if (!formData.preferredSchedule) {
      setError('Tu preferencia de horario es requerida');
      return false;
    }

    if (!formData.motivation.trim()) {
      setError('La motivación es requerida');
      return false;
    }

    if (!formData.shirtSize) {
      setError('La talla de playera es requerida');
      return false;
    }

    if (!formData.attendanceCommitment) {
      setError('Debes aceptar el compromiso de asistencia');
      return false;
    }

    if (!formData.paymentOption) {
      setError('Debes seleccionar una opción de pago o beca');
      return false;
    }

    if (formData.paymentOption === 'scholarship' && !formData.scholarshipReason.trim()) {
      setError('Debes explicar por qué solicitas la beca');
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
      await api.post('/registrations/pre-registro', {
        full_name: formData.fullName,
        student_code: formData.studentCode,
        institutional_email: formData.institutionalEmail,
        personal_email: formData.personalEmail || null,
        phone_whatsapp: formData.phoneWhatsapp || null,
        career: formData.career,
        semester: formData.semester,
        programming_level: formData.programmingLevel,
        python_experience: formData.pythonExperience,
        operating_system: formData.operatingSystem,
        has_laptop: formData.hasLaptop,
        preferred_days: formData.preferredDays,
        preferred_schedule: formData.preferredSchedule,
        motivation: formData.motivation,
        shirt_size: formData.shirtSize,
        attendance_commitment: formData.attendanceCommitment,
        payment_option: formData.paymentOption,
        scholarship_reason: formData.paymentOption === 'scholarship' ? formData.scholarshipReason : null
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
            <h1>¡Pre-registro completado!</h1>
            <p>Gracias por tu interés en el Curso de Python del GDG Guadalajara × CUGDL.</p>
            <p>Nos pondremos en contacto pronto con más detalles sobre el curso.</p>
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
          <h1>Pre-Registro: Curso de Python</h1>
          <p className="intro-text">
            ¡Hola! Te damos la bienvenida al pre-registro para el Curso de Python organizado por el CUGDL en colaboración con el GDG Guadalajara.
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="preregistration-form">
          {/* Sección 1: Información Personal e Institucional */}
          <section className="form-section">
            <h2>Información Personal e Institucional</h2>
            <p className="section-description">Esta sección es indispensable para validar que sean alumnos del centro y poder contactarlos.</p>
            
            <div className="form-group">
              <label htmlFor="fullName">Nombre completo *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Pérez García"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentCode">Código de estudiante *</label>
              <input
                type="text"
                id="studentCode"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleChange}
                placeholder="12345678"
                pattern="[0-9]*"
                required
              />
              <small>Solo números</small>
            </div>

            <div className="form-group">
              <label htmlFor="institutionalEmail">Correo electrónico institucional (@alumnos.udg.mx) *</label>
              <input
                type="email"
                id="institutionalEmail"
                name="institutionalEmail"
                value={formData.institutionalEmail}
                onChange={handleChange}
                placeholder="nombre@alumnos.udg.mx"
                required
              />
              <small>Es crucial para la comunicación oficial</small>
            </div>

            <div className="form-group">
              <label htmlFor="personalEmail">Correo electrónico personal</label>
              <input
                type="email"
                id="personalEmail"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
                placeholder="nombre@gmail.com"
              />
              <small>Opcional, por si falla el institucional</small>
            </div>

            <div className="form-group">
              <label htmlFor="phoneWhatsapp">Número de teléfono / WhatsApp</label>
              <input
                type="tel"
                id="phoneWhatsapp"
                name="phoneWhatsapp"
                value={formData.phoneWhatsapp}
                onChange={handleChange}
                placeholder="+52 33 1234 5678"
              />
              <small>Útil para avisos rápidos</small>
            </div>
          </section>

          {/* Sección 2: Perfil Académico */}
          <section className="form-section">
            <h2>Perfil Académico</h2>
            <p className="section-description">Para saber de qué carreras vienen y qué tan avanzados están en la universidad.</p>

            <div className="form-group">
              <label htmlFor="career">Carrera o Programa Académico *</label>
              <select
                id="career"
                name="career"
                value={formData.career}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {CAREERS.map(career => (
                  <option key={career} value={career}>{career}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="semester">Ciclo / Semestre actual *</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {SEMESTERS.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Sección 3: Perfil Técnico y Conocimientos Previos */}
          <section className="form-section">
            <h2>Perfil Técnico y Conocimientos Previos</h2>
            <p className="section-description">Esto le ayudará a los ponentes del GDG a saber desde dónde empezar a explicar.</p>

            <div className="form-group">
              <label htmlFor="programmingLevel">¿Cuál es tu nivel de experiencia previa en programación? *</label>
              <select
                id="programmingLevel"
                name="programmingLevel"
                value={formData.programmingLevel}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {PROGRAMMING_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>¿Has utilizado el lenguaje Python anteriormente?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={formData.pythonExperience === true}
                    onChange={() => setFormData(prev => ({ ...prev, pythonExperience: true }))}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    checked={formData.pythonExperience === false}
                    onChange={() => setFormData(prev => ({ ...prev, pythonExperience: false }))}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="operatingSystem">Sistema operativo que utilizas en tu computadora principal *</label>
              <select
                id="operatingSystem"
                name="operatingSystem"
                value={formData.operatingSystem}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="Linux">Linux</option>
              </select>
            </div>
          </section>

          {/* Sección 4: Logística y Compromiso */}
          <section className="form-section">
            <h2>Logística y Compromiso</h2>
            <p className="section-description">Vital para asegurar que los asistentes tengan las herramientas necesarias y no dejen el lugar vacío.</p>

            <div className="form-group">
              <label>¿Cuentas con una computadora portátil propia que puedas usar en las sesiones?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={formData.hasLaptop === true}
                    onChange={() => setFormData(prev => ({ ...prev, hasLaptop: true }))}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    checked={formData.hasLaptop === false}
                    onChange={() => setFormData(prev => ({ ...prev, hasLaptop: false }))}
                  />
                  No
                </label>
              </div>
              <small>Es clave si el taller es tipo hands-on y no hay laboratorios disponibles</small>
            </div>

            <div className="form-group">
              <label>¿Qué días tienes preferencia/disponibilidad para asistir al curso? *</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="preferredDays"
                    checked={formData.preferredDays === 'weekdays'}
                    onChange={() => setFormData(prev => ({ ...prev, preferredDays: 'weekdays' }))}
                  />
                  Entre semana (Lunes a Viernes)
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredDays"
                    checked={formData.preferredDays === 'weekend'}
                    onChange={() => setFormData(prev => ({ ...prev, preferredDays: 'weekend' }))}
                  />
                  Fin de semana (Sábado)
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredDays"
                    checked={formData.preferredDays === 'both'}
                    onChange={() => setFormData(prev => ({ ...prev, preferredDays: 'both' }))}
                  />
                  Ambos
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>¿En qué horario prefieres que se impartan las sesiones? *</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="preferredSchedule"
                    checked={formData.preferredSchedule === 'afternoon'}
                    onChange={() => setFormData(prev => ({ ...prev, preferredSchedule: 'afternoon' }))}
                  />
                  Tarde
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredSchedule"
                    checked={formData.preferredSchedule === 'evening'}
                    onChange={() => setFormData(prev => ({ ...prev, preferredSchedule: 'evening' }))}
                  />
                  Noche
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredSchedule"
                    checked={formData.preferredSchedule === 'both'}
                    onChange={() => setFormData(prev => ({ ...prev, preferredSchedule: 'both' }))}
                  />
                  Ambos
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="motivation">¿Por qué te interesa inscribirte a este curso de Python? *</label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
                placeholder="Cuéntanos sobre tu interés..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shirtSize">Talla de playera (Corte Unisex/Mens) *</label>
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
              <small>Esta información es únicamente para fines logísticos de los kits conmemorativos.</small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="attendanceCommitment"
                  checked={formData.attendanceCommitment}
                  onChange={handleChange}
                  required
                />
                Me comprometo a asistir a las sesiones programadas y cumplir con el código de conducta de la comunidad *
              </label>
            </div>
          </section>

          {/* Sección 5: Cuota de Recuperación y Becas */}
          <section className="form-section">
            <h2>Cuota de Recuperación y Becas</h2>
            
            <div className="section-intro">
              <p className="intro-paragraph">
                Este taller es posible gracias a la colaboración voluntaria de profesionales del GDG Guadalajara. La cuota de recuperación de <strong>$100 MXN</strong> se destina íntegramente a cubrir los honorarios y viáticos de los talleristas, reconociendo su tiempo y expertise.
              </p>
              <p className="intro-paragraph">
                En apoyo a nuestra comunidad estudiantil, el CUGDL ofrecerá un número limitado de becas del 100%. Estas becas están reservadas exclusivamente para estudiantes que, por su situación económica actual, les resulte imposible cubrir la cuota y que demuestren un alto compromiso con el aprovechamiento del curso.
              </p>
            </div>

            <div className="form-group">
              <label>Situación para la inscripción (Selecciona una) *</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={formData.paymentOption === 'payment'}
                    onChange={() => setFormData(prev => ({ ...prev, paymentOption: 'payment' }))}
                  />
                  <span className="option-title">Deseo realizar el pago de la cuota de recuperación</span>
                  <span className="option-description">($100 MXN) Contribuyo al pago de los talleristas, mi merch del curso y aseguro mi lugar tras el pre-registro.</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={formData.paymentOption === 'scholarship'}
                    onChange={() => setFormData(prev => ({ ...prev, paymentOption: 'scholarship' }))}
                  />
                  <span className="option-title">Solicito ser candidato(a) a una beca del 100%</span>
                  <span className="option-description">Entiendo que las becas son limitadas y que mi solicitud pasará por un proceso de revisión y selección basado en mi exposición de motivos. Esto no asegura mi lugar en el curso.</span>
                </label>
              </div>
            </div>

            {formData.paymentOption === 'scholarship' && (
              <div className="form-group">
                <label htmlFor="scholarshipReason">Exposición de motivos para solicitud de beca *</label>
                <textarea
                  id="scholarshipReason"
                  name="scholarshipReason"
                  value={formData.scholarshipReason}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Explica brevemente tu situación actual y por qué este apoyo es fundamental para que puedas cursar el taller. Las becas se asignarán priorizando el compromiso académico y la necesidad económica demostrada."
                  required={formData.paymentOption === 'scholarship'}
                />
                <small>La información proporcionada en esta sección será tratada con estricta confidencialidad y solo se utilizará para el proceso de selección de becas.</small>
              </div>
            )}

            <div className="form-notices">
              <p className="notice">
                <strong>Importante:</strong> El pre-registro no garantiza un lugar definitivo en el curso. La confirmación final se realizará posteriormente, una vez que se hayan revisado las solicitudes y se hayan asignado las becas correspondientes. Agradecemos tu comprensión y paciencia durante este proceso.
              </p>
              <p className="notice">
                El comité organizador contactará a los seleccionados para la beca vía correo electrónico institucional para validar su situación y compromiso, y para proporcionar detalles sobre el proceso de pago o asignación de becas. Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos.
              </p>
            </div>
          </section>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Completar Pre-Registro'}
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
