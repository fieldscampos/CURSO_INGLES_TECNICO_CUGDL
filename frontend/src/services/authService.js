import api from './api';

export async function loginWithGoogleToken(googleIdToken) {
  const response = await api.post('/auth/google-login', {
    google_id_token: googleIdToken,
  });
  return response.data;
}

export async function loginWithInstitutionalEmail(email, fullName) {
  const response = await api.post('/auth/google-login', {
    email,
    full_name: fullName,
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get('/auth/me');
  return response.data;
}

