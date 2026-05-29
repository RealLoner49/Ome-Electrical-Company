import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./ConfirmPayment.css";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function ConfirmPayment() {
  const [proof, setProof] = useState(null);
  const [submitted, setSubmitted] = useState(
    Boolean(localStorage.getItem("latestPaymentProofId"))
  );
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("waiting");

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const proofId = localStorage.getItem("latestPaymentProofId");

    if (!proofId) return;

    const resetOldSubmission = () => {
      localStorage.removeItem("latestPaymentProofId");
      setProof(null);
      setSubmitted(false);
      setPaymentStatus("waiting");
    };

    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/payment-proof/${proofId}`);
        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          setSubmitted(true);
          setPaymentStatus(data.status || "waiting");
        } else {
          resetOldSubmission();
        }
      } catch (error) {
        console.log(error);
        resetOldSubmission();
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || submitted) return;

    if (!proof) {
      toast?.showToast?.(
        "Please upload your payment receipt or screenshot.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("proof", proof);
      formData.append("customerName", user?.displayName || "Customer");
      formData.append("customerEmail", user?.email || "No email");

      const response = await fetch(`${API_BASE_URL}/payment-proof`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Payment proof submission failed.");
      }

      localStorage.setItem("latestPaymentProofId", data.submission.id);

      toast?.showToast?.(
        "Payment proof has been sent. Please wait for confirmation.",
        "success"
      );

      setPaymentStatus(data.submission.status || "waiting");
      setSubmitted(true);
    } catch (error) {
      toast?.showToast?.(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadAnotherProof = () => {
    localStorage.removeItem("latestPaymentProofId");
    setProof(null);
    setSubmitted(false);
    setPaymentStatus("waiting");
  };

  return (
    <>
      <Navbar />

      <main className="confirm-page">
        <section className="confirm-card">
          {!submitted ? (
            <>
              <p className="confirm-eyebrow">Payment verification</p>

              <h1>Confirm your transfer</h1>

              <p className="confirm-text">
                Upload your payment receipt or screenshot so our team can verify
                your transfer. Once payment is confirmed, your order will be
                processed.
              </p>

              <form onSubmit={handleSubmit} className="confirm-form">
                <label className="upload-box">
                  <span>Upload payment proof</span>
                  <small>
                    Receipt, bank screenshot, PDF, or transfer confirmation
                  </small>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    disabled={loading}
                    onChange={(e) => setProof(e.target.files[0])}
                  />
                </label>

                {proof && <p className="file-name">Selected: {proof.name}</p>}

                <button
                  className="confirm-btn"
                  type="submit"
                  disabled={loading || submitted}
                >
                  {loading ? "Sending..." : "Submit payment proof"}
                </button>
              </form>
            </>
          ) : (
            <div className="submitted-box">
              <div className="success-icon">✓</div>

              <h1>Payment proof submitted</h1>

              <p>
                We are reviewing your payment. Please keep this page open or
                check back later. Your status will update once the admin responds.
              </p>

              {paymentStatus === "waiting" && (
                <div className="status-box waiting">
                  Please wait while we confirm your payment.
                </div>
              )}

              {paymentStatus === "confirmed" && (
                <div className="status-box confirmed">
                  Payment successful. Your package is now being prepared.
                </div>
              )}

              {paymentStatus === "rejected" && (
                <div className="status-box rejected">
                  Payment proof rejected. Please upload a valid receipt or
                  contact support.
                </div>
              )}

              {paymentStatus === "rejected" && (
                <button className="confirm-btn" onClick={uploadAnotherProof}>
                  Upload another proof
                </button>
              )}

              {paymentStatus === "confirmed" && (
                <button
                  className="confirm-btn"
                  onClick={() => (window.location.hash = "#/profile")}
                >
                  Go to profile
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}