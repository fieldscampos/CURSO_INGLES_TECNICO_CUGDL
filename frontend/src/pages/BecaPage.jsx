import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import GDGLogo from '../logos/GDG Guadalajara (1).png';
import CUGDLLogo from '../logos/Logos CUGDL-06.png';

const SCHEDULE_OPTIONS = [
  { value: 'tuesday', label: 'Martes de 6:00 PM a 8:00 PM' },
  { value: 'saturday', label: 'Sábado de 10:00 AM a 12:00 PM' }
];

export default function BecaPage() {
  const [step, setStep] = useState('email'); // 'email' | 'schedule' | 'confirmed'
  const [email, setEmail] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [commitmentChecked, setCommitmentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scholarshipData, setScholarshipData] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setLoading(true);

    try {
      const response = await api.get('/registrations/pre-registro-by-email', {
        params: { email }
      });

      if (!response.data) {
        setError('No encontramos un registro de beca con ese correo. Verifica que sea el correo que usaste en el pre-registro.');
        setLoading(false);
        return;
      }

      if (response.data.payment_option !== 'scholarship') {
        setError('Este correo no tiene una solicitud de beca aprobada. Si crees que es un error, contacta a los organizadores.');
        setLoading(false);
        return;
      }

      setScholarshipData(response.data);
      setStep('schedule');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al verificar tu registro. Intenta de nuevo.');
      console.error('Email verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedSchedule) {
      setError('Por favor selecciona un horario');
      return;
    }

    if (!commitmentChecked) {
      setError('Debes confirmar tu compromiso de asistencia');
      return;
    }

    setLoading(true);

    try {
      await api.post('/registrations/scholarship-enrollment', {
        email: scholarshipData.institutional_email,
        selected_schedule: selectedSchedule,
        commitment_confirmed: true
      });

      setStep('confirmed');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al confirmar tu beca. Intenta de nuevo.');
      console.error('Scholarship enrollment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirmed') {
    return (
      <main className="beca-page">
        <div className="container narrow">
          <div className="success-message">
            <h1>¡Beca Confirmada!</h1>
            <p>Gracias por confirmar tu participación en el Curso de Python con beca al 100%.</p>
            <p>
              Tu lugar está reservado para el horario:{' '}
              <strong>
                {SCHEDULE_OPTIONS.find(opt => opt.value === selectedSchedule)?.label}
              </strong>
            </p>
            <p>Recibirás más detalles en tu correo electrónico institucional.</p>
            <Link to="/" className="btn btn-primary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="beca-page">
      <div className="container narrow">
        <div className="beca-header">
          <div className="logos-row">
            <img src={GDGLogo} alt="GDG Guadalajara" className="logo" />
            <span className="separator">×</span>
            <img src={CUGDLLogo} alt="CUGDL" className="logo" />
          </div>
          <h1>Confirmación de Beca: Curso de Python</h1>
          <p className="intro-text">
            Felicidades. Tu solicitud de beca al 100% ha sido aprobada. Completa este proceso para confirmar tu lugar en el curso.
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="beca-form">
            <section className="form-section">
              <h2>Paso 1: Verifica tu Identidad</h2>
              <p className="section-description">
                Ingresa el correo electrónico institucional (@alumnos.udg.mx) que usaste en tu pre-registro.
              </p>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico institucional *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@alumnos.udg.mx"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? 'Verificando...' : 'Continuar'}
                </button>
              </div>
            </section>
          </form>
        )}

        {step === 'schedule' && scholarshipData && (
          <form onSubmit={handleScheduleSubmit} className="beca-form">
            <section className="form-section">
              <h2>Paso 2: Selecciona tu Horario</h2>
              <p className="section-description">
                Hola {scholarshipData.full_name}, selecciona en cuál horario deseas asistir al curso.
              </p>

              <div className="form-group">
                <label>Horario de preferencia *</label>
                <div className="radio-group">
                  {SCHEDULE_OPTIONS.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name="schedule"
                        value={option.value}
                        checked={selectedSchedule === option.value}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="form-section">
              <h2>Paso 3: Compromiso de Asistencia</h2>
              <p className="section-description">
                Confirma tu compromiso de asistir a todas las sesiones del curso.
              </p>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={commitmentChecked}
                    onChange={(e) => setCommitmentChecked(e.target.checked)}
                    required
                  />
                  <span>
                    Me comprometo a asistir de forma regular y completar el curso de Python en su totalidad. 
                    Entiendo que este es un compromiso académico importante con la institución y los organizadores.
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading || !commitmentChecked || !selectedSchedule}
                >
                  {loading ? 'Confirmando...' : 'Confirmar Beca'}
                </button>
              </div>
            </section>
          </form>
        )}
      </div>
    </main>
  );
}
