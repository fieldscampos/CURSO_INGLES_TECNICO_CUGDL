import api from './api';

export async function getQuestions() {
  const response = await api.get('/questionnaires/questions');
  return response.data;
}

export async function submitResponses(answers) {
  const response = await api.post('/questionnaires/responses', answers);
  return response.data;
}

export async function getCourseSurveyQuestions() {
  const response = await api.get('/questionnaires/survey/questions');
  return response.data;
}

export async function submitCourseSurvey(payload) {
  const response = await api.post('/questionnaires/survey/responses', payload);
  return response.data;
}
