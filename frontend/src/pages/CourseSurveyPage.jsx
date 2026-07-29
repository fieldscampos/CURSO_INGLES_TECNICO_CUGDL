import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitCourseSurvey } from '../services/questionnaireService';

const ALLOWED_DOMAINS = ['alumnos.udg.mx', 'estudiantes.udg.mx'];

const RATING_QUESTIONS = [
  {
    key: 'overall_satisfaction',
    label: '¿Cómo calificarías tu experiencia general en el curso?',
    helper: '1 = muy baja, 5 = excelente',
  },
  {
    key: 'content_clarity',
    label: '¿Qué tan claro te pareció el contenido?',
    helper: 'Evalúa la explicación, ejemplos y orden del material.',
  },
  {
    key: 'teaching_quality',
    label: '¿Qué tan útil te pareció la forma de enseñar?',
    helper: 'Piensa en acompañamiento, ejemplos y resolución de dudas.',
  },
  {
    key: 'exercises_usefulness',
    label: '¿Qué tan útiles fueron los ejercicios y prácticas?',
    helper: 'Considera si te ayudaron a entender y aplicar lo visto.',
  },
  {
    key: 'pace_balance',
    label: '¿Qué tan adecuado fue el ritmo del curso?',
    helper: 'Si fue muy rápido, muy lento o adecuado.',
  },
  {
    key: 'recommendation_likelihood',
    label: '¿Qué tan probable es que recomiendes el curso?',
    helper: '1 = nada probable, 5 = muy probable.',
  },
];

const initialForm = {
  institutionalEmail: '',
  overall_satisfaction: '',
  content_clarity: '',
  teaching_quality: '',
  exercises_usefulness: '',
  pace_balance: '',
  recommendation_likelihood: '',
  liked_most: '',
  improvement_suggestions: '',
  proposed_courses: '',
  proposed_projects: '',
  wants_organization_participation: '',
  organization_support_areas: '',
  organization_availability: '',
  final_comments: '',
};

function isInstitutionalEmail(value) {
  const email = value.trim().toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => email.endsWith(`@${domain}`));
}

function RatingScale({ name, value, onChange }) {
  return (
    <div className="survey-rating-scale" role="radiogroup" aria-label={name}>
      {[1, 2, 3, 4, 5].map((option) => (
        <label key={option} className={`rating-option ${value === String(option) ? 'selected' : ''}`}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === String(option)}
            onChange={onChange}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

export default function CourseSurveyPage() {
  const [step, setStep] = useState('email');
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailValue = formData.institutionalEmail;
  const showOrganizationFields = formData.wants_organization_participation === 'yes';

  const emailPill = useMemo(() => formData.institutionalEmail.trim().toLowerCase(), [formData.institutionalEmail]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!emailValue.trim()) {
      setError('Ingresa tu correo institucional.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError('Ingresa un correo válido.');
      return;
    }

    if (!isInstitutionalEmail(emailValue)) {
      setError('Usa tu correo institucional UDG.');
      return;
    }

    setStep('survey');
  };

  const validateSurvey = () => {
    for (const question of RATING_QUESTIONS) {
      if (!formData[question.key]) {
        setError('Responde todas las preguntas de calificación.');
        return false;
      }
    }

    if (!formData.liked_most.trim() || !formData.improvement_suggestions.trim() || !formData.proposed_courses.trim() || !formData.proposed_projects.trim()) {
      setError('Completa los espacios de opinión antes de enviar.');
      return false;
    }

    if (!formData.wants_organization_participation) {
      setError('Indica si te gustaría participar en la organización.');
      return false;
    }

    return true;
  };

  const handleSurveySubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateSurvey()) {
      return;
    }

    setLoading(true);

    try {
      await submitCourseSurvey({
        institutional_email: emailValue.trim().toLowerCase(),
        overall_satisfaction: Number(formData.overall_satisfaction),
        content_clarity: Number(formData.content_clarity),
        teaching_quality: Number(formData.teaching_quality),
        exercises_usefulness: Number(formData.exercises_usefulness),
        pace_balance: Number(formData.pace_balance),
        recommendation_likelihood: Number(formData.recommendation_likelihood),
        liked_most: formData.liked_most.trim(),
        improvement_suggestions: formData.improvement_suggestions.trim(),
        proposed_courses: formData.proposed_courses.trim(),
        proposed_projects: formData.proposed_projects.trim(),
        wants_organization_participation: formData.wants_organization_participation === 'yes',
        organization_support_areas: formData.organization_support_areas.trim() || null,
        organization_availability: formData.organization_availability.trim() || null,
        final_comments: formData.final_comments.trim() || null,
      });

      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError.response?.data?.detail || 'No se pudo guardar la encuesta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="survey-page">
        <div className="container narrow">
          <div className="success-message survey-success">
            <h1>Gracias por tu participación</h1>
            <p>Tu encuesta fue enviada correctamente con el correo <strong>{emailPill}</strong>.</p>
            <p>Tu opinión nos ayudará a mejorar el curso y los próximos proyectos del CUGDL.</p>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="survey-page">
      <div className="container narrow">
        <section className="survey-hero card">
          <div className="survey-badges">
            <span className="pill">Encuesta de satisfacción</span>
            <span className="pill">Curso de Python</span>
          </div>
          <h1>Cuéntanos cómo te fue en el curso</h1>
          <p>
            Primero ingresa tu correo institucional y después responde la encuesta para ayudarnos a mejorar
            el curso y los proyectos de agosto a diciembre.
          </p>
        </section>

        {error && <div className="error-banner">{error}</div>}

        {step === 'email' ? (
          <form className="survey-form" onSubmit={handleEmailSubmit}>
            <section className="form-section">
              <h2>Paso 1: Verificación</h2>
              <div className="form-group">
                <label htmlFor="institutionalEmail">Correo institucional *</label>
                <input
                  id="institutionalEmail"
                  name="institutionalEmail"
                  type="email"
                  value={formData.institutionalEmail}
                  onChange={handleInputChange}
                  placeholder="nombre@alumnos.udg.mx"
                />
                <small>Usa el correo institucional con el que participaste en el curso.</small>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary btn-large" type="submit">
                  Continuar
                </button>
              </div>
            </section>
          </form>
        ) : (
          <form className="survey-form" onSubmit={handleSurveySubmit}>
            <section className="form-section">
              <div className="survey-form-header">
                <div>
                  <h2>Paso 2: Encuesta</h2>
                  <p>Respondamos con calma. Tardas solo unos minutos.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep('email')}
                >
                  Cambiar correo
                </button>
              </div>
              <div className="survey-email-pill">
                <span className="pill">{emailPill}</span>
              </div>
            </section>

            <section className="form-section">
              <h2>Satisfacción general</h2>
              <div className="survey-rating-list">
                {RATING_QUESTIONS.map((question) => (
                  <div key={question.key} className="survey-rating-card">
                    <div className="survey-rating-copy">
                      <h3>{question.label}</h3>
                      <p>{question.helper}</p>
                    </div>
                    <RatingScale
                      name={question.key}
                      value={formData[question.key]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="form-section">
              <h2>Lo que más te gustó</h2>
              <div className="form-group">
                <label htmlFor="liked_most">¿Qué fue lo que más te gustó del curso? *</label>
                <textarea
                  id="liked_most"
                  name="liked_most"
                  value={formData.liked_most}
                  onChange={handleInputChange}
                  placeholder="Cuéntanos qué dinámica, tema o parte del curso te ayudó más."
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Mejoras para futuras ediciones</h2>
              <div className="form-group">
                <label htmlFor="improvement_suggestions">¿Qué se podría mejorar? *</label>
                <textarea
                  id="improvement_suggestions"
                  name="improvement_suggestions"
                  value={formData.improvement_suggestions}
                  onChange={handleInputChange}
                  placeholder="Temas que deberían explicarse mejor, ritmo, ejercicios, horarios, etc."
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Ideas para la comunidad</h2>
              <div className="form-group">
                <label htmlFor="proposed_courses">¿Qué otros cursos te gustaría ver en el CUGDL? *</label>
                <textarea
                  id="proposed_courses"
                  name="proposed_courses"
                  value={formData.proposed_courses}
                  onChange={handleInputChange}
                  placeholder="Ej. Git/GitHub, IA aplicada, desarrollo web, bases de datos..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="proposed_projects">¿Qué proyectos propones para la comunidad? *</label>
                <textarea
                  id="proposed_projects"
                  name="proposed_projects"
                  value={formData.proposed_projects}
                  onChange={handleInputChange}
                  placeholder="Ej. talleres, hackatones, mentorías, laboratorios, charlas..."
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Participación en organización</h2>
              <div className="form-group">
                <label>¿Te gustaría participar en la organización de los próximos proyectos de agosto a diciembre? *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="wants_organization_participation"
                      value="yes"
                      checked={formData.wants_organization_participation === 'yes'}
                      onChange={handleInputChange}
                    />
                    Sí, me gustaría participar
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="wants_organization_participation"
                      value="no"
                      checked={formData.wants_organization_participation === 'no'}
                      onChange={handleInputChange}
                    />
                    No por el momento
                  </label>
                </div>
              </div>

              {showOrganizationFields && (
                <>
                  <div className="form-group">
                    <label htmlFor="organization_support_areas">¿En qué te gustaría apoyar?</label>
                    <textarea
                      id="organization_support_areas"
                      name="organization_support_areas"
                      value={formData.organization_support_areas}
                      onChange={handleInputChange}
                      placeholder="Organización, contenido, logística, comunicación, soporte técnico..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="organization_availability">Cuéntanos tu disponibilidad o comentario sobre agosto-diciembre</label>
                    <textarea
                      id="organization_availability"
                      name="organization_availability"
                      value={formData.organization_availability}
                      onChange={handleInputChange}
                      placeholder="Puedes decirnos horarios, ideas o el tipo de proyectos en los que te gustaría involucrarte."
                    />
                  </div>
                </>
              )}
            </section>

            <section className="form-section">
              <h2>Cierre</h2>
              <div className="form-group">
                <label htmlFor="final_comments">Comentario final</label>
                <textarea
                  id="final_comments"
                  name="final_comments"
                  value={formData.final_comments}
                  onChange={handleInputChange}
                  placeholder="Gracias por compartir tu opinión."
                />
              </div>
            </section>

            <div className="form-actions survey-actions">
              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar encuesta'}
              </button>
              <Link to="/" className="btn btn-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
