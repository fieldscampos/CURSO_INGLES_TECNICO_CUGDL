import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin-dashboard.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function AdminPaymentDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    status: '',
    email: '',
    preRegistrationId: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 50,
    totalRecords: 0
  });
  
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (adminToken) {
      setIsLoggedIn(true);
      fetchPaymentsWithToken(adminToken, 1);
      fetchStats();
    }
  }, [adminToken]);

  // Refetch when filters change
  useEffect(() => {
    if (adminToken && isLoggedIn) {
      fetchPaymentsWithToken(adminToken, 1);
    }
  }, [filters]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const response = await axios.post(`${API_BASE}/admin/login`, null, {
        params: {
          username: credentials.username,
          password: credentials.password
        }
      });

      const token = response.data.access_token;
      setAdminToken(token);
      localStorage.setItem('adminToken', token);
      setIsLoggedIn(true);
      setCredentials({ username: '', password: '' });

      // Fetch initial data with the token directly
      setTimeout(() => {
        fetchPaymentsWithToken(token);
        fetchStatsWithToken(token);
      }, 100);

    } catch (err) {
      setLoginError('Credenciales inválidas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentsWithToken = async (token, page = 1) => {
    try {
      const offset = (page - 1) * pagination.pageSize;
      const response = await axios.get(`${API_BASE}/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: filters.status || undefined,
          email: filters.email || undefined,
          pre_registration_id: filters.preRegistrationId || undefined,
          limit: pagination.pageSize,
          offset: offset
        }
      });

      console.log('Payments response:', response.data);
      console.log('Total records:', response.data.total);
      
      setPayments(response.data.records);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalRecords: response.data.total || 0
      }));
    } catch (err) {
      console.error('Error fetching payments:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchPayments = async () => {
    fetchPaymentsWithToken(adminToken, pagination.currentPage);
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      fetchPaymentsWithToken(adminToken, pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(pagination.totalRecords / pagination.pageSize);
    if (pagination.currentPage < totalPages) {
      fetchPaymentsWithToken(adminToken, pagination.currentPage + 1);
    }
  };

  const fetchPaymentDetailWithToken = async (paymentId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPaymentDetail(response.data);
      setSelectedPayment(paymentId);
      setModalOpen(true);
    } catch (err) {
      setActionError('Error cargando detalles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetail = async (paymentId) => {
    fetchPaymentDetailWithToken(paymentId, adminToken);
  };

  const fetchStatsWithToken = async (token) => {
    try {
      const response = await axios.get(`${API_BASE}/admin/payments/summary/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchStats = async () => {
    fetchStatsWithToken(adminToken);
  };

  const handleVerifyPayment = async () => {
    if (!paymentDetail) return;

    try {
      setLoading(true);
      setActionError('');

      const response = await axios.post(
        `${API_BASE}/admin/payments/${paymentDetail.id}/verify`,
        { verified_by: credentials.username || 'admin' },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setActionSuccess('Pago verificado exitosamente');
      setPaymentDetail(response.data.payment_record);
      
      // Refresh list
      setTimeout(() => {
        fetchPayments();
        fetchStats();
      }, 500);

    } catch (err) {
      setActionError(err.response?.data?.detail || 'Error verificando pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!paymentDetail || !rejectionReason.trim() || rejectionReason.length < 10) {
      setActionError('Motivo debe tener al menos 10 caracteres');
      return;
    }

    try {
      setRejecting(true);
      setActionError('');

      const response = await axios.post(
        `${API_BASE}/admin/payments/${paymentDetail.id}/reject`,
        {
          rejection_reason: rejectionReason,
          verified_by: credentials.username || 'admin'
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setActionSuccess('Pago rechazado. Estudiante puede reenviar');
      setPaymentDetail(response.data.payment_record);
      setRejectionReason('');
      
      // Refresh list
      setTimeout(() => {
        fetchPayments();
        fetchStats();
      }, 500);

    } catch (err) {
      setActionError(err.response?.data?.detail || 'Error rechazando pago');
      console.error(err);
    } finally {
      setRejecting(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    fetchPayments();
  };

  const handleLogout = () => {
    setAdminToken('');
    setIsLoggedIn(false);
    setPayments([]);
    setStats(null);
    setModalOpen(false);
    localStorage.removeItem('adminToken');
  };

  const closeModal = () => {
    setModalOpen(false);
    setPaymentDetail(null);
    setActionError('');
    setActionSuccess('');
    setRejectionReason('');
  };

  const openFilePreview = (file) => {
    // Extract URL string from file_path - it might be an object with signedURL or a plain string
    let filePath = file.file_path;
    if (typeof filePath === 'object' && filePath.signedURL) {
      filePath = filePath.signedURL;
    } else if (typeof filePath !== 'string') {
      filePath = String(filePath);
    }
    
    console.log('Opening file preview:', file);
    console.log('File path URL:', filePath);
    
    // If file_path is just the storage path (not a full URL), construct the signed URL
    let displayPath = filePath;
    if (filePath && !filePath.startsWith('http')) {
      // Construct Supabase Storage URL for the file
      const supabaseUrl = 'https://meyazdjyumdprexdhpxw.supabase.co';
      displayPath = `${supabaseUrl}/storage/v1/object/public/payment-receipts/${filePath}`;
      console.log('Constructed URL:', displayPath);
    }
    
    setSelectedFile({
      ...file,
      file_path: displayPath
    });
    setPreviewOpen(true);
  };

  const closeFilePreview = () => {
    console.log('Closing file preview');
    setPreviewOpen(false);
    setSelectedFile(null);
  };

  const handleVerifyFromPreview = async () => {
    await handleVerifyPayment();
    closeFilePreview();
  };

  const handleRejectFromPreview = async () => {
    if (rejectionReason.trim() && rejectionReason.length >= 10) {
      await handleRejectPayment();
      closeFilePreview();
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'verified':
        return 'badge-verified';
      case 'rejected':
        return 'badge-rejected';
      case 'completed':
        return 'badge-completed';
      default:
        return 'badge-draft';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Borrador',
      pending: 'Pendiente',
      verified: 'Verificado',
      rejected: 'Rechazado',
      completed: 'Completado'
    };
    return labels[status] || status;
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <h1 className="login-title">Panel Administrativo</h1>
          <p className="login-subtitle">Verificación de Pagos</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                placeholder="admin"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>

            {loginError && <div className="error-banner">{loginError}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Autenticando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p className="info-text">
              Acceso restringido solo para administradores
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>Panel de Pagos</h1>
          <button className="btn btn-outline" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-label">Total de Pagos</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-label">Pendientes</div>
            <div className="stat-value">{stats.by_status.pending || 0}</div>
          </div>
          <div className="stat-card verified">
            <div className="stat-label">Verificados</div>
            <div className="stat-value">{stats.by_status.verified || 0}</div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-label">Rechazados</div>
            <div className="stat-value">{stats.by_status.rejected || 0}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Estado</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Todos</option>
            <option value="draft">Borrador</option>
            <option value="pending">Pendiente</option>
            <option value="verified">Verificado</option>
            <option value="rejected">Rechazado</option>
            <option value="completed">Completado</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Email Institucional</label>
          <input
            type="email"
            name="email"
            placeholder="Buscar por email..."
            value={filters.email}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>ID Pre-registro</label>
          <input
            type="text"
            name="preRegistrationId"
            placeholder="UUID..."
            value={filters.preRegistrationId}
            onChange={handleFilterChange}
          />
        </div>

        <button className="btn btn-primary" onClick={applyFilters}>
          Aplicar Filtros
        </button>
      </div>

      {/* Payments Table */}
      <div className="payments-table-section">
        <h2>Registros de Pago</h2>

        {payments.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron pagos</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Enviado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="email-cell">
                      <div className="email-info">
                        <strong>{payment.institutional_email}</strong>
                        <small>{payment.pre_registration_id.slice(0, 8)}...</small>
                      </div>
                    </td>
                    <td>
                      {payment.payment_method === 'bank_reference' ? '🏦 Banco' : '💳 SPEI'}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(payment.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => fetchPaymentDetail(payment.id)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {payments.length > 0 && (
          <div className="pagination-controls">
            <button
              className="btn-pagination"
              onClick={handlePreviousPage}
              disabled={pagination.currentPage === 1}
            >
              ← Anterior
            </button>
            
            <div className="pagination-info">
              Página {pagination.currentPage} de {Math.ceil(pagination.totalRecords / pagination.pageSize)} 
              ({pagination.totalRecords} registros totales)
            </div>
            
            <button
              className="btn-pagination"
              onClick={handleNextPage}
              disabled={pagination.currentPage >= Math.ceil(pagination.totalRecords / pagination.pageSize)}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {modalOpen && paymentDetail && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de Pago</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>

            {/* Payment Info */}
            <div className="modal-body">
              <div className="info-section">
                <h3>Información del Pago</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Estado</label>
                    <span className={`badge ${getStatusBadgeClass(paymentDetail.status)}`}>
                      {getStatusLabel(paymentDetail.status)}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Método</label>
                    <strong>
                      {paymentDetail.payment_method === 'bank_reference' ? 'Pago en Banco' : 'Transferencia SPEI'}
                    </strong>
                  </div>
                  <div className="info-item">
                    <label>Email Institucional</label>
                    <strong>{paymentDetail.institutional_email}</strong>
                  </div>
                  <div className="info-item">
                    <label>Fecha de Envío</label>
                    <strong>{new Date(paymentDetail.created_at).toLocaleString('es-MX')}</strong>
                  </div>
                </div>
              </div>

              {/* Pre-registration Info */}
              {paymentDetail.pre_registration && (
                <div className="info-section">
                  <h3>Datos del Estudiante</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Nombre</label>
                      <strong>{paymentDetail.pre_registration.full_name}</strong>
                    </div>
                    <div className="info-item">
                      <label>Código de Estudiante</label>
                      <strong>{paymentDetail.pre_registration.student_code}</strong>
                    </div>
                    <div className="info-item">
                      <label>Email Personal</label>
                      <strong>{paymentDetail.pre_registration.personal_email}</strong>
                    </div>
                    <div className="info-item">
                      <label>Teléfono</label>
                      <strong>{paymentDetail.pre_registration.phone_whatsapp}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Files Gallery */}
              {paymentDetail.files && paymentDetail.files.length > 0 && (
                <div className="files-section">
                  <h3>Comprobantes ({paymentDetail.files.length})</h3>
                  <div className="files-gallery">
                    {paymentDetail.files.map((file) => (
                      <div 
                        key={file.id} 
                        className="file-card"
                        onClick={() => openFilePreview(file)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="file-preview">
                          {file.file_type === 'pdf' ? (
                            <div className="pdf-icon">📄 PDF</div>
                          ) : (
                            <div className="image-icon">🖼️ IMG</div>
                          )}
                        </div>
                        <div className="file-details">
                          <strong className="file-name">{file.file_name}</strong>
                          <small>{(file.file_size_kb / 1024).toFixed(2)} MB</small>
                          <small>{new Date(file.uploaded_at).toLocaleDateString('es-MX')}</small>
                          {file.is_primary && <span className="badge-primary">Principal</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {paymentDetail.rejection_reason && (
                <div className="rejection-section">
                  <h3>Motivo del Rechazo</h3>
                  <p className="rejection-reason">{paymentDetail.rejection_reason}</p>
                </div>
              )}

              {/* Messages */}
              {actionError && <div className="error-banner">{actionError}</div>}
              {actionSuccess && <div className="success-banner">{actionSuccess}</div>}
            </div>

            {/* Actions */}
            {paymentDetail.status === 'pending' && (
              <div className="modal-footer">
                {/* Verify Button */}
                <button
                  className="btn btn-primary"
                  onClick={handleVerifyPayment}
                  disabled={loading}
                >
                  ✓ Verificar Pago
                </button>

                {/* Reject Section */}
                {!rejecting && (
                  <button
                    className="btn btn-danger"
                    onClick={() => setRejecting(true)}
                  >
                    ✕ Rechazar
                  </button>
                )}

                {rejecting && (
                  <div className="reject-form">
                    <textarea
                      placeholder="Motivo del rechazo (mínimo 10 caracteres)..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows="3"
                    />
                    <div className="reject-actions">
                      <button
                        className="btn btn-danger"
                        onClick={handleRejectPayment}
                        disabled={rejectionReason.length < 10}
                      >
                        Confirmar Rechazo
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setRejecting(false);
                          setRejectionReason('');
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {paymentDetail.status !== 'pending' && (
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Preview Lightbox */}
      {previewOpen && selectedFile && (() => {
        console.log('Rendering lightbox, previewOpen:', previewOpen, 'selectedFile:', selectedFile);
        return (
        <div className="lightbox-overlay" onClick={closeFilePreview}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close lightbox-close" onClick={closeFilePreview}>✕</button>
            
            {/* File Preview Area */}
            <div className="lightbox-preview">
              {selectedFile.file_type === 'pdf' ? (
                <div className="pdf-placeholder">
                  <div className="pdf-icon-large">📄</div>
                  <p>PDF - {selectedFile.file_name}</p>
                  <a 
                    href={selectedFile.file_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Abrir PDF
                  </a>
                </div>
              ) : (
                <img 
                  src={selectedFile.file_path} 
                  alt={selectedFile.file_name}
                  className="lightbox-image"
                />
              )}
            </div>

            {/* File Info */}
            <div className="lightbox-info">
              <h3>{selectedFile.file_name}</h3>
              <p>{(selectedFile.file_size_kb / 1024).toFixed(2)} MB • {new Date(selectedFile.uploaded_at).toLocaleString('es-MX')}</p>
            </div>

            {/* Action Buttons */}
            {paymentDetail?.status === 'pending' && (
              <div className="lightbox-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleVerifyFromPreview}
                  disabled={loading}
                >
                  ✓ Verificar Pago
                </button>
                
                {!rejecting ? (
                  <button
                    className="btn btn-outline"
                    onClick={() => setRejecting(true)}
                  >
                    ✕ Rechazar
                  </button>
                ) : (
                  <div className="reject-form-inline">
                    <textarea
                      placeholder="Motivo del rechazo (mínimo 10 caracteres)..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows="2"
                    />
                    <div className="reject-actions-inline">
                      <button
                        className="btn btn-danger"
                        onClick={handleRejectFromPreview}
                        disabled={rejectionReason.length < 10}
                      >
                        Confirmar Rechazo
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setRejecting(false);
                          setRejectionReason('');
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        );
      })()}
    </div>
  );
}
