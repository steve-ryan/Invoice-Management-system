import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    axios
     .post("http://localhost:5000/admin/register",{ name, password })
     .then((response) => {
      console.log(response.data);
      setErrorMessage("");
     })
     .catch((error)=> {
      console.log(error.response.data);
      setErrorMessage(error.response.data);
     });
  };
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">IMS Register</h2>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <button type="submit" className="form-button">
          Register
        </button>
        <div className="form-group">
          <p className="form-label">
            Don't have an account <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
