"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

// import { register } from "../../../features/userSlice"; // Uncomment if you have a register action

const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/v1/auth/create/", {
        username: username,
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.status === 6000) {
          console.log("Signup successful:", response.data);
          setError("Signup successful : " + response.data.message);
          router.push("/");
          // Handle successful signup, redirect, etc.
        } else {
          console.error("Signup failed:", response.data);
          setError("Signup failed: " + response.data.message);
          // Handle failed signup, display a message, etc.
        }
      })

      .catch(function (error) {
        console.log("error:", error);
      });

    // dispatch(
    //   register({
    //     name: username,
    //     email: email,
    //     password: password,
    //   })
    // );
   
  };

  return (
    <RegisterContainer>
      <RightContainer>
        <h1>Register</h1>
        <Form id="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faEnvelope} />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} />
          </div>

          <div className="button-container">
            <button type="submit">Register</button>
          </div>        
        </Form>
      </RightContainer>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  margin-top: 100px;
`;

const RightContainer = styled.div`
  width:350px;
  margin: auto;
  background: #76737321;
  padding: 32px;
  border-radius: 7px;

  h1 {
    text-align: center;
    color: #333;
  }
`;

const Form = styled.form`
  .form-group {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    color: #666;
    border: 1px solid #ccc;
    padding: 5px 15px 5px 5px;
    border-radius: 7px;
    background: #fff;

    &:focus-within {
      outline: 2px solid #634c9f;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 8px;
      border-radius: 3px;
      box-sizing: border-box;
      border: none;
      outline: none;
    }
  }

  .button-container {
    text-align: center; /* Centers the button horizontally */
  }

  button {
    width: 50%;
    padding: 10px;
    background-color: #351430;
    color: #fff;
    border: none;
    border-radius: 7px;
    cursor: pointer;

    &:hover {
      background-color: #551430;
    }
  }
`;

export default Register;
