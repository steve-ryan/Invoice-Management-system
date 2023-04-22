import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/admin/login", { username, password })
      .then((response) => {
        const token = response.data.token;
        console.log(token);
        // do something with the token
      })
      .catch((error) => {
        setErrorMessage(error.response.data);
      });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">IMS Login</h2>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-input"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-input"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <button type="submit" className="form-button">
          Login
        </button>
        <div className="form-group">
          <p className="form-label">
            Don't have an account <a href="/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
