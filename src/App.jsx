import { useState } from "react";
import Dashboard from "./Dashboard";
import Transaction from "./Transaction";
import Transfer from "./Transfer";
import ForgotPassword from "./ForgotPassword";
import Register from "./Register";
import "./App.css";

function App() {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loggedIn, setLoggedIn] = useState(false);

const [attempts, setAttempts] = useState(0);
const [locked, setLocked] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [showTransaction, setShowTransaction] = useState(false);
const [showTransfer, setShowTransfer] = useState(false);
const [showRegister, setShowRegister] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false);

const handleLogin = async () => {
  if (locked) {
    setError("Account is locked. Try again later");
    return;
  }

  if (!username || !password) {
    setError("Please enter username and password.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setLoggedIn(true);
      setError("");
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLocked(true);
        setError("Too many failed attempts. Account locked");
      } else {
        setError(data.message || "Invalid Username or Password");
      }
    }
  } catch (error) {
    setError("❌ Backend server is not connected.");
  }

  setLoading(false);
};
const handleLogout = () => {
    setLoggedIn(false);
  };
  const handleTransaction = () => {
    setShowTransaction(true);
};
const handleTransfer = () => {
  setShowTransfer(true);
};
if (showRegister) {
  return (
    <Register
      backToLogin={() => setShowRegister(false)}
    />
  );
}
if (showForgotPassword) {
  return (
    <ForgotPassword
      backToLogin={() => setShowForgotPassword(false)}
    />
  );
}

if (loggedIn) {
  if (showTransfer) {
  return (
    <Transfer
      backToDashboard={() => setShowTransfer(false)}
    />
  );
}
   if (showTransaction) {
    return (
      <Transaction 
        backToDashboard={() => setShowTransaction(false)}
      />
    );
  }

  return (
    <Dashboard 
      onLogout={handleLogout}
      viewTransaction={  handleTransaction}
      goToTransfer={handleTransfer}
    />
  );
}

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="bank-icon">🏦</div>
      <h1> Banking <br/>
        Security App
        </h1>
        <p className="welcome-text">
  Securely access your banking account
</p>

      <input 
        type="text"
        placeholder="Username"
        value={username}
  onChange={(e) => setUsername(e.target.value)}
      />

      <br />

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
         value={password}
  onChange={(e) => setPassword(e.target.value)}
      />

      <button 
       className="show-password"
       onClick={() => setShowPassword(!showPassword)}
       >
        {showPassword ? "Hide Password" : "Show Password"}
      </button>

      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button 
      className="login-button"
      onClick={handleLogin}> {loading ? "Logging in..." : "Login"}</button>
      <br />
      

<button  className="forgot-password"
onClick={() => setShowForgotPassword(true)}
>
  Forgot Password
</button>
<br />

<button
  className="create-account-button"
  onClick={() => setShowRegister(true)}
>
  Create New Account
</button>
</div>
    </div>
  );
}

export default App;