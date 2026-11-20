import { useEffect, useState } from "react";
 function Dashboard({ onLogout, viewTransaction,goToTransfer }) {
  const [balance, setBalance] = useState(50000); 
  const [user, setUser] = useState(null);
  useEffect(() => { 
    const savedBalance = localStorage.getItem("balance");
     if (savedBalance !== null) {
       setBalance(Number(savedBalance)); 
      } else { 
        localStorage.setItem("balance", "50000"); }
        const savedUser =
  JSON.parse(localStorage.getItem("bankUser")) || null;

setUser(savedUser);
       }, []);
  return (
     <div className="dashboard">
      <div className="dashboard-header">
  <h1>🏦 Secure Banking Portal</h1>
  <p>Welcome, Admin</p>
</div>
<div className="dashboard-grid">

<div className="dashboard-card account-card">
      <h2>💳 Account Details</h2>

  <p>
    👤 Account Holder: {user?.fullName || "Admin"}
  </p>

  <p>
    📧 Email: {user?.email || "-"}
  </p>

  <p>
    📱 Mobile: {user?.mobile || "-"}
  </p>

  <p>
    👤 Username: {user?.username || "gnapika"}
  </p>

  <p>
    💰 Available Balance: ₹{balance}
  </p>
</div>

 <div className="dashboard-card security-card">
      <h2>🛡️ Security Status</h2>
      <p className="secure-text">Your account is secure ✅</p>
       <p>🔐 Two Factor Authentication: Enabled</p>
  </div>
  <div className="dashboard-card security-card">
      <h2>Security Alerts</h2>

<p>🔐 Last Login: Today</p>
<p>✅ Account Verification: Completed</p>
<p>⚠️ Failed Login Attempts: 0</p>
<p>🛡️ Security Level: High</p>
</div>
</div>
<button
  className="transfer-button"
  onClick={goToTransfer}
>
  Transfer Money
</button>

<br /><br />
      <button  className="transaction-button" onClick={viewTransaction}>
  View Transactions
</button>

<br /><br />

      <button className="logout-button"  onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
