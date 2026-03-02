import { useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        // LOGIN
        const res = await API.post("/api/auth/login", {
          email: form.email,
          password: form.password
        });

        login(res.data.token);
        navigate("/");
      } else {
        // REGISTER
        const res = await API.post("/api/auth/register", form);

        // auto login after register
        login(res.data.token);
        navigate("/");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      {!isLogin && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <br /><br />
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
      <br /><br />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p style={{ marginTop: 20 }}>
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}

        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "blue",
            cursor: "pointer",
            marginLeft: 5
          }}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
}