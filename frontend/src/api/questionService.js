import axiosInstance from "./axiosInstance";

const uploadExcelQuestions = async (quizId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    `/questions/${quizId}/excel`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

const updateQuestion = async (questionId, questionData) => {
  const response = await axiosInstance.put(
    `/questions/${questionId}`,
    questionData
  );
  return response.data.data;
};

const deleteQuestion = async (questionId) => {
  const response = await axiosInstance.delete(`/questions/${questionId}`);
  return response.data.data;
};

const questionService = {
  uploadExcelQuestions,
  updateQuestion,
  deleteQuestion,
};

export default questionService;