import axiosInstance from "./axiosInstance";

const createQuiz = async (quizData) => {
  const response = await axiosInstance.post("/quizzes", quizData);
  return response.data.data;
};

const getQuizzesByClass = async (classId) => {
  const response = await axiosInstance.get(`/classes/${classId}/quizzes`);
  return response.data.data;
};

const getQuizById = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}`);
  return response.data.data;
};

const getQuizDetails = async (quizId) => {
  const response = await axiosInstance.get(`/quizzes/${quizId}`);
  return response.data.data;
};

const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(`/quizzes/${quizId}`);
  return response.data;
};

const updateQuiz = async (quizId, quizData) => {
  const response = await axiosInstance.put(`/quizzes/${quizId}`, quizData);
  return response.data.data;
};

const quizService = {
  createQuiz,
  getQuizzesByClass,
  getQuizById,
  getQuizDetails,
  deleteQuiz,
  updateQuiz
};

export default quizService;