import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/auth.css";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const res = await API.post(endpoint, form);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">

      <div className="auth-blob blob1"></div>
      <div className="auth-blob blob2"></div>

      <div className="auth-left">
        <div className="auth-brand">
          <h1>MedVault</h1>
          <p>
            Manage medicines, track stock,
            schedule checkups, and store
            documents securely.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <input
              name="name"
              className="auth-input"
              placeholder="Full Name"
              onChange={handleChange}
            />
          )}

          <input
            name="email"
            className="auth-input"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            className="auth-input"
            placeholder="Password"
            onChange={handleChange}
          />

          {error && (
            <p style={{ color: "#ef4444", fontSize: 13 }}>
              {error}
            </p>
          )}

          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>

          <div className="auth-link">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span onClick={() => setIsLogin(false)}>
                  Register
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsLogin(true)}>
                  Login
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}