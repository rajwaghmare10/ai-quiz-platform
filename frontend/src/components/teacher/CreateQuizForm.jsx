import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CreateQuizForm = ({ classId, onCreate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const payload = {
        classId,
        title: formData.title,
        durationMinutes: Number(formData.durationMinutes),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        questionsPerAttempt: Number(formData.questionsPerAttempt),
      };

      await onCreate(payload);
      toast.success("Quiz created successfully");
      reset();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create quiz";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ marginBottom: "24px" }}>
      <div>
        <label>Quiz Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
      </div>

      <div>
        <label>Duration (minutes)</label>
        <input
          type="number"
          {...register("durationMinutes", {
            required: "Duration is required",
            min: { value: 1, message: "Duration must be at least 1 minute" },
          })}
        />
        {errors.durationMinutes && (
          <p style={{ color: "red" }}>{errors.durationMinutes.message}</p>
        )}
      </div>

      <div>
        <label>Start Time</label>
        <input
          type="datetime-local"
          {...register("startTime", { required: "Start time is required" })}
        />
        {errors.startTime && (
          <p style={{ color: "red" }}>{errors.startTime.message}</p>
        )}
      </div>

      <div>
        <label>End Time</label>
        <input
          type="datetime-local"
          {...register("endTime", {
            required: "End time is required",
            validate: (value, formValues) => {
              if (!formValues.startTime) return true;
              return (
                new Date(value) > new Date(formValues.startTime) ||
                "End time must be after start time"
              );
            },
          })}
        />
        {errors.endTime && (
          <p style={{ color: "red" }}>{errors.endTime.message}</p>
        )}
      </div>

      <div>
        <label>Questions Per Attempt</label>
        <input
          type="number"
          {...register("questionsPerAttempt", {
            required: "This field is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
        />
        {errors.questionsPerAttempt && (
          <p style={{ color: "red" }}>{errors.questionsPerAttempt.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Quiz"}
      </button>
    </form>
  );
};

export default CreateQuizForm;