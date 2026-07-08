import axiosInstance from "./axiosInstance";

const generateQuestions = async (payload) => {
  const response = await axiosInstance.post("/ai/generate", payload);
  return response.data.data;
};

const saveGeneratedQuestions = async (payload) => {
  const response = await axiosInstance.post("/ai/save-generated-questions", payload);
  return response.data.data;
};

const generateFromPdf = async (formValues) => {
  const formData = new FormData();
  formData.append("file", formValues.file);
  formData.append("difficulty", formValues.difficulty);
  formData.append("quizId", formValues.quizId);

  const response = await axiosInstance.post("/ai/generate-from-pdf", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

const aiService = {
  generateQuestions,
  saveGeneratedQuestions,
  generateFromPdf
};


export default aiService;