import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await API.post("/api/auth/register", form);

      alert(res.data.message);
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />
      <br /><br />

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

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}