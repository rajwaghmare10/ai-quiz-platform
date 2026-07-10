import { useState } from "react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
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
      const message = error?.response?.data?.message || "Failed to upload questions";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600">
        <Upload size={18} />
        {file ? file.name : "Click to select an Excel file (.xlsx, .xls)"}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>
      <button
        type="submit"
        disabled={uploading || !file}
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload Excel"}
      </button>
    </form>
  );
};

export default ExcelUploadForm;