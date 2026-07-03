import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../api/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const { name, email, password, role } = formData;
      await authService.register({ name, email, password, role });
      toast.success("Account created. Please log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "80px auto" }}>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label>I am a</label>
          <select {...register("role", { required: "Please select a role" })}>
            <option value="">Select role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          {errors.role && <p style={{ color: "red" }}>{errors.role.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "12px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;