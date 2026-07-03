import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "../api/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const data = await apiRequest(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          {status === "success" ? (
            <CheckCircle size={36} />
          ) : (
            <XCircle size={36} />
          )}
        </div>

        <h1>Email Verification</h1>
        <p className={status === "success" ? "success-message" : "error-message"}>
          {message}
        </p>

        <p className="bottom-link">
          <Link to="/login">Go to login</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;