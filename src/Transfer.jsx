
import { useState } from "react";

function Transfer({ backToDashboard }) {
  const [receiverName, setReceiverName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");

  const handleTransfer = async () => {
    if (
      receiverName === "" ||
      accountNumber === "" ||
      amount === ""
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    if (accountNumber.length !== 10) {
      setMessage("Account Number must be 10 digits.");
      return;
    }

    if (Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const currentBalance =
      Number(localStorage.getItem("balance")) || 50000;

    const transferAmount = Number(amount);

    if (transferAmount > currentBalance) {
      setMessage("Insufficient balance.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverName,
            accountNumber,
            amount: transferAmount,
            message: note,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Transfer failed.");
        return;
      }

      // Update balance
      const newBalance = currentBalance - transferAmount;

      localStorage.setItem("balance", newBalance);

      // Create transaction
      const newTransaction = {
        date: new Date().toLocaleDateString("en-GB"),
        type: "Transfer",
        amount: amount,
        receiver: receiverName,
        note: note,
      };

      const oldTransactions =
        JSON.parse(localStorage.getItem("transactions")) || [];

      localStorage.setItem(
        "transactions",
        JSON.stringify([
          ...oldTransactions,
          newTransaction,
        ])
      );

      setMessage("✅ Transfer Successful!");

      setReceiverName("");
      setAccountNumber("");
      setAmount("");
      setNote("");
    } catch (error) {
      setMessage("❌ Backend server is not connected.");
    }
  };

  return (
    <div className="transfer-page">
      <div className="transfer-card">
        <h1>💸 Transfer Money</h1>

        <input
          type="text"
          placeholder="Enter Receiver Name"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d{0,10}$/.test(value)) {
              setAccountNumber(value);
            }
          }}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br /><br />
        <br /><br />

        <input
          type="text"
          placeholder="Enter Message (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <br /><br />

        <button onClick={handleTransfer}>
          Transfer
        </button>

        <br /><br />

        {message && <p>{message}</p>}

        <br />

        <button onClick={backToDashboard}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Transfer;

