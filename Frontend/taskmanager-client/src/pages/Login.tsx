import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/AuthUI.css";

export default function Login() {
  const [email, setEmail] = useState("");       // ✅ NEW
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://localhost:7243/api/auth/login", {
        Email: email,
        Username: username,
        Password: password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful! 🎉");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.Email?.[0] ||
        err.response?.data ||
        "Login failed";
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back 💫</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
}
