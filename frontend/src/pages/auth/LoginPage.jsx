import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link} from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const user = await login(formData);
      toast.success(`Welcome back, ${user.name}`);

      if (user.role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "80px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "12px" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;