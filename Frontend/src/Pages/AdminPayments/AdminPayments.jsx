import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./AdminPayments.css";

const ADMIN_PASSWORD = "123456"; // CHANGE PASSWORD HERE

export default function AdminPayments() {
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem("adminUnlocked") === "true"
  );
  const [password, setPassword] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadPayments() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/payment-proof");
      const data = await response.json();
      setPayments(data);
    } catch {
      alert("Could not load payment requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (unlocked) loadPayments();
  }, [unlocked]);

  function handleUnlock(e) {
    e.preventDefault();

    if (password !== ADMIN_PASSWORD) {
      alert("Incorrect admin password");
      return;
    }

    sessionStorage.setItem("adminUnlocked", "true");
    setUnlocked(true);
  }

  function handleLock() {
    sessionStorage.removeItem("adminUnlocked");
    setUnlocked(false);
    setPassword("");
  }

  async function updateStatus(id, status) {
    await fetch(`http://localhost:5000/api/payment-proof/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadPayments();
  }

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <section className="admin-shell">
          {!unlocked ? (
            <form className="admin-login-card" onSubmit={handleUnlock}>
              <div className="admin-lock">🔐</div>

              <p className="admin-eyebrow">Owner access</p>
              <p className="admin-eyebrow">Access to this page is strictly reserved for authorized administrative personnel only</p>
              <h1>Admin Login</h1>
              <p className="admin-text">
                Enter your admin password to manage payment confirmations.
              </p>

              <input
                className="admin-input"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="admin-btn" type="submit">
                Unlock Admin
              </button>
            </form>
          ) : (
            <div className="admin-panel-card">
              <div className="admin-topbar">
                <div>
                  <p className="admin-eyebrow">Payment verification</p>
                  <h1>Payment Requests</h1>
                  <p className="admin-text">
                    Review receipt uploads and approve customer payments.
                  </p>
                </div>

                <div className="admin-actions">
                  <button className="admin-secondary-btn" onClick={loadPayments}>
                    Refresh
                  </button>
                  <button className="admin-secondary-btn" onClick={handleLock}>
                    Lock Admin
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="empty-state">Loading payment requests...</div>
              ) : payments.length === 0 ? (
                <div className="empty-state">
                  <h3>No payment requests yet</h3>
                  <p>When customers upload proof of payment, it will appear here.</p>
                </div>
              ) : (
                <div className="payment-grid">
                  {payments.map((payment) => (
                    <article className="payment-item" key={payment.id}>
                      <div>
                        <span className={`payment-status status-${payment.status}`}>
                          {payment.status}
                        </span>

                        <h3>{payment.customerName}</h3>
                        <p>{payment.customerEmail}</p>
                        <small>{new Date(payment.createdAt).toLocaleString()}</small>
                      </div>

                      <a
                        className="payment-proof"
                        href={`data:${payment.mimeType};base64,${payment.proof}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Proof →
                      </a>

                      <div className="payment-buttons">
                        <button
                          className="admin-btn confirm-btn"
                          onClick={() => updateStatus(payment.id, "confirmed")}
                        >
                          Payment Confirmed
                        </button>

                        <button
                          className="admin-btn waiting-btn"
                          onClick={() => updateStatus(payment.id, "waiting")}
                        >
                          Waiting Alert
                        </button>

                        <button
                          className="admin-btn reject-btn"
                          onClick={() => updateStatus(payment.id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}