import axiosInstance from "./axiosInstance";

const generateQuestions = async (payload) => {
  const response = await axiosInstance.post("/ai/generate", payload);
  return response.data.data;
};

const saveGeneratedQuestions = async (payload) => {
  const response = await axiosInstance.post("/ai/save-generated-questions", payload);
  return response.data.data;
};

const aiService = {
  generateQuestions,
  saveGeneratedQuestions,
};

export default aiService;