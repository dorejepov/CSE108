import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const register = (data) => API.post('/users/register', data);
export const login = (data) => API.post('/users/login', data);

export const getQuestions = (topicId) => API.get('/questions', { params: { topicId } });
export const getTopics = () => API.get('/topics');

export const getQuestion = (id) => API.get(`/questions/${id}`);
export const createQuestion = (data) => API.post('/questions', data);
export const getAnswers = (questionId) => API.get(`/answers/${questionId}`);
export const createAnswer = (questionId, data) => API.post(`/answers/${questionId}`, data);
export const castVote = (answerId, data) => API.post(`/votes/${answerId}`, data);
export const getVote = (answerId) => API.get(`/votes/${answerId}`);
