
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary memory storage
const users = [
  {
    fullName: "Gnapika",
    email: "gnapika@gmail.com",
    mobile: "9876543210",
    username: "gnapika",
    password: "gnapika@30",
  },
];

const transactions = [];
let balance = 50000;

// Backend testing
app.get("/", (req, res) => {
  res.send("Banking Security Backend is running!");
});

// User Registration
app.post("/api/register", (req, res) => {
  const { fullName, email, mobile, username, password } = req.body;

  if (!fullName || !email || !mobile || !username || !password) {
    return res.status(400).json({
      message: "Please fill all fields.",
    });
  }

  const existingUser = users.find(
    (user) =>
      user.username === username || user.email === email
  );

  if (existingUser) {
    return res.status(409).json({
      message: "Username or email already exists.",
    });
  }

  const newUser = {
    fullName,
    email,
    mobile,
    username,
    password,
  };

  users.push(newUser);

  res.status(201).json({
    message: "Account registered successfully!",
    user: {
      fullName,
      email,
      mobile,
      username,
    },
  });
});

// User Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please enter username and password.",
    });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password.",
    });
  }

  res.status(200).json({
    message: "Login successful!",
    user: {
      fullName: user.fullName,
      username: user.username,
    },
  });
});

// Money Transfer
app.post("/api/transfer", (req, res) => {
  const { receiverName, accountNumber, amount, message } = req.body;

  if (!receiverName || !accountNumber || !amount) {
    return res.status(400).json({
      message: "Please fill all required fields.",
    });
  }

  const transferAmount = Number(amount);

  if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({
      message: "Please enter a valid amount.",
    });
  }

  if (transferAmount > balance) {
    return res.status(400).json({
      message: "Insufficient balance.",
    });
  }

  balance -= transferAmount;

  const newTransaction = {
    date: new Date().toLocaleDateString("en-GB"),
    type: "Transfer",
    receiver: receiverName,
    note: message || "-",
    amount: transferAmount,
  };

  transactions.push(newTransaction);

  res.status(200).json({
    message: "Transfer successful!",
    balance,
    transaction: newTransaction,
  });
});

// Get Transactions
app.get("/api/transactions", (req, res) => {
  res.status(200).json(transactions);
});

// Get Balance
app.get("/api/balance", (req, res) => {
  res.status(200).json({ balance });
});

// Start Backend Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
