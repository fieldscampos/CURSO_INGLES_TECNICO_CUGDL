import api from './api';

export async function createPreRegistration() {
  const response = await api.post('/registrations/pre-register');
  return response.data;
}

export async function getRegistrationStatus() {
  const response = await api.get('/registrations/status');
  return response.data;
}

