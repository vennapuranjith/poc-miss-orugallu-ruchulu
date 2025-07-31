import React, {Suspense,lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpOfOrugallu.css";
const GuestBanner= lazy(()=>import("../orugallu-components/GuestBanner"));

function SignUpOfOrugallu() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Username: required, min 3, max 30, letters, numbers, _ only
    if (!form.username.trim()) {
      errors.username = "Username is required";
    } 
    // Allow letters, numbers, underscore, and spaces
    else if (!/^[a-zA-Z0-9_ ]{3,30}$/.test(form.username.trim())) {
      errors.username =
        "Username must be 3-30 characters and can contain letters, numbers, underscores, and spaces";
    }

    // Email format
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/.test(form.email.trim())
    ) {
      errors.email = "Email address is invalid";
    }

    // Password: min 8 chars, at least one uppercase, one lowercase, one digit, one special char
    if (!form.password) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        form.password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character";
    }

    // Confirm password matches password
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate this field only
    let fieldError = "";
    if (name === "username") {
      if (!value.trim()) fieldError = "Username is required";
      else if (!/^[a-zA-Z0-9_ ]{3,30}$/.test(value.trim()))
        fieldError =
          "Username must be 3-30 characters and can contain letters, numbers, underscores, and spaces";
    }
    if (name === "email") {
      if (!value.trim()) fieldError = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/.test(value.trim()))
        fieldError = "Email address is invalid";
    }
    if (name === "password") {
      if (!value) fieldError = "Password is required";
      else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
          value
        )
      )
        fieldError =
          "Password must be at least 8 characters, include uppercase, lowercase, number and special character";
    }
    if (name === "confirmPassword") {
      if (!value) fieldError = "Please confirm your password";
      else if (value !== form.password) fieldError = "Passwords do not match";
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
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Signup successful! You can now log in.");
        setForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        setTimeout(() => {
          navigate("/login");
        }, 1500); // Redirect after 1.5 seconds (optional, for user to see message)
      } else {
        setMessageType("error");
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Signup error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Suspense fallback={<div className="loading">Loading...</div>}>
    <GuestBanner />
    </Suspense>
    <div className="signup-wrapper">
      <div className="signup-section" role="main" aria-label="Signup Form">
        <h2 className="signup-heading">Signup for Miss Orugallu Ruchulu</h2>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
            required
            disabled={isSubmitting}
            autoComplete="username"
          />
          {errors.username && (
            <small id="username-error" className="error-text" role="alert">
              {errors.username}
            </small>
          )}

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

          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            required
            disabled={isSubmitting}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <small
              id="confirmPassword-error"
              className="error-text"
              role="alert"
            >
              {errors.confirmPassword}
            </small>
          )}

          <div className="button-group">
            <button
              type="submit"
              className="form-btn"
              disabled={
                isSubmitting ||
                Object.values(errors).some(Boolean) ||
                !form.username ||
                !form.email ||
                !form.password ||
                !form.confirmPassword
              }
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
            <button
              type="button"
              className="form-btn back-btn"
              onClick={() => navigate(-1)}
            >
              Login
            </button>
          </div>
        </form>
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

export default SignUpOfOrugallu;
