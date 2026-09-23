import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { API_BASE_URL } from "../services/api";

export default function ResetPassword() {
  const [searchParams] =
    useSearchParams();

  const navigate =
    useNavigate();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

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

    if (!token) {
      setError(
        "This password reset link is invalid."
      );
      return;
    }

    if (
      password.length < 8 ||
      password.length > 128
    ) {
      setError(
        "Password must be between 8 and 128 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/auth/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              token,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reset password"
        );
      }

      setMessage(
        "Your password has been reset successfully. You can now log in with your new password."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset password"
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
                Reset your password
              </h2>

              <p className="text-muted mb-4">
                Choose a new password for
                your Recovery+ account.
              </p>

              {message && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  {message}
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

              {!message && (
                <form
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <label
                      htmlFor="reset-password"
                      className="form-label"
                    >
                      New password
                    </label>

                    <input
                      id="reset-password"
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      minLength={8}
                      maxLength={128}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="confirm-password"
                      className="form-label"
                    >
                      Confirm new password
                    </label>

                    <input
                      id="confirm-password"
                      type="password"
                      className="form-control"
                      value={
                        confirmPassword
                      }
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      minLength={8}
                      maxLength={128}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Resetting..."
                      : "Reset password"}
                  </button>
                </form>
              )}

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
