import { useState } from "react";
import axios from "axios";
import "../styles/AuthUI.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

const handleLogin = async () => {
  try {
    const res = await axios.post("https://localhost:7243/api/auth/login", {
      Username: username,
      Email: email,
      Password: password,
    });

    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
  } catch (err: any) {
    console.error("Login failed:", err.response?.data || err.message);
    alert("Login failed");
  }
};

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back 💫</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
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
