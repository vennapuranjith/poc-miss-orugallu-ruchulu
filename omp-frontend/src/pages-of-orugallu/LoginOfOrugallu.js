import React, { Suspense, useState, useEffect,lazy } from "react";
import { useAuth } from "../orugallu-components/AuthContext";
import "./LoginOfOrugallu.css";
import { useNavigate, Link } from "react-router-dom";
const GuestBanner =lazy(()=>import("../orugallu-components/GuestBanner"));
const CenterLoader =lazy(()=>import("../orugallu-components/CenterLoader"));

function LoginOfOrugallu() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home"); // or your preferred default route
    }
  }, [user, navigate]);

  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => document.body.classList.remove("auth-page");
  }, []);

  // Validation function for submit
  const validateForm = () => {
    const errors = {};
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/.test(form.email.trim())) {
      errors.email = "Email address is invalid";
    }
    if (!form.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  // Real-time field validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    let fieldError = "";
    if (name === "email") {
      if (!value.trim()) fieldError = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/.test(value.trim()))
        fieldError = "Email address is invalid";
    }
    if (name === "password") {
      if (!value) fieldError = "Password is required";
    }
    setErrors({ ...errors, [name]: fieldError });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessageType("success");
        setMessage("Login successful!");

        // ✅ Extract token, username, and userId from response
        const { token, username, userId } = data;

        // ✅ Save to context and localStorage
        login({ username, userId, role: data.role }, token);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMessageType("error");
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("laterLogin error. Please try again .");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <CenterLoader />}
      <Suspense fallback={<CenterLoader />}>
      <GuestBanner />
      </Suspense>
      <div className="signup-wrapper">
        <div className="signup-section" role="main" aria-label="Login Form">
          <h2 className="signup-heading">Login to Miss Orugallu Ruchulu</h2>
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <small id="email-error" className="error-text" role="alert">
                {errors.email}
              </small>
            )}

            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.password && (
              <small id="password-error" className="error-text" role="alert">
                {errors.password}
              </small>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                Object.values(errors).some(Boolean) ||
                !form.email ||
                !form.password
              }
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
          <div style={{ marginTop: "1rem" }}>
            <span>Not a user? </span>
            <Link to="/signup">Sign up here</Link>
          </div>
          {message && (
            <p
              className={`signup-message ${
                messageType === "error" ? "error" : "success"
              }`}
              role={messageType === "error" ? "alert" : undefined}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginOfOrugallu;
