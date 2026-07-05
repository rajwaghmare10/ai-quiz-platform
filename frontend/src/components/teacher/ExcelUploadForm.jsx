import { useState } from "react";
import toast from "react-hot-toast";
import questionService from "../../api/questionService";

const ExcelUploadForm = ({ quizId, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an Excel file first");
      return;
    }

    setUploading(true);
    try {
      const result = await questionService.uploadExcelQuestions(quizId, file);
      toast.success(`${result.totalQuestions} questions uploaded`);
      setFile(null);
      onUploaded();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to upload questions";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={uploading} style={{ marginLeft: "8px" }}>
        {uploading ? "Uploading..." : "Upload Excel"}
      </button>
    </form>
  );
};

export default ExcelUploadForm;