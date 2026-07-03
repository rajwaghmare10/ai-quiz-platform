import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ marginBottom: "24px" }}>
      <div>
        <label>Class Name</label>
        <input
          type="text"
          {...register("className", { required: "Class name is required" })}
        />
        {errors.className && (
          <p style={{ color: "red" }}>{errors.className.message}</p>
        )}
      </div>

      <div>
        <label>Description (optional)</label>
        <input type="text" {...register("description")} />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Class"}
      </button>
    </form>
  );
};

export default CreateClassForm;