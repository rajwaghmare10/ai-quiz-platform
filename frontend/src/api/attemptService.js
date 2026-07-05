import axiosInstance from "./axiosInstance";

const startQuiz = async (quizId) => {
  const response = await axiosInstance.post(`/attempts/${quizId}/start`);
  return response.data.data;
};

const getAttemptQuestions = async (attemptId) => {
  const response = await axiosInstance.get(`/attempts/${attemptId}/questions`);
  return response.data.data;
};

const submitQuiz = async (attemptId, answers) => {
  const response = await axiosInstance.post(`/attempts/${attemptId}/submit`, {
    answers,
  });
  return response.data.data;
};

const getResult = async (attemptId) => {
  const response = await axiosInstance.get(`/attempts/${attemptId}/result`);
  return response.data.data;
};

const attemptService = {
  startQuiz,
  getAttemptQuestions,
  submitQuiz,
  getResult,
};

export default attemptService;