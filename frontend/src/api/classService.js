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

const deleteClass = async (classId) => {
  const response = await axiosInstance.delete(`/classes/${classId}`);
  return response.data;
};

const joinClass = async (classCode) => {
  const response = await axiosInstance.post("/classes/join", { classCode });
  return response.data.data;
};

const getJoinedClasses = async () => {
  const response = await axiosInstance.get("/classes/joined");
  return response.data.data;
};

const classService = {
  getMyClasses,
  getClassById,
  getClassStudents,
  createClass,
  deleteClass,
  joinClass,
  getJoinedClasses
};

export default classService;