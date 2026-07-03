import axiosInstance from "./axiosInstance";

const getMyClasses = async () => {
  const response = await axiosInstance.get("/classes");
  return response.data.data;
};

const getClassById = async (classId) => {
  const response = await axiosInstance.get(`/classes/${classId}`);
  return response.data.data;
};

const getClassStudents = async (classId) => {
  const response = await axiosInstance.get(`/classes/${classId}/students`);
  return response.data.data;
};

const createClass = async (classData) => {
  const response = await axiosInstance.post("/classes", classData);
  return response.data.data;
};

const classService = {
  getMyClasses,
  getClassById,
  getClassStudents,
  createClass,
};

export default classService;