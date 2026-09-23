import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
import { Link, useSearchParams } from "react-router-dom";

type VerificationState =
  | "verifying"
  | "success"
  | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] =
    useState<VerificationState>("verifying");

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setState("error");
        setMessage(
          "Verification token is missing."
        );
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(
            token
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Email verification failed."
          );
        }

        setState("success");
        setMessage(
          data.message ||
            "Your email has been verified successfully."
        );
      } catch (err) {
        setState("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Email verification failed."
        );
      }
    }

    verify();
  }, [token]);

  return (
    <div className="container py-5">
      <div
        className="card shadow-sm border-0 mx-auto"
        style={{ maxWidth: 520 }}
      >
        <div className="card-body p-4 text-center">
          {state === "verifying" && (
            <>
              <div className="spinner-border mb-3" />
              <h2>Verifying your email...</h2>
              <p className="text-muted">
                Please wait while we confirm your
                email address.
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <div className="fs-1 mb-3">✅</div>

              <h2>Email verified</h2>

              <p className="text-muted">
                {message}
              </p>

              <Link
                className="btn btn-primary"
                to="/login"
              >
                Continue to Login
              </Link>
            </>
          )}

          {state === "error" && (
            <>
              <div className="fs-1 mb-3">⚠️</div>

              <h2>Verification failed</h2>

              <p className="text-muted">
                {message}
              </p>

              <Link
                className="btn btn-primary"
                to="/login"
              >
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
