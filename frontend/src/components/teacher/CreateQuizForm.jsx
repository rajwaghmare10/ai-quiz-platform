import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const errorClass = "mt-1 text-xs text-red-600";

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label className={labelClass}>Quiz Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className={inputClass}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Duration (minutes)</label>
        <input
          type="number"
          {...register("durationMinutes", {
            required: "Duration is required",
            min: { value: 1, message: "Duration must be at least 1 minute" },
          })}
          className={inputClass}
        />
        {errors.durationMinutes && (
          <p className={errorClass}>{errors.durationMinutes.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Time</label>
          <input
            type="datetime-local"
            {...register("startTime", { required: "Start time is required" })}
            className={inputClass}
          />
          {errors.startTime && (
            <p className={errorClass}>{errors.startTime.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>End Time</label>
          <input
            type="datetime-local"
            {...register("endTime", {
              required: "End time is required",
              validate: (value, formValues) => {
                if (!formValues.startTime) return true;
                return (
                  new Date(value) > new Date(formValues.startTime) ||
                  "Must be after start time"
                );
              },
            })}
            className={inputClass}
          />
          {errors.endTime && (
            <p className={errorClass}>{errors.endTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Questions Per Attempt</label>
        <input
          type="number"
          {...register("questionsPerAttempt", {
            required: "This field is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
          className={inputClass}
        />
        {errors.questionsPerAttempt && (
          <p className={errorClass}>{errors.questionsPerAttempt.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Quiz"}
      </button>
    </form>
  );
};

export default CreateQuizForm;