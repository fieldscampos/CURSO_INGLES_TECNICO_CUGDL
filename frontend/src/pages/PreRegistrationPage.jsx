import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import GrowmoLogo from '../logos/growmo.png';
import CUGDLLogo from '../logos/Logos CUGDL-06.png';

const CAREERS = [
  'Ciberseguridad',
  'Inteligencia Artificial',
  'Creatividad Digital',
  'Inteligencia Financiera',
  'Tecnologias Biomedicas',
  'Otro centro universitario / Externo CUGDL',
];

const SEMESTERS = ['1ro', '2do', '3ro', '4to', '5to o mas', 'Egresado/a'];

const TECHNICAL_BACKGROUNDS = [
  'Aun no tengo un perfil tecnico claro',
  'Estoy empezando a explorar tecnologia',
  'Ya estudio o practico en un area tech',
  'Ya trabajo o colaboro en temas de tecnologia',
];

const ENGLISH_LEVELS = [
  'Principiante total',
  'Basico',
  'Basico con algo de comprension',
  'Intermedio',
];

const ENGLISH_EXPOSURE_OPTIONS = [
  'Casi nada',
  'He visto terminos sueltos o documentacion ocasional',
  'Leo o escucho ingles tecnico de vez en cuando',
  'Lo uso con cierta frecuencia, pero quiero hablarlo mejor',
];

const SPEAKING_CONFIDENCE_OPTIONS = [
  'Me cuesta mucho hablarlo',
  'Puedo intentar frases cortas',
  'Puedo sostener ideas simples con apoyo',
  'Ya me siento relativamente comodo/a, pero quiero mejorar',
];

export default function PreRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentCode: '',
    institutionalEmail: '',
    personalEmail: '',
    phoneWhatsapp: '',
    career: '',
    semester: '',
    technicalBackground: '',
    englishLevel: '',
    englishExposure: '',
    speakingConfidence: '',
    learningGoal: '',
    hasLaptop: false,
    preferredDays: '',
    preferredSchedule: '',
    motivation: '',
    attendanceCommitment: false,
    paymentOption: '',
    scholarshipReason: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('El nombre completo es requerido.');
      return false;
    }

    if (!formData.studentCode.trim() || !/^\d+$/.test(formData.studentCode)) {
      setError('El codigo de estudiante es requerido y debe contener solo numeros.');
      return false;
    }

    if (!formData.institutionalEmail.trim().toLowerCase().endsWith('@alumnos.udg.mx')) {
      setError('El correo institucional debe terminar en @alumnos.udg.mx.');
      return false;
    }

    if (!formData.career || !formData.semester) {
      setError('Completa tu carrera y tu ciclo o semestre actual.');
      return false;
    }

    if (!formData.technicalBackground || !formData.englishLevel || !formData.englishExposure || !formData.speakingConfidence) {
      setError('Completa la seccion de perfil tecnico y punto de partida.');
      return false;
    }

    if (!formData.learningGoal.trim()) {
      setError('Cuéntanos que te gustaria poder hacer en ingles tecnico.');
      return false;
    }

    if (!formData.preferredDays || !formData.preferredSchedule) {
      setError('Selecciona tu preferencia de dias y horario.');
      return false;
    }

    if (!formData.motivation.trim()) {
      setError('La motivacion es requerida.');
      return false;
    }

    if (!formData.attendanceCommitment) {
      setError('Debes aceptar el compromiso de asistencia.');
      return false;
    }

    if (!formData.paymentOption) {
      setError('Selecciona una opcion de cuota o beca.');
      return false;
    }

    if (formData.paymentOption === 'scholarship' && !formData.scholarshipReason.trim()) {
      setError('Explica por que solicitas la beca.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/registrations/pre-registro', {
        full_name: formData.fullName.trim(),
        student_code: formData.studentCode.trim(),
        institutional_email: formData.institutionalEmail.trim().toLowerCase(),
        personal_email: formData.personalEmail.trim() || null,
        phone_whatsapp: formData.phoneWhatsapp.trim() || null,
        career: formData.career,
        semester: formData.semester,
        technical_background: formData.technicalBackground,
        english_level: formData.englishLevel,
        english_exposure: formData.englishExposure,
        speaking_confidence: formData.speakingConfidence,
        learning_goal: formData.learningGoal.trim(),
        has_laptop: formData.hasLaptop,
        preferred_days: formData.preferredDays,
        preferred_schedule: formData.preferredSchedule,
        motivation: formData.motivation.trim(),
        attendance_commitment: formData.attendanceCommitment,
        payment_option: formData.paymentOption,
        scholarship_reason:
          formData.paymentOption === 'scholarship' ? formData.scholarshipReason.trim() : null,
      });

      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          'Ya existe un pre-registro con este correo institucional. Si quieres, usa otro correo o avísame para revisar ese registro.'
        );
      } else {
        setError(
          err.response?.data?.detail || 'Error al enviar el formulario. Intenta de nuevo.'
        );
      }
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
            <p>Gracias por registrarte en el curso intensivo de ingles tecnico.</p>
            <p>El equipo de CUGDL y growmo.tech te compartira los siguientes pasos por correo.</p>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
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
            <img src={GrowmoLogo} alt="growmo.tech" className="logo" />
            <span className="separator">×</span>
            <img src={CUGDLLogo} alt="CUGDL" className="logo" />
          </div>
          <h1>Pre-registro: Curso intensivo de Ingles tecnico</h1>
          <p className="intro-text">
            Este formulario nos ayudara a conocer tu punto de partida y a construir junto con
            growmo.tech una experiencia util, realista y enfocada en conversacion tech.
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="preregistration-form">
          <section className="form-section">
            <h2>Informacion personal e institucional</h2>
            <p className="section-description">
              Seguimos recopilando los datos basicos para identificarte, contactarte y validar tu
              participacion como estudiante.
            </p>

            <div className="form-group">
              <label htmlFor="fullName">Nombre completo *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Perez Garcia"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentCode">Codigo de estudiante *</label>
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
            </div>

            <div className="form-group">
              <label htmlFor="institutionalEmail">
                Correo institucional (@alumnos.udg.mx) *
              </label>
              <input
                type="email"
                id="institutionalEmail"
                name="institutionalEmail"
                value={formData.institutionalEmail}
                onChange={handleChange}
                placeholder="nombre@alumnos.udg.mx"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="personalEmail">Correo personal</label>
              <input
                type="email"
                id="personalEmail"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
                placeholder="nombre@gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneWhatsapp">Telefono / WhatsApp</label>
              <input
                type="tel"
                id="phoneWhatsapp"
                name="phoneWhatsapp"
                value={formData.phoneWhatsapp}
                onChange={handleChange}
                placeholder="+52 33 1234 5678"
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Perfil academico</h2>
            <p className="section-description">
              Nos ayuda a entender desde que carreras y etapas estan llegando las personas
              interesadas.
            </p>

            <div className="form-group">
              <label htmlFor="career">Carrera o programa academico *</label>
              <select
                id="career"
                name="career"
                value={formData.career}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {CAREERS.map((career) => (
                  <option key={career} value={career}>
                    {career}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="semester">Ciclo / semestre actual *</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="form-section">
            <h2>Perfil tecnico y punto de partida</h2>
            <p className="section-description">
              Esta parte sera muy valiosa para que los companeros de growmo.tech puedan ajustar el
              contenido semana por semana.
            </p>

            <div className="form-group">
              <label htmlFor="technicalBackground">
                ¿Que tanto te relacionas hoy con temas tecnicos o de tecnologia? *
              </label>
              <select
                id="technicalBackground"
                name="technicalBackground"
                value={formData.technicalBackground}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {TECHNICAL_BACKGROUNDS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="englishLevel">¿Como describirias tu nivel actual de ingles? *</label>
              <select
                id="englishLevel"
                name="englishLevel"
                value={formData.englishLevel}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {ENGLISH_LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="englishExposure">¿Que tanto contacto has tenido con ingles tecnico? *</label>
              <select
                id="englishExposure"
                name="englishExposure"
                value={formData.englishExposure}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {ENGLISH_EXPOSURE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="speakingConfidence">
                ¿Que tan comodo o comoda te sientes hablando ingles hoy? *
              </label>
              <select
                id="speakingConfidence"
                name="speakingConfidence"
                value={formData.speakingConfidence}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona --</option>
                {SPEAKING_CONFIDENCE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="learningGoal">
                ¿Que te gustaria poder hacer en ingles tecnico al terminar estas 5 semanas? *
              </label>
              <textarea
                id="learningGoal"
                name="learningGoal"
                value={formData.learningGoal}
                onChange={handleChange}
                rows={4}
                placeholder="Por ejemplo: presentarme mejor, participar en reuniones, entender documentacion o hablar con mas seguridad."
                required
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Logistica y compromiso</h2>
            <p className="section-description">
              Queremos entender tu disponibilidad real y el nivel de compromiso con el curso.
            </p>

            <div className="form-group">
              <label>¿Cuentas con laptop propia para tus practicas y sesiones?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={formData.hasLaptop === true}
                    onChange={() => setFormData((prev) => ({ ...prev, hasLaptop: true }))}
                  />
                  Si
                </label>
                <label>
                  <input
                    type="radio"
                    checked={formData.hasLaptop === false}
                    onChange={() => setFormData((prev) => ({ ...prev, hasLaptop: false }))}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>¿Que dias te acomodan mas para asistir? *</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="preferredDays"
                    checked={formData.preferredDays === 'weekdays'}
                    onChange={() => setFormData((prev) => ({ ...prev, preferredDays: 'weekdays' }))}
                  />
                  Entre semana
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredDays"
                    checked={formData.preferredDays === 'weekend'}
                    onChange={() => setFormData((prev) => ({ ...prev, preferredDays: 'weekend' }))}
                  />
                  Fin de semana
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredDays"
                    checked={formData.preferredDays === 'both'}
                    onChange={() => setFormData((prev) => ({ ...prev, preferredDays: 'both' }))}
                  />
                  Ambos
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>¿En que horario prefieres las sesiones? *</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="preferredSchedule"
                    checked={formData.preferredSchedule === 'afternoon'}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, preferredSchedule: 'afternoon' }))
                    }
                  />
                  Tarde
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredSchedule"
                    checked={formData.preferredSchedule === 'evening'}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, preferredSchedule: 'evening' }))
                    }
                  />
                  Noche
                </label>
                <label>
                  <input
                    type="radio"
                    name="preferredSchedule"
                    checked={formData.preferredSchedule === 'both'}
                    onChange={() => setFormData((prev) => ({ ...prev, preferredSchedule: 'both' }))}
                  />
                  Ambos
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="motivation">
                ¿Por que te interesa inscribirte a este curso de ingles tecnico? *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
                placeholder="Cuentanos que te motiva y en que contexto te gustaria usar este ingles."
                required
              />
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
                Me comprometo a asistir, practicar y respetar el codigo de conducta de la comunidad *
              </label>
            </div>
          </section>

          <section className="form-section">
            <h2>Cuota de recuperacion y becas</h2>

            <div className="section-intro">
              <p className="intro-paragraph">
                Este taller es posible gracias a la colaboracion voluntaria de profesionales de
                Growmo Tech. La cuota de recuperacion es de <strong>$250 MXN</strong>.
              </p>
              <p className="intro-paragraph">
                Tambien habra un numero limitado de becas para personas que realmente necesiten el
                apoyo y demuestren compromiso para aprovechar el curso.
              </p>
            </div>

            <div className="form-group">
              <label>Situacion para la inscripcion *</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={formData.paymentOption === 'payment'}
                    onChange={() => setFormData((prev) => ({ ...prev, paymentOption: 'payment' }))}
                  />
                  <span className="option-title">Deseo realizar el pago de la cuota</span>
                  <span className="option-description">
                    ($250 MXN) Quiero asegurar mi lugar y continuar con el proceso de inscripcion.
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={formData.paymentOption === 'scholarship'}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, paymentOption: 'scholarship' }))
                    }
                  />
                  <span className="option-title">Solicito ser considerado/a para beca</span>
                  <span className="option-description">
                    Entiendo que el apoyo es limitado y que mi solicitud sera revisada por el
                    equipo organizador.
                  </span>
                </label>
              </div>
            </div>

            {formData.paymentOption === 'scholarship' && (
              <div className="form-group">
                <label htmlFor="scholarshipReason">¿Por que solicitas la beca? *</label>
                <textarea
                  id="scholarshipReason"
                  name="scholarshipReason"
                  value={formData.scholarshipReason}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Explica tu situacion actual y por que este apoyo haria posible tu participacion."
                  required
                />
              </div>
            )}

            <div className="form-notices">
              <p className="notice">
                <strong>Importante:</strong> El pre-registro no garantiza un lugar definitivo. La
                confirmacion llegara despues de revisar disponibilidad, horarios y solicitudes de
                beca.
              </p>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
              {loading ? 'Enviando...' : 'Completar pre-registro'}
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
