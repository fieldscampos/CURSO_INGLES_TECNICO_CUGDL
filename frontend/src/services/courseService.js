import api from './api';

export async function getCourseOverview() {
  const response = await api.get('/courses/overview');
  return response.data;
}

export async function getSyllabus() {
  const response = await api.get('/courses/syllabus');
  return response.data;
}

