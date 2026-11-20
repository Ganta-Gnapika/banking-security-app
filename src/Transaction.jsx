import { useEffect, useState } from "react";

function Transaction({ backToDashboard }) {
  const sampleTransactions = [
    {
      date: "01-08-2026",
      type: "Deposit",
      receiver: "-",
      note: "-",
      amount: 5000,
    },
    {
      date: "02-08-2026",
      type: "Withdraw",
      receiver: "-",
      note: "-",
      amount: 2000,
    },
    {
      date: "03-08-2026",
      type: "Transfer",
      receiver: "-",
      note: "-",
      amount: 1000,
    },
  ];

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/transactions"
        );

        const data = await response.json();

        if (response.ok) {
          setTransactions([...sampleTransactions, ...data]);
        } else {
          setTransactions(sampleTransactions);
        }
      } catch (error) {
        console.log("Backend not connected:", error);

        const savedTransactions =
          JSON.parse(localStorage.getItem("transactions")) || [];

        setTransactions([
          ...sampleTransactions,
          ...savedTransactions,
        ]);
      }
    };

    loadTransactions();
  }, []);

  return (
    <div className="transaction-page">
      <h2>📋 Transaction History</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="date-filter">
        <label>Select Date:</label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setSelectedDate("")}
        >
          Clear Date
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Receiver</th>
              <th>Message</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions
              .filter((transaction) => {
                const matchesSearch =
                  transaction.type
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  transaction.receiver
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  transaction.amount
                    ?.toString()
                    .includes(searchTerm);

                const matchesDate =
                  selectedDate === "" ||
                  transaction.date ===
                    selectedDate
                      .split("-")
                      .reverse()
                      .join("-");

                return matchesSearch && matchesDate;
              })
              .map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>

                  <td className="transfer">
                    {transaction.type}
                  </td>

                  <td>
                    {transaction.receiver || "-"}
                  </td>

                  <td>
                    {transaction.note || "-"}
                  </td>

                  <td>
                    ₹{transaction.amount}
                  </td>

                  <td className="success">
                    Completed ✅
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <br />

      <button
        className="back-button"
        onClick={backToDashboard}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default Transaction;