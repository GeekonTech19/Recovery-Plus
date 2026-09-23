import { useState } from "react";
import type { FormEvent } from "react";
import { API_BASE_URL } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

type RegistrationState = "form" | "success";

export default function Register() {
  const navigate = useNavigate();
  const [state, setState] =
    useState<RegistrationState>("form");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setState("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    try {
      setError("");
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to resend verification email"
        );
      }

      alert(
        data.message ||
          "Verification instructions have been resent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend verification"
      );
    } finally {
      setLoading(false);
    }
  }

  if (state === "success") {
    return (
      <div className="container py-5">
        <div
          className="card shadow-sm border-0 mx-auto"
          style={{ maxWidth: 520 }}
        >
          <div className="card-body p-4 text-center">
            <div className="fs-1 mb-3">📧</div>

            <h2 className="mb-3">
              Check your email
            </h2>

            <p className="text-muted">
              Your Recovery+ account has been created.
              Please verify your email before continuing.
            </p>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <button
              type="button"
              className="btn btn-outline-primary me-2"
              disabled={loading}
              onClick={resendVerification}
            >
              {loading
                ? "Sending..."
                : "Resend verification"}
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div
        className="card shadow-sm border-0 mx-auto"
        style={{ maxWidth: 520 }}
      >
        <div className="card-body p-4">
          <h2 className="mb-4">Create your account</h2>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  First name
                </label>

                <input
                  className="form-control"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Last name
                </label>

                <input
                  className="form-control"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
              </div>

              <div className="col-12">
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </button>
              </div>
            </div>
          </form>

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
