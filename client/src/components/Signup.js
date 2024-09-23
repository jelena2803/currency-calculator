import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MDBContainer,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";

function Signup() {
  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    password: "",
    securityKey: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // save the admin's data and send them to backend
  const handleInput = (e) => {
    setShow(false);
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
  };
  // request with the admin's data sent to the backed
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3030/admin/signup",
        admin,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        navigate("/admin/login");
      }
    } catch (err) {
      setError(err.response.data.msg);
      setShow(true);
    }
  };

  return (
    <div className="login-main-container">
      <MDBContainer className="signup-form mt-5 p-4">
        <h3 className="text-center mb-4">Sign up as admin</h3>
        <MDBInput
          wrapperClass="mb-4"
          type="username"
          id="signupUsername"
          name="username"
          label="Username"
          onChange={handleInput}
        />
        <MDBInput
          wrapperClass="mb-4"
          type="email"
          id="signupEmail"
          name="email"
          label="Email"
          onChange={handleInput}
        />
        <MDBInput
          wrapperClass="mb-4"
          type="password"
          id="signupPassword"
          name="password"
          label="Password"
          onChange={handleInput}
        />
        <MDBInput
          wrapperClass="mb-4"
          type="password"
          id="signupSecurityKey"
          name="securityKey"
          label="Security key"
          onChange={handleInput}
        />

        {show && (
          <div
            className="mb-4"
            style={{
              backgroundColor: "#f9e1e5",
              color: "#af233a",
              borderRadius: "5px",
              textAlign: "left",
              padding: "0.8rem",
            }}
          >
            <MDBIcon fas icon="times" className="me-2" />
            {error}
          </div>
        )}
        <MDBRow className="mb-4">
          <MDBCol className="d-flex justify-content-center">
            <p>
              Already have an admin account? <a href="/admin/login">Sign in</a>
            </p>
          </MDBCol>
        </MDBRow>

        <MDBBtn onClick={handleSubmit}>SIGN UP</MDBBtn>
      </MDBContainer>
    </div>
  );
}

export default Signup;
