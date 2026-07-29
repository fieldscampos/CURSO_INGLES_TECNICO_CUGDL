import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/payment.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function PaymentPage() {
  const [step, setStep] = useState(1);
  const [bankInfo, setBankInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Status Checker states
  const [statusCheckEmail, setStatusCheckEmail] = useState('');
  const [statusCheckResult, setStatusCheckResult] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Session selection states
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
  const [formData, setFormData] = useState({
    institutionalEmail: '',
    paymentMethod: '',
    files: []
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchBankInfo();
    fetchSessions();
  }, []);

  const fetchBankInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE}/registrations/payments/bank-info`);
      setBankInfo(response.data);
    } catch (err) {
      setError('Error cargando información bancaria');
      console.error(err);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API_BASE}/registrations/payments/sessions`);
      setSessions(response.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const checkPaymentStatus = async () => {
    if (!statusCheckEmail.trim() || !statusCheckEmail.includes('@')) {
      setError('Ingresa un email válido');
      return;
    }
    
    setStatusLoading(true);
    setError('');
    setStatusCheckResult(null);
    
    try {
      const response = await axios.get(
        `${API_BASE}/registrations/payments/check-status?email=${statusCheckEmail}`
      );
      setStatusCheckResult(response.data);
    } catch (err) {
      setError('Error al verificar estatus: ' + (err.response?.data?.detail || err.message));
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setFormData({ ...formData, paymentMethod: method });
    setStep(2);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const handleFiles = (files) => {
    setError('');
    
    if (files.length === 0) return;
    if (files.length > 5) {
      setError('Máximo 5 archivos permitidos');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'application/pdf', 'image/heic', 'image/heif'];
    const newFiles = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setError(`${file.name}: Tipo no permitido. Solo PNG, JPG, PDF, HEIC.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name}: Tamaño excede 5MB`);
        return;
      }
      newFiles.push(file);
    });

    if (newFiles.length > 0) {
      setFormData({ ...formData, files: [...formData.files, ...newFiles] });
    }
  };

  const removeFile = (index) => {
    const updatedFiles = formData.files.filter((_, i) => i !== index);
    setFormData({ ...formData, files: updatedFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.institutionalEmail.trim()) {
      setError('Ingresa tu email institucional');
      return;
    }
    if (!selectedSessionId) {
      setError('Selecciona un horario antes de enviar');
      return;
    }
    if (formData.files.length === 0) {
      setError('Sube al menos un comprobante');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formPayload = new FormData();
      formPayload.append('institutional_email', formData.institutionalEmail);
      formPayload.append('payment_method', formData.paymentMethod);
      formPayload.append('session_id', selectedSessionId);

      formData.files.forEach((file) => {
        formPayload.append('files', file);
      });

      const response = await axios.post(
        `${API_BASE}/registrations/payments/upload`,
        formPayload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
            }
          }
        }
      );

      setSuccess('Comprobante enviado exitosamente. Será revisado en 24-48 horas.');
      setStep(4);
      setFormData({
        institutionalEmail: '',
        paymentMethod: '',
        files: []
      });
      setSelectedSessionId(null);
      setUploadProgress(0);

    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error al enviar comprobante';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const downloadReference = () => {
    if (bankInfo?.reference_pdf_path) {
      // Create download link
      const link = document.createElement('a');
      link.href = bankInfo.reference_pdf_path;
      link.download = 'referencia-banco.pdf';
      link.click();
    }
  };

  return (
    <div className="payment-container">
      {/* Status Checker Section */}
      <div className="payment-section status-checker-section">
        <h2 className="section-title">📋 Verifica tu Estatus</h2>
        <p className="section-subtitle">Ingresa tu email para ver el estado de tu pago</p>
        
        <div className="status-checker-form">
          <input
            type="email"
            placeholder="tu correo institucional"
            value={statusCheckEmail}
            onChange={(e) => setStatusCheckEmail(e.target.value)}
            className="input-field"
          />
          <button
            onClick={checkPaymentStatus}
            disabled={statusLoading}
            className="btn btn-secondary"
          >
            {statusLoading ? 'Verificando...' : 'Verificar Estatus'}
          </button>
        </div>

        {statusCheckResult && (
          <div className="status-result">
            <div className={`status-badge status-${statusCheckResult.status}`}>
              {statusCheckResult.status === 'no_payment' && '⏳ Aún no has realizado tu pago'}
              {statusCheckResult.status === 'draft' && '📝 Guardado (sin verificar)'}
              {statusCheckResult.status === 'pending' && '⏳ En proceso de verificación'}
              {statusCheckResult.status === 'verified' && '✅ Aceptado'}
              {statusCheckResult.status === 'rejected' && '❌ Rechazado'}
              {statusCheckResult.status === 'completed' && '🎉 Completado'}
            </div>

            {statusCheckResult.rejection_reason && (
              <div className="rejection-reason">
                <p><strong>Motivo del rechazo:</strong></p>
                <p>{statusCheckResult.rejection_reason}</p>
              </div>
            )}

            {statusCheckResult.session_day && (
              <div className="session-info">
                <p><strong>Tu sesión:</strong> {statusCheckResult.session_day.toUpperCase()} {statusCheckResult.session_time}</p>
              </div>
            )}

            {statusCheckResult.files_count > 0 && (
              <p className="files-info">Comprobantes enviados: {statusCheckResult.files_count}</p>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Step 1: Method Selection */}
      {step === 1 && (
        <div className="payment-section">
          <h1 className="payment-title">Método de Pago</h1>
          <p className="payment-intro">
            Selecciona tu forma de pago preferida. Ambas opciones son seguras y rápidas.
          </p>

          <div className="payment-methods">
            {/* Bank Reference */}
            <div 
              className="payment-method-card"
              onClick={() => handlePaymentMethodSelect('bank_reference')}
            >
              <div className="method-icon">🏦</div>
              <h3>Pago en Banco</h3>
              <p>Paga en banco</p>
              <ul className="method-details">
                <li>✓ Seguro y comprobable</li>
                <li>✓ Sin comisiones</li>
                <li>✓ Comprobante automático</li>
              </ul>
              <button className="btn btn-primary">Seleccionar</button>
            </div>

            {/* Bank Transfer */}
            <div 
              className="payment-method-card"
              onClick={() => handlePaymentMethodSelect('bank_transfer')}
            >
              <div className="method-icon">💳</div>
              <h3>Transferencia SPEI</h3>
              <p>Transferencia instantánea a nuestra cuenta</p>
              <ul className="method-details">
                <li>✓ Inmediato</li>
                <li>✓ Desde cualquier banco</li>
                <li>✓ AppBanco o cajero</li>
              </ul>
              <button className="btn btn-primary">Seleccionar</button>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}
        </div>
      )}

      {/* Step 2: Bank Details */}
      {step === 2 && bankInfo && (
        <div className="payment-section">
          <h1 className="payment-title">
            {formData.paymentMethod === 'bank_reference' ? 'Pago en Banco' : 'Transferencia SPEI'}
          </h1>

          {formData.paymentMethod === 'bank_transfer' && (
            <div className="bank-info-card">
              <div className="info-row">
                <label>Banco:</label>
                <strong>{bankInfo.bank_name}</strong>
              </div>
              <div className="info-row">
                <label>Titular:</label>
                <strong>{bankInfo.account_holder}</strong>
              </div>
              <div className="info-row">
                <label>CLABE:</label>
                <code>{bankInfo.clabe}</code>
                <button 
                  className="btn-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(bankInfo.clabe);
                    alert('CLABE copiado al portapapeles');
                  }}
                >
                  📋 Copiar
                </button>
              </div>
              <div className="info-row">
                <label>Número de Cuenta:</label>
                <strong>{bankInfo.account_number}</strong>
              </div>
              {bankInfo.phone && (
                <div className="info-row">
                  <label>Teléfono de Contacto:</label>
                  <strong>{bankInfo.phone}</strong>
                </div>
              )}
            </div>
          )}

          {formData.paymentMethod === 'bank_reference' && (
            <div className="reference-section">
              <h3>📥 Descargar Referencia</h3>
              <p>Descarga el PDF con la referencia bancaria y llévalo a una sucursal bancaria</p>
              <button className="btn btn-secondary" onClick={downloadReference}>
                Descargar PDF
              </button>
            </div>
          )}

          <div className="navigation">
            <button 
              className="btn btn-outline"
              onClick={() => setStep(1)}
            >
              ← Atrás
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setStep(3);
                setError('');
              }}
            >
              Continuar →
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}
        </div>
      )}

      {/* Step 3: Upload Proof */}
      {step === 3 && (
        <div className="payment-section">
          <h1 className="payment-title">Enviar Comprobante</h1>

          <form onSubmit={handleSubmit} className="payment-form">
            {/* Institutional Email */}
            <div className="form-group">
              <label htmlFor="institutionalEmail">Email Institucional</label>
              <input
                type="email"
                id="institutionalEmail"
                name="institutionalEmail"
                value={formData.institutionalEmail}
                onChange={handleInputChange}
                placeholder="tu correo @alumnos.udg.mx"
                required
              />
              <small>Debe coincidir con tu email de pre-registro</small>
            </div>

            {/* Session Selection */}
            <div className="form-group">
              <label>Selecciona tu Horario</label>
              <p className="form-hint">Elige en cuál sesión prefieres asistir al curso</p>
              
              <div className="session-reminder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Recuerda que este curso es 100% virtual • Los horarios son en línea</span>
              </div>

              <div className="sessions-grid">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`session-card ${selectedSessionId === session.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSessionId(session.id)}
                  >
                    <div className="session-day">
                      {session.day_of_week === 'tuesday' && '📅 Martes'}
                      {session.day_of_week === 'saturday' && '📅 Sábado'}
                    </div>
                    <div className="session-time">
                      {session.start_time} - {session.end_time}
                    </div>
                    <div className="session-selection-indicator">
                      {selectedSessionId === session.id ? '✓ Seleccionado' : 'Seleccionar'}
                    </div>
                  </div>
                ))}
              </div>

              {!selectedSessionId && (
                <small className="form-warning">⚠️ Selecciona un horario antes de enviar</small>
              )}
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label>Comprobante(s) de Pago</label>
              
              <div
                className={`drag-drop-area ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="drag-drop-content">
                  <div className="upload-icon">📸</div>
                  <p>Arrastra tus archivos aquí o</p>
                  <label className="file-input-label">
                    selecciona desde tu dispositivo
                    <input
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,application/pdf,image/heic,image/heif"
                      onChange={handleFileInput}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <small>PNG, JPG, PDF, HEIC • Máx 5MB cada uno • Hasta 5 archivos</small>
                </div>
              </div>

              {/* File List */}
              {formData.files.length > 0 && (
                <div className="file-list">
                  <h4>Archivos seleccionados:</h4>
                  {formData.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeFile(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                  {uploadProgress}%
                </div>
              </div>
            )}

            {/* Error */}
            {error && <div className="error-banner">{error}</div>}

            {/* Submit */}
            <div className="navigation">
              <button 
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(2)}
                disabled={loading}
              >
                ← Atrás
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={loading || formData.files.length === 0 || !selectedSessionId}
              >
                {loading ? 'Enviando...' : 'Enviar Comprobante'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="payment-section success">
          <div className="success-icon">✓</div>
          <h1 className="payment-title">¡Pago Enviado!</h1>
          
          <div className="success-message">
            <p>Tu comprobante ha sido recibido correctamente.</p>
            <p className="highlight">
              Será revisado en las próximas 24-48 horas.
            </p>
          </div>

          <div className="what-next">
            <h3>Próximos pasos:</h3>
            <ol>
              <li>Revisamos tu comprobante</li>
              <li>Verificamos el pago</li>
              <li>Te enviamos confirmación por email</li>
            </ol>
          </div>

          <div className="contact-support">
            <p>¿Preguntas? Contacta con nosotros:</p>
            <p className="email">📧 jose.gonzalez5305@alumnos.udg.mx</p>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setStep(1);
              setSuccess('');
              setFormData({
                preRegistrationId: '',
                institutionalEmail: '',
                paymentMethod: '',
                files: []
              });
            }}
          >
            Nuevo Pago
          </button>
        </div>
      )}
    </div>
  );
}
