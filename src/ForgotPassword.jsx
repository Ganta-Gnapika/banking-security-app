import { useState } from "react";

function ForgotPassword({ backToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    const savedUser =
      JSON.parse(localStorage.getItem("bankUser")) || null;

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    if (!savedUser) {
      setMessage("No registered account found.");
      return;
    }

    if (email !== savedUser.email) {
      setMessage("Email not found.");
      return;
    }

    setVerified(true);
    setMessage("✅ Email verified successfully!");
  };

  // Password reset function
  const handlePasswordReset = () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const savedUser =
      JSON.parse(localStorage.getItem("bankUser")) || null;

    const updatedUser = {
      ...savedUser,
      password: newPassword,
    };

    localStorage.setItem("bankUser", JSON.stringify(updatedUser));

    setMessage("✅ Password reset successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>🔐 Forgot Password</h2>

        <p>Enter your registered email address.</p>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">
            Verify Email
          </button>
        </form>

        {message && <p>{message}</p>}

        {verified && (
          <div>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={handlePasswordReset}
            >
              Reset Password
            </button>

          </div>
        )}

        <button
          type="button"
          className="back-button"
          onClick={backToLogin}
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;