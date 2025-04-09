import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const LoginComponent = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleValidation = (e) => {
    const { email, password } = formData;

    let isValid = true;

    if (e.target.name === "email") {
      if (!email) {
        setError((prev) => ({ ...prev, email: "email is required" }));
        isValid = false;
        return;
      }
      if (email.length < 3) {
        setError((prev) => ({
          ...prev,
          email: "email must be at least 3 characters long",
        }));
        isValid = false;
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError((prev) => ({
          ...prev,
          email: "email must be a valid email address",
        }));
        isValid = false;
        return;
      }
      setError((prev) => ({
        ...prev,
        email: "",
      }));
    }

    if (e.target.name === "password") {
      if (!password) {
        setError((prev) => ({ ...prev, password: "Password is required" }));
        isValid = false;
        return;
      }
      if (password.length < 6) {
        setError((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters long",
        }));
        isValid = false;
        return;
      }
      setError((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await fetch("/SmartProAPI/api/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Replace with your API endpoint
        //  "{ "email": "test", "password": "test"}"
      });

      const data = await res.json();

      const decordedToken = jwtDecode(data.token);

      // localStorage.setItem("token", data.token);
      // sessionStorage.setItem("token", data.token);
      Cookies.set("token", data.token, {
        expires: new Date(decordedToken.exp * 1000),
        path: "/",
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert(error);
    }

    console.log("Login submitted:", formData);
    // Add actual login logic here
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form
        onSubmit={handleSubmit}
        onReset={() => setFormData({ email: "", password: "" })}
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleValidation}
            required
          />
          {error.email && <div className="text-danger">{error.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleValidation}
            required
          />
          {error.password && (
            <div className="text-danger">{error.password}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        <hr />
        <button type="reset" className="btn btn-primary w-100">
          reset
        </button>
      </form>
      <iframe src="http://18.211.120.129/" frameborder="0"></iframe>
    </div>
  );
};

export default LoginComponent;
