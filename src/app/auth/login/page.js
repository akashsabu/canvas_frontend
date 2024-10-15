"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import axios from "axios";

import { setTokens } from '../../../utils/session';
import { login } from "../../../redux/features/userSlice";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/v1/auth/login/", {
        username: username,
        password: password,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.status === 6000) {
          console.log("login successful:", response.data);

          const { access, refresh } = response.data.data;
          setTokens(access, refresh);

          localStorage.setItem("username", response.data.username);

          dispatch(
            login({
              name: response.data.username,
              email: response.data.email,
              is_logged_in: true,
            })
          );


          router.push("/");
        } else {
          console.error("Signup failed:", response.data);
          alert(response.data.message);
          setError(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  
  };

  return (
    <LoginContainer>
      <RightContainer>
        <h1>Login</h1>
        <Form id="login-form" onSubmit={handleSubmit}>
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
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} />
          </div>
          <div className="button-container">
            <button type="submit">Login</button>
          </div>{" "}
        </Form>
      </RightContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  margin-top: 100px;
`;

const RightContainer = styled.div`
  width: 350px;
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
    display: flex;
    justify-content: center; /* This centers the button horizontally */
    margin-top: 20px;
  }

  button {
    width: 50%;
    padding: 10px;
    background-color: #351430;
    color: #fff;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    align-items: center;

    &:hover {
      background-color: #551430;
    }
  }
`;

export default Login;
