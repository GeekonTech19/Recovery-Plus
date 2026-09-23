import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/auth/forgot-password`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                email.trim().toLowerCase(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to process request"
        );
      }

      setMessage(
        data.message ||
          "If an account exists for this email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process request"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <div
        className="row justify-content-center"
      >
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-2">
                Forgot your password?
              </h2>

              <p className="text-muted mb-4">
                Enter your email address and
                we'll help you reset your
                password.
              </p>

              {message && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  {message}

                  {import.meta.env.DEV && (
                    <div className="mt-2">
                      Check the backend terminal
                      for the local reset link.
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label
                    htmlFor="forgot-email"
                    className="form-label"
                  >
                    Email address
                  </label>

                  <input
                    id="forgot-email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send reset link"}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link to="/login">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
