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

const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(`/quizzes/${quizId}`);
  return response.data;
};

const deleteClass = async (classId) => {
  const response = await axiosInstance.delete(`/classes/${classId}`);
  return response.data;
};

const quizService = {
  createQuiz,
  getQuizzesByClass,
  getQuizById,
  deleteQuiz,
  deleteClass
};

export default quizService;