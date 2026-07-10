import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const errorClass = "mt-1 text-xs text-red-600";

const CreateClassForm = ({ onCreate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await onCreate(formData);
      toast.success("Class created successfully");
      reset();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create class";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className={labelClass}>Class Name</label>
        <input
          type="text"
          {...register("className", { required: "Class name is required" })}
          className={inputClass}
          placeholder="e.g. DBMS"
        />
        {errors.className && (
          <p className={errorClass}>{errors.className.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Description (optional)</label>
        <input
          type="text"
          {...register("description")}
          className={inputClass}
          placeholder="e.g. Database Management Systems"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Class"}
      </button>
    </form>
  );
};

export default CreateClassForm;